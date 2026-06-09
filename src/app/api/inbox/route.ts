import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";

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

    // 4. Verification and validation passed. Ingestion engine logic will be implemented in the next step.
    return NextResponse.json({
      success: true,
      message: "Verification passed. Message ingestion pending.",
      threadId: thread.threadId,
    });
  } catch (error) {
    console.error("Error verifying inbound mail:", error);
    return NextResponse.json(
      { error: "Failed to verify inbound email." },
      { status: 500 }
    );
  }
}
