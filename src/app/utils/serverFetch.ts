// src/app/utils/serverFetch.ts
// Server-side fetch helper that forwards incoming cookies to the backend.
// Use from RSC/server components or route handlers to avoid CORS and
// ensure the session is recognized server-to-server.

import 'server-only';
import { headers } from 'next/headers';

export const SERVER_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

type JsonResult = { ok: boolean; status: number; data: unknown };

function buildUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  return `${SERVER_BASE_URL}${input.startsWith('/') ? '' : '/'}${input}`;
}

export async function serverFetchJson(input: string, init: RequestInit = {}): Promise<JsonResult> {
  const url = buildUrl(input);
  const incoming = headers();

  const h = new Headers(init.headers as HeadersInit | undefined);
  // Preserve explicit headers but default content-type for JSON requests
  if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  // Forward cookies from the current request so backend can read the session
  const cookieHeader = incoming.get('cookie');
  if (cookieHeader) h.set('cookie', cookieHeader);

  const res = await fetch(url, {
    ...init,
    // Avoid Next cache for auth/session calls by default
    cache: init.cache ?? 'no-store',
    headers: h,
    // credentials is a no-op on server fetch, cookies are forwarded via header
  });

  const text = await res.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

// Convenience: fetch current user on the server
export type ServerUser = { id: string; email: string; plan?: string | null } | null;

export async function serverGetUser(): Promise<ServerUser> {
  const r = await serverFetchJson('/api/auth/me', { method: 'GET' });
  return r.ok ? (r.data as ServerUser) : null;
}

