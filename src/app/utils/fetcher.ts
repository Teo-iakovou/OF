// src/app/utils/fetcher.ts
const useBFF = process.env.NEXT_PUBLIC_USE_BFF === "true";
export const BASE_URL = useBFF ? "" : process.env.NEXT_PUBLIC_API_URL || "";

const AUTH_EVENT = "ai-auth-changed";

type FetchJsonOptions = RequestInit & {
  onUnauthorized?: () => void;
};

export async function fetchJson(input: string, init: FetchJsonOptions = {}) {
  const { onUnauthorized, ...requestInit } = init;
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === "true";
  const BFF_PREFIXES = ["/api/auth/", "/api/checkout/", "/api/user/"];
  // If using the in-app BFF, route auth calls to relative /api/auth/*
  let url = input;
  try {
    if (USE_BFF && typeof input === "string") {
      for (const prefix of BFF_PREFIXES) {
        if (input.startsWith(BASE_URL + prefix)) {
          url = input.slice(BASE_URL.length);
          break;
        }
        const idx = input.indexOf(prefix);
        if (input.startsWith("http") && idx !== -1) {
          url = input.slice(idx);
          break;
        }
      }
    }
    // Always force auth routes through the BFF to avoid cookie/domain issues.
    if (typeof input === 'string') {
      const authPrefix = "/api/auth/";
      if (input.startsWith(BASE_URL + authPrefix)) {
        url = input.slice(BASE_URL.length);
      } else {
        const idx = input.indexOf(authPrefix);
        if (input.startsWith("http") && idx !== -1) {
          url = input.slice(idx);
        }
      }
    }
    // In BFF mode, never call absolute API hosts from the browser.
    if (USE_BFF && typeof url === "string" && url.startsWith("http")) {
      const apiIdx = url.indexOf("/api/");
      if (apiIdx !== -1) {
        url = url.slice(apiIdx);
      }
    }
  } catch {}
  const headers = new Headers(requestInit.headers as HeadersInit | undefined);
  if (!headers.has("content-type")) headers.set("Content-Type", "application/json");

  if (process.env.NODE_ENV !== "production") {
    try {
      console.log("[fetchJson]", {
        method: requestInit.method || "GET",
        url,
        useBFF: USE_BFF,
      });
    } catch {}
  }

  const res = await fetch(url, {
    ...requestInit,
    credentials: "include",
    headers,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (res.status === 401) {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_EVENT));
      }
    } catch {}
    try {
      onUnauthorized?.();
    } catch {}
    // optional: client-side redirect can be handled by caller
    const err = new Error("Unauthorized") as Error & {
      status?: number;
      data?: unknown;
      requestId?: string;
    };
    err.status = 401;
    err.data = data;
    if (data && typeof data === "object" && "requestId" in data) {
      const rid = (data as { requestId?: unknown }).requestId;
      if (typeof rid === "string") err.requestId = rid;
    }
    throw err;
  }
  return { ok: res.ok, status: res.status, data };
}
