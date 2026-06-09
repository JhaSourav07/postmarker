import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: [
          // Prevent browsers from guessing MIME types
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Block clickjacking via iframe embedding
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Only send the origin (no path) as Referer, and never over HTTP
          // This prevents email tracking pixels from learning the inbox URL
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Enforce HTTPS for 1 year (only meaningful in production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Block access to camera, microphone, geolocation
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy:
          // - default-src 'self'        → only load resources from our own origin
          // - script-src 'self' 'unsafe-inline' 'unsafe-eval' → required for Next.js
          // - style-src 'self' 'unsafe-inline' fonts.googleapis.com
          // - font-src 'self' fonts.gstatic.com
          // - img-src 'self' data: → allow inline data: images (email content)
          // - frame-src 'none' → no iframes anywhere
          // - object-src 'none' → no plugins
          // - base-uri 'self' → prevent base tag injection
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
