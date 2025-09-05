// src/app/utils/fetcher.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function fetchJson(input: string, init: RequestInit = {}) {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (res.status === 401) {
    // optional: client-side redirect can be handled by caller
    const err: any = new Error("Unauthorized");
    err.status = 401;
    err.data = data;
    throw err;
  }
  return { ok: res.ok, status: res.status, data };
}

