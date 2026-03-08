import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";

function getSetCookieList(res: Response) {
  const viaMethod = (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
  if (Array.isArray(viaMethod) && viaMethod.length > 0) return viaMethod;
  const raw = res.headers.get("set-cookie");
  return raw
    ? raw
        .split(/,(?=\s*[^;,\s]+=)/g)
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
}

export async function POST(req: NextRequest) {
  const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] POST /api/auth/login start', {
        ua: req.headers.get('user-agent') || undefined,
        origin: req.headers.get('origin') || undefined,
        referer: req.headers.get('referer') || undefined,
      });
    }
  } catch {}
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any; // eslint is not enforced in route files; keep simple
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  const nextRes = NextResponse.json(data, { status: res.status });
  // Pass through backend Set-Cookie so the backend remains the single cookie owner.
  const setCookieList = getSetCookieList(res);
  for (const value of setCookieList) {
    nextRes.headers.append("set-cookie", value);
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] POST /api/auth/login done', {
        status: res.status,
        setCookie: setCookieList.length > 0,
      });
    }
  } catch {}
  return nextRes;
}

export async function GET(req: NextRequest) {
  const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
  // Support GET /api/auth/login?email=...&redirect=/... as a top-level flow
  const email = req.nextUrl.searchParams.get("email");
  const redirect = req.nextUrl.searchParams.get("redirect") || "/";
  const provider = req.nextUrl.searchParams.get("provider");
  const googleId = req.nextUrl.searchParams.get("googleId");
  const name = req.nextUrl.searchParams.get("name");
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] GET /api/auth/login start', {
        email,
        redirect,
        provider: provider || undefined,
        ua: req.headers.get('user-agent') || undefined,
      });
    }
  } catch {}
  const payload: Record<string, string> = { email };
  if (provider) payload.provider = provider;
  if (googleId) payload.googleId = googleId;
  if (name) payload.name = name;
  const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  const to = redirect.startsWith("/") ? redirect : "/";
  const nextRes = NextResponse.redirect(new URL(to, req.url));
  // Pass through backend Set-Cookie so the backend remains the single cookie owner.
  const setCookieList = getSetCookieList(res);
  for (const value of setCookieList) {
    nextRes.headers.append("set-cookie", value);
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] GET /api/auth/login done', { status: res.status, to });
    }
  } catch {}
  return nextRes;
}
