# SmashVision Web — CLAUDE.md

> React 18 + Vite 6 frontend for the SmashVision platform. Deployed on **Vercel** (`smashvisionapp.com`).
> Repo: `github.com/smashvisionreplays/smashVisionWeb`

---

## 1. What this app is

**SmashVision** installs cameras in padel club courts that record every game. Recordings go to **Cloudflare Stream** and are kept for **7 days**. This website is where:

- **Players (role `member`)** find their match by picking *club → court → date → 30-min time slot*, watch it, jump to auto-detected "best points", cut a 5–60 s clip with a tag and a personal note, then download it. They also browse live streams.
- **Clubs (role `club`)** get a dashboard with all their videos (watch / block / unblock), their clips, live-stream toggles per court, and a statistics tab (clips created, best points, minutes of video delivered, Excel export).

Three repos make up the platform:

| Repo | Role |
|------|------|
| **`smashVisionWeb`** (this repo) | The website. **Has no database access** — every piece of data comes from the API. |
| **`api`** (`../api`) | Express + Supabase backend and WebSocket hub at `https://api.smashvisionapp.com`. |
| **`smashVision-club-server`** | On-premise box at each club: records to Cloudflare, and serves the live stream through a Cloudflare tunnel URL that this app embeds in an `<iframe>`. |

### The one domain concept you must know

A video is **not** addressed by a date. It is addressed by `(id_club, court_number, weekday, hour, hour_section)`:

- `weekday` — English day name, e.g. `"Wednesday"` (derived in the browser from the picked date).
- `hour` — integer in 24h.
- `hour_section` — `0` = `:00–:30`, `1` = `:30–:00` of the next hour.

Only 7 days of video exist at any time, so weekday is unambiguous. This is why the Home date picker is limited to **today − 7 days … today**, and why every table and label re-derives times from `hour` + `hour_section`.

---

## 2. Tech stack

- **React 18** + **Vite 6** (`npm run dev` on port 5173). Plain JS/JSX — no TypeScript despite `typescript` being a devDependency.
- **React Router DOM 7** — client-side routing, `BrowserRouter`.
- **Styling:** Tailwind CSS 3 (utility-first, used everywhere) + a handful of CSS files in `stylesheet/`. Heavy "liquid glass" aesthetic: `backdrop-blur-xl`, `bg-white/[0.03]`, `border-white/10`, gradient accent bars.
- **Component libraries:** **Ant Design 5** (Table, Select, DatePicker/RangePicker, TimePicker, Modal, ConfigProvider — always with `theme.darkAlgorithm`), **Headless UI** (tabs, nav disclosure), **Heroicons**, Flowbite React (minimal use).
- **Auth:** **Clerk** (`@clerk/clerk-react`) — `<SignIn>`/`<SignUp>` components, `useAuth`, `useUser`, `<UserButton>`.
- **Video:** `@cloudflare/stream-react` `<Stream>` component for VOD; raw `<iframe>` for live streams.
- **HTTP:** mixed `axios` and `fetch` (see §5).
- **State:** React Context only — `LanguageContext` (i18n) and `WebSocketContext` (live camera updates). No Redux/Zustand/React Query.
- **Dates:** `dayjs` (with Ant), plus `date-fns` and MUI date pickers left over in dependencies.
- **Excel:** `xlsx` for the statistics export.
- **Analytics:** Google Analytics via `VITE_GA_MEASUREMENT_ID`, injected in `src/main.jsx`, page views tracked per route in `src/Index.jsx`.

---

## 3. Project structure

