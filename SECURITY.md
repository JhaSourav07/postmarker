# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ |
| Older tagged releases | ❌ |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Postmarker, please disclose it responsibly by emailing:

**[security@postmarker.dev](mailto:security@postmarker.dev)**  
*(or open a [GitHub Security Advisory](https://github.com/JhaSourav07/postmarker/security/advisories/new))*

### What to include

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations (optional but appreciated)

### Response timeline

| Action | SLA |
|---|---|
| Initial acknowledgement | 48 hours |
| Triage and severity assessment | 5 business days |
| Fix and coordinated disclosure | 30 days (or sooner) |

We will credit you in the release notes unless you prefer to remain anonymous.

---

## Security Design

Postmarker was designed with privacy and minimal attack surface as first principles:

- **No user accounts** — there is no user table to leak
- **Hashed tokens only** — raw tokens are never persisted. Only SHA-256 hashes are stored in MongoDB
- **XSS sanitisation** — all inbound HTML email bodies are sanitised before storage and rendering
- **Duplicate message guard** — IMAP sync checks `messageId` uniqueness before insert (prevents replay)
- **Thread expiry** — all threads and messages auto-delete after 7 days via MongoDB TTL
- **Cron endpoint auth** — the `/api/cleanup` route is protected by a `CRON_SECRET` bearer token
- **No analytics** — zero third-party trackers or telemetry

---

## Known Limitations

- Gmail SMTP rewrites the `From` header to the authenticated account. Alias-based sender identity is preserved only via `Reply-To`.
- IMAP sync relies on Gmail preserving `X-` custom headers in replies. Some aggressive email clients may strip them (strategies 3 & 4 handle this fallback).
