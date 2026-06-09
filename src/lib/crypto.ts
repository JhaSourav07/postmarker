import crypto from "crypto";

/**
 * Generates a cryptographically secure 256-bit (32 byte) random token.
 * Returned as a 64-character lowercase hex string.
 * Previous format was 48-bit (6 bytes) — this is ~2^208 times stronger.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a token using SHA-256.
 * Only the hash is stored in the database — the plaintext is never persisted.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a unique 64-bit (8 byte) thread identifier.
 * Returned as a 16-character lowercase hex string.
 * Previous format was 24-bit (3 bytes) — only ~16M combinations, collision-prone at scale.
 */
export function generateThreadId(): string {
  return crypto.randomBytes(8).toString("hex").toLowerCase();
}
