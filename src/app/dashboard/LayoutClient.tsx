"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";
import { FloatingChatProvider } from "@/app/components/AIchat/FloatingChatContext";
import FloatingChatWidget from "@/app/components/AIchat/FloatingChatWidget";
import MobileProjectNavDrawer from "@/app/components/dashboard/buttons/MobileProjectNavDrawer";
import FaceEnrollModal from "@/app/components/dashboard/FaceEnrollModal";
import DashboardGlow from "@/app/components/dashboard/DashboardGlow";
import { Menu } from "lucide-react";
import { useConsent } from "@/app/components/consent/ConsentContext";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";

type User = { id: string; email: string; plan?: string | null } | null;

export default function LayoutClient({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { open: openConsent } = useConsent();
  // Hydrate auth client-side using server-provided user to avoid first-paint 401
  const { user, loading: userLoading } = useUser({ required: true, initialUser });
  const { data: planData, hasActiveInstance, refresh: refreshPlan } = usePlanInfo();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const SIDEBAR_COLLAPSED = 64;
  const SIDEBAR_EXPANDED = 256;
  const sidebarWidth = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  // routes where we DON'T want the bottom spacer (no footer UI)
  const noBottomSpacerRoutes = [
    "/dashboard/ai-chat",
    "/dashboard/ai-coach",
    "/dashboard/coaching",
  ];
  const showBottomSpacer = !noBottomSpacerRoutes.some((r) => pathname?.startsWith(r));

  // also hide the floating widget on the dedicated chat routes
  const showFloating = showBottomSpacer;
  const forceEnroll = searchParams.get("enroll") === "1";
  const shouldBlock =
    forceEnroll ||
    (Boolean(hasActiveInstance) && Boolean(planData) && planData?.faceEnrolled === false);

  if (!hasMounted || userLoading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Spinner />
      </div>
    );

  return (
    <>
      <FloatingChatProvider>
        {/* allow natural page scroll; sidebar remains fixed */}
        <div className="relative min-h-screen overflow-x-hidden bg-[var(--hg-bg)] flex">
          <DashboardGlow />
          {/* Sidebar */}
          <div
            className="hidden md:flex fixed top-6 left-6 z-30 transition-all duration-200"
            style={{ width: sidebarWidth, height: "calc(100svh - 3rem)", padding: "0.5rem 0" }}
          >
            <DashboardSidebar
              expanded={expanded}
              setExpanded={setExpanded}
              onOpenCookiePreferences={openConsent}
            />
          </div>

          {/* Content column */}
          <div className={`flex-1 flex flex-col transition-all duration-200 ${expanded ? "md:ml-64" : "md:ml-16"}`}>
            <main className="px-3 sm:px-6 pt-2">{children}</main>

            {showBottomSpacer ? <div className="h-4 shrink-0" /> : null}
          </div>

          {/* Paint-only safe-area filler when spacer is hidden */}
          {!showBottomSpacer && (
            <div
              aria-hidden
              className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] bg-[var(--hg-bg)]"
              style={{ height: "env(safe-area-inset-bottom, 0px)" }}
            />
          )}

          {showFloating && <FloatingChatWidget />}

          {/* Mobile header menu button */}
          <div className="md:hidden fixed top-3 left-3 z-40">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl bg-[#171d29] border border-[#232B36] text-white shadow"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile Project Navigation Drawer */}
          <MobileProjectNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        </div>
        <FaceEnrollModal
          open={shouldBlock}
          onSuccess={async () => {
            await refreshPlan(true);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("ai-auth-changed"));
            }
            if (forceEnroll) {
              const next = new URLSearchParams(searchParams.toString());
              next.delete("enroll");
              const q = next.toString();
              router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
            }
          }}
        />
      </FloatingChatProvider>
    </>
  );
}
