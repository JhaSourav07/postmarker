# Contributing to Postmarker

First off — thank you for taking the time to contribute! 🎉

Whether you're fixing a bug, improving documentation, proposing a feature, or reviewing a PR, every contribution matters.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Commit Message Convention](#commit-message-convention)
- [Code Style](#code-style)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Please report unacceptable behaviour to the maintainers.

---

## How Can I Contribute?

### Reporting Bugs

Before filing a bug report, please search [existing issues](https://github.com/JhaSourav07/postmarker/issues) to avoid duplicates.

When filing a bug, include:

- **What you expected to happen**
- **What actually happened** (with error messages / logs if available)
- **Steps to reproduce** (minimal and specific)
- **Environment**: OS, Node.js version, browser (if UI-related)

Use the **Bug Report** issue template.

---

### Suggesting Features

Feature requests are welcome. Open an issue using the **Feature Request** template and describe:

- **The problem** you're trying to solve
- **Your proposed solution**
- **Alternatives you considered**

---

### Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-description
   ```

2. **Make your changes.** Keep them focused — one feature or fix per PR.

3. **Ensure the code compiles** with no TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

4. **Run the linter:**
   ```bash
   npm run lint
   ```

5. **Commit** following the [Conventional Commits](#commit-message-convention) format.

6. **Push** and open a Pull Request against `main`. Fill in the PR template completely.

7. A maintainer will review within a few days. Be responsive to feedback.

---

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)
- Gmail account with IMAP enabled + an App Password

### Steps

```bash
# Clone your fork
git clone https://github.com/<your-username>/postmarker.git
cd postmarker

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in .env.local with your credentials

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
postmarker/
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   ├── components/    # React components (home/, inbox/, conversation/)
│   ├── services/      # Business logic (ThreadService, ImapService)
│   ├── models/        # Mongoose models (Thread, Message)
│   └── lib/           # Utilities (db, crypto, email, validators)
├── vercel.json        # Vercel cron configuration
└── .env.example       # Environment variable template
```

---

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure (no feature or bug change) |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |

### Examples

```
feat(imap): add X-PostMarker-Thread-ID header lookup
fix(smtp): remove trailing space from App Password env var
docs: update IMAP sync architecture in README
refactor(cleanup): extract shared auth check into helper
```

---

## Code Style

- **TypeScript strict mode** — all types must be explicit. No `any` unless truly unavoidable (document why).
- **No unused variables** — the linter will catch these.
- **Keep files small and focused** — components under `200 lines`, services under `300 lines`.
- **CSS**: Vanilla CSS or Tailwind utilities only. No inline `style={}` for layout.
- **Error handling**: Always handle async errors. Never silently swallow exceptions in services.
- **Logging**: Use `console.log("[Module] message")` format with a consistent module prefix.

---

## Good First Issues

Look for issues labelled [`good first issue`](https://github.com/JhaSourav07/postmarker/labels/good%20first%20issue) — these are intentionally scoped and well-documented entry points.

---

Thank you for helping make Postmarker better. 🚀
