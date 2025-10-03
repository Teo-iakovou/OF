import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const url = new URL(`${SERVER_BASE_URL}/api/checkout/verify-session`);
  if (sessionId) url.searchParams.set("session_id", sessionId);
  const r = await fetch(url.toString());
  const text = await r.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return NextResponse.json(data, { status: r.status });
}
