import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Thread from "../../../models/Thread";
import Message from "../../../models/Message";
import { Logger } from "../../../lib/logger";

function checkAuth(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // No secret set — allow (only in dev)
  const authHeader = request.headers.get("Authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

async function runCleanup() {
  Logger.info("CLEANUP", "Running database TTL sweep and pruning expired records...");
  await connectToDatabase();
  const now = new Date();
  const deletedThreads = await Thread.deleteMany({ expiresAt: { $lte: now } });
  const deletedMessages = await Message.deleteMany({ expiresAt: { $lte: now } });
  
  Logger.info("CLEANUP", `Sweep completed. Purged ${deletedThreads.deletedCount} threads and ${deletedMessages.deletedCount} messages.`);
  
  return {
    success: true,
    deletedThreadsCount: deletedThreads.deletedCount,
    deletedMessagesCount: deletedMessages.deletedCount,
  };
}

// GET — used by Vercel Cron Jobs
export async function GET(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await runCleanup();
    return NextResponse.json(result);
  } catch (error) {
    Logger.error("CLEANUP", "Cleanup error during GET request:", error);
    return NextResponse.json(
      { error: "Failed to perform database cleanup." },
      { status: 500 }
    );
  }
}

// POST — kept for manual triggers
export async function POST(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await runCleanup();
    return NextResponse.json(result);
  } catch (error) {
    Logger.error("CLEANUP", "Cleanup error during POST request:", error);
    return NextResponse.json(
      { error: "Failed to perform database cleanup." },
      { status: 500 }
    );
  }
}