```
smashVisionWeb/
├── index.html                     # Vite entry; loads Flowbite JS from a CDN
├── vite.config.js                 # dev-only proxy: /api/proxy/* → VITE_API_URL/api/*
├── vercel.json                    # routes /api/proxy/* to the serverless fn; SPA fallback
├── api/proxy/[...path].js         # ⭐ Vercel serverless proxy — the ONLY path to the API in prod
├── src/
│   ├── main.jsx                   # createRoot + GA bootstrap
│   ├── App.jsx                    # LanguageProvider → ClerkProvider → WebSocketProvider → Router
│   ├── Index.jsx                  # NavBar + notification host + <Routes> + Footer
│   ├── pages/
│   │   ├── Home.jsx               # hero + <BlurredContainer/> search form
│   │   ├── Login.jsx              # Clerk SignIn/SignUp, redirects to /dashboard
│   │   ├── VideoView.jsx          # player + clock + best points + clip box + prev/next nav
│   │   ├── ClipView.jsx           # clip processing progress → playback → download (protected)
│   │   ├── Dashboard.jsx          # shell: sidebar/tabs + role gate (protected)
│   │   ├── Lives.jsx              # public live-stream grid per club
│   │   ├── About.jsx              # marketing (tabbed: clubs / players)
│   │   ├── ForPlayers.jsx         # exports <PlayersAbout/> consumed by About.jsx
│   │   ├── Tournaments.jsx        # ⚠️ hardcoded placeholder data, hidden from the navbar
│   │   ├── PrivacyPolicy.jsx / TermsAndConditions.jsx   # PDF in an <iframe>
│   ├── controllers/               # ⭐ every API call lives here
│   │   ├── serverController.js    # clubs, videos, clips, cameras
│   │   ├── statisticsController.js
│   │   ├── adminController.js     # outdated videos + bulk delete (admin only)
│   │   ├── userController.js      # Clerk metadata lookup
│   │   ├── usersController.js     # ⚠️ dead code
│   │   └── dbController.js        # ⚠️ dead code — old direct MySQL access
│   ├── contexts/
│   │   ├── LanguageContext.jsx    # EN/ES dictionary + t() + geo detection
│   │   └── WebSocketContext.jsx   # ws connection, reconnect, RELOAD_CAMERAS
│   ├── hooks/useWebSocketStatus.js
│   └── scripts/utils.js           # time helpers   (home.js is dead code)
├── components/
│   ├── NavBarTW.jsx  Footer.jsx  Sidebar.jsx  LanguageSelector.jsx
│   ├── TopNotification.jsx  Notification.jsx  ProgressBar.jsx
│   ├── TableAnt.jsx  Table.jsx  TagDisplay.jsx  VideoModal.jsx
│   ├── DatePicker.jsx  TimePicker.jsx  TimePickerAsphalt.jsx  SelectMenuAvatar.jsx
│   ├── auth/ProtectedRoute.jsx  RoleBasedAuth.jsx  Login.jsx
│   ├── home/BlurredContainer.jsx        # the search form
│   ├── videoView/VideoPlayer.jsx  CreateClipBox.jsx  TableActions.jsx
│   └── dashboard/DashboardContent.jsx  StatisticsContent.jsx  columnSchemas.jsx
│                 AdminContent.jsx      dashboardTabs.js   # ⭐ tabs + roles, one list
├── stylesheet/                    # index.css (Tailwind directives), dashboard, lives, videoview, rangepicker
├── public/                        # logos, svg icons, background images, policy PDFs
├── docs/api-authentication.md     # M2M proxy design (⚠️ header name is stale — see §5)
└── docs/admin-outdated-videos.md  # ⭐ admin panel: design, findings, what is untested
```

Note `components/` sits at the **repo root**, not under `src/` — imports from pages look like `../../components/...`.

---

## 4. Routing

Defined in `src/Index.jsx`; the layout (NavBar, notification slot, Footer) wraps every route.

| Route | Component | Protected | Notes |
|---|---|---|---|
| `/` | `Home` | no | Search form. |
| `/login` | `Login` | no | Redirects to `/dashboard` if already signed in. |
| `/videoView` | `VideoView` | **no** | Watching is public; creating a clip prompts sign-in inline. |
| `/clipView` | `ClipView` | yes | |
| `/dashboard` | `Dashboard` | yes | Content further gated by role. |
| `/lives` | `Lives` | no | |
| `/about` | `About` | no | |
| `/tournaments` | `Tournaments` | no | Reachable by URL but **commented out of the navbar**. |
| `/terms/privacy-policy`, `/terms/terms-and-conditions` | PDF viewers | no | |

