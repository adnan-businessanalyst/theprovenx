# Deploy The Proven X

## Architecture on Vercel

| Piece | Where it runs |
|---|---|
| Next.js web (`artifacts/community`) | **Vercel** |
| Express API (`artifacts/api-server`) | Separate host (Railway, Render, Fly.io, etc.) |
| Postgres | Neon, Supabase, Railway, or any hosted Postgres |

Vercel hosts the frontend. The app proxies `/api/*` to your Express `API_URL`.

Auth is **first-party** (Express sessions). Web uses the httpOnly `tp_session` cookie through the Next rewrite. Mobile uses Bearer tokens from the same `sessions` table.

---

## 1. Database

Create a Postgres database (e.g. [Neon](https://neon.tech)) and copy the connection string (`DATABASE_URL`).

Push schema from your machine (or CI):

```bash
pnpm --filter @workspace/db run push
```

### Clerk cutover
If you previously used Clerk, `users.clerk_id` is gone. Rows that only had a Clerk identity cannot log in until they re-register (or you seed accounts with `create-platform-owner.ts` / password reset). For production cutover, plan a maintenance window, push the new schema, and communicate re-registration to members.

---

## 2. Express API (not on Vercel)

Deploy `artifacts/api-server` somewhere that runs Node continuously.

Required env on the API host:

- `PORT` (often set by the platform)
- `DATABASE_URL`
- `SESSION_SECRET` (long random string)
- `NODE_ENV=production`
- `PUBLIC_APP_URL` (e.g. `https://your-app.vercel.app` — used in reset emails)
- Optional: `COOKIE_DOMAIN` if web and API share a parent domain and you set cookies across subdomains

Start command example:

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

Note the public API origin, e.g. `https://api.yourdomain.com`.

**Cookie note:** With Next rewriting `/api/*` to Express, browsers treat Set-Cookie as coming from the Vercel origin. Prefer same-site deploy (rewrite) over cross-origin API calls from the browser. If the browser talks to the API origin directly, configure CORS + `COOKIE_DOMAIN` carefully (`SameSite=None; Secure` in production).

---

## 3. Deploy Next.js on Vercel

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

## 4. Smoke test

- Open the Vercel URL — home page loads
- Register a new user at `/sign-up` (first user becomes admin)
- Confirm `/api/healthz` via the rewrite
- Sign out / sign in works; protected routes (`/ask`, `/profile`, `/admin`) require the session cookie
