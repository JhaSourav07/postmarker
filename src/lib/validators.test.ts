import { describe, it, expect } from "vitest";
import { validateEmail, escapeHtml, sanitizeContent } from "./validators";

describe("Validator Utilities", () => {
  describe("validateEmail", () => {
    it("should return true for valid email patterns", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("user.name+alias@example.co.uk")).toBe(true);
      expect(validateEmail("u@example.org")).toBe(true);
    });

    it("should return false for invalid email patterns", () => {
      expect(validateEmail("plainaddress")).toBe(false);
      expect(validateEmail("#@%^%#$@#$@#.com")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("Joe Smith <joe@example.com>")).toBe(false);
      expect(validateEmail("email.example.com")).toBe(false);
      expect(validateEmail("email@example@example.com")).toBe(false);
    });
  });

  describe("escapeHtml", () => {
    it("should return empty string for nullish or empty inputs", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("should escape special characters to safe HTML entities", () => {
      const input = `<div>Hello & "Welcome" 'guest'</div>`;
      const expected = `&lt;div&gt;Hello &amp; &quot;Welcome&quot; &#x27;guest&#x27;&lt;/div&gt;`;
      expect(escapeHtml(input)).toBe(expected);
    });
  });

  describe("sanitizeContent", () => {
    it("should pass-through content", () => {
      expect(sanitizeContent("test content")).toBe("test content");
      expect(sanitizeContent("")).toBe("");
    });
  });
});
