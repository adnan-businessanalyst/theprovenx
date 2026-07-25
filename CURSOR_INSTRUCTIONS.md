# The Proven X — local development notes

This is a pnpm monorepo containing **"The Proven X"** — a niche Q&A community.

## What's inside
- `artifacts/community` — **Next.js App Router** web frontend (React, TanStack Query, Tailwind CSS v4, shadcn/ui, react-i18next with 13 locales incl. RTL, Clerk via `@clerk/nextjs`)
- `artifacts/api-server` — Express 5 backend API
- `artifacts/mobile` — Expo React Native app
- `artifacts/mockup-sandbox` — Next.js component preview server (design canvas)
- `lib/` — shared workspace libraries, including Orval-generated OpenAPI client (`@workspace/api-client-react`)
- `lib/db` — Drizzle ORM schema for PostgreSQL

## Environment variables
- `DATABASE_URL` (PostgreSQL) — api-server / `@workspace/db`
- `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — community + api-server
- `NEXT_PUBLIC_SITE_URL` — absolute site URL for SEO (canonical, sitemap, OG)
- `API_URL` — Express origin used by Next.js `/api` rewrites (default `http://localhost:8080`)
- See `artifacts/community/.env.example`

## Commands
- `pnpm install`
- `pnpm --filter @workspace/api-server run dev`
- `pnpm --filter @workspace/community run dev` → Next.js on port 21400
- `pnpm --filter @workspace/community run build` / `start`
- `pnpm run --filter @workspace/api-spec codegen`
- `pnpm --filter @workspace/db run push`
