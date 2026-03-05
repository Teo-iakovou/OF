"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useReportDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const handledOpenRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openDrawer = useCallback((id: string) => {
    if (!id) return;
    setActiveId(id);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openDrawerFromQuery = useCallback(() => {
    const openId = searchParams.get("open");
    if (!openId) return;
    if (handledOpenRef.current === openId && isOpen) return;
    handledOpenRef.current = openId;
    setActiveId(openId);
    setIsOpen(true);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("open");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [isOpen, pathname, router, searchParams]);

  return {
    openDrawer,
    closeDrawer,
    isOpen,
    activeId,
    setIsOpen,
    openDrawerFromQuery,
  };
}

