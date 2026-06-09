import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";
import Message from "../../../models/Message";

export async function POST(request: Request) {
  try {
    // Verify Cron Secret if configured in .env.local
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await connectToDatabase();
    const now = new Date();

    // Explicitly delete expired thread and message documents
    const deletedThreads = await Thread.deleteMany({ expiresAt: { $lte: now } });
    const deletedMessages = await Message.deleteMany({ expiresAt: { $lte: now } });

    return NextResponse.json({
      success: true,
      deletedThreadsCount: deletedThreads.deletedCount,
      deletedMessagesCount: deletedMessages.deletedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to perform database cleanup." },
      { status: 500 }
    );
  }
}
