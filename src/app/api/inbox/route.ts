import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";
import Message from "../../../models/Message";
import { sanitizeContent } from "../../../lib/validators";
import { hashToken } from "../../../lib/crypto";
import { ImapService } from "../../../services/imap.service";
import { Logger } from "../../../lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token query parameter is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const hashed = hashToken(token.trim());

    // Find valid, active thread
    const thread = await Thread.findOne({
      hashedToken: hashed,
      expiresAt: { $gt: new Date() },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found or has expired." },
        { status: 404 }
      );
    }

    // Sync inbound emails from Gmail IMAP first
    try {
      Logger.info("API", `Triggering IMAP sync for token prefix: ${token.slice(0, 8)}...`);
      await ImapService.syncInboxReplies(token);
    } catch (syncError) {
      Logger.error("API", "Gmail IMAP sync error during GET request:", syncError);
    }

    // Get all messages for this thread, newest first
    const messages = await Message.find({ threadId: thread.threadId }).sort({
      receivedAt: -1,
    });

    return NextResponse.json({
      success: true,
      thread: {
        threadId: thread.threadId,
        tempEmail: thread.tempEmail,
        expiresAt: thread.expiresAt,
      },
      messages: messages.map((msg) => ({
        id: msg._id.toString(),
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        bodyHtml: msg.bodyHtml,
        bodyText: msg.bodyText,
        receivedAt: msg.receivedAt,
      })),
    });
  } catch (error) {
    Logger.error("API", "Error retrieving inbox messages:", error);
    return NextResponse.json(
      { error: "Failed to retrieve messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // This endpoint is used only by the dev Reply Simulator.
  // In production, replies arrive via IMAP sync — not via this POST route.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { from, to, subject, html, text, messageId } = body;


    // 1. Basic validation of request payload
    if (!from || !to || !messageId) {
      return NextResponse.json(
        { error: "Missing required email fields (from, to, messageId)." },
        { status: 400 }
      );
    }

    // 2. Extract threadId from the 'to' email address
    const emailMatch = to.match(/<([^>]+)>/);
    const emailAddress = (emailMatch ? emailMatch[1] : to).trim().toLowerCase();
    const localPart = emailAddress.split("@")[0];
    const threadId = localPart;

    // 3. Connect to database and verify thread validity
    await connectToDatabase();
    const thread = await Thread.findOne({
      threadId,
      expiresAt: { $gt: new Date() },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found or has expired." },
        { status: 404 }
      );
    }

    // 4. Ingest and persist the incoming message with XSS protection and duplicate checks
    try {
      const message = new Message({
        threadId: thread.threadId,
        messageId,
        from,
        to,
        subject: subject || "(No Subject)",
        bodyHtml: html ? sanitizeContent(html) : "",
        bodyText: text ? sanitizeContent(text) : "",
        receivedAt: new Date(),
        expiresAt: thread.expiresAt,
      });

      await message.save();
    } catch (saveError: any) {
      // Gracefully handle duplicate messageIds (code 11000) to respond 200 OK to the webhook
      if (saveError.code === 11000) {
        return NextResponse.json({
          success: true,
          message: "Message already ingested.",
          threadId: thread.threadId,
        });
      }
      throw saveError;
    }

    Logger.info("API", `Ingested inbound email messageId: ${messageId} for thread: ${thread.threadId}`);
    return NextResponse.json({
      success: true,
      message: "Message ingested successfully.",
      threadId: thread.threadId,
    });
  } catch (error) {
    Logger.error("API", "Error ingesting inbound mail:", error);
    return NextResponse.json(
      { error: "Failed to ingest inbound email." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token query parameter is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const hashed = hashToken(token.trim());

    // Find active, unexpired thread
    const thread = await Thread.findOne({
      hashedToken: hashed,
      expiresAt: { $gt: new Date() },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found or has expired." },
        { status: 404 }
      );
    }

    // Define new expiry: now + 7 days
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // Limit maximum lifetime to 14 days from original thread creation
    const maxExpiry = new Date(thread.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const newExpiresAt = sevenDaysFromNow > maxExpiry ? maxExpiry : sevenDaysFromNow;

    // Save thread and its associated messages
    thread.expiresAt = newExpiresAt;
    await thread.save();

    await Message.updateMany(
      { threadId: thread.threadId },
      { $set: { expiresAt: newExpiresAt } }
    );

    Logger.info("API", `Extended thread lifespan. Thread: ${thread.threadId} | New Expiry: ${newExpiresAt.toISOString()}`);
    return NextResponse.json({
      success: true,
      message: "Thread expiration extended successfully.",
      expiresAt: newExpiresAt.toISOString(),
    });
  } catch (error) {
    Logger.error("API", "Error extending thread expiration:", error);
    return NextResponse.json(
      { error: "Failed to extend thread expiration." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token query parameter is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const hashed = hashToken(token.trim());

    // Find active, unexpired thread
    const thread = await Thread.findOne({
      hashedToken: hashed,
      expiresAt: { $gt: new Date() },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found or has expired." },
        { status: 404 }
      );
    }

    const threadId = thread.threadId;

    // Delete the thread and all associated messages
    await Thread.deleteOne({ _id: thread._id });
    await Message.deleteMany({ threadId });

    Logger.warn("API", `Self-destruct: Permanently deleted thread ${threadId} and all associated messages.`);
    return NextResponse.json({
      success: true,
      message: "Thread and all associated messages have been permanently deleted.",
    });
  } catch (error) {
    Logger.error("API", "Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread." },
      { status: 500 }
    );
  }
}

