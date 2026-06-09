<div align="center">
  <h1>📬 Postmarker</h1>
  <p><strong>Anonymous, transient email threads. No sign-up. No tracking. No data retention.</strong></p>

  <p>
    <a href="https://github.com/JhaSourav07/postmarker/stargazers">
      <img src="https://img.shields.io/github/stars/JhaSourav07/postmarker?style=for-the-badge&color=F59E0B&labelColor=0B0D10" alt="GitHub Stars" />
    </a>
    <a href="https://github.com/JhaSourav07/postmarker/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/JhaSourav07/postmarker?style=for-the-badge&color=10B981&labelColor=0B0D10" alt="License" />
    </a>
    <a href="https://github.com/JhaSourav07/postmarker/issues">
      <img src="https://img.shields.io/github/issues/JhaSourav07/postmarker?style=for-the-badge&color=3B82F6&labelColor=0B0D10" alt="Open Issues" />
    </a>
    <a href="https://github.com/JhaSourav07/postmarker/pulls">
      <img src="https://img.shields.io/github/issues-pr/JhaSourav07/postmarker?style=for-the-badge&color=8B5CF6&labelColor=0B0D10" alt="Pull Requests" />
    </a>
  </p>

  <br />

  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gmail-SMTP%2FIMAP-EA4335?style=flat-square&logo=gmail&logoColor=white" />

</div>

---

## What is Postmarker?

Postmarker lets anyone send a secure, anonymous email to any recipient and read replies — all without creating an account. When you compose a message, Postmarker:

1. **Generates a unique thread alias** (e.g. `you+xk3a9f@gmail.com`)
2. **Dispatches your email anonymously** via SMTP with custom `X-PostMarker-Thread-ID` headers
3. **Returns a single-use cryptographic token** — your only key to the inbox
4. **Syncs replies via IMAP** using header-based lookup (zero bandwidth waste)
5. **Deletes everything** after 7 days — threads, messages, tokens

There is no user database. There are no cookies. There is nothing to leak.

---

## Features

- 🔐 **Cryptographic token access** — SHA-256 hashed, never stored in plaintext
- 📨 **Anonymous SMTP dispatch** — custom `X-PostMarker-Thread-ID` header embedded in every email
- 📥 **Smart IMAP sync** — 4-tier fallback strategy; marks emails `\Seen` immediately after ingestion
- 🧹 **Auto-expiry** — MongoDB TTL-based cleanup, enforced by a daily Vercel Cron Job
- 🚫 **Zero tracking** — no analytics, no user accounts, no persistent identity
- ⚡ **Edge-ready** — Next.js 16 App Router, Turbopack dev server
- 🎨 **Premium UI** — Framer Motion animations, Geist font, dark-mode first

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (compose form)
│   ├── inbox/
│   │   ├── page.tsx                # /inbox token entry
│   │   └── [token]/page.tsx        # Thread inbox view (server component)
│   └── api/
│       ├── create-thread/route.ts  # POST — creates thread, sends email
│       ├── inbox/route.ts          # GET  — IMAP sync + fetch messages
│       └── cleanup/route.ts        # GET/POST — purge expired records
├── components/
│   ├── home/                       # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── ComposerCard.tsx
│   │   ├── Features.tsx
│   │   ├── Workflow.tsx
│   │   └── SuccessModal.tsx
│   ├── inbox/                      # Token access form
│   │   └── TokenAccessForm.tsx
│   └── conversation/               # Thread inbox UI
│       ├── InboxClientForm.tsx
│       ├── InboxHeader.tsx
│       ├── ThreadSidebar.tsx
│       └── MessageViewer.tsx
├── services/
│   ├── thread.service.ts           # Thread creation + SMTP dispatch
│   └── imap.service.ts             # IMAP sync with header lookup
├── models/
│   ├── Thread.ts                   # Mongoose thread schema
│   └── Message.ts                  # Mongoose message schema
└── lib/
    ├── mongodb.ts                  # Connection pooling
    ├── email.ts                    # Nodemailer transporter
    ├── crypto.ts                   # Token generation + hashing
    └── validators.ts               # XSS sanitisation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier works)
- A Gmail account with:
  - **IMAP enabled** (Settings → See all settings → Forwarding and POP/IMAP)
  - An **App Password** ([myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))

### 1. Clone the repository

```bash
git clone https://github.com/JhaSourav07/postmarker.git
cd postmarker
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Postmarker?retryWrites=true&w=majority

# SMTP (outgoing email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx   # Gmail App Password (no trailing spaces!)
SMTP_FROM=you@gmail.com

# IMAP (incoming email sync)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=you@gmail.com
IMAP_PASS=xxxx xxxx xxxx xxxx   # Same App Password

# Cron security (generate with: openssl rand -hex 32)
CRON_SECRET=
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in **Settings → Environment Variables**
4. The `vercel.json` in this repo configures a daily cron job at midnight UTC to purge expired data

> **MongoDB Atlas**: Allow all IPs (`0.0.0.0/0`) or Vercel's IP ranges under **Network Access**.

---

## How the IMAP Sync Works

When a recipient replies to a Postmarker email, their email client preserves the custom `X-PostMarker-Thread-ID` header (set on the original outbound message). The sync pipeline uses a 4-tier strategy:

| Priority | Method | Speed |
|---|---|---|
| 1 | `HEADER X-PostMarker-Thread-ID: <threadId>` | ⚡ Instant |
| 2 | `HEADER X-Thread-ID: <threadId>` | ⚡ Instant |
| 3 | `SUBJECT` contains `<threadId>` | 🔶 Fast |
| 4 | Scan last 50 UNSEEN emails by envelope | 🔴 Last resort |

Once a message is saved to MongoDB, it is immediately marked `\Seen` on the IMAP server. Future syncs skip it at the server-side search level — zero re-download, zero re-parse.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## Security

See [SECURITY.md](./SECURITY.md) for how to report vulnerabilities.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

---

## License

MIT © [Sourav Jha](https://github.com/JhaSourav07)
