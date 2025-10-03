import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

export async function GET(req: NextRequest) {
  const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const headers: Record<string, string> = {};
  if (token) headers["cookie"] = `${SESSION_COOKIE_NAME}=${token}`;
  const r = await fetch(`${SERVER_BASE_URL}/api/auth/me`, { headers });
  const text = await r.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] GET /api/auth/me', {
        hadCookie: !!token,
        status: r.status,
      });
    }
  } catch {}
  return NextResponse.json(data, { status: r.status });
}
