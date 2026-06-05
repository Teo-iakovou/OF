"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecentCreations, type RecentCreation } from "@/app/utils/api";

type UseRecentCreationsOptions = {
  packageInstanceId: string | null;
  limit?: number;
};

type CacheEntry = {
  ts: number;
  items?: RecentCreation[];
  inFlight?: Promise<RecentCreation[]>;
};

const CACHE_TTL_MS = 5000;
const recentCreationsCache = new Map<string, CacheEntry>();

export function useRecentCreations({ packageInstanceId, limit = 12 }: UseRecentCreationsOptions) {
  const cacheKey = packageInstanceId ? `${packageInstanceId}:${limit}` : null;
  const cached = cacheKey ? recentCreationsCache.get(cacheKey) : undefined;
  const [items, setItems] = useState<RecentCreation[]>(cached?.items ?? []);
  const [loading, setLoading] = useState(Boolean(packageInstanceId && !cached?.items));

  const refresh = useCallback(async (force = false) => {
    if (!packageInstanceId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const key = `${packageInstanceId}:${limit}`;
    const now = Date.now();
    const current = recentCreationsCache.get(key);
    if (!force && current?.items && now - current.ts < CACHE_TTL_MS) {
      setItems(current.items);
      setLoading(false);
      return;
    }

    const request =
      !force && current?.inFlight
        ? current.inFlight
        : getRecentCreations({ packageInstanceId, limit });

    recentCreationsCache.set(key, {
      ts: current?.ts ?? 0,
      items: current?.items,
      inFlight: request,
    });

    if (!current?.items) setLoading(true);
    try {
      const next = await request;
      recentCreationsCache.set(key, { ts: Date.now(), items: next });
      setItems(next);
    } catch (err) {
      console.error("Failed to load recent creations:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [packageInstanceId, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleAnalysisChanged = () => {
      refresh(true);
    };

    window.addEventListener("analysis:changed", handleAnalysisChanged);
    return () => {
      window.removeEventListener("analysis:changed", handleAnalysisChanged);
    };
  }, [refresh]);

  return { items, loading, refresh };
}
