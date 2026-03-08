import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL =
  process.env.API_URL || "http://localhost:5001";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const url = new URL(`${SERVER_BASE_URL}/api/user/results/${encodeURIComponent(id)}/image-url`);
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
