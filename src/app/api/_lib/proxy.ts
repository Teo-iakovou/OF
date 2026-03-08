import { NextRequest } from "next/server";

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";

const HARDENED_BFF_ROUTES = [
  "/api/coach-chat",
  "/api/conversations/[id]/summarize",
  "/api/conversations/[id]/generate-title",
  "/api/feedback",
  "/api/persona/enroll-face",
  "/api/recommendations/feedback",
  "/api/render/generate",
  "/api/render/jobs/[id]",
  "/api/user/select-package-instance",
  "/api/checkout/create-addon-checkout-session",
  "/api/billing/addons/verify",
] as const;

type GlobalWithBffLog = typeof globalThis & {
  __aiPlatformBffHardeningLogged?: boolean;
};

function logBffHardeningRoutesOnce() {
  const g = globalThis as GlobalWithBffLog;
  if (g.__aiPlatformBffHardeningLogged) return;
  g.__aiPlatformBffHardeningLogged = true;
  console.log("[bff] hardening routes active", {
    count: HARDENED_BFF_ROUTES.length,
    routes: HARDENED_BFF_ROUTES,
  });
}

type ProxyOptions = {
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  includeBody?: boolean;
};

export async function proxyToBackend(request: NextRequest, options: ProxyOptions) {
  logBffHardeningRoutesOnce();

  const url = new URL(`${SERVER_BASE_URL}${options.path}`);
  url.search = request.nextUrl.search;

  const headers: Record<string, string> = {
    cookie: request.headers.get("cookie") || "",
  };

  const contentType = request.headers.get("content-type");
  if (contentType && options.includeBody) {
    headers["content-type"] = contentType;
  }

  const init: RequestInit = {
    method: options.method,
    headers,
    cache: "no-store",
  };

  if (options.includeBody) {
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
