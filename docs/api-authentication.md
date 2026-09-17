# API Authentication — SmashVision Web

How `smashVisionWeb` reaches the SmashVision API, what the Vercel proxy does, and how to set it up locally and in production.

---

## The problem

`api.smashvisionapp.com` is a public URL. CORS only constrains browsers; it does nothing about Postman, curl or a scraper. We want a cheap signal that a request came from our own frontend.

Note what this is *not*. Most of the site is public — the club list, the video search on Home, `/videoView`, `/lives` all work signed-out — so the proxy forwards for anonymous visitors too. The app token proves **origin**, not **permission**. Anything that depends on who the user is must check the user's own Clerk JWT (see "User identity" below).

---

## The solution: a shared secret between the proxy and the API

Every REST call from the browser targets the relative path `/api/proxy/...`. In production a Vercel serverless function (`api/proxy/[...path].js`) picks it up and forwards it to Railway with **two independent headers**:

| Header | Carries | Read by |
|---|---|---|
| `x-app-token` | a static secret, `APP_PROXY_SECRET` | `requireAppToken` on the API |
| `Authorization` | the browser's own Clerk session JWT, forwarded untouched (absent when signed out) | `clerkMiddleware()` / `getAuth(req)` / `requireAdmin` |

Keeping them separate is the whole design. They used to be conflated and it cost us twice — see "History" at the bottom.

The secret lives only in the Vercel function's runtime environment. It is never `VITE_`-prefixed, so it never enters the browser bundle.

---

## Architecture

### Production (Vercel)

```
Browser
  │  GET /api/proxy/clubs
  │  Authorization: Bearer <Clerk user JWT>   (only if signed in)
  ▼
Vercel Serverless Function  (api/proxy/[...path].js)
  │  - holds APP_PROXY_SECRET (server-side only)
  │  - forwards method, JSON body, query string
  │  - streams video/* and application/octet-stream through,
  │    preserving Content-Disposition (clip downloads keep their filename)
  │
  │  GET https://api.smashvisionapp.com/api/clubs
  │  x-app-token:   <APP_PROXY_SECRET>
  │  Authorization: Bearer <Clerk user JWT>   (forwarded as-is)
  ▼
Railway API
  │  requireAppToken   constant-time compares x-app-token
  │  clerkMiddleware   verifies Authorization for user-identified routes
  ▼
Response → Vercel → Browser
```

`vercel.json` rewrites `/api/proxy/(.*)` → `/api/proxy/[...path]?path=$1`; everything else falls through to the SPA.

### Local development (Vite)

There is no Vercel runtime. `vite.config.js` proxies `/api/proxy/*` → `${VITE_API_URL}/api/*` (default `http://localhost:5000`), skipping the serverless function entirely. `requireAppToken` short-circuits when `NODE_ENV !== "production"`, so no secret is needed. The Vite proxy is disabled when `process.env.VERCEL` is set (i.e. under `vercel dev`).

```
Browser → Vite dev proxy (/api/proxy/clubs → /api/clubs) → local API (NODE_ENV=development)
```

| You want to test | Run |
|---|---|
| UI, pages, API calls, Clerk sign-in, roles | `npm run dev` → http://localhost:5173 |
| The proxy itself, the app-token gate, prod-equivalent 401s | `vercel dev` → http://localhost:3000 |

For `vercel dev`, `.env.local` needs `APP_PROXY_SECRET` and `RAILWAY_API_URL=http://localhost:5000`, and that local API must run with `NODE_ENV=production` and the same `APP_PROXY_SECRET` for the gate to actually fire.

> ⚠️ **`vercel dev` also reads `.env`.** If `RAILWAY_API_URL` there still points at `https://api.smashvisionapp.com`, your local frontend proxies to **production** and nothing says so — you get production's 401s and assume your local setup is broken. Keep `RAILWAY_API_URL` on `http://localhost:5000` in both local files; the production value belongs in the Vercel dashboard. Note `http`, not `https`: the local API serves plain HTTP, and `https://localhost:5000` fails the TLS handshake, which the proxy reports as a generic `502 Proxy error`.

---

## User identity

