import { describe, it, expect } from "vitest";
import { generateSecureToken, hashToken, generateThreadId } from "./crypto";

describe("Crypto Utilities", () => {
  describe("generateSecureToken", () => {
    it("should return a 64-character lowercase hex string", () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it("should generate cryptographically unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("hashToken", () => {
    it("should compute a valid SHA-256 hash", () => {
      // Test vector: sha256("test") = 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
      const hash = hashToken("test");
      expect(hash).toBe("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    });
  });

  describe("generateThreadId", () => {
    it("should return a 16-character lowercase hex string", () => {
      const threadId = generateThreadId();
      expect(threadId).toHaveLength(16);
      expect(threadId).toMatch(/^[0-9a-f]{16}$/);
    });

    it("should generate unique thread IDs", () => {
      const id1 = generateThreadId();
      const id2 = generateThreadId();
      expect(id1).not.toBe(id2);
    });
  });
});
