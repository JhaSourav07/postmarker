import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";
import Message from "../../../models/Message";
import { sanitizeContent } from "../../../lib/validators";

export async function POST(request: Request) {
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

    return NextResponse.json({
      success: true,
      message: "Message ingested successfully.",
      threadId: thread.threadId,
    });
  } catch (error) {
    console.error("Error ingesting inbound mail:", error);
    return NextResponse.json(
      { error: "Failed to ingest inbound email." },
      { status: 500 }
    );
  }
}

