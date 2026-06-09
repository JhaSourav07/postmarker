import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { connectToDatabase } from "../lib/mongodb";
import { hashToken } from "../lib/crypto";
import Thread from "../models/Thread";
import Message from "../models/Message";
import { sanitizeContent } from "../lib/validators";

export class ImapService {
  /**
   * Connects to the Gmail IMAP server, queries the mailbox for emails sent to the thread's
   * aliased email address, parses them, and persists any new messages to the database.
   */
  static async syncInboxReplies(token: string): Promise<void> {
    console.log("[IMAP Sync] Starting syncInboxReplies for token:", token);
    try {
      await connectToDatabase();
      const hashed = hashToken(token.trim());

      // 1. Fetch active thread
      const thread = await Thread.findOne({
        hashedToken: hashed,
        expiresAt: { $gt: new Date() },
      });

      if (!thread) {
        console.warn("[IMAP Sync] Thread not found or expired for token:", token);
        return;
      }

      console.log(`[IMAP Sync] Found thread ID: ${thread.threadId}, tempEmail: ${thread.tempEmail}`);

      // 2. Fetch IMAP Credentials from environment
      const host = process.env.IMAP_HOST || "imap.gmail.com";
      const port = process.env.IMAP_PORT
        ? parseInt(process.env.IMAP_PORT, 10)
        : 993;
      const user = process.env.IMAP_USER || process.env.SMTP_USER;
      const pass = process.env.IMAP_PASS || process.env.SMTP_PASS;

      if (!user || !pass) {
        console.warn("IMAP sync skipped: Missing credentials in .env.local");
        return;
      }

      console.log(`[IMAP Sync] Using IMAP Host: ${host}:${port}, User: ${user}`);

      // 3. Initialize IMAP Client
      const client = new ImapFlow({
        host,
        port,
        secure: true,
        auth: {
          user,
          pass,
        },
        logger: false,
      });

      console.log("[IMAP Sync] Connecting to IMAP server...");
      await client.connect();
      console.log("[IMAP Sync] Connected. Locking INBOX...");
      const lock = await client.getMailboxLock("INBOX");
      try {
        console.log(`[IMAP Sync] Searching for emails sent to: ${thread.tempEmail}`);
        const uids = await client.search({
          to: thread.tempEmail,
        });
        console.log("[IMAP Sync] Search returned uids:", uids);

        if (!uids || uids.length === 0) {
          console.log("[IMAP Sync] Searching for all emails in INBOX to debug...");
          const allUids = await client.search({ all: true });
          console.log(`[IMAP Sync] Total messages in INBOX: ${allUids ? allUids.length : 0}`);
          if (allUids && allUids.length > 0) {
            // Get the last 10 UIDs
            const lastUids = allUids.slice(-10);
            console.log("[IMAP Sync] Last 10 email UIDs:", lastUids);
            for (const uid of lastUids) {
              const envelope = await client.fetchOne(uid, { envelope: true });
              if (envelope) {
                console.log(`[IMAP Sync] Debug UID ${uid} - To:`, JSON.stringify(envelope.envelope?.to), `Subject:`, envelope.envelope?.subject);
              }
            }
          }
        }

        if (Array.isArray(uids)) {
          console.log(`[IMAP Sync] Found ${uids.length} messages. Processing...`);
          for (const uid of uids) {
            // Fetch the message source
            const messageSource = await client.fetchOne(uid, { source: true });
            if (!messageSource || !messageSource.source) {
              console.warn(`[IMAP Sync] Empty source for UID ${uid}, skipping.`);
              continue;
            }

            // Parse raw email content
            const parsed = await simpleParser(messageSource.source);
            const messageId =
              parsed.messageId || `imap-${uid}-${thread.threadId}`;

            console.log(`[IMAP Sync] Processing message UID ${uid}, Message-ID: ${messageId}`);

            // Verify if message is already ingested
            const exists = await Message.findOne({ messageId });
            if (exists) {
              console.log(`[IMAP Sync] Message ${messageId} already exists in DB. Skipping.`);
              continue;
            }

            // Sanitize body HTML and Text content
            const bodyHtml = parsed.html ? sanitizeContent(parsed.html) : "";
            const bodyText = parsed.text || "";

            // Persist the message to MongoDB
            const newMessage = new Message({
              threadId: thread.threadId,
              messageId,
              from: parsed.from?.text || "Unknown Sender",
              to: thread.tempEmail,
              subject: parsed.subject || "(No Subject)",
              bodyHtml,
              bodyText,
              receivedAt: parsed.date || new Date(),
              expiresAt: thread.expiresAt,
            });

            await newMessage.save();
            console.log(`[IMAP Sync] Saved new message UID ${uid} from: ${parsed.from?.text}`);
          }
        } else {
          console.log("[IMAP Sync] No matching messages found (uids is not an array).");
        }
      } finally {
        console.log("[IMAP Sync] Releasing lock and logging out...");
        lock.release();
      }

      await client.logout();
      console.log("[IMAP Sync] Logout complete.");
    } catch (error) {
      console.error("Failed to perform Gmail IMAP sync:", error);
    }
  }
}
