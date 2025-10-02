"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchJson } from "@/app/utils/fetcher";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; plan?: string | null } | null;

// Simple in-memory cache to avoid duplicate /me calls across components
let cachedUser: User | undefined = undefined; // undefined = unknown, null = unauthenticated
let inFlight: Promise<User> | null = null;
let lastFetched = 0;
const STALE_TTL_MS = 5000;

async function fetchUserOnce(): Promise<User> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const r = await fetchJson(`${BASE_URL}/api/auth/me`, { method: "GET", cache: "no-store" });
      cachedUser = r.ok ? (r.data as User) : null;
    } catch {
      cachedUser = null;
    } finally {
      lastFetched = Date.now();
      const val = cachedUser ?? null;
      inFlight = null;
      return val;
    }
  })();
  return inFlight;
}

export function useUser(opts: { redirectTo?: string; required?: boolean } = {}) {
  const { redirectTo = "/login", required = true } = opts;
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Serve instantly from cache if fresh; revalidate in background if stale
        const now = Date.now();
        const fresh = cachedUser !== undefined && now - lastFetched < STALE_TTL_MS;
        // For protected pages (required=true), bypass fresh cache to avoid
        // letting a stale authenticated user slip through after logout.
        if (fresh && !required) {
          setUser(cachedUser ?? null);
          setLoading(false);
          return;
        }

        const u = await fetchUserOnce();
        if (cancelled) return;
        setUser(u);
        if (!u && required) router.replace(redirectTo);
      } catch (e) {
        if (cancelled) return;
        setError(e);
        setUser(null);
        if (required) router.replace(redirectTo);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [redirectTo, required, router]);

  return { user, loading, error, refresh: async () => {
    setLoading(true);
    try {
      const u = await fetchUserOnce();
      setUser(u);
    } catch (e) {
      setUser(null);
      setError(e);
    } finally {
      setLoading(false);
    }
  }};
}

// Allow callers (logout) to reset the in-memory user cache so the app
// behaves like a fresh visit.
export function clearUserCache() {
  cachedUser = undefined;
  inFlight = null;
  lastFetched = 0;
}
