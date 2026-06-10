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

    it("should generate unique tokens across a batch of 100 calls", () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateSecureToken());
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe("hashToken", () => {
    it("should compute a valid SHA-256 hash", () => {
      // Test vector: sha256("test") = 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
      const hash = hashToken("test");
      expect(hash).toBe("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    });

    it("should hash empty string correctly to empty SHA-256 digest", () => {
      const hash = hashToken("");
      expect(hash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });

    it("should be case-sensitive", () => {
      expect(hashToken("Test")).not.toBe(hashToken("test"));
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

    it("should generate unique thread IDs across a batch of 100 calls", () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateThreadId());
      }
      expect(ids.size).toBe(100);
    });
  });
});
