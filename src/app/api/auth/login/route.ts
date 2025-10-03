import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as "lax" | "strict" | "none",
    path: "/",
  };
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
  // If backend returned a token, set it as a first-party session cookie
  if (res.ok && data && typeof data === "object" && typeof data.token === "string") {
    nextRes.cookies.set(SESSION_COOKIE_NAME, data.token, cookieOptions());
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] POST /api/auth/login done', {
        status: res.status,
        setCookie: res.ok && !!(data && typeof data === 'object' && data.token),
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
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] GET /api/auth/login start', {
        email,
        redirect,
        ua: req.headers.get('user-agent') || undefined,
      });
    }
  } catch {}
  const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  const to = redirect.startsWith("/") ? redirect : "/";
  const nextRes = NextResponse.redirect(new URL(to, req.url));
  if (data && typeof data === "object" && typeof data.token === "string") {
    nextRes.cookies.set(SESSION_COOKIE_NAME, data.token, cookieOptions());
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] GET /api/auth/login done', { status: res.status, to });
    }
  } catch {}
  return nextRes;
}
