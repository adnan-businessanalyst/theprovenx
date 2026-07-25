# @workspace/community

Next.js (App Router) frontend for The Proven X.

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- First-party auth (cookie session via Express `/api/auth/*`)
- TanStack Query via `@workspace/api-client-react`
- Express API proxied at `/api/*` (see `next.config.ts` rewrites)
- Postgres + Drizzle remain in `@workspace/db` / `artifacts/api-server`

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute canonical / sitemap / OG base URL |
| `API_URL` | Express origin for `/api` rewrites (default `http://localhost:8080`) |
| `PORT` | Optional; scripts default to `21400` |

API/DB need `DATABASE_URL` and `SESSION_SECRET` on `artifacts/api-server`.

## Commands

```bash
# from repo root
pnpm install

# API (port 8080)
pnpm --filter @workspace/api-server run dev

# Web (port 21400)
pnpm --filter @workspace/community run dev

# production build
pnpm --filter @workspace/community run build
pnpm --filter @workspace/community run start
```

Open http://localhost:21400 — register at `/sign-up` (first user becomes admin).
