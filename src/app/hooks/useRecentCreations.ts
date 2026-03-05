"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecentCreations, type RecentCreation } from "@/app/utils/api";

type UseRecentCreationsOptions = {
  packageInstanceId: string | null;
  limit?: number;
};

export function useRecentCreations({ packageInstanceId, limit = 12 }: UseRecentCreationsOptions) {
  const [items, setItems] = useState<RecentCreation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!packageInstanceId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await getRecentCreations({ packageInstanceId, limit });
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
      refresh();
    };

    window.addEventListener("analysis:changed", handleAnalysisChanged);
    return () => {
      window.removeEventListener("analysis:changed", handleAnalysisChanged);
    };
  }, [refresh]);

  return { items, loading, refresh };
}
