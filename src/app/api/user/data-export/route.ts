import { NextRequest } from "next/server";

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(`${SERVER_BASE_URL}/api/user/data-export`);

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  const buffer = await resp.arrayBuffer();

  const responseHeaders: Record<string, string> = {
    "content-type": resp.headers.get("content-type") || "application/json",
  };

  // Forward Content-Disposition so the browser triggers a file download
  const disposition = resp.headers.get("content-disposition");
  if (disposition) {
    responseHeaders["content-disposition"] = disposition;
  }

  return new Response(buffer, {
    status: resp.status,
    headers: responseHeaders,
  });
}
