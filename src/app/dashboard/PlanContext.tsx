"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkUserPackage, type UserPackageResponse } from "@/app/utils/api";

type ContextValue = {
  loading: boolean;
  data: UserPackageResponse | null;
};

const PlanContext = createContext<ContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContextValue>({ loading: true, data: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await checkUserPackage();
        if (!cancelled) setState({ loading: false, data: res });
      } catch {
        if (!cancelled) setState({ loading: false, data: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <PlanContext.Provider value={state}>{children}</PlanContext.Provider>;
}

export function usePlanInfo() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlanInfo must be used within PlanProvider");
  return ctx;
}
