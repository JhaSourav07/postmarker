import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { connectToDatabase } from "../lib/mongodb";
import { hashToken } from "../lib/crypto";
import Thread from "../models/Thread";
import Message from "../models/Message";
import { sanitizeContent } from "../lib/validators";

export class ImapService {
  /**
   * Connects to the Gmail IMAP server, finds emails relevant to the thread,
   * and persists any new ones to the database.
   *
   * Gmail IMAP quirk: Searching `TO: alias@gmail.com` often returns no results
   * because Gmail normalises addresses internally. We use a multi-strategy
   * approach: first search by TO, then fall back to searching recent emails
   * and matching by subject or the alias in the body.
   */
  static async syncInboxReplies(token: string): Promise<void> {
    console.log("[IMAP Sync] Starting syncInboxReplies for token:", token);
    try {
      await connectToDatabase();
      const hashed = hashToken(token.trim());

      const thread = await Thread.findOne({
        hashedToken: hashed,
        expiresAt: { $gt: new Date() },
      });

      if (!thread) {
        console.warn("[IMAP Sync] Thread not found or expired.");
        return;
      }

      const tempEmail: string = thread.tempEmail;
      const threadId: string = thread.threadId;
      console.log(`[IMAP Sync] Thread: ${threadId}, alias: ${tempEmail}`);

      const host = process.env.IMAP_HOST || "imap.gmail.com";
      const port = process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993;
      const user = process.env.IMAP_USER || process.env.SMTP_USER;
      const pass = (process.env.IMAP_PASS || process.env.SMTP_PASS || "").trim();

      if (!user || !pass) {
        console.warn("[IMAP Sync] Missing credentials, skipping.");
        return;
      }

      const client = new ImapFlow({
        host,
        port,
        secure: true,
        auth: { user, pass },
        logger: false,
      });

      await client.connect();
      console.log("[IMAP Sync] Connected.");

      const lock = await client.getMailboxLock("INBOX");
      try {
        let candidateUids: number[] = [];

        // --- Strategy 1: search by TO alias (works on some IMAP servers) ---
        const byTo = await client.search({ to: tempEmail });
        const byToArr = Array.isArray(byTo) ? byTo : [];
        console.log(`[IMAP Sync] Strategy 1 (TO alias): ${byToArr.length} results`);
        if (byToArr.length > 0) {
          candidateUids = byToArr;
        }

        // --- Strategy 2: search for the thread ID in the subject line ---
        if (candidateUids.length === 0) {
          const bySubject = await client.search({ subject: threadId });
          const bySubjectArr = Array.isArray(bySubject) ? bySubject : [];
          console.log(`[IMAP Sync] Strategy 2 (subject contains threadId): ${bySubjectArr.length} results`);
          if (bySubjectArr.length > 0) {
            candidateUids = bySubjectArr;
          }
        }

        // --- Strategy 3: scan the most recent 50 emails and match the alias in headers ---
        if (candidateUids.length === 0) {
          const allUids = await client.search({ all: true });
          const allUidsArr = Array.isArray(allUids) ? allUids : [];
          if (allUidsArr.length > 0) {
            const recent = allUidsArr.slice(-50);
            console.log(`[IMAP Sync] Strategy 3: scanning last ${recent.length} emails for alias match`);

            const baseUser = (user || "").split("@")[0].toLowerCase();
            const aliasLocal = tempEmail.split("@")[0].toLowerCase();

            for (const uid of recent) {
              const info = await client.fetchOne(uid, { envelope: true });
              if (!info) continue;
              const envelope = (info as any).envelope;
              if (!envelope) continue;

              const toList: string[] = ((envelope.to || []) as Array<{ mailbox: string; host: string }>)
                .map((a) => `${a.mailbox}@${a.host}`.toLowerCase());

              const matched = toList.some(
                (addr: string) =>
                  addr === tempEmail.toLowerCase() ||
                  addr.includes(aliasLocal) ||
                  addr.startsWith(baseUser + "+")
              );

              if (matched) {
                candidateUids.push(uid);
              }
            }
            console.log(`[IMAP Sync] Strategy 3 matched ${candidateUids.length} emails.`);
          }
        }

        // --- Process all candidate messages ---
        console.log(`[IMAP Sync] Processing ${candidateUids.length} candidate messages.`);
        for (const uid of candidateUids) {
          const msgData = await client.fetchOne(uid, { source: true });
          if (!msgData) {
            console.warn(`[IMAP Sync] Empty result for UID ${uid}, skipping.`);
            continue;
          }
          const source = (msgData as any).source as Buffer | undefined;
          if (!source) {
            console.warn(`[IMAP Sync] Empty source for UID ${uid}, skipping.`);
            continue;
          }

          const parsed = await simpleParser(source);
          const messageId = parsed.messageId || `imap-${uid}-${threadId}`;

          const exists = await Message.findOne({ messageId });
          if (exists) {
            console.log(`[IMAP Sync] Already in DB: ${messageId}`);
            continue;
          }

          // Extra guard — make sure this message is actually relevant to this thread.
          // Check To header, Subject, or body for the alias.
          const toField = parsed.to;
          const toText = (Array.isArray(toField) ? toField.map((a) => a.text).join(", ") : toField?.text ?? "").toLowerCase();
          const subjectText = (parsed.subject || "").toLowerCase();
          const bodyText = (parsed.text || "").toLowerCase();
          const aliasLower = tempEmail.toLowerCase();
          const threadIdLower = threadId.toLowerCase();

          const isRelevant =
            toText.includes(aliasLower) ||
            toText.includes(threadIdLower) ||
            subjectText.includes(threadIdLower) ||
            bodyText.includes(aliasLower);

          if (!isRelevant) {
            console.log(`[IMAP Sync] UID ${uid} not relevant to this thread, skipping.`);
            continue;
          }

          const newMsg = new Message({
            threadId,
            messageId,
            from: parsed.from?.text || "Unknown Sender",
            to: tempEmail,
            subject: parsed.subject || "(No Subject)",
            bodyHtml: parsed.html ? sanitizeContent(parsed.html) : "",
            bodyText: parsed.text || "",
            receivedAt: parsed.date || new Date(),
            expiresAt: thread.expiresAt,
          });

          await newMsg.save();
          console.log(`[IMAP Sync] Saved message from: ${parsed.from?.text}, subject: ${parsed.subject}`);
        }
      } finally {
        lock.release();
      }

      await client.logout();
      console.log("[IMAP Sync] Done.");
    } catch (error) {
      console.error("[IMAP Sync] Fatal error:", error);
      throw error; // Re-throw so the API route can surface a proper error
    }
  }
}
