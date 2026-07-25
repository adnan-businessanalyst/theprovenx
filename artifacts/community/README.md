# @workspace/community

Next.js (App Router) frontend for The Proven X.

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Clerk (`@clerk/nextjs`)
- TanStack Query via `@workspace/api-client-react`
- Express API proxied at `/api/*` (see `next.config.ts` rewrites)
- Postgres + Drizzle remain in `@workspace/db` / `artifacts/api-server`

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute canonical / sitemap / OG base URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret (middleware / server) |
| `NEXT_PUBLIC_CLERK_PROXY_URL` | Optional Clerk proxy |
| `API_URL` | Express origin for `/api` rewrites (default `http://localhost:8080`) |
| `PORT` | Optional; scripts default to `21400` |

API/DB still need `DATABASE_URL` and Clerk keys on `artifacts/api-server`.

## Commands

```bash
# from repo root
pnpm install

# API (port 8080)
pnpm --filter @workspace/api-server run dev

# Web (port 21400)
pnpm --filter @workspace/community run dev

# production
pnpm --filter @workspace/community run build
pnpm --filter @workspace/community run start
```

## SEO

- Per-route `metadata` / `generateMetadata`
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`
- JSON-LD on home, question, and profile pages
- Clean App Router URLs (`/questions/[slug]`, `/users/[username]`, …)
