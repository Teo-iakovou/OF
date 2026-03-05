import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const body = await req.text();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.cookie = `${SESSION_COOKIE_NAME}=${token}`;

  const response = await fetch(`${SERVER_BASE_URL}/api/user/profile`, {
    method: "PATCH",
    headers,
    body,
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return NextResponse.json(data, { status: response.status });
}
