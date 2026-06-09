import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = (process.env.SMTP_PASS || "").trim(); // trim trailing spaces

export const transporter = nodemailer.createTransport({
  host: smtpHost || "localhost",
  port: smtpPort ? parseInt(smtpPort, 10) : 587,
  secure: smtpPort === "465",
  auth:
    smtpUser && smtpPass
      ? { user: smtpUser, pass: smtpPass }
      : undefined,
  // Disable file and URL access within email content processing
  disableFileAccess: true,
  disableUrlAccess: true,
});

/**
 * IP Anonymity Notice:
 *
 * Gmail's SMTP infrastructure adds a `Received:` header containing the
 * connecting server's IP to every outgoing message. On Vercel this is
 * Vercel's shared IP, not the user's. In local dev it is the developer's
 * public IP.
 *
 * Nodemailer itself does not add IP headers — the leak is introduced by
 * Gmail's SMTP gateway and cannot be suppressed by the client.
 *
 * For true IP anonymity in production, switch to a dedicated relay
 * (e.g., Resend, SendGrid, Mailgun) which masks origin IPs entirely.
 * Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS accordingly.
 */
