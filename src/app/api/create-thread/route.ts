import { NextResponse } from "next/server";
import { validateEmail } from "../../../lib/validators";
import { ThreadService } from "../../../services/thread.service";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";

export async function POST(request: Request) {
  // ── Rate limiting: 5 threads per IP per 15 minutes ──────────────────────
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = checkRateLimit(ip, 5, 15 * 60 * 1000);

  if (!allowed) {
    const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another email." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSecs),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { to, subject, message } = body;

    // ── Input validation ─────────────────────────────────────────────────
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

    if (subject.trim().length > 200) {
      return NextResponse.json(
        { error: "Subject must be 200 characters or fewer." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A message body is required." },
        { status: 400 }
      );
    }

    if (message.trim().length > 10_000) {
      return NextResponse.json(
        { error: "Message body must be 10,000 characters or fewer." },
        { status: 400 }
      );
    }

    const result = await ThreadService.createNewConversation({
      recipientEmail: to.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        token: result.plainToken,
        tempEmail: result.tempEmail,
        expiresAt: result.expiresAt,
      },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    console.error("Error creating anonymous thread:", error);
    return NextResponse.json(
      { error: "Failed to send anonymous email." },
      { status: 500 }
    );
  }
}
