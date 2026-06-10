import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateThreadId(): string {
  return crypto.randomBytes(8).toString("hex").toLowerCase();
}
