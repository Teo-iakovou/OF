"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchJson } from "@/app/utils/fetcher";
import { useRouter } from "@/i18n/navigation";
import { AUTH_EVENT } from "@/app/utils/sessionExpiry";

type User = {
  id: string;
  email: string;
  plan?: string | null;
  firstName?: string;
  lastName?: string;
} | null;
type MeResponse = { user?: Exclude<User, null> | null } | null;

// Simple in-memory cache to avoid duplicate /me calls across components
let cachedUser: User | undefined = undefined; // undefined = unknown, null = unauthenticated
let inFlight: Promise<User> | null = null;
let lastFetched = 0;
const STALE_TTL_MS = 5000;
async function fetchUserOnce(): Promise<User> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const r = await fetchJson(`/api/auth/me`, { method: "GET", cache: "no-store" });
      const payload = r.data as MeResponse;
      cachedUser = r.ok && payload && payload.user ? payload.user : null;
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

export function useUser(opts: { redirectTo?: string; required?: boolean; initialUser?: User } = {}) {
  const { redirectTo = "/", required = true, initialUser } = opts;
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    function handleAuthChanged() {
      (async () => {
        try {
          const u = await fetchUserOnce();
          if (cancelled) return;
          setUser(u);
          setLoading(false);
          if (!u && required) router.replace(redirectTo);
        } catch {
          if (cancelled) return;
          setUser(null);
          setLoading(false);
          if (required) router.replace(redirectTo);
        }
      })();
    }
    if (typeof window !== "undefined") {
      window.addEventListener(AUTH_EVENT, handleAuthChanged);
    }
    (async () => {
      try {
        // If the server already provided the user, use it immediately when truthy.
        // If it's explicitly null but a client token exists (testing header auth),
        // allow a client-side revalidation before redirecting.
        if (typeof initialUser !== "undefined") {
          if (initialUser) {
            cachedUser = initialUser;
            lastFetched = Date.now();
            setUser(initialUser);
            setLoading(false);
            return;
          } else if (!initialUser && required) {
            // initialUser is null/falsy but don't redirect immediately —
            // the cookie may have just been set by OAuth and SSR hasn't read it yet.
            // Fall through to fetch /api/auth/me and let lines below decide.
          }
          // else: initialUser is null but we have a client token; fall through to fetch
        }

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
    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener(AUTH_EVENT, handleAuthChanged);
      }
    };
  }, [redirectTo, required, router, initialUser]);

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

export function notifyAuthChange() {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_EVENT));
    }
  } catch {}
}
