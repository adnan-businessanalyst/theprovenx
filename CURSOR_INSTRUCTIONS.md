# The Proven X — local development notes

This is a pnpm monorepo containing **"The Proven X"** — a niche Q&A community.

## What's inside
- `artifacts/community` — **Next.js App Router** web frontend (React, TanStack Query, Tailwind CSS v4, shadcn/ui, react-i18next with 13 locales incl. RTL)
- `artifacts/api-server` — Express 5 backend API with **first-party session auth**
- `artifacts/mobile` — Expo React Native app (Bearer session token via SecureStore)
- `artifacts/mockup-sandbox` — Next.js component preview server (design canvas)
- `lib/` — shared workspace libraries, including Orval-generated OpenAPI client (`@workspace/api-client-react`)
- `lib/db` — Drizzle ORM schema for PostgreSQL

## Auth (first-party)
- Email + password register/login/logout on Express (`/api/auth/*`)
- Web: httpOnly cookie `tp_session` (via Next `/api` rewrite → Express)
- Mobile: same session record, opaque token stored in SecureStore, sent as `Authorization: Bearer …`
- Passwords hashed with bcryptjs; reset tokens stored hashed; mailer is stubbed (logs in dev)
- Roles: `member | moderator | admin | platform_owner` — **first registered user becomes admin**
- Optional later: OAuth via `oauth_accounts` table (schema reserved)

### Cutover from Clerk
Old rows that only had `clerk_id` are not compatible with password login.
1. Apply `lib/db/scripts/migrate-off-clerk.sql` (or recreate DB + `pnpm --filter @workspace/db run push`).
2. Existing Clerk-linked users must **re-register** or be seeded (e.g. `create-platform-owner.ts`).
3. `drizzle-kit push` may prompt on `clerk_id` → email column conflicts; use the SQL script or a fresh DB in non-interactive environments.

## Environment variables
- `DATABASE_URL` (PostgreSQL) — api-server / `@workspace/db`
- `SESSION_SECRET` — pepper for hashing session/reset tokens (set a long random string in production)
- `COOKIE_DOMAIN` — optional cookie domain when API and web share a parent domain
- `PUBLIC_APP_URL` or `NEXT_PUBLIC_SITE_URL` — used in password-reset email links
- `NEXT_PUBLIC_SITE_URL` — absolute site URL for SEO (canonical, sitemap, OG)
- `API_URL` — Express origin used by Next.js `/api` rewrites (default `http://localhost:8080`)
- Mobile: `EXPO_PUBLIC_API_URL` (or `EXPO_PUBLIC_DOMAIN` for `https://$domain`)
- See `artifacts/community/.env.example`

## Commands
- `pnpm install`
- `pnpm --filter @workspace/db run push`
- `pnpm --filter @workspace/api-server run dev`
- `pnpm --filter @workspace/community run dev` → Next.js on port 21400
- `pnpm --filter @workspace/community run build` / `start`
- `pnpm run --filter @workspace/api-spec codegen`
- Platform owner bootstrap:
  `OWNER_EMAIL=… OWNER_PASSWORD=… pnpm --filter @workspace/api-server exec tsx scripts/create-platform-owner.ts`
