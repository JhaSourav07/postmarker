import { NextResponse } from "next/server";
import { validateEmail } from "../../../lib/validators";
import { ThreadService } from "../../../services/thread.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const result = await ThreadService.createNewConversation({
      userEmail: email,
    });

    return NextResponse.json({
      success: true,
      threadId: result.threadId,
      tempEmail: result.tempEmail,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create temporary inbox." },
      { status: 500 }
    );
  }
}

