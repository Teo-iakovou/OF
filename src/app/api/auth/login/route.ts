import { NextRequest, NextResponse } from "next/server";

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
  return nextRes;
}

export async function GET(req: NextRequest) {
  // Support GET /api/auth/login?email=...&redirect=/... as a top-level flow
  const email = req.nextUrl.searchParams.get("email");
  const redirect = req.nextUrl.searchParams.get("redirect") || "/";
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
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
  return nextRes;
}
