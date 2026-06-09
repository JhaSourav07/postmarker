import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { connectToDatabase } from "../../../../lib/mongodb";
import Feedback from "../../../../models/Feedback";

export async function GET(request: Request) {
  // 1. Authenticate Request
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch Data
  try {
    await connectToDatabase();
    
    // Sort by newest first
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
