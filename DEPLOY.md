# Deploy The Proven X

## Architecture on Vercel

| Piece | Where it runs |
|---|---|
| Next.js web (`artifacts/community`) | **Vercel** |
| Express API (`artifacts/api-server`) | Separate host (Railway, Render, Fly.io, etc.) |
| Postgres | Neon, Supabase, Railway, or any hosted Postgres |

Vercel hosts the frontend. The app proxies `/api/*` to your Express `API_URL`.

---

## 1. Database

Create a Postgres database (e.g. [Neon](https://neon.tech)) and copy the connection string (`DATABASE_URL`).

Push schema from your machine (or CI):

```bash
pnpm --filter @workspace/db run push
```

---

## 2. Express API (not on Vercel)

Deploy `artifacts/api-server` somewhere that runs Node continuously.

Required env on the API host:

- `PORT` (often set by the platform)
- `DATABASE_URL`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NODE_ENV=production`

Start command example:

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

Note the public API origin, e.g. `https://api.yourdomain.com`.

---

## 3. Clerk

In the [Clerk dashboard](https://dashboard.clerk.com):

1. Add your Vercel URL to allowed origins / redirect URLs  
   (`https://your-app.vercel.app`, `/sign-in`, `/sign-up`)
2. Copy **Publishable key** and **Secret key**

---

## 4. Deploy Next.js on Vercel

### A. GitHub import (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `adnan-businessanalyst/theprovenx`
3. Configure:
   - **Root Directory:** `artifacts/community`
   - **Framework Preset:** Next.js
   - **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`  
     (already in `artifacts/community/vercel.json`)
   - **Build Command:** `cd ../.. && pnpm --filter @workspace/community build`
4. Add Environment Variables (Production + Preview):

| Name | Example |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |
| `CLERK_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `API_URL` | `https://your-api-host.example` |

5. Deploy

After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the final domain (custom domain or `*.vercel.app`) and redeploy.

### B. CLI

```bash
npm i -g vercel
vercel login
cd artifacts/community
vercel
```

Link the project, set Root Directory to `artifacts/community` when prompted, then add the same env vars in the Vercel dashboard (or `vercel env add`).

---

## 5. Smoke test

- Open the Vercel URL — home page loads
- `/robots.txt`, `/sitemap.xml` respond
- Sign-in works (Clerk)
- Questions load (API + DB reachable via `API_URL`)

---

## Local env template

See `artifacts/community/.env.example`.
