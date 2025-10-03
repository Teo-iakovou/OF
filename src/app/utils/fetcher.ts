// src/app/utils/fetcher.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function fetchJson(input: string, init: RequestInit = {}) {
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === 'true';
  const BFF_PREFIXES = ['/api/auth/', '/api/checkout/', '/api/user/'];
  // If using the in-app BFF, route auth calls to relative /api/auth/*
  let url = input;
  try {
    if (USE_BFF && typeof input === 'string') {
      for (const prefix of BFF_PREFIXES) {
        if (input.startsWith(BASE_URL + prefix)) {
          url = input.slice(BASE_URL.length);
          break;
        }
        const idx = input.indexOf(prefix);
        if (input.startsWith('http') && idx !== -1) {
          url = input.slice(idx);
          break;
        }
      }
    }
  } catch {}
  // Optionally attach Authorization header from localStorage token (testing/dev)
  const HEADER_AUTH_ENABLED = process.env.NEXT_PUBLIC_HEADER_AUTH === 'true';
  const headers = new Headers(init.headers as HeadersInit | undefined);
  if (!headers.has('content-type')) headers.set('Content-Type', 'application/json');
  try {
    if (HEADER_AUTH_ENABLED && typeof window !== 'undefined') {
      const t = window.localStorage?.getItem('ai_token');
      // Only add Authorization if not already present
      if (t && !headers.has('authorization')) {
        headers.set('Authorization', `Bearer ${t}`);
      }
    }
  } catch {}

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (res.status === 401) {
    // optional: client-side redirect can be handled by caller
    const err = new Error("Unauthorized") as Error & { status?: number; data?: unknown };
    err.status = 401;
    err.data = data;
    throw err;
  }
  return { ok: res.ok, status: res.status, data };
}
