# Admin Panel — Outdated Video Cleanup (Frontend)

**Date:** 2026-09-01
**Branch:** `admin-outdated-videos`
**Companion change:** `api` → `docs/admin-outdated-videos.md` (the classification logic and the API contract live there)

---

## The Problem

Recordings are meant to be deleted from Cloudflare after 7 days. When that fails — the cleanup errors, or a club server uploads recordings of an empty court that were never registered — Stream storage fills up. Once the account is full, **new uploads are rejected and the club servers start queueing videos they cannot deliver.**

There was no way to see this happening, and no way to clear it without going into the Cloudflare dashboard by hand.

---

## What We Built

A third role, `admin`, and a dashboard tab for it: **Admin → outdated videos**.

- Three cards: Cloudflare storage against the plan limit, the outdated count broken down by cause, and how much space clearing the list would free.
- A window selector (7 / 14 / 30 / 90 days — the API floors it at 7).
- A table filterable by **weekday** and by **reason**, with bulk selection and permanent deletion.

Two admins: `tomasossaefcsl@gmail.com` and `cesarxemiliox@gmail.com`.

---

## How It Works

### Identity

`role` comes from Clerk `publicMetadata` via `GET /users/metadata/:id`, same as `member` and `club`. **The role in this app is presentation only** — it decides which tabs render. It is not what protects the endpoints: the API re-reads the role from Clerk on every `/api/admin/*` request, so editing `role` in devtools produces an empty panel and 403s, not data.

### Tabs

`components/dashboard/dashboardTabs.js` is now the single list of tabs and the roles allowed each. The desktop sidebar, the mobile tab strip, and `DashboardContent`'s access check all read from it, so a tab cannot be offered in one navigation and missing from another. **Add a tab there, not in the components.**

### The panel

`AdminContent.jsx` + `src/controllers/adminController.js`:

| Function | Endpoint |
|---|---|
| `fetchOutdatedVideos(days, token)` | `GET /admin/videos/outdated?days=` |
| `deleteVideosBatch(uids, token)` | `POST /admin/videos/delete` |

Both send the Clerk session token as `Authorization: Bearer`; the Vercel proxy moves it to `x-user-token` in production.

---

## Why It Is Built This Way

Deletion here is **permanent and Cloudflare-side**. That single fact shapes most of the component.

### 1. Confirmation is typed, not clicked

The same pattern as deleting a clip — the word `delete` / `eliminar`. A destructive bulk action should not be one misplaced click away.

### 2. Deletion is chunked, and reports per video

Cloudflare has no bulk delete, so each video is its own request on the API side. The API caps a batch at 50; the UI chunks at 25 and shows progress across chunks, because a single request covering hundreds of videos would exceed the Vercel proxy's timeout.

