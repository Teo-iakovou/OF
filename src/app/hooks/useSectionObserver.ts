"use client";

import { useEffect, useState } from "react";

export function useSectionObserver(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds.length || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((prev, curr) => {
          if (!prev) return curr;
          return curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev;
        });
        if (topMost?.target?.id) {
          setActiveId(topMost.target.id);
        }
      },
      {
        rootMargin: "-45% 0% -45% 0%",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds.join("|")]);

  return activeId;
}
