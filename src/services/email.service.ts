import { transporter } from "../lib/email";

interface SendAccessLinkOptions {
  toEmail: string;
  tempEmail: string;
  inboxLink: string;
}

export class EmailService {
  /**
   * Sends the inbox access link to the user's real email address.
   */
  static async sendInboxAccessLink({
    toEmail,
    tempEmail,
    inboxLink,
  }: SendAccessLinkOptions): Promise<boolean> {
    const smtpFrom = process.env.SMTP_FROM || "postmarker@yourdomain.com";

    const mailOptions = {
      from: `"PostMarker" <${smtpFrom}>`,
      to: toEmail,
      subject: "Your Temporary PostMarker Inbox is Ready!",
      text: `Hello,\n\nYour temporary inbox for ${tempEmail} has been created.\n\nYou can access your inbox dashboard and view messages at the following link:\n${inboxLink}\n\nThis link is active for 24 hours. After that, your inbox and all messages will be automatically deleted.\n\nBest regards,\nPostMarker Team`,
      html: `https://postmarker.vercel.app/
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">PostMarker Temporary Inbox</h2>
          <p style="color: #334155; font-size: 16px;">Your temporary email address is ready for use:</p>
          <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; color: #0f172a; margin: 16px 0; text-align: center; border: 1px dashed #cbd5e1;">
            ${tempEmail}
          </div>
          <p style="color: #334155; font-size: 16px;">Click the button below to access your private inbox dashboard:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${inboxLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
              Access My Inbox
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <strong>Security Notice:</strong> This link is private to you. It will expire in 24 hours, at which point the inbox and all associated messages will be permanently deleted from our servers.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Failed to send access link email:", error);
      return false;
    }
  }
}
