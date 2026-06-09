import { connectToDatabase } from "../lib/mongodb";
import {
  generateSecureToken,
  hashToken,
  generateThreadId,
} from "../lib/crypto";
import Thread, { IThread } from "../models/Thread";
import Message, { IMessage } from "../models/Message";
import { transporter } from "../lib/email";

export interface CreateThreadOptions {
  recipientEmail: string;
  subject: string;
  message: string;
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
   * Creates a new temporary thread, hashes its access token, sends the anonymous email
   * to the recipient, persists the thread to MongoDB with a 7-day TTL, and returns the details.
   */
  static async createNewConversation(
    options: CreateThreadOptions
  ): Promise<ThreadResult> {
    await connectToDatabase();

    const plainToken = generateSecureToken();
    const hashedToken = hashToken(plainToken);
    const threadId = generateThreadId();

    // Derives domain or constructs Gmail address using alias (+threadId) formatting
    const fromEmail = process.env.SMTP_FROM || "postmarker@yourdomain.com";
    let tempEmail = "";
    if (fromEmail.toLowerCase().includes("gmail.com")) {
      const localPart = fromEmail.split("@")[0];
      tempEmail = `${localPart}+${threadId}@gmail.com`;
    } else {
      const domain = fromEmail.split("@")[1] || "yourdomain.com";
      tempEmail = `${threadId}@${domain}`;
    }

    // Default to 7 days (168 hours) lifecycle
    const expiryHours = options.expiryHours || 168;
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const thread = new Thread({
      threadId,
      userEmail: "anonymous@postmarker.com",
      tempEmail,
      hashedToken,
      expiresAt,
    });

    await thread.save();

    // Dispatch the anonymous email to the recipient
    const mailOptions = {
      from: `"Anonymous" <${tempEmail}>`,
      replyTo: tempEmail,
      to: options.recipientEmail,
      subject: options.subject || "(No Subject)",
      text: options.message,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px;">
          <p style="color: #334155; font-size: 15px; white-space: pre-wrap; line-height: 1.6;">${options.message}</p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            This email was sent anonymously via <strong>Postmarker</strong>. 
            To reply to this message, simply reply directly to this email address. 
            Replies will be routed securely to the sender's private dashboard.
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to dispatch anonymous SMTP email:", emailError);
      // We still persist the thread so the user gets their dashboard key,
      // but log the delivery failure.
    }

    return {
      threadId,
      tempEmail,
      plainToken,
      expiresAt,
    };
  }
}

