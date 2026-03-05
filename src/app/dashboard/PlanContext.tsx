"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserPackage, type UserPackageResponse } from "@/app/utils/api";
import { toast } from "sonner";
import { markToasted, shouldToastOnce } from "@/lib/toastDedupe";
import { PACKAGES_URL } from "@/app/utils/urls";

type ContextValue = {
  loading: boolean;
  data: UserPackageResponse | null;
  hasActiveInstance: boolean;
  isMissingActiveInstance: boolean;
  isNewUser: boolean;
  refresh: (resetState?: boolean) => void;
  refreshPlan: (resetState?: boolean) => void;
};

const PlanContext = createContext<ContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<ContextValue, "refresh" | "refreshPlan">>({
    loading: true,
    data: null,
    hasActiveInstance: false,
    isMissingActiveInstance: false,
    isNewUser: false,
  });
  const router = useRouter();
  const requestSeq = useRef(0);
  const cancelled = useRef(false);
  const redirectedRef = useRef(false);

  const refresh = useCallback(async (resetState = false) => {
    const seq = ++requestSeq.current;
    if (resetState) {
      setState((prev) => ({ ...prev, loading: true, data: null, isNewUser: false }));
    }
    try {
      const res = await checkUserPackage({ force: resetState });
      if (!cancelled.current && seq === requestSeq.current) {
        const uploadsUsed = typeof res.uploadsUsed === "number" ? res.uploadsUsed : null;
        const createdAt = res.packageInstanceCreatedAt
          ? Date.parse(res.packageInstanceCreatedAt)
          : NaN;
        const now = Date.now();
        const within24h =
          Number.isFinite(createdAt) && createdAt <= now
            ? now - createdAt < 24 * 60 * 60 * 1000
            : false;
        const isNewUser = uploadsUsed === 0 || (uploadsUsed === null && within24h);
        const hasActiveInstance = Boolean(res?.hasAccess && res?.packageInstanceId);
        setState((prev) => ({
          ...prev,
          loading: false,
          data: res,
          isNewUser,
          hasActiveInstance,
          isMissingActiveInstance: false,
        }));
      }
    } catch (err: unknown) {
      if (!cancelled.current && seq === requestSeq.current) {
        const payload =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: unknown }).data
            : null;
        const errorCode =
          payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: unknown }).error
            : null;
        if (errorCode === "ACTIVE_INSTANCE_REQUIRED") {
          const isSelectingInstance =
            typeof window !== "undefined" &&
            (window as unknown as { __AI_SELECTING_INSTANCE__?: string }).__AI_SELECTING_INSTANCE__ ===
              "1";
          if (isSelectingInstance) {
            setTimeout(() => {
              void refresh(true);
            }, 200);
            return;
          }
          const isPackagesPage =
            typeof window !== "undefined" &&
            window.location.pathname === "/";
          if (shouldToastOnce("ACTIVE_INSTANCE_REQUIRED")) {
            toast("Select a package to continue", {
              description: "Choose an active package instance to use Uploads, History, and AI Chat.",
              duration: 6000,
              action: {
                label: "View packages",
                onClick: () => router.push(PACKAGES_URL),
              },
            });
            markToasted("ACTIVE_INSTANCE_REQUIRED");
          }
          if (isPackagesPage) {
            setState((prev) => ({
              ...prev,
              loading: false,
              data: { hasAccess: true, needsInstanceSelection: true },
              isNewUser: false,
              hasActiveInstance: false,
              isMissingActiveInstance: true,
            }));
          } else {
            if (!redirectedRef.current) {
              router.replace(PACKAGES_URL);
              redirectedRef.current = true;
            }
            setState((prev) => ({
              ...prev,
              loading: false,
              data: null,
              isNewUser: false,
              hasActiveInstance: false,
              isMissingActiveInstance: true,
            }));
          }
          return;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          data: null,
          isNewUser: false,
          hasActiveInstance: false,
          isMissingActiveInstance: false,
        }));
      }
    }
  }, []);

  useEffect(() => {
    cancelled.current = false;
    refresh(false);

    const handleAuthChanged = () => {
      void refresh(true);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("ai-auth-changed", handleAuthChanged);
    }
    return () => {
      cancelled.current = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("ai-auth-changed", handleAuthChanged);
      }
    };
  }, [refresh]);

  return (
    <PlanContext.Provider value={{ ...state, refresh, refreshPlan: refresh }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanInfo() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlanInfo must be used within PlanProvider");
  return ctx;
}
