# The Proven X — Niche Q&A Community

A StackOverflow-style Q&A community for niche, hard-to-find knowledge: new policies, regulations, unwritten rules, and practical advice. Formerly "Mustashar".

Brand palette (owner-specified): orange primary, blue secondary (nav/icons), yellow accent, off-white background, white surfaces, dark navy text, light gray borders (tokens in `artifacts/community/src/index.css`).

## Product overview
- Public question feed (featured/pinned first), question detail with answers, comments, up/down voting, asker-chosen accepted answer
- Categories (required per question) alongside tags; full-bleed home hero with search + Ask a Question; "Top verifiers this month" sidebar card (most accepted answers in last 30 days, via `answers.accepted_at`)
- Reputation system (votes/accepts), public contributor profiles with badges, top contributors leaderboard
- Full-text search (Postgres FTS) with tag and unanswered filters
- Real-time in-app notifications (SSE stream + bell badge)
- Per-post AI translation toggle (Original / English / Arabic), cached in DB
- 13-language UI (en, ar, tl, hi, zh, fr, es, ru, uk, fa, ur, bn, tr) with RTL for ar/fa/ur
- Admin control panel: overview stats, flagged-content queue, user management (roles/suspend), tag management, pin/unpin questions, transactions list
- Anti-spam: honeypot fields, rate limits (tighter for low-reputation users), report/flag flow
- SEO: per-route Next.js metadata, JSON-LD (WebSite/Organization, QAPage, Person), `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`

## Architecture
- pnpm monorepo. Frontend: `artifacts/community` (Next.js App Router, TanStack Query, Tailwind v4, react-i18next, `@clerk/nextjs`). Backend: `artifacts/api-server` (Express 5, pino). Design preview: `artifacts/mockup-sandbox` (Next.js).
- Next.js rewrites `/api/*` to the Express API (`API_URL`, default `http://localhost:8080`).
- API contract: `lib/api-spec/openapi.yaml` → Orval codegen (`pnpm --filter @workspace/api-spec run codegen`) → hooks in `lib/api-client-react`, Zod in `lib/api-zod`.
- DB: Postgres via Drizzle (`lib/db/src/schema/`). Push with `pnpm --filter @workspace/db run push`.
- Auth: Clerk (`@clerk/nextjs` on web; `@clerk/express` + optional proxy on api-server). Local `users` table is JIT-provisioned from Clerk identity; **the first user to sign in becomes admin**.
- Translation: Replit AI integration (OpenAI proxy) via `lib/integrations-openai-ai-server`; results cached in `translations` table.
- Email: pluggable scaffold in `artifacts/api-server/src/lib/mailer.ts` (dev log transport; no mail server wired). Account emails are handled by Clerk.
- Payments: scaffolding only — `transactions` table + admin listing; no live gateway.
- SSE notifications: `GET /api/notifications/stream` (not in OpenAPI spec by design).
- Sitemap: Next.js `app/sitemap.ts` (primary for the web app); api-server still exposes `/sitemap.xml` for platform routing if needed.

## User preferences
- User is non-technical-leaning; communicate in product terms.
- Accepted PostgreSQL (over MongoDB) and Next.js App Router for the web frontend (SEO-friendly SSR/SSG).
