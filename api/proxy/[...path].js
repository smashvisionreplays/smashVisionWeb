let cachedToken = null;
let tokenExpiry = 0;

async function getM2MToken() {
  if (cachedToken && Date.now() < tokenExpiry - 60_000) return cachedToken;
  console.log("Fetching new M2M token...");
  const res = await fetch(`${process.env.CLERK_ISSUER_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLERK_M2M_CLIENT_ID,
      client_secret: process.env.CLERK_M2M_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error(`Failed to get M2M token: ${res.status}`);
  const { access_token, expires_in } = await res.json();
  cachedToken = access_token;
  tokenExpiry = Date.now() + expires_in * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  try {
    console.log("IN HANDLER..");
    const { path: pathSegments, ...queryParams } = req.query;
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
      "x-app-token": token,
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
