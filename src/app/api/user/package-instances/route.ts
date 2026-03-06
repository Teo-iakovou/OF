import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function GET(request: NextRequest) {
  const url = new URL(`${SERVER_BASE_URL}/api/user/package-instances`);
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
