import { connectToDatabase } from "../lib/mongodb";
import {
  generateSecureToken,
  hashToken,
  generateThreadId,
} from "../lib/crypto";
import Thread, { IThread } from "../models/Thread";
import Message, { IMessage } from "../models/Message";
import { EmailService } from "./email.service";

export interface CreateThreadOptions {
  userEmail: string;
  expiryHours?: number;
}

export interface ThreadResult {
  threadId: string;
  tempEmail: string;
  plainToken: string;
  expiresAt: Date;
}

export class ThreadService {
  /**
   * Creates a new temporary thread, hashes its access token, persists it to MongoDB,
   * and returns the conversation details including the raw plain token.
   */
  static async createNewConversation(
    options: CreateThreadOptions
  ): Promise<ThreadResult> {
    await connectToDatabase();

    const plainToken = generateSecureToken();
    const hashedToken = hashToken(plainToken);
    const threadId = generateThreadId();

    // Derives domain from configured SMTP sender or defaults to yourdomain.com
    const fromEmail = process.env.SMTP_FROM || "postmarker@yourdomain.com";
    const domain = fromEmail.split("@")[1] || "yourdomain.com";
    const tempEmail = `${threadId}@${domain}`;

    const expiryHours = options.expiryHours || 24;
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const thread = new Thread({
      threadId,
      userEmail: options.userEmail,
      tempEmail,
      hashedToken,
      expiresAt,
    });

    await thread.save();

    return {
      threadId,
      tempEmail,
      plainToken,
      expiresAt,
    };
  }
}