`ProtectedRoute` (`components/auth/ProtectedRoute.jsx`) waits for Clerk's `isLoaded`, then redirects to `/login` when `!isSignedIn`. `RoleBasedAuth.jsx` exists but is **not used** by any route — role gating happens inside `Dashboard`/`Sidebar`/`DashboardContent`, all driven by `components/dashboard/dashboardTabs.js`.

**Navigation state:** `VideoView` and `ClipView` receive their subject via `navigate(..., {state})`, not URL params. `VideoView` mirrors that state into `sessionStorage.videoViewState` and restores it on a hard refresh (falling back to `/` if there is nothing saved). A `/videoView` URL is therefore **not shareable**.

---

## 5. How the frontend talks to the API

**Golden rule: the browser never calls `api.smashvisionapp.com` directly.** Every REST call targets the relative path **`/api/proxy/...`**, which resolves differently per environment.

### Production (Vercel)

```
Browser  ──GET /api/proxy/clubs──►  Vercel serverless fn  api/proxy/[...path].js
                                      │ holds CLERK_M2M_CLIENT_SECRET (server-side only)
                                      │ mints a Clerk M2M JWT, cached in module scope
                                      │   until 60s before expiry
                                      ▼
                                    GET ${RAILWAY_API_URL}/api/clubs
                                      Authorization: Bearer <M2M JWT>
                                      x-user-token: <the browser's Authorization header, if any>
                                      ▼
                                    Railway API — requireAppToken verifies the M2M JWT via Clerk JWKS
```

