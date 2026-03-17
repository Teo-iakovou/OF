import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${SERVER_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  const nextRes = NextResponse.json(data, { status: res.status });
  const setCookieList = getSetCookieList(res);
  for (const value of setCookieList) {
    nextRes.headers.append("set-cookie", value);
  }
  return nextRes;
}
