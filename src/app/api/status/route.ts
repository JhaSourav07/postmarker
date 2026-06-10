import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";
import Message from "../../../models/Message";
import { transporter } from "../../../lib/email";
import { ImapFlow } from "imapflow";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = false;
  let smtpStatus = false;
  let imapStatus = false;
  let activeThreadsCount = 0;
  let activeMessagesCount = 0;
  let smtpError: string | null = null;
  let imapError: string | null = null;

  try {
    // 1. Database Connection & Metrics
    await connectToDatabase();
    dbStatus = true;
    
    activeThreadsCount = await Thread.countDocuments({
      expiresAt: { $gt: new Date() },
    });
    
    activeMessagesCount = await Message.countDocuments({
      expiresAt: { $gt: new Date() },
    });
  } catch (err: any) {
    console.error("Status API: DB check failed:", err);
  }

  // 2. SMTP Connectivity Check
  try {
    await transporter.verify();
    smtpStatus = true;
  } catch (err: any) {
    smtpError = err.message || String(err);
    console.error("Status API: SMTP verification failed:", err);
  }

  // 3. IMAP Connectivity Check
  try {
    const host = process.env.IMAP_HOST || "imap.gmail.com";
    const port = process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993;
    const user = process.env.IMAP_USER || process.env.SMTP_USER;
    const pass = (process.env.IMAP_PASS || process.env.SMTP_PASS || "").trim();

    if (user && pass) {
      const client = new ImapFlow({
        host,
        port,
        secure: true,
        auth: { user, pass },
        logger: false,
      });

      await client.connect();
      await client.logout();
      imapStatus = true;
    } else {
      imapError = "IMAP credentials missing in configuration.";
    }
  } catch (err: any) {
    imapError = err.message || String(err);
    console.error("Status API: IMAP connection failed:", err);
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbStatus,
        activeThreads: activeThreadsCount,
        activeMessages: activeMessagesCount,
      },
      smtp: {
        status: smtpStatus,
        error: smtpError,
      },
      imap: {
        status: imapStatus,
        error: imapError,
      },
    },
  });
}
