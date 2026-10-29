# Nexora

Nexora is a Next.js App Router digital-services application. Browser tools run locally. Account registration, credentials authentication, and profile storage use the configured managed PostgreSQL database. The application catalog, billing, email verification/recovery, AI providers, and public API-key service are not operational; the relevant screens are marked as previews.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- PostgreSQL with a version-controlled Prisma schema and SQL migration
- PostgreSQL driver-backed persistence for the initial auth/profile/API implementation
- Auth.js v5 credentials provider with JWT sessions and bcrypt password hashes
- Zod validation

## Local setup

1. Install Node.js 22.12 or later (Node 24 recommended for the test toolchain) and PostgreSQL 14 or later.
2. Install project dependencies: `npm install`.
3. Create a managed PostgreSQL database (for example, in Neon) and copy its PostgreSQL connection URL. Use the provider's pooled URL for a hosted app if recommended by the provider.
4. Copy `.env.example` to `.env.local`, replace the `DATABASE_URL` example with the provider's URL, generate a unique `AUTH_SECRET` locally (PowerShell: `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`), and set `NEXT_PUBLIC_APP_URL`.
5. Apply the versioned schema: `npm run db:migrate:dev`.
6. Start the app: `npm run dev`.

This project reads `.env.local` for Next.js and `.env` for Prisma CLI commands. Keep both ignored; when `.env.local` changes, copy its values into `.env` locally as well, then restart Next.js. A managed PostgreSQL project is provisioned for this workspace, its initial migrations are applied, and registration was verified with a temporary test account that was then removed. Never paste connection strings or generated secrets into chat, source code, or a public issue.

Available scripts: `npm run lint`, `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run db:status`, `npm run db:generate`, `npm run db:migrate:dev`, and `npm run db:migrate`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | For account and database APIs | PostgreSQL connection string. |
| `AUTH_SECRET` | For registration and sessions | Random secret of at least 32 characters; keep server-side. |
| `NEXT_PUBLIC_APP_URL` | For deployment | Canonical public HTTPS origin used by metadata, sitemap, and robots. |

Never put secrets in `NEXT_PUBLIC_*` variables or commit populated environment files. No third-party provider credentials are currently required.

## Current backend functionality

- Registration writes a user, profile, inactive Free subscription row, and audit event in one transaction. Passwords are bcrypt-hashed, registration validates and normalizes input, and database-backed registration/login rate buckets use hashed identifiers.
- Auth.js credentials login uses HTTP-only session cookies and checks account status. Profile and preference APIs, favorites, activity, usage, dashboard, app/tool catalogs, and health endpoints are under `/api`.
- Server-side profile and user data queries are restricted to the session user.
- A Prisma schema and initial PostgreSQL migration include users, profiles, applications, tools, favorites, activity, subscriptions, hashed API-key storage, usage, audit logs, reset tokens, and rate-limit buckets. Only the models used by current features are active.

## Operational limitations

- PostgreSQL registration and migration were smoke-tested against the managed database. A full browser sign-in/dashboard session flow still needs a dedicated end-to-end test.
- Prisma Client was generated and the Prisma 7.10.1 schema validated. The service layer uses parameterized PostgreSQL queries with the shared Prisma client configured server-side.
- Do not deploy the initial migration without reviewing it against an isolated database and taking a backup of any existing data.
- Email verification and password reset need a configured transactional email provider. Until then, password recovery is explicitly unavailable.
- The API key model is reserved for a future public API service; keys cannot be issued because no key-authenticated service endpoints are implemented. The current billing plans, app listings, AI features, and status page remain preview/not configured.
- Automated tests currently cover server-side form validation, registration rate-limit handling, and atomic registration writes with isolated database mocks. A real PostgreSQL integration test and cross-user production session test still require a separately configured test database and are not claimed as passing.
- The supplied Privacy and Terms pages are draft notices, not legal policies.

## Production deployment checklist

- Set production `DATABASE_URL`, an independently generated `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin.
- Generate Prisma Client and run `npm run db:migrate` as a controlled deployment step. Do not reset the production database.
- Configure trusted proxy IP forwarding for the persistent auth rate limiter and confirm your deployment's Auth.js host/cookie configuration.
- Set up backups, restoration tests, error monitoring, log retention, and database migration rollback procedures.
- Add and test email, AI, billing, and storage adapters before advertising those features. Do not represent draft legal pages, sample application routes, or example API endpoints as live services.
