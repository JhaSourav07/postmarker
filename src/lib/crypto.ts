import crypto from "crypto";

export function generateSecureToken(): string {
  const hex = crypto.randomBytes(6).toString("hex").toUpperCase();
  const part1 = hex.substring(0, 4);
  const part2 = hex.substring(4, 8);
  const part3 = hex.substring(8, 12);
  return `TMP-${part1}-${part2}-${part3}`;
}

/**
 * Hashes a token using SHA-256.
 * This is used to store hashed tokens in the database to prevent plain-text exposure.
 * @param {string} token - The plain token to hash.
 * @returns {string} The SHA-256 hashed token.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a unique thread identifier prefix (e.g. for generating temporary email addresses).
 * We use a random 6-byte hex value (12 characters).
 * @returns {string} The generated thread ID.
 */
export function generateThreadId(): string {
  return crypto.randomBytes(6).toString("hex");
}


