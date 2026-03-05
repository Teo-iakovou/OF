const SERVER_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  if (contentType) headers.set("content-type", contentType);

  const body = await request.arrayBuffer();
  const resp = await fetch(`${SERVER_BASE_URL}/api/persona/enroll-face`, {
    method: "POST",
    headers,
    body,
    redirect: "manual",
  });

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
