"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchJson } from "@/app/utils/fetcher";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; plan?: string | null } | null;

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
        const r = await fetchJson(`${BASE_URL}/api/auth/me`, { method: "GET" });
        if (cancelled) return;
        if (r.ok) setUser(r.data as any);
        else if (r.status === 401) {
          setUser(null);
          if (required) router.replace(redirectTo);
        } else setUser(null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e);
        setUser(null);
        if (required && (e?.status === 401 || e?.message === "Unauthorized")) router.replace(redirectTo);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [redirectTo, required, router]);

  return { user, loading, error, refresh: async () => {
    setLoading(true);
    try {
      const r = await fetchJson(`${BASE_URL}/api/auth/me`, { method: "GET" });
      if (r.ok) setUser(r.data as any);
      else setUser(null);
    } catch (e) {
      setUser(null);
      setError(e);
    } finally {
      setLoading(false);
    }
  }};
}

