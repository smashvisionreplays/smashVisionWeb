const API_BASE_URL = `/api/proxy`;

// Admin endpoints identify the user, not just the app, so they need the Clerk
// session token. In production the Vercel proxy moves this header to
// `x-user-token` before it reaches the API; locally it arrives untouched.
const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

/**
 * Recordings sitting in Cloudflare past their life — what the weekly cleanup
 * should have removed and did not. `days` is floored at 7 by the API.
 *
 * Throws, so the panel can tell "nothing outdated" apart from "the request
 * failed" — reading a failure as an empty list would hide a full account.
 */
export async function fetchOutdatedVideos(days, token) {
  const response = await fetch(`${API_BASE_URL}/admin/videos/outdated?days=${days}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const error = new Error(`Failed to load outdated videos (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

/**
 * Permanently deletes a batch of videos from Cloudflare.
 *
 * One chunk of a larger selection: the API caps how many it will take at once
 * so a request finishes inside the proxy's timeout, and the caller loops.
 * Resolves to `{deleted, skipped, failed}` — a uid can be refused (a clip, or
 * still within retention) without the request failing, so callers must read
 * the result rather than assume success.
 */
export async function deleteVideosBatch(uids, token) {
  const response = await fetch(`${API_BASE_URL}/admin/videos/delete`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ uids }),
  });

  if (!response.ok) {
    const error = new Error(`Failed to delete videos (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}