`vercel.json` rewrites `/api/proxy/(.*)` → `/api/proxy/[...path]?path=$1` and sends everything else to the SPA. The proxy forwards the method, JSON body and query string, and streams `video/*` / `application/octet-stream` responses through while preserving `Content-Disposition` (that's how clip downloads keep their filename).

> ⚠️ **`docs/api-authentication.md` is out of date on one detail:** it says the proxy sends the M2M token as `x-app-token`. The code sends it as `Authorization: Bearer` and demotes the **user's** Clerk JWT to `x-user-token`. Consequence: the API's `clerkMiddleware`/`getAuth(req)` sees the machine token, not the user, so **user-identified endpoints (currently `DELETE /api/clips/:id`) fail with 401 in production while working locally.** Keep this in mind before adding user-authenticated endpoints.

The purpose of the proxy is **secret management, not access control** — anything prefixed `VITE_` is bundled into the browser, so the M2M secret has to live in a server-side runtime. Anyone with a valid M2M JWT can call the Railway API directly.

### Local development

`vite.config.js` proxies `/api/proxy/*` → `${VITE_API_URL}/api/*` (default `http://localhost:5000`), skipping the serverless function entirely. The API's `requireAppToken` middleware short-circuits when `NODE_ENV !== "production"`, so no token is needed. The proxy config is disabled when `process.env.VERCEL` is set (i.e. under `vercel dev`).

| You want to test | Run |
|---|---|
| UI, pages, API calls, Clerk sign-in, roles | `npm run dev` → http://localhost:5173 |
| The M2M proxy, token minting, JWKS validation, prod-equivalent 401s | `vercel dev` → http://localhost:3000 |

For `vercel dev`, `.env.local` needs `CLERK_M2M_CLIENT_SECRET` and `RAILWAY_API_URL=http://localhost:5000` (point it at your **local** API, and run that API with `NODE_ENV=production` if you want the middleware to actually validate).

### WebSocket — not proxied

Vercel serverless can't do WebSocket upgrades, so `WebSocketContext` connects **straight to Railway**: `${VITE_WS_URL}/ws?token=<clerk user JWT>`.

### The controllers layer

All calls live in `src/controllers/` — **components should never call `fetch`/`axios` inline** (the one exception in the codebase is `ClipView`'s `handleDownloadVideo`, which sets `window.location.href` to the proxy download URL, and `columnSchemas.jsx`, which renders that URL as an `<a href>`).

| Function (`serverController.js`) | Calls |
|---|---|
| `fetchClubs()` | `GET /clubs` |
| `fetchClubById(id)` | `GET /clubs/:id` → returns an **array**; callers use `[0]` |
| `fetchVideos(params)` | `POST /videos` — the Home search |
| `fetchBestPoints(params)` | `POST /videos/bestPoints` |
| `fetchCourtVideos(clubId, court)` | `GET /videos/court/:clubId/:court` — prev/next nav |
| `fetchClubVideos(clubId)` | `GET /videos/club/:id` |
| `fetchVideoData(uid)` | `GET /videos/:uid` — Cloudflare status polling |
| `fetchBlockVideo` / `fetchUnblockVideo` | `PUT /videos/:id/block` \| `/unblock` |
| `registerClip(...)` | `POST /clips` |
| `fetchClubClips` / `fetchMemberClips` | `GET /clips/club/:id` \| `/clips/member/:id` |
| `createDownload` / `fetchDownload` / `selectDownload` / `updateDownload` | the `/clips/:uid/download*` family |
| `deleteClip(clipId, token)` | `DELETE /clips/:id` (sends `Authorization: Bearer <clerk token>`) |
| `fetchClubCameras(clubId)` | `GET /cameras/club/:id` |
| `toggleCameraLive(cameraId, clubId, court, status)` | `POST /cameras/:id/toggleLive` |
| `fetchUserMetadata(clerkUserId)` (`userController.js`) | `GET /users/metadata/:userId` |
| `fetchOutdatedVideos(days, token)` (`adminController.js`) | `GET /admin/videos/outdated?days=` — **throws** on failure, so a broken request can't read as "nothing outdated" |
| `deleteVideosBatch(uids, token)` | `POST /admin/videos/delete` — one chunk; resolves to `{deleted, skipped, failed}` |
| `fetchStatistics(clubId, start, end, token)` (`statisticsController.js`) | `GET /statistics?...` |
| `fetchUserEmailsByIds(ids, token)` | `POST /statistics/user-emails` |

Style note: `fetchClubs`/`fetchVideos`/`fetchClubById`… use **axios and rethrow**; the clip/camera functions use **fetch** and mostly **return `null` on error**. Check which convention a function follows before assuming a rejected promise.

---

## 6. Identity and roles

```
Clerk session (browser)
   └─ useUser().id  (a Clerk id, e.g. user_2abc...)
        └─ GET /api/proxy/users/metadata/<clerk id>
             └─ { role: 'member' | 'club' | 'admin', id: <DB primary key>, userId }
```

`role` comes from Clerk `publicMetadata`, `id` from Clerk `privateMetadata` — both are set by the API's Clerk webhook (or by `sync-dev-user.js` in dev). Granting admin is `../api/scripts/set-role.js <email> admin` against the right Clerk instance.

**Crucially, `id` means different things per role:**

- `member` → `users.id`
- `club` → `clubs.id`
- `admin` → `users.id` (an admin is a member with platform-wide powers, and keeps their own clips)

**The role in this app is presentation only.** It decides which tabs render; it is not what protects the admin endpoints. The API re-reads the role from Clerk on every `/api/admin/*` request, so editing `role` in devtools reveals an empty panel and 403s, not data.

That is why `Dashboard` passes `userMetadata.id` down as `userId` and `DashboardContent` then uses it as a **club id** (`fetchClubClips(userId)`, `fetchClubCameras(userId)`, `fetchClubVideos(userId)`, `<StatisticsContent userId={userId}/>` → `clubId`). Do not "fix" this naming without tracing every call site.

`VideoView` applies a related rule when creating clips: for a club account it deliberately sends `userId = null`, so the clip is attributed to the club rather than to an individual (`clips.id_user IS NULL` marks a club-owned clip, which also drives who may delete it).

If metadata has no `id`, `Dashboard` renders an "Account Setup Required" screen — in local dev that almost always means you haven't run `sync-dev-user.js`.

---

## 7. Core user flows

### A. Find and watch a game (`Home` → `VideoView`)

1. `BlurredContainer` loads clubs (`fetchClubs`, filtered to `status === "active"`), then courts for the picked club from `club.courts_number`.
2. Form state is mirrored into `sessionStorage` under `smashvision_search_form` so it survives navigating away and back; "Clear all fields" wipes it.
3. Date is constrained to the last 7 days; time uses `minuteStep={30}`, and `section` is derived as `minutes === "00" ? 0 : 1`.
4. `fetchVideos({id_club, weekday, court_number, hour, section})`. Empty result or `url === null` → localized "video not found" notification. Otherwise `navigate('/videoView', {state:{videoUID, ...}})`.
5. `VideoView` renders `<VideoPlayer>` (Cloudflare `<Stream>` with `streamRef={videoRef}`) and:
   - **Wall clock** — reconstructs the real recording time. Start = slot end (`hour`/`hour+1` at `:30`/`:00`) minus `videoRef.current.duration`, then adds `currentTime` on every `timeupdate`.
   - **Best points** — `fetchBestPoints`; clicking one seeks the player and pre-fills the clip box with `[t−60s, t+60s]`.
   - **Prev/next video** — `fetchCourtVideos`, sorted so that today sorts last (`(idx − todayIndex − 1 + 7) % 7`), then by hour and section.
   - Mobile switches "Create clip" / "Best points" into tabs.

### B. Create a clip (`CreateClipBox` → `ClipView`)

1. Not signed in → the form state is saved to `sessionStorage.clipFormState` and a Clerk `<SignIn>` modal opens; the values are restored after login.
2. Validation: `m:ss`/`mm:ss` format, within the video duration, and **5 s ≤ duration ≤ 60 s** (`MIN_TIME_FOR_CLIPS` / `MAX_TIME_FOR_CLIPS`).
3. Tag is an Ant `mode="tags"` Select (suggestions: Blooper / Good Point / Forced Error, free text allowed) — arrays are `JSON.stringify`'d before sending, which is why `TagDisplay` parses both a JSON array and a plain string.
4. `registerClip(videoRef.current.src /* the Cloudflare UID */, tag, clubId, userId, start, end, token, note)`.
5. On `{success:true}` → `navigate('/clipView', {state:{videoUID: result.clipUID, note}})`. On failure the API's `reason` (`database` | `cloudflare`) maps to a specific localized message — **keep those codes in sync with the API.**
6. `ClipView` polls `fetchVideoData(uid)` every 3 s until `readyToStream`, driving a 3-step `<ProgressBar>`; then it checks for an existing `downloadurl`, creates a Cloudflare download if absent, polls until `status === "ready"`, and persists the URL with `updateDownload`. Already-processed clips skip straight to playback.
7. Download goes through the API proxy route `/api/proxy/clips/:uid/download/file` so the file arrives named correctly.

### C. Club dashboard (`Dashboard` → `DashboardContent`)

Both navigations — `Sidebar` (desktop) and the Headless UI `TabGroup` (mobile) — render from **`components/dashboard/dashboardTabs.js`**, the single list of tabs and the roles allowed each. `member` sees **Clips**; `club` sees **Clips / Videos / Lives / Statistics**; `admin` sees **Clips / Admin**. `DashboardContent` re-checks against that same list and shows "Access Restricted" for anything else, so a tab cannot be offered in one navigation and missing from the other. Add a tab there, not in the components.

- **Clips** — `fetchClubClips` or `fetchMemberClips`, re-mapped from lowercase API fields to PascalCase row fields (`clip.id → ID`, `clip.downloadurl → downloadURL`, …). Watch opens `VideoModal`; Download is an `<a>` to the proxy; Delete opens a confirmation modal that requires typing **`delete`** (or **`eliminar`** in Spanish) and then calls `deleteClip` with a Clerk token. The delete button is hidden for a club when the clip belongs to a member.
- **Videos** (club only) — `fetchClubVideos`, with block/unblock buttons. `Blocked` is the string `"Si"` / `"No"`, not a boolean.
- **Lives** (club only) — `fetchClubCameras`, toggle per court via `toggleCameraLive`, and a "Watch" modal embedding `${live_tunnel_url}/stream.html?src=court${n}`. Reloads whenever the WebSocket signals.
- **Statistics** (club only) — see below.
- **Admin** (admin only) — see §7G.

Column definitions for all three tables live in `components/dashboard/columnSchemas.jsx` (`clipsColumns`, `videosColumns`, `livesColumns`, `videoMinutesColumns`); `TableAnt.jsx` is the shared Ant `<Table>` wrapper (dark theme, `virtual` when `needsVirtual`, index-based row keys).

### D. Statistics (`StatisticsContent.jsx`)

One `fetchStatistics(clubId, start, end, token)` returns `{clips, bestPoints, videoMinutes}`:

- Default range: last 30 days ending **yesterday**. `disabledDate` blocks today and later, because `video_history` is only synced once daily at 7am — showing "today" would display stale intraday numbers.
- Clips card (count + first 5 names) and Best-points card (count + first 5).
- **Minutes delivered** — total is summed **client-side** from `videoMinutes`, with a per-video breakdown table (`videoMinutesColumns`). `formatTimeSlot(hour, section)` renders `10:00 - 10:30` / `10:30 - 11:00`.
- `MINUTES_TRACKING_START = 2026-07-02` — ranges starting earlier show an explanatory note; empty arrays show `noMinutesData`.
- **Excel export** — `xlsx` builds `clips_history_<start>_<end>.xlsx`; user ids are resolved to emails via `fetchUserEmailsByIds`, and `id_user == null` is labelled `Club`.

### E. Live streams (`Lives.jsx`, public)

Pick a club → `fetchClubCameras` → grid of cards. A camera with `status === 'Live'` and a `live_tunnel_url` renders the tunnel `<iframe>` inline (pointer-events disabled) and opens full-screen in a modal on click. `useWebSocketStatus(cameras)` overlays recent WebSocket updates.

### F. Admin — outdated videos (`AdminContent.jsx`, admin only)

**The problem it solves.** Recordings are supposed to be deleted from Cloudflare after 7 days. When that fails — the cleanup errors, or motion detection uploads recordings of an empty court that were never registered — storage fills, new uploads are rejected, and the club servers start queueing videos they cannot deliver. This panel is the manual way to see and clear that.

`fetchOutdatedVideos(days, token)` → `{storage, summary, videos, maxDeleteBatch, truncated}`. Three cards (Cloudflare storage against the plan limit, outdated count, space to reclaim), an "older than" window (7/14/30/90 days — the API floors it at 7), and a selectable table.

**The Reason column is a diagnosis, not decoration.** Every row is equally deletable; the category says which failure produced it, and which number is large tells you where to look — `Delete failed` means the cleanup's Cloudflare call is erroring, `Unregistered` means club servers are uploading recordings the platform never registered, `Not cleaned up` means the unlink itself never ran. The three are derived in the API (`../api/CLAUDE.md` §6); their labels, explanations and colours are the `CATEGORY_*` maps at the top of the component, and both places that show a category read from them.

The counts on the "Outdated videos" card are `CategoryChip`s — the same colours as the table badges, each with its explanation on hover, click or focus. They look like buttons and are deliberately inert (`cursor-help`, not `cursor-pointer`): making them filter the table would be a second, competing way to do what the Reason column's own filter already does. They carry `tabIndex` and the table's badges do not, because the badges repeat the same three explanations once per row and fifty identical tab stops are worse than none — the card is the keyboard path to the legend.

**Filtering by day.** Recordings are named `Friday_9_1_15_1`, and the API turns that into a `weekday` on every row (see `../api/CLAUDE.md` §6), so the table filters by weekday the same way `videosColumns` does. Anything whose name doesn't yield a day — an unnamed upload, a manual one — lands in an **"Unrecognised name"** bucket that is its own filter value, so it is never swept up by a day filter and never hidden either.

Two things make that filter safe to act on in bulk:

- **The filters are controlled state, and the matching rows are derived from them** — not read out of the table's `onChange`. Reading the event would go stale the moment a delete or a reload replaced the data without the user touching a filter, and "select all matching" would then act on the wrong set. The predicates in `FILTER_PREDICATES` are shared by the table's own `onFilter` and that derivation, so the two cannot disagree.
- **Selection spans pages, and says when it spans filters.** Ant's header checkbox only reaches the current page, so the selection dropdown adds "Select all N matching". Selections deliberately survive a filter change (building one across days is legitimate), so the action bar warns when some selected rows are no longer visible — otherwise the count reads as if it were only what's on screen.

Deletion is **permanent and Cloudflare-side**, which shapes the whole component:

1. **Confirmation is typed.** The same pattern as deleting a clip — the word `delete` / `eliminar` — not a single click.
2. **It is chunked, not one request.** Cloudflare has no bulk delete, so the API caps a batch at 50 and this chunks at 25 with a progress bar. One chunk failing does not abandon the rest of the selection.
3. **The result is read, not assumed.** A uid can come back `skipped` (a member's clip, or still inside the 7-day window — the API refuses both regardless of what the table showed) or `failed`, so the notification reports deleted/skipped/failed rather than "done".
4. **Rows are removed locally, not refetched.** Cloudflare's list is eventually consistent and would happily return a video that was just deleted.

A failed load renders an explicit error panel, never the empty state — "nothing outdated" and "we could not check" must not look the same when the consequence is a full account.

---

## 8. Contexts

### `LanguageContext.jsx` — i18n

A single in-file dictionary `translations = { en: {...}, es: {...} }` (~500 lines) and `t(key)` which **falls back to the key itself** when a translation is missing. On mount it calls `https://ipapi.co/json/` and picks `es` for a list of Spanish-speaking country codes, falling back to `navigator.language`; `LanguageSelector` lets the user override. The provider also feeds Ant Design's `ConfigProvider locale` (`en_US` / `es_ES`) and drives Clerk's `localization` prop in `App.jsx`.

**Adding UI text = adding the key to *both* `en` and `es`.** Weekday names are translation keys too (`t('Monday')`), which is how tables localize `weekday` values coming from the API.

### `WebSocketContext.jsx` — realtime

Connects on mount with the Clerk token, reconnects with exponential backoff (`2^n` s, capped at 30 s, max 5 attempts). On `RELOAD_CAMERAS` (or the currently-unused `LIVE_STREAM_STARTED`/`STOPPED`) it bumps `liveUpdates._reloadTrigger = Date.now()`; consumers watch that value and refetch. It does **not** reconnect when the Clerk token changes, so a user signing in after page load may stay disconnected until refresh.

---

## 9. Environment variables

`.env.example` is the reference. **Only `VITE_`-prefixed vars reach the browser** — everything else is server-side (Vercel dashboard / `.env.local`).

| Variable | Scope | Purpose |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | browser | `pk_test_` locally, `pk_live_` in prod |
| `VITE_API_URL` | dev only | Target of the Vite proxy (`http://localhost:5000`) |
| `VITE_WS_URL` | browser | `ws://localhost:5000` / `wss://api.smashvisionapp.com` |
| `VITE_GA_MEASUREMENT_ID` | browser | GA4 id; leave empty to disable analytics |
| `CLERK_M2M_CLIENT_SECRET` | **server** | Used by the Vercel proxy to mint the M2M token |
| `RAILWAY_API_URL` | **server** | Where the proxy forwards (`https://api.smashvisionapp.com`) |
| `CLERK_M2M_CLIENT_ID`, `CLERK_ISSUER_URL` | **server** | Documented in `docs/api-authentication.md`; the current proxy code only reads the secret |

⚠️ **Vite loads `.env.development` (dot), not `.env_development` (underscore).** The underscore variant is git-ignored and silently ignored by Vite.

---

## 10. Local development

The frontend alone is enough for UI work if you point `VITE_API_URL` at the production API. For anything touching data, run the full local stack (see `../api/DEVELOPMENT_TESTING_INSTRUCTIONS.md` and this repo's own `DEVELOPMENT_TESTING_INSTRUCTIONS.md`):

```bash
# terminal 1 — in ../api
supabase start                 # local Supabase: REST :54321, Postgres :54322, Studio :54323
npm run dev                    # API on :5000 against local Supabase, dev Clerk (sk_test_)

# terminal 2 — here
npm run dev                    # http://localhost:5173
```

Why: production uses a **live Clerk instance** and the **production Supabase**. Locally you use the **dev Clerk instance** (`pk_test_`), whose user ids don't exist in prod data, so every protected view fails. The fix is `../api/scripts/refresh-dev-db.sh` (import prod data into local Supabase, clearing `clerkid`) plus `../api/scripts/sync-dev-user.js you@email.com [--role=club]`, which links your dev Clerk user to a local DB row and writes the metadata this app reads. Run the sync once per user (and again after each DB refresh), then hard-refresh the browser.

Local tools: Supabase Studio http://127.0.0.1:54323 · API http://localhost:5000 · web http://localhost:5173.

Commands:

```bash
npm run dev       # vite --host
npm run build     # ⚠️ literally `vite build --mode development`
npm run preview
npm run lint      # eslint (flat config, eslint.config.js) — not wired into CI
vercel dev        # only when testing the M2M proxy (port 3000)
```

`npm run build` running in **development mode** is intentional-looking but worth knowing: `import.meta.env.MODE` is `development` in production builds, so don't branch on it. There is no test suite.

Docker files (`Dockerfile`, `nginx.conf`, `docker-compose.yml`, `build-docker.sh`) are from the pre-Vercel self-hosted setup — nginx serving `dist/` on port 3000 behind a Cloudflare tunnel. **Production is Vercel;** those files (and most of `README.md`) are stale.

---

## 11. Conventions

- **Dark theme only.** Background `#05070B`, brand greens `#DDF31A` / `#B8E016` / `#acbb22`, glass surfaces `bg-white/[0.03]` + `border-white/10` + `backdrop-blur-xl`, and a top shimmer line (`bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent`) on most cards. Ant components are always wrapped in `<ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>` with per-component token overrides.
- **All user-visible strings go through `t()`** and must be added to both `en` and `es`.
- **All API calls go in `src/controllers/`.**
- **Field-name translation happens in the component**, not the API: rows arrive lowercase (`clip.downloadurl`, `video.court_number`) and are mapped to PascalCase for the tables. Keep the mapping in the loader function (`loadClips`, `loadVideos`, `loadCameras`).
- Notifications: pass `triggerNotification(type, message, description, timing)` down from `Index.jsx` (it renders `TopNotification` for 5 s), or use a local `TopNotification` inside a component (as `CreateClipBox` does).
- Prefer `sessionStorage` for cross-navigation form state (existing keys: `smashvision_search_form`, `videoViewState`, `clipFormState`).
- Mobile matters — most screens have explicit mobile branches (`window.innerWidth` checks, `md:hidden` tab layouts).

---

## 12. Known issues and dead code

1. **`src/controllers/dbController.js` is dead code** — the old direct-MySQL layer (`mysql2` in the browser, `import.meta.env.DB_*`). Imported by nothing and cannot work. It also carries the same best-points weekday bug described below. Safe to delete.
2. **`src/controllers/usersController.js`** (hardcoded `http://localhost:5000/api/login`) and **`src/scripts/home.js`** (pre-React DOM manipulation) are dead code too.
3. **Best points from the wrong weekday** — a known active bug, root cause in the API (`api/db/videos.js selectBestPoints` never filters by `weekday`). Full analysis in `../FIX_BUG_bestpoints_weekday.md`. The frontend already sends `weekday` correctly; no change is needed here.
4. **User-authenticated API calls fail in production** because the Vercel proxy moves the user JWT to `x-user-token` — see §5. Affects `deleteClip` today.
5. **`docs/api-authentication.md`** describes the header as `x-app-token`; the code uses `Authorization`. Trust the code.
6. **`README.md`** documents the retired Docker/nginx/Cloudflare-tunnel deployment and MySQL env vars. `DEVELOPMENT_TESTING_INSTRUCTIONS.md` is the current guide.
7. **`Tournaments.jsx`** contains hardcoded demo tournaments with Unsplash images and is deliberately hidden from the navbar.
8. **`RoleBasedAuth.jsx`** is unused and defaults to a role named `'player'`, which doesn't exist in the platform (`member` / `club` / `admin`).
9. `TableAnt` keys rows by array index, so sorted/filtered tables can reuse keys; `useWebSocketStatus` indexes `liveUpdates[camera.ID]`, but the context only ever sets `_reloadTrigger`, so the per-camera merge path is effectively inert (the refetch is what updates the UI).
10. **In-flight migration: Clerk → Supabase Auth.** A `clerk_to_supabase_migration` branch exists in both repos and the API already has phase-1 SQL (`users.auth_id`, `users.role`, a custom JWT-claims hook). `master` is still fully on Clerk — check your branch before touching auth.
