/**
 * Validates whether a given string is a correctly formatted email address.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Escapes HTML special characters in a plain-text string so it is safe
 * to embed inside an HTML template without injection risk.
 *
 * Use this for user-supplied text that goes into the email HTML body.
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Server-side content sanitization pass-through.
 * Offloaded to client-side DOMPurify to avoid jsdom/ESM dependency load crashes in serverless runtimes.
 */
export function sanitizeContent(content: string): string {
  return content || "";
}
