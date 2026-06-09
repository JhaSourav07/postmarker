import crypto from "crypto";

/**
 * Generates a secure, cryptographically strong random token (hex-encoded).
 * This will be used in the inbox access link sent to the user.
 * @returns {string} The generated secure token.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
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