The proxy does not touch `Authorization`, so a signed-in user's Clerk JWT reaches the API intact and `getAuth(req)` resolves them in production exactly as it does locally. That is what `DELETE /api/clips/:id` and everything under `/api/admin/*` rely on.

The API's `getUserToken(req)` (`api/src/middleware/requireAdmin.js`) reads `Authorization` first and still falls back to the legacy `x-user-token`; nothing sends that header any more and the fallback can be removed once no old deployment is live.

WebSocket is not proxied — Vercel serverless cannot do WS upgrades. `WebSocketContext.jsx` connects straight to Railway at `${VITE_WS_URL}/ws?token=<Clerk user JWT>`.

---

## File reference

| File | Purpose |
|---|---|
| `smashVisionWeb/api/proxy/[...path].js` | The serverless proxy: adds `x-app-token`, forwards `Authorization` |
| `smashVisionWeb/vite.config.js` | Dev-only proxy to the local/remote API |
| `smashVisionWeb/vercel.json` | Routes `/api/proxy/*` to the function, everything else to the SPA |
| `api/src/middleware/requireAppToken.js` | Compares `x-app-token` on all `/api/*` in production |
| `api/src/middleware/requireAdmin.js` | `getUserToken()` + the admin role gate |
| `api/server.js` | `app.use("/api", requireAppToken)` before the routers |

---

## Environment variables

### Vercel (server-side — no `VITE_` prefix)

| Variable | Description |
|---|---|
| `APP_PROXY_SECRET` | The shared secret. Must be byte-identical to the API's. |
| `RAILWAY_API_URL` | `https://api.smashvisionapp.com` |

### Railway (API)

| Variable | Description |
|---|---|
| `APP_PROXY_SECRET` | Same value as on Vercel. **If unset in production the API returns 500 on every `/api/*` request** — it fails closed rather than silently opening. |
| `NODE_ENV` | Must be `production` or the gate is skipped entirely |
| `ALLOWED_ORIGINS` | `https://smashvisionapp.com,https://www.smashvisionapp.com` |

### Local `.env`

Only `VITE_`-prefixed vars are needed for `npm run dev`; the Vite proxy reads `VITE_API_URL`.

---

## Rotating the secret

Generate: `openssl rand -base64 32`

Order matters, because the API accepts exactly one value:

1. Set the new value on **Railway** and redeploy. Requests from the old proxy now 401.
2. Set the new value on **Vercel** and redeploy.

That is a short window of 401s. To rotate with no downtime, add a second accepted value on the API first, cut Vercel over, then remove the old one.

---

## Verifying a deploy

1. Open the app and watch the Network tab — every API call goes to `/api/proxy/*` and returns 200.
2. Sign in and delete one of your own clips. It should succeed; a 401 here means `Authorization` is not reaching the API.
3. `curl https://api.smashvisionapp.com/api/clubs` with no headers → `401 {"error":"Missing app token"}`.
4. Same with a wrong `x-app-token` → `401 {"error":"Invalid app token"}`.
5. Vercel function logs should be quiet — there is no token fetch any more.

---

## History — why this is not Clerk M2M

The first version minted a Clerk **M2M JWT** in the proxy and sent it as `Authorization: Bearer`, demoting the user's own JWT to `x-user-token`. The API verified it against Clerk's JWKS. Two things went wrong:

1. **Quota.** The token was cached in the function's *module scope*, which is per lambda instance, not global. Vercel starts and recycles instances constantly, so each cold start minted a fresh token until Clerk returned `403 token_quota_exceeded` — and the proxy then 502'd every request. M2M tokens are priced and rate-limited for backend-to-backend traffic; fronting a public website with them is the wrong tool.
2. **Lost user identity.** With the machine token in `Authorization`, `clerkMiddleware()`/`getAuth(req)` saw the machine, not the user, so `DELETE /api/clips/:id` returned 401 in production while working locally.

A static shared secret gives the same guarantee the M2M token actually provided — "this came from our proxy" — with no quota, no network call and no JWKS cache, and leaves `Authorization` free for the user. `CLERK_M2M_CLIENT_ID`, `CLERK_M2M_CLIENT_SECRET`, `CLERK_API_MACHINE_ID` and the API-side `CLERK_ISSUER_URL` are all unused now and can be deleted from both dashboards.
