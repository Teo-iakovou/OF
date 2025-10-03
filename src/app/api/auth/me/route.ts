import { NextRequest, NextResponse } from "next/server";

const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const headers: Record<string, string> = {};
  if (token) headers["cookie"] = `${SESSION_COOKIE_NAME}=${token}`;
  const r = await fetch(`${SERVER_BASE_URL}/api/auth/me`, { headers });
  const text = await r.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return NextResponse.json(data, { status: r.status });
}

