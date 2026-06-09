/**
 * Simple in-memory IP rate limiter.
 *
 * Tracks request counts per IP in a Map. Each entry expires after `windowMs`.
 * On Vercel, serverless cold starts reset the map, so this is a best-effort
 * guard — not a substitute for Redis-backed rate limiting in high-traffic prod.
 *
 * For production hardening, swap this module with an Upstash Redis client.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp ms
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param ip      The client IP address (from x-forwarded-for on Vercel)
 * @param limit   Max requests allowed within the window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    // New window
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extracts the real client IP from a Next.js Request.
 * Vercel sets x-forwarded-for; falls back to a placeholder for local dev.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
