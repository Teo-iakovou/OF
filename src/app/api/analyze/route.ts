const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  if (contentType) headers.set("content-type", contentType);

  const url = new URL(`${SERVER_BASE_URL}/api/analyze`);
  url.search = request.nextUrl.search;

  const body = await request.arrayBuffer();
  const resp = await fetch(url.toString(), {
    method: "POST",
    headers,
    body,
    redirect: "manual",
  });

  if (process.env.NODE_ENV !== "production") {
    try {
      const ct = resp.headers.get("content-type") || "unknown";
      let requestId = resp.headers.get("x-request-id") || resp.headers.get("request-id") || null;
      if (!requestId && ct.includes("application/json")) {
        const cloned = resp.clone();
        const data = await cloned.json().catch(() => null);
        if (data && typeof data === "object" && "requestId" in data) {
          const rid = (data as { requestId?: unknown }).requestId;
          if (typeof rid === "string") requestId = rid;
        }
      }
      console.log("[bff] /api/analyze", { status: resp.status, contentType: ct, requestId });
    } catch {}
  }

  const outHeaders = new Headers();
  const outContentType = resp.headers.get("content-type");
  const outCacheControl = resp.headers.get("cache-control");
  if (outContentType) outHeaders.set("content-type", outContentType);
  if (outCacheControl) outHeaders.set("cache-control", outCacheControl);

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: outHeaders,
  });
}
