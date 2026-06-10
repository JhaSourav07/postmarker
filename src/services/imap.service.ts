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

      // Strategy 3: Search by the explicit TO alias address
      if (candidateUids.length === 0) {
        const byTo = await client.search({ to: tempEmail });
        const byToArr = Array.isArray(byTo) ? byTo : [];
        console.log(`[IMAP Sync] S3 (TO alias): ${byToArr.length} hits`);
        if (byToArr.length > 0) candidateUids = byToArr;
      }

      // Strategy 4: Search by subject contains threadId (if subject was somehow modified)
      if (candidateUids.length === 0) {
        const bySubject = await client.search({ subject: threadId });
        const bySubjectArr = Array.isArray(bySubject) ? bySubject : [];
        console.log(`[IMAP Sync] S4 (subject): ${bySubjectArr.length} hits`);
        if (bySubjectArr.length > 0) candidateUids = bySubjectArr;
      }

      // Strategy 5: scan last 50 emails (regardless of UNSEEN) to catch opened emails
      if (candidateUids.length === 0) {
        // Fetch the UIDs of the 50 most recent emails in the mailbox
        const seqStatus = await client.status("INBOX", { messages: true });
        const total = seqStatus.messages || 0;
        let recent: number[] = [];
        
        if (total > 0) {
          const start = Math.max(1, total - 49);
          // fetch UIDs for sequence range start:*
          for (let i = start; i <= total; i++) {
             recent.push(i); // This is sequence number, we need UID. Actually, let's just do a SEARCH ALL and slice.
          }
        }
        
        const allUids = await client.search({ all: true });
        const allUidsArr = Array.isArray(allUids) ? allUids : [];
        recent = allUidsArr.slice(-50);
        console.log(`[IMAP Sync] S5 scanning ${recent.length} recent emails`);

        const baseUser = (user || "").split("@")[0].toLowerCase();
        const aliasLocal = tempEmail.split("@")[0].toLowerCase();

        if (recent.length > 0) {
          // Fetch all envelopes in a single bulk request to prevent IMAP rate limit burning
          const fetchStream = await client.fetch(recent, { envelope: true }, { uid: true });
          
          for await (const msg of fetchStream) {
            const envelope = msg.envelope;
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
            if (matched && msg.uid) {
              candidateUids.push(msg.uid);
            }
          }
        }
        console.log(`[IMAP Sync] S5 matched ${candidateUids.length} emails`);
      }

      // ── Processing phase ──────────────────────────────────────────────────
      console.log(`[IMAP Sync] Processing ${candidateUids.length} candidates`);

      // Fetch all candidate envelopes in bulk to check duplicates by Message-ID first
      const envelopesMap = new Map<number, string>();
      if (candidateUids.length > 0) {
        const fetchStream = await client.fetch(candidateUids, { envelope: true }, { uid: true });
        for await (const msg of fetchStream) {
          if (msg.envelope?.messageId && msg.uid) {
            envelopesMap.set(msg.uid, msg.envelope.messageId);
          }
        }
      }

      for (const uid of candidateUids) {
        const messageId = envelopesMap.get(uid) || `imap-${uid}-${threadId}`;

        // Skip already-ingested messages
        const exists = await Message.findOne({ messageId });
        if (exists) {
          console.log(`[IMAP Sync] Already in DB: ${messageId}`);
          // Ensure it is marked Seen on IMAP server
          await client.messageFlagsAdd({ uid }, ["\\Seen"]).catch(() => {});
          continue;
        }

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

        // ── Security: Verify this is a genuine reply ──────────────────────
        // Check In-Reply-To and References headers to ensure this email is
        // an actual reply to the original Postmarker message — NOT a signup
        // verification, newsletter, or any unsolicited email sent directly to
        // the alias. This prevents Postmarker from being used as a temp-mail
        // service for website signups.
        if (thread.sentMessageId) {
          const inReplyTo = (parsed.inReplyTo || "").toLowerCase();
          const references = (
            Array.isArray(parsed.references)
              ? parsed.references.join(" ")
              : parsed.references || ""
          ).toLowerCase();
          const sentId = thread.sentMessageId.toLowerCase();

          const isGenuineReply =
            inReplyTo.includes(sentId) || references.includes(sentId);

          if (!isGenuineReply) {
            console.warn(
              `[IMAP Sync] UID ${uid} rejected — not a reply to the original message. ` +
              `In-Reply-To: "${inReplyTo || "none"}", sentMessageId: "${sentId}"`
            );
            // Mark Seen so this email is never scanned again
            await client.messageFlagsAdd({ uid }, ["\\Seen"]).catch(() => {});
            continue;
          }
        }

        // ── Security: Verify sender is the person we originally emailed ──
        // Only emails FROM the recipient we sent to are accepted.
        // This blocks: website signups, newsletters, spam — anything not
        // coming back from the intended conversation partner.
        if (thread.recipientEmail) {
          const fromAddresses = parsed.from?.value || [];
          const fromEmails = fromAddresses.map(
            (addr: { address?: string }) => (addr.address || "").toLowerCase()
          );
          const expectedSender = thread.recipientEmail.toLowerCase();

          const isFromRecipient = fromEmails.some(
            (addr: string) =>
              addr === expectedSender ||
              // Allow sub-addressing: john+anything@example.com still matches john@example.com
              addr.split("+")[0] + "@" + addr.split("@")[1] === expectedSender
          );

          if (!isFromRecipient) {
            console.warn(
              `[IMAP Sync] UID ${uid} rejected — sender "${fromEmails.join(", ")}" ` +
              `does not match expected recipient "${expectedSender}"`
            );
            await client.messageFlagsAdd({ uid }, ["\\Seen"]).catch(() => {});
            continue;
          }
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
