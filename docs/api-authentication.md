# API Authentication — SmashVision Web

This document explains how `smashVisionWeb` authenticates with the SmashVision API, how the Vercel proxy works, and how to set everything up for local development and production.

---

## The Problem

The SmashVision API (`api.smashvisionapp.com`) is a public URL. Without protection, anyone could hit it directly from Postman or a script without being a legitimate SmashVision client. CORS alone only protects browser-to-browser cross-origin requests — it does not stop server-to-server or direct HTTP calls.

---

## The Solution: Vercel Proxy with Clerk M2M Tokens

A **machine-to-machine (M2M)** token is a short-lived JWT issued by Clerk that proves the caller is a trusted SmashVision application — not a random external client. The secret used to generate this token is stored **only on the Vercel server** (never in the browser), so it cannot be extracted.

All frontend API calls go through a Vercel serverless function (`/api/proxy/[...path].js`) which:

1. Fetches a short-lived M2M JWT from Clerk (cached until near-expiry)
2. Forwards the original request to the Railway API
3. Attaches the M2M JWT as an `x-app-token` header

The Railway API validates that header on every `/api/*` request using Clerk's public JWKS endpoint.

---

## Architecture

### Production (Vercel)

```
Browser
  │
  │  GET /api/proxy/clubs
  ▼
Vercel Serverless Function  (api/proxy/[...path].js)
  │  - Holds CLERK_M2M_CLIENT_SECRET (server-side only, never in browser)
  │  - Fetches M2M JWT from Clerk (cached per function instance)
  │  - Adds x-app-token header
  │
  │  GET https://api.smashvisionapp.com/api/clubs
  │  Headers: x-app-token: <M2M JWT>
  │           Authorization: Bearer <Clerk user JWT>  (if user is signed in)
  ▼
Railway API
  │  requireAppToken middleware validates x-app-token via Clerk JWKS
  │  clerkMiddleware validates Authorization header for user-protected routes
  ▼
Response → Vercel → Browser
```

### Local Development (Vite)

In development there is no Vercel runtime. Instead, Vite's built-in proxy rewrites `/api/proxy/*` → `http://localhost:5000/api/*` (or the value of `VITE_API_URL`), sending requests directly to the API without a token.

The API middleware skips M2M validation when `NODE_ENV !== "production"`, so local development works without any token setup.

```
Browser
  │
  │  GET /api/proxy/clubs
  ▼
Vite Dev Server Proxy
  │  Rewrites path: /api/proxy/clubs → /api/clubs
  │  Forwards to VITE_API_URL (e.g. http://localhost:5000)
  ▼
Local or Railway API
  │  requireAppToken skips validation (NODE_ENV = development)
  ▼
Response → Browser
```

---

## File Reference

| File | Location | Purpose |
|------|----------|---------|
| Vercel proxy function | `smashVisionWeb/api/proxy/[...path].js` | Serverless function — fetches M2M token, proxies to Railway |
| Vite proxy config | `smashVisionWeb/vite.config.js` | Dev-only proxy: forwards `/api/proxy/*` to local/Railway API |
| Route config | `smashVisionWeb/vercel.json` | Ensures `/api/*` reaches the serverless function, not the SPA |
| App token middleware | `api/src/middleware/requireAppToken.js` | Validates `x-app-token` on all `/api/*` routes in production |
| Middleware applied in | `api/server.js` | `app.use("/api", requireAppToken)` before all route handlers |

---

## Environment Variables

### smashVisionWeb — Vercel Dashboard

These must be added as **server-side** variables (no `VITE_` prefix). They are never sent to the browser.

| Variable | Description | Example |
|----------|-------------|---------|
| `CLERK_ISSUER_URL` | Your Clerk frontend API URL | `https://clerk.smashvisionapp.com` |
| `CLERK_M2M_CLIENT_ID` | Client ID of the M2M machine in Clerk | `m2m_abc123...` |
| `CLERK_M2M_CLIENT_SECRET` | Client secret of the M2M machine — keep this safe | `sk_...` |
| `RAILWAY_API_URL` | Base URL of the Railway API | `https://api.smashvisionapp.com` |

> These variables are only accessible inside the Vercel serverless function. They are NOT bundled into the React app.

### smashVisionWeb — Local `.env`

Only `VITE_` prefixed variables are needed locally. The proxy reads `VITE_API_URL` from `vite.config.js`.

```env
VITE_API_URL=https://api.smashvisionapp.com
# Or point to local API:
# VITE_API_URL=http://localhost:5000
```

### Railway API — Environment Variables

| Variable | Description |
|----------|-------------|
| `CLERK_ISSUER_URL` | Same Clerk frontend API URL as above — used to fetch JWKS for token validation |
| `NODE_ENV` | Must be set to `production` for M2M validation to be enforced |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins (e.g. `https://smashvisionapp.com,https://www.smashvisionapp.com`) |

---

## Setting Up Clerk M2M (One-Time)

1. Go to the [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your SmashVision application
3. Navigate to **Configure → M2M Tokens**
4. Click **Create machine** — name it `SmashVision Web`
5. Copy the `Client ID` and `Client Secret`
6. Add them to Vercel as `CLERK_M2M_CLIENT_ID` and `CLERK_M2M_CLIENT_SECRET`

The `CLERK_ISSUER_URL` is your Clerk **Frontend API URL**, found under **Configure → API Keys** — it looks like `https://clerk.smashvisionapp.com` or `https://<your-id>.clerk.accounts.dev` in development.

---

## How to Test in Production (Vercel Deployment)

1. Add all four Vercel server-side env vars listed above in the Vercel dashboard
2. Add `CLERK_ISSUER_URL` and `NODE_ENV=production` to Railway
3. Set `ALLOWED_ORIGINS=https://smashvisionapp.com,https://www.smashvisionapp.com` in Railway
4. Push to `master` — Vercel will deploy automatically
5. Open the deployed app and watch the Network tab: all API calls should go to `/api/proxy/*` and return valid responses
6. In Vercel's function logs you should see `Fetching new M2M token...` on the first request, then silence as the token is reused from cache

To confirm the Railway API is rejecting unauthorized requests, try hitting `https://api.smashvisionapp.com/api/clubs` directly from Postman without the `x-app-token` header — you should get `401 Missing app token`.

---

## How the Token Cache Works

The M2M token is cached in the Vercel function's module scope (a variable at the top of `[...path].js`). Vercel function instances are reused across requests within the same deployment, so the token is typically fetched once and reused until 60 seconds before it expires, at which point a new one is fetched automatically. On a cold start (new instance), the cache is empty and one fetch happens.

---

## WebSocket

The WebSocket connection (`wss://api.smashvisionapp.com/ws`) is **not** proxied through Vercel — Vercel serverless functions do not support WebSocket upgrades. The WebSocket connects directly to Railway and is authenticated using a Clerk user JWT passed as a query parameter (`?token=...`). This is handled separately in `WebSocketContext.jsx` and is unaffected by the M2M proxy.
