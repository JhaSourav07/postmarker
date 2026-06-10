import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Feedback from "../../../models/Feedback";
import { sanitizeContent, validateEmail } from "../../../lib/validators";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";
import { Logger } from "../../../lib/logger";

export async function POST(request: Request) {
  // ── Rate limiting: 3 feedbacks per IP per 1 hour ──────────────────────
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = checkRateLimit(ip, 3, 60 * 60 * 1000);

  if (!allowed) {
    const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many feedback submissions. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSecs),
          "X-RateLimit-Limit": "3",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message, type } = body;

    // ── Input validation ─────────────────────────────────────────────────
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A message body is required." },
        { status: 400 }
      );
    }

    if (message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Message must be 2000 characters or fewer." },
        { status: 400 }
      );
    }

    if (!type || !["feedback", "bug"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid submission type." },
        { status: 400 }
      );
    }

    if (email && !validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // ── Database Interaction ──────────────────────────────────────────────
    await connectToDatabase();

    // Sanitize input
    const safeMessage = sanitizeContent(message);
    const safeName = name ? sanitizeContent(name) : undefined;
    const safeEmail = email ? email.trim().toLowerCase() : undefined;

    const newFeedback = new Feedback({
      name: safeName,
      email: safeEmail,
      message: safeMessage,
      type,
    });

    await newFeedback.save();
    Logger.info("FEEDBACK", `New feedback submitted successfully. Type: ${type} | Name: ${safeName || "Anonymous"}`);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "X-RateLimit-Limit": "3",
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    Logger.error("FEEDBACK", "Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
