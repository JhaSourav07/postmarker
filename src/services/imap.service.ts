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
    try {
      await connectToDatabase();
      const hashed = hashToken(token.trim());

      // 1. Fetch active thread
      const thread = await Thread.findOne({
        hashedToken: hashed,
        expiresAt: { $gt: new Date() },
      });

      if (!thread) return;

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

      await client.connect();
      const lock = await client.getMailboxLock("INBOX");
      try {
        const uids = await client.search({
          to: thread.tempEmail,
        });

        if (Array.isArray(uids)) {
          for (const uid of uids) {
            // Fetch the message source
            const messageSource = await client.fetchOne(uid, { source: true });
            if (!messageSource || !messageSource.source) continue;

            // Parse raw email content
            const parsed = await simpleParser(messageSource.source);
            const messageId =
              parsed.messageId || `imap-${uid}-${thread.threadId}`;

            // Verify if message is already ingested
            const exists = await Message.findOne({ messageId });
            if (exists) continue;

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
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();
    } catch (error) {
      console.error("Failed to perform Gmail IMAP sync:", error);
    }
  }
}
