/**
 * Vercel serverless proxy — the only path from the browser to the API in production.
 *
 * Two headers, two jobs, and they must not be mixed up:
 *
 *   x-app-token    a static shared secret proving the request came from this
 *                  proxy. Server-side only, never in the bundle.
 *   Authorization   the browser's own Clerk session JWT, forwarded untouched,
 *                  so `clerkMiddleware()`/`getAuth(req)` on the API sees the
 *                  real user. Absent for signed-out visitors — most of the
 *                  site is public.
 *
 * This used to mint a Clerk M2M JWT and put it in `Authorization`, demoting the
 * user's token to `x-user-token`. That cost us twice: the M2M token was cached
 * per lambda instance so every cold start minted a new one until the Clerk quota
 * ran out, and `getAuth(req)` saw the machine token instead of the user, which is
 * why `DELETE /api/clips/:id` 401'd in production. Both are fixed by not doing it.
 */
export default async function handler(req, res) {
  const appToken = process.env.APP_PROXY_SECRET;
  if (!appToken) {
    // Without this the header goes out as the string "undefined" and the API
    // answers 401 "Invalid app token", which reads like a wrong secret rather
    // than an unset one. Nothing local catches this: `npm run dev` bypasses
    // this function entirely, so production is the first place it can surface.
    console.error("APP_PROXY_SECRET is not set on this deployment");
    return res.status(500).json({ error: "Proxy misconfigured" });
  }

  try {
    const pathSegments = req.query["...path"] ?? req.query["path"];
    const { "...path": _a, path: _b, ...queryParams } = req.query;
    const apiPath = Array.isArray(pathSegments)
      ? pathSegments.join("/")
      : pathSegments;

    const url = new URL(`${process.env.RAILWAY_API_URL}/api/${apiPath}`);
    Object.entries(queryParams).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );

    const headers = {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    };
    if (req.headers.authorization)
      headers["Authorization"] = req.headers.authorization;

    const fetchOptions = { method: req.method, headers };
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const apiRes = await fetch(url.toString(), fetchOptions);
    const contentType = apiRes.headers.get("content-type") || "";

    res.status(apiRes.status);

    const disposition = apiRes.headers.get("content-disposition");
    if (disposition) res.setHeader("Content-Disposition", disposition);

    if (contentType.includes("application/json")) {
      res.json(await apiRes.json());
    } else if (contentType.startsWith("video/") || contentType === "application/octet-stream") {
      res.setHeader("Content-Type", contentType);
      const { Readable } = await import("stream");
      Readable.fromWeb(apiRes.body).pipe(res);
    } else {
      res.send(await apiRes.text());
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: "Proxy error" });
  }
}
