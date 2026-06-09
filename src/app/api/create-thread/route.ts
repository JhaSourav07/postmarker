import { NextResponse } from "next/server";
import { validateEmail } from "../../../lib/validators";

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

    // Input is valid. Orchestration layer will be implemented in the next step.
    return NextResponse.json({
      success: true,
      message: "Validation passed. Orchestration pending.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body or request error." },
      { status: 400 }
    );
  }
}
