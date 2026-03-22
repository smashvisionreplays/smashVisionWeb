# SmashVision Web — Local Development Guide

## Why This Exists

Production uses a **production Clerk instance** (`pk_live_...`) and a **production Supabase database**. When running the frontend locally you cannot use the production Clerk instance — so you use the **development Clerk instance** (`pk_test_...`) instead. The problem is that dev Clerk users have completely different IDs than prod Clerk users, so they don't exist in the production database, and every protected route fails.

The solution is a **fully local dev stack**:

```
LOCAL FRONTEND           LOCAL API (port 5000)     LOCAL SUPABASE (Docker)
(dev Clerk pk_test_) →  (dev Clerk sk_test_)    →  (supabase start)
```

The `sync-dev-user.js` script bridges the gap: it takes your dev Clerk user and links it to your existing record in the local database, then updates Clerk's private metadata so the API can resolve you correctly.

---

## Prerequisites

- **Node.js 20.6+** (required for `--env-file` flag — run `node --version` to check)
- **Docker Desktop** installed and running
- **Supabase CLI** — install via your platform's package manager:
  - **Windows (Scoop):** `scoop install supabase`
  - **macOS (Homebrew):** `brew install supabase/tap/supabase`
  - **Linux:** see [Supabase CLI install docs](https://supabase.com/docs/guides/cli/getting-started)
  - Or download the binary directly from [github.com/supabase/cli/releases](https://github.com/supabase/cli/releases) and add it to your PATH

---

## One-Time Setup

Do this once. After this, the daily workflow is just a few commands.

### Step 1 — Start the local Supabase stack

The Supabase CLI manages the local database via Docker. Run from the `api/` folder:

```bash
cd C:\Users\tomas\Desktop\smashVisionReplays\api
supabase start
```

This starts a full local Supabase instance (Postgres, REST API, Studio). On first run it pulls Docker images — takes a few minutes. Subsequent starts are instant.

When done it prints the local URLs and keys. These are already configured in `api/.env_development`.

### Step 2 — Import production data

From the `api/` folder run the refresh script:

```bash
bash scripts/refresh-dev-db.sh
```

This script:
1. Dumps the production Supabase database (schema + data + stored functions) via the session pooler
2. Wipes and reimports into your local Supabase
3. Clears all production Clerk IDs so the sync script can match users by email

> All connection details come from `api/.env_development` — no credentials in the script.

### Step 3 — Verify environment files

**`api/.env_development`** — already configured, verify it exists:
```
PORT=5000
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=sb_secret_...
CLERK_SECRET_KEY=sk_test_...
...
```

**`smashVisionWeb/.env.development`** — Vite auto-loads this on `npm run dev`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

> Note: `smashVisionWeb/.env_development` (underscore) is **not** loaded by Vite. Only `.env.development` (dot) is.

---

## Daily Dev Workflow

### Terminal 1 — Start the local Supabase stack (if not already running)

```bash
cd C:\Users\tomas\Desktop\smashVisionReplays\api
supabase start
```

> Already running? Skip this — it persists between sessions until you run `supabase stop`.

### Terminal 2 — Start the API

```bash
cd C:\Users\tomas\Desktop\smashVisionReplays\api
npm run dev
```

### Terminal 3 — Start the frontend

```bash
cd C:\Users\tomas\Desktop\smashVisionReplays\smashVisionWeb
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Syncing Your User (First Time or After Re-importing Prod Data)

After logging in locally with your dev Clerk account, run from the `api/` folder:

```bash
node --env-file=.env_development scripts/sync-dev-user.js you@youremail.com
```

You can also pass your dev Clerk user ID directly:

```bash
node --env-file=.env_development scripts/sync-dev-user.js user_abc123xyz
```

**What the script does:**
1. Looks up your user in the **dev Clerk instance** by email or user ID
2. Connects to **local Supabase**
3. Checks if a user with your dev Clerk ID already exists → skips if so
4. If not found by Clerk ID, checks by **email** → links your dev Clerk ID to your existing prod record (preserving all your clips and videos)
5. If not found at all → creates a new user record
6. Updates your **dev Clerk private metadata** with your database user ID so the API can resolve you

After the script completes, **hard-refresh** the browser (`Ctrl+Shift+R`) — the dashboard should load with your data.

> You only need to run this once per user. After that, just start the stack and go.

> Default role is `member`. To sync as a club account, pass `--role=club`:
> ```bash
> node --env-file=.env_development scripts/sync-dev-user.js you@clubemail.com --role=club
> ```
> The email must match a club record in the local DB (imported from prod). The script looks it up in the `clubs` table and sets the correct metadata automatically.

---

## Refreshing Prod Data Locally

When production has new data you want locally, just re-run:

```bash
bash scripts/refresh-dev-db.sh
```

Then re-run the sync script to re-link your dev user (the refresh wipes and reimports, so Clerk IDs are cleared again).

---

## How Authentication Works Locally

```
1. You log in via dev Clerk in the browser
2. Frontend gets your dev Clerk user ID (e.g. user_38oez...)
3. Frontend calls GET http://localhost:5000/api/users/metadata/user_38oez...
4. Local API uses dev Clerk secret key → finds you in dev Clerk → returns your role + DB id
5. Frontend uses the DB id for all subsequent queries (clips, videos, etc.)
6. Everything resolves against the local Supabase database
```

---

## Local Tools

| Tool | URL | Purpose |
|------|-----|---------|
| Supabase Studio | http://127.0.0.1:54323 | Browse/edit local DB tables |
| Local API | http://localhost:5000 | API endpoints |
| Local Frontend | http://localhost:5173 | Web app |

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `supabase: command not found` | CLI not installed or not in PATH | Install the Supabase CLI and ensure it is in your PATH |
| `connection refused` on port 54321 | Local Supabase not running | Run `supabase start` in `api/` |
| `Failed to connect to local Supabase` | Wrong URL/key in `.env_development` | Check `SUPABASE_URL=http://127.0.0.1:54321` |
| Dashboard shows "Failed to load user metadata" | User not synced | Run the sync script |
| `--env-file` not recognized | Node.js < 20.6 | Upgrade Node.js |
| Sync script finds no user in Clerk | Not signed up in dev Clerk yet | Sign up at localhost:5173 first, then sync |
