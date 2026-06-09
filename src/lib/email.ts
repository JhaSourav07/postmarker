import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

export const transporter = nodemailer.createTransport({
  host: smtpHost || "localhost",
  port: smtpPort ? parseInt(smtpPort, 10) : 587,
  secure: smtpPort === "465",
  auth:
    smtpUser && smtpPass
      ? {
          user: smtpUser,
          pass: smtpPass,
        }
      : undefined,
});
