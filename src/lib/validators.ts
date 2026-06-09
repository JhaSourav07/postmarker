import DOMPurify from "isomorphic-dompurify";

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
 * Sanitizes an HTML content string using DOMPurify to prevent XSS.
 *
 * Replaces the previous regex-based approach which was bypassable with
 * crafted payloads like <details ontoggle=...> or <svg><animate onbegin=...>.
 *
 * Config:
 * - Allows common safe HTML elements and attributes
 * - Strips all event handlers (on*)
 * - Blocks javascript: URIs
 * - Blocks data: URIs in src/href (common for exfiltration)
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "pre", "code",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "hr",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "width", "height",
      "style", "class", "target", "rel",
      "colspan", "rowspan",
    ],
    // Block javascript: and data: URIs entirely
    ALLOWED_URI_REGEXP:
      /^(?:https?|mailto|ftp):/i,
    // Force target="_blank" links to also have rel="noopener noreferrer"
    ADD_ATTR: ["rel"],
    // Remove all DOM clobbering vectors
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
  });
}
