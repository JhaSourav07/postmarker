import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { connectToDatabase } from "../lib/mongodb";
import { hashToken } from "../lib/crypto";
import Thread from "../models/Thread";
import Message from "../models/Message";
import { sanitizeContent } from "../lib/validators";

export class ImapService {
  /**
   * Sync inbox replies for a given thread token.
   *
   * Search priority (fastest → slowest):
   *  1. HEADER X-PostMarker-Thread-ID <threadId>  — precise, zero false-positives
   *  2. HEADER X-Thread-ID <threadId>             — fallback header
   *  3. SUBJECT <threadId>                        — subject-line match
   *  4. Scan recent 50 UNSEEN emails by envelope  — last resort alias match
   *
   * After persisting a reply to MongoDB the message is marked \Seen on the
   * server so future sync calls skip it instantly.
   */
  static async syncInboxReplies(token: string): Promise<void> {
    console.log("[IMAP Sync] Starting for token:", token);

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
    console.log(`[IMAP Sync] Thread: ${threadId} | alias: ${tempEmail}`);

    const host = process.env.IMAP_HOST || "imap.gmail.com";
    const port = process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993;
    const user = process.env.IMAP_USER || process.env.SMTP_USER;
    const pass = (process.env.IMAP_PASS || process.env.SMTP_PASS || "").trim();

    if (!user || !pass) {
      console.warn("[IMAP Sync] Missing IMAP credentials — skipping.");
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
    console.log("[IMAP Sync] Connected to IMAP server.");

    const lock = await client.getMailboxLock("INBOX");
    try {
      // ── Search phase ──────────────────────────────────────────────────────
      let candidateUids: number[] = [];

      // Strategy 1: custom header X-PostMarker-Thread-ID (fastest, most precise)
      const byHeader1 = await client.search({
        header: { "X-PostMarker-Thread-ID": threadId },
      });
      const byHeader1Arr = Array.isArray(byHeader1) ? byHeader1 : [];
      console.log(`[IMAP Sync] S1 (X-PostMarker-Thread-ID): ${byHeader1Arr.length} hits`);
      if (byHeader1Arr.length > 0) candidateUids = byHeader1Arr;

      // Strategy 2: fallback header X-Thread-ID
      if (candidateUids.length === 0) {
        const byHeader2 = await client.search({
          header: { "X-Thread-ID": threadId },
        });
        const byHeader2Arr = Array.isArray(byHeader2) ? byHeader2 : [];
        console.log(`[IMAP Sync] S2 (X-Thread-ID): ${byHeader2Arr.length} hits`);
        if (byHeader2Arr.length > 0) candidateUids = byHeader2Arr;
      }

      // Strategy 3: subject contains threadId
      if (candidateUids.length === 0) {
        const bySubject = await client.search({ subject: threadId });
        const bySubjectArr = Array.isArray(bySubject) ? bySubject : [];
        console.log(`[IMAP Sync] S3 (subject): ${bySubjectArr.length} hits`);
        if (bySubjectArr.length > 0) candidateUids = bySubjectArr;
      }

      // Strategy 4: scan last 50 UNSEEN emails by envelope (alias match)
      if (candidateUids.length === 0) {
        const allUids = await client.search({ seen: false });
        const allUidsArr = Array.isArray(allUids) ? allUids : [];
        const recent = allUidsArr.slice(-50);
        console.log(`[IMAP Sync] S4 scanning ${recent.length} recent UNSEEN emails`);

        const baseUser = (user || "").split("@")[0].toLowerCase();
        const aliasLocal = tempEmail.split("@")[0].toLowerCase();

        for (const uid of recent) {
          const info = await client.fetchOne(uid, { envelope: true });
          if (!info) continue;
          const envelope = (info as any).envelope;
          if (!envelope) continue;

          const toList: string[] = (
            (envelope.to || []) as Array<{ mailbox: string; host: string }>
          ).map((a) => `${a.mailbox}@${a.host}`.toLowerCase());

          const matched = toList.some(
            (addr: string) =>
              addr === tempEmail.toLowerCase() ||
              addr.includes(aliasLocal) ||
              addr.startsWith(baseUser + "+")
          );
          if (matched) candidateUids.push(uid);
        }
        console.log(`[IMAP Sync] S4 matched ${candidateUids.length} emails`);
      }

      // ── Processing phase ──────────────────────────────────────────────────
      console.log(`[IMAP Sync] Processing ${candidateUids.length} candidates`);

      for (const uid of candidateUids) {
        const msgData = await client.fetchOne(uid, { source: true });
        if (!msgData) {
          console.warn(`[IMAP Sync] No data for UID ${uid}, skipping.`);
          continue;
        }
        const source = (msgData as any).source as Buffer | undefined;
        if (!source) {
          console.warn(`[IMAP Sync] Empty source for UID ${uid}, skipping.`);
          continue;
        }

        const parsed = await simpleParser(source);
        const messageId = parsed.messageId || `imap-${uid}-${threadId}`;

        // Skip already-ingested messages
        const exists = await Message.findOne({ messageId });
        if (exists) {
          console.log(`[IMAP Sync] Already in DB: ${messageId}`);
          // Mark Seen so we don't touch it in future scans
          await client.messageFlagsAdd({ uid }, ["\\Seen"]);
          continue;
        }

        // Relevance guard — prevents cross-thread contamination in strategy 4
        const toField = parsed.to;
        const toText = (
          Array.isArray(toField)
            ? toField.map((a) => a.text).join(", ")
            : toField?.text ?? ""
        ).toLowerCase();
        const subjectText = (parsed.subject || "").toLowerCase();
        const bodyText = (parsed.text || "").toLowerCase();
        const aliasLower = tempEmail.toLowerCase();
        const threadIdLower = threadId.toLowerCase();

        const isRelevant =
          toText.includes(aliasLower) ||
          toText.includes(threadIdLower) ||
          subjectText.includes(threadIdLower) ||
          bodyText.includes(aliasLower) ||
          // Always trust strategy 1 & 2 header hits
          byHeader1Arr.includes(uid);

        if (!isRelevant) {
          console.log(`[IMAP Sync] UID ${uid} not relevant to this thread — skipping.`);
          continue;
        }

        // Persist to MongoDB
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
        console.log(`[IMAP Sync] ✓ Saved message from: ${parsed.from?.text}`);

        // Mark as \Seen on the server — future syncs skip this immediately
        try {
          await client.messageFlagsAdd({ uid }, ["\\Seen"]);
          console.log(`[IMAP Sync] Marked UID ${uid} as \\Seen`);
        } catch (flagError) {
          // Non-fatal — the message is saved; we just couldn't mark it
          console.warn(`[IMAP Sync] Failed to mark UID ${uid} as \\Seen:`, flagError);
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
    console.log("[IMAP Sync] Complete.");
  }
}
