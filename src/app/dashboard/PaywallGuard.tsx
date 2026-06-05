"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { usePlanInfo } from "@/app/dashboard/PlanContext";

// Whole /dashboard/* requires an active package
const REQUIRES_PACKAGE = "/dashboard";

export default function PaywallGuard({ children }: { children: React.ReactNode }) {
  const { loading, hasActiveInstance, data } = usePlanInfo();
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();

  const isLockedRoute = pathname?.startsWith(REQUIRES_PACKAGE) ?? false;
  const isPostPurchase = searchParams?.get("status") === "success";

  useEffect(() => {
    if (loading) return;
    if (!hasActiveInstance && isLockedRoute && !isPostPurchase) {
      router.replace("/account/plans");
    }
  }, [loading, hasActiveInstance, isLockedRoute, isPostPurchase, router]);

  // While plan is loading on a locked route, show a skeleton to prevent flash
  if (loading && isLockedRoute && data === null) {
    return (
      <div className="min-h-screen animate-pulse rounded-2xl bg-[var(--hg-surface)]/40" />
    );
  }

  // Redirect is in flight — render nothing to avoid showing locked content
  if (!loading && !hasActiveInstance && isLockedRoute && !isPostPurchase) {
    return null;
  }

  return <>{children}</>;
}
