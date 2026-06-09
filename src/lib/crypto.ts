import crypto from "crypto";

/**
 * Generates a secure, cryptographically strong random token (hex-encoded).
 * This will be used in the inbox access link sent to the user.
 * @returns {string} The generated secure token.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
