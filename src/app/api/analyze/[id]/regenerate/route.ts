import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const url = new URL(
    `${SERVER_BASE_URL}/api/analyze/${encodeURIComponent(id)}/regenerate`
  );

  const body = await request.arrayBuffer();

  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") || "application/json",
      cookie: request.headers.get("cookie") || "",
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
