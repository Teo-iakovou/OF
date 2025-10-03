import { NextRequest, NextResponse } from "next/server";

const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const headers: Record<string, string> = {};
  if (token) headers["cookie"] = `${SESSION_COOKIE_NAME}=${token}`;
  // Best-effort logout on backend
  try {
    await fetch(`${SERVER_BASE_URL}/api/auth/logout`, { method: "POST", headers });
  } catch {}
  const res = NextResponse.json({ ok: true });
  // Clear our first-party cookie
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0 });
  return res;
}