**One chunk failing does not abandon the run** — the loop continues and counts that chunk as failed. The API returns `{deleted, skipped, failed}` per uid, so the notification reports all three rather than "done". A uid can be legitimately *skipped* (it is a member's clip, or still inside the 7-day window — the API refuses both regardless of what the table showed), and that is not a failure.

### 3. Rows are removed locally, not refetched

Cloudflare's list is eventually consistent and will happily return a video that was just deleted. After a run, only the uids the API confirmed deleted are filtered out of local state.

### 4. A failed load is never the empty state

`fetchOutdatedVideos` **throws** rather than returning `null`, and the panel renders an explicit error panel. When the consequence of being wrong is a silently filling account, "nothing is outdated" and "we could not check" must not look the same.

### 5. Select-all means the filter, not the page

Ant's header checkbox only reaches the **current page**. With 50-row pages, "select all Wednesday" would have silently caught a fraction of the match. The selection dropdown adds **"Select all N matching"**.

Making that reliable required the filters to be **controlled state with the matching rows derived from them**, rather than read out of the table's `onChange`. The event goes stale the moment a delete or a window change replaces the data without the user touching a filter — and select-all would then act on the wrong set. `FILTER_PREDICATES` is shared by the table's own `onFilter` and that derivation, so the two cannot disagree about what a filter means.

### 6. Selection survives a filter change, and says so

Building a selection across several days is legitimate, so filters do not silently prune it. But filtering to Wednesday, selecting 40, then switching to Friday would otherwise show "40 selected" above a screen of Friday rows. The action bar warns when some selected rows are not currently visible.

### 7. The Reason column is a diagnosis

Every row is equally deletable; the category says which failure produced it, and which count is large tells you where to look:

| Label | Meaning |
|---|---|
| **Unregistered** | Uploaded to Cloudflare but never recorded in the database. |
| **Delete failed** | The cleanup unlinked it correctly; the Cloudflare delete did not go through. |
| **Not cleaned up** | Still linked to a court and slot past its 7 days; the unlink never ran. |

Labels, explanations and colours are the `CATEGORY_*` maps at the top of the component, read by both places that show a category.

The counts on the "Outdated videos" card are `CategoryChip`s — same colours as the table badges, each with its explanation on hover, click or focus. They look like buttons and are deliberately **inert** (`cursor-help`, not `cursor-pointer`): making them filter the table would be a second, competing way to do what the Reason column's own filter already does.

### 8. Weekday filtering, including what has no weekday

Recordings are named `Friday_9_1_15_1` (confirmed format: `weekday_club_court_hour_section`). The API parses the first segment into a `weekday` on every row. Anything whose name yields no day — an unnamed upload, a manual one — lands in an **"Unrecognised name"** bucket that is its own filter value, so it is never swept up by a day filter and never hidden either.

---

## Findings & Bugs

### 1. The mobile tab strip showed every tab to every role

**Pre-existing bug, fixed here.** `Dashboard.jsx` built its own hardcoded four-tab list with no role filtering, while `Sidebar.jsx` filtered correctly. On mobile a `member` was therefore offered **Videos, Lives and Statistics** — tabs they cannot use. Tapping one hit `DashboardContent`'s guard and showed "Access Restricted", so nothing leaked, but the navigation was wrong.

Both now render from `dashboardTabs.js`. This is exactly the drift a single shared list prevents, and it is why the Admin tab was added there rather than in two places.

### 2. The access check only knew about `member`

`DashboardContent` gated on `userRole === 'member' && selectedButton !== 'Clips'`. Any role that was not `member` fell through to whatever tab was selected — so a new role would silently have had access to every tab. It now checks membership in the shared list instead, which is both correct for `admin` and closed by default for any role added later.

### 3. "Access Restricted" was hardcoded English

The heading and body were literal strings in a codebase where every user-facing string goes through `t()`. Spanish users saw English. Now `accessRestricted` / `accessRestrictedBody`, and the body no longer says "only available for club accounts", which was already untrue for a member viewing Clips.

### 4. Native `title` tooltips do not work on touch

The Reason badges first used the `title` attribute. It has no touch equivalent, so on mobile — where this panel is plausibly used — the explanations were unreachable. Both the badges and the card chips now use the Ant `Tooltip` with `trigger={["hover", "click"]}`.

Only the **card chips** are focusable. The table badges repeat the same three explanations once per row, and fifty identical tab stops are worse than none, so the card is the keyboard path to the legend.

### 5. `TableAnt` could not be reused

The shared wrapper keys rows by **array index**, which is fine for display and wrong for selection — sorting or filtering reuses keys, so the wrong rows would be selected. `AdminContent` uses its own `<Table rowKey="uid">` with the same `ConfigProvider` theme rather than changing a component four other tables depend on.

### 6. Serious API-side bugs found while building this

Two are documented in full in the API repo's companion doc and are worth knowing here:

- **PostgREST silently truncates at 1000 rows.** Verified live: `video_history` returned 1000 of 3916. This would have caused a **member's clip to be offered for deletion and not refused** once the `clips` table passed 1000 rows. Fixed with a paging helper.
- **`DELETE /api/clips/:id` is still broken in production** (the `x-user-token` conflict) and is *not* fixed in this change. It affects the existing clip-delete button in the dashboard, which returns 401 in production while working locally.

---

## Files Changed

```
components/dashboard/AdminContent.jsx    NEW  the panel
components/dashboard/dashboardTabs.js    NEW  tabs + roles, single source
src/controllers/adminController.js       NEW  the two API calls
public/admin.svg                         NEW  sidebar icon
components/dashboard/DashboardContent.jsx  Admin tab; role check via shared list;
                                           "Access Restricted" translated
components/Sidebar.jsx                     renders from dashboardTabs; admin label
src/pages/Dashboard.jsx                    mobile tabs now role-filtered
src/contexts/LanguageContext.jsx           +46 keys in each of en and es
CLAUDE.md                                  §3 §4 §5 §6 §7C §7F §12
```

---

## What Was Verified, and What Was Not

**Verified.** In development, against the real Cloudflare account: the panel loads, classifies real data, and **videos were actually deleted from Cloudflare through this UI, successfully.** Production build passes; ESLint introduces no new problems beyond the codebase-wide `prop-types` convention; `en` and `es` dictionaries are at parity (240 keys each) and every `t()` key in the new components resolves.

**Not verified:**

- **Nothing has run in production.** Locally the Vercel proxy is bypassed, so the `x-user-token` path the API uses in production has never actually been exercised. If the panel 401s after deploy, that is the first place to look — it fails closed, not open.
- The role has not been granted on the **production** Clerk instance; the two instances are independent.
- Mobile layout has not been checked on a real device — the panel follows the existing responsive patterns but the table is wide, and the tooltips' click-trigger behaviour on touch is untested.
- No automated frontend tests; this repo has no test suite. The API-side logic behind the panel is covered — 35 tests, `npm test` in the `api` repo (see the companion doc).
