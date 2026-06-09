/**
 * Validates whether a given string is a correctly formatted email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes an HTML content string to strip out scripts, iframes, inline event handlers,
 * and javascript: links to prevent Cross-Site Scripting (XSS) attacks.
 * @param {string} content - The raw HTML/text content to sanitize.
 * @returns {string} The sanitized HTML/text content.
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";
  
  return content
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove iframe, object, embed, frame, frameset tags and their content
    .replace(/<(iframe|object|embed|frame|frameset)\b[^>]*>([\s\S]*?)<\/\1>/gi, "")
    .replace(/<(iframe|object|embed|frame|frameset)\b[^>]*\/?>/gi, "")
    // Remove inline event handlers (e.g. onload, onclick, onerror)
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    // Remove javascript: pseudo-protocol links
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"');
}

