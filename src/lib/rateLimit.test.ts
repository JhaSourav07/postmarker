import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

describe("Rate Limiter Utilities", () => {
  let checkRateLimit: typeof import("./rateLimit").checkRateLimit;
  let getClientIp: typeof import("./rateLimit").getClientIp;

  beforeAll(async () => {
    vi.useFakeTimers();
    const mod = await import("./rateLimit");
    checkRateLimit = mod.checkRateLimit;
    getClientIp = mod.getClientIp;
  });

  afterAll(() => {
    vi.useRealTimers();
  });

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
    });

    it("should clean up expired entries periodically via setInterval", () => {
      // Create an expired entry (expires in 1s)
      const expiredIp = "192.168.1.100";
      checkRateLimit(expiredIp, 5, 1000);

      // Create a non-expired entry (expires in 10 minutes)
      const nonExpiredIp = "192.168.1.200";
      const firstCheck = checkRateLimit(nonExpiredIp, 5, 10 * 60 * 1000);
      expect(firstCheck.remaining).toBe(4);

      // Advance time by 5 minutes (300,000 ms) to trigger setInterval
      vi.advanceTimersByTime(5 * 60 * 1000);

      // Checking non-expired IP should decrement remaining requests (4 -> 3),
      // proving the entry was NOT deleted from the store.
      const secondCheck = checkRateLimit(nonExpiredIp, 5, 10 * 60 * 1000);
      expect(secondCheck.remaining).toBe(3);

      // Checking expired IP should reset the window (remaining should be 4),
      // because it was deleted/expired.
      const expiredCheck = checkRateLimit(expiredIp, 5, 1000);
      expect(expiredCheck.remaining).toBe(4);
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
