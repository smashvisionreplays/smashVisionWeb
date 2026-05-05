import { createClerkClient } from "@clerk/backend";

let cachedToken = null;
let tokenExpiry = 0;

async function getM2MToken() {
  if (cachedToken && Date.now() < tokenExpiry - 60_000) return cachedToken;

  console.log("Fetching new M2M token via Clerk SDK...");
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_M2M_CLIENT_SECRET,
  });

  const m2mToken = await clerk.m2m.createToken({ tokenFormat: "jwt" });
  const expiresIn = m2mToken.expiration
    ? m2mToken.expiration - Math.floor(Date.now() / 1000)
    : 3600;

  cachedToken = m2mToken.token;
  tokenExpiry = Date.now() + expiresIn * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
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

    const token = await getM2MToken();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (req.headers.authorization)
      headers["x-user-token"] = req.headers.authorization;

    const fetchOptions = { method: req.method, headers };
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const apiRes = await fetch(url.toString(), fetchOptions);
    const contentType = apiRes.headers.get("content-type") || "";

    res.status(apiRes.status);
    if (contentType.includes("application/json")) {
      res.json(await apiRes.json());
    } else {
      res.send(await apiRes.text());
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: "Proxy error" });
  }
}
