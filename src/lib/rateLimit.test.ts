import { describe, it, expect, vi } from "vitest";
import { checkRateLimit, getClientIp } from "./rateLimit";

describe("Rate Limiter Utilities", () => {
  describe("checkRateLimit", () => {
    it("should allow first request and track remaining requests", () => {
      const ip = "192.168.1.1";
      const result = checkRateLimit(ip, 3, 1000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.resetAt).toBeGreaterThan(Date.now());
    });

    it("should block request when limit is exceeded", () => {
      const ip = "192.168.1.2";
      // 1st request
      checkRateLimit(ip, 2, 1000);
      // 2nd request
      const second = checkRateLimit(ip, 2, 1000);
      expect(second.allowed).toBe(true);
      expect(second.remaining).toBe(0);

      // 3rd request (exceeded limit)
      const third = checkRateLimit(ip, 2, 1000);
      expect(third.allowed).toBe(false);
      expect(third.remaining).toBe(0);
    });

    it("should reset rate limit window after windowMs passes", () => {
      const ip = "192.168.1.3";
      vi.useFakeTimers();
      
      // Consume all limit
      checkRateLimit(ip, 1, 1000);
      const blocked = checkRateLimit(ip, 1, 1000);
      expect(blocked.allowed).toBe(false);

      // Advance time by 1001ms to trigger window expiry
      vi.advanceTimersByTime(1001);

      // Should be allowed again
      const allowedAgain = checkRateLimit(ip, 1, 1000);
      expect(allowedAgain.allowed).toBe(true);
      expect(allowedAgain.remaining).toBe(0);

      vi.useRealTimers();
    });
  });

  describe("getClientIp", () => {
    it("should extract client IP from x-forwarded-for header", () => {
      const req = new Request("http://localhost", {
        headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
      });
      expect(getClientIp(req)).toBe("203.0.113.195");
    });

    it("should fallback to x-real-ip header if x-forwarded-for is missing", () => {
      const req = new Request("http://localhost", {
        headers: { "x-real-ip": "198.51.100.10" },
      });
      expect(getClientIp(req)).toBe("198.51.100.10");
    });

    it("should fallback to local loopback IP if headers are missing", () => {
      const req = new Request("http://localhost");
      expect(getClientIp(req)).toBe("127.0.0.1");
    });
  });
});
