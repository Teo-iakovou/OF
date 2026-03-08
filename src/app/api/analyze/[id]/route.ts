import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVER_BASE_URL =
  process.env.API_URL || "http://localhost:5001";

type RouteParams = {
  params: Promise<{ id: string }>;
};

function buildHeaders(request: NextRequest, includeContentType = false) {
  const headers: Record<string, string> = {
    cookie: request.headers.get("cookie") || "",
  };
  const contentType = request.headers.get("content-type");
  if (includeContentType && contentType) {
    headers["content-type"] = contentType;
  }
  return headers;
}

async function proxy(
  request: NextRequest,
  params: RouteParams["params"],
  method: "GET" | "PATCH" | "DELETE"
) {
  const { id } = await params;
  const url = new URL(`${SERVER_BASE_URL}/api/analyze/${encodeURIComponent(id)}`);
  url.search = request.nextUrl.search;

  const init: RequestInit = {
    method,
    headers: buildHeaders(request, method === "PATCH" || method === "DELETE"),
    cache: "no-store",
  };

  if (method === "PATCH") {
    init.body = await request.arrayBuffer();
  }

  const resp = await fetch(url.toString(), init);
  const buffer = await resp.arrayBuffer();
  return new Response(buffer, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return proxy(request, params, "GET");
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return proxy(request, params, "PATCH");
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return proxy(request, params, "DELETE");
}
