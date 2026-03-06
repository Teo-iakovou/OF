import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL =
  process.env.API_URL || "http://localhost:5001";

export async function GET(request: NextRequest) {
  const url = new URL(`${SERVER_BASE_URL}/api/conversations`);
  url.search = request.nextUrl.search;

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  const buffer = await resp.arrayBuffer();
  return new Response(buffer, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.arrayBuffer();
  const contentType = request.headers.get("content-type") || "application/json";
  const resp = await fetch(`${SERVER_BASE_URL}/api/conversations`, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") || "",
      "content-type": contentType,
    },
    body,
    cache: "no-store",
  });

  const buffer = await resp.arrayBuffer();
  return new Response(buffer, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") || "application/json",
    },
  });
}
