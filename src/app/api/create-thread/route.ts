import { NextResponse } from "next/server";
import { validateEmail } from "../../../lib/validators";
import { ThreadService } from "../../../services/thread.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    // Validate inputs
    if (!to || typeof to !== "string" || !validateEmail(to)) {
      return NextResponse.json(
        { error: "A valid recipient email address is required." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { error: "A message subject is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A message body is required." },
        { status: 400 }
      );
    }

    const result = await ThreadService.createNewConversation({
      recipientEmail: to.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      token: result.plainToken,
      tempEmail: result.tempEmail,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Error creating anonymous thread:", error);
    return NextResponse.json(
      { error: "Failed to send anonymous email." },
      { status: 500 }
    );
  }
}


