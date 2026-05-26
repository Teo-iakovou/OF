"use client";

import { useCallback, useEffect, useState } from "react";

export function useTour(tourId: string) {
  const [isDone, setIsDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDone(localStorage.getItem(`tour_${tourId}_done`) === "1");
  }, [tourId]);

  const markDone = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`tour_${tourId}_done`, "1");
    setIsDone(true);
  }, [tourId]);

  return { isDone, markDone };
}
