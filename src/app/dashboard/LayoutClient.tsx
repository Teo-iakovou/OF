"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";
import { FloatingChatProvider } from "@/app/components/AIchat/FloatingChatContext";
import FloatingChatWidget from "@/app/components/AIchat/FloatingChatWidget";
import FaceEnrollModal from "@/app/components/dashboard/FaceEnrollModal";
import DashboardGlow from "@/app/components/dashboard/DashboardGlow";
import { useConsent } from "@/app/components/consent/ConsentContext";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import SettingsModal, { type SettingsSection } from "@/app/components/dashboard/sidebar/SettingsModal";
import PackagesModal from "@/app/components/dashboard/sidebar/PackagesModal";
import { usePathname, useRouter } from "@/i18n/navigation";
import DashboardTopBar from "@/app/components/dashboard/navigation/DashboardTopBar";
import MobileBottomBar from "@/app/components/dashboard/MobileBottomBar";
import { DASHBOARD_LAYOUT } from "@/app/dashboard/dashboardLayout.constants";
import { SESSION_EXPIRED_EVENT } from "@/app/utils/sessionExpiry";
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("account");
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const redirectingRef = useRef(false);
  const { open: openConsent } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextTarget = useMemo(() => {
    const q = searchParams.toString();
    return `${pathname}${q ? `?${q}` : ""}`;
  }, [pathname, searchParams]);
  const loginHref = useMemo(
    () => `/login?next=${encodeURIComponent(nextTarget)}`,
    [nextTarget]
  );
  // Hydrate auth client-side using server-provided user to avoid first-paint 401
  const { user, loading: userLoading } = useUser({
    required: true,
    initialUser,
    redirectTo: loginHref,
  });
  const { data: planData, hasActiveInstance, refresh: refreshPlan } = usePlanInfo();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setSessionExpired(true);
      setSettingsOpen(false);
    };
    if (typeof window !== "undefined") {
      window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionExpired) return;
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    const timer = window.setTimeout(() => {
      router.replace(loginHref);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [loginHref, router, sessionExpired]);

  useEffect(() => {
    const modal = searchParams.get("modal");
    const settings = searchParams.get("settings");
    const tab = searchParams.get("tab");
    const shouldOpen = modal === "settings" || settings === "1";
    if (!shouldOpen) return;

    const nextSection: SettingsSection =
      tab === "history" || tab === "billing" || tab === "usage" || tab === "account"
        ? tab
        : "account";
    setSettingsSection(nextSection);
    setSettingsOpen(true);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("modal");
    next.delete("settings");
    next.delete("tab");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const sidebarWidth = expanded
    ? DASHBOARD_LAYOUT.sidebarExpandedWidth
    : DASHBOARD_LAYOUT.sidebarCollapsedWidth;
  const openSettings = (section: SettingsSection = "account") => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  // routes where we DON'T want the bottom spacer (no footer UI)
  const noBottomSpacerRoutes = [
    "/dashboard/ai-coach",
    "/dashboard/coaching",
  ];
  const showBottomSpacer = !noBottomSpacerRoutes.some((r) => pathname?.startsWith(r));

  const showFloating = true;
  const forceEnroll = searchParams.get("enroll") === "1";
  const shouldBlock =
    forceEnroll ||
    (Boolean(hasActiveInstance) && Boolean(planData) && planData?.faceEnrolled === false);

  if (!hasMounted || userLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Spinner />
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--hg-bg)] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 text-center shadow-[0_16px_36px_rgba(0,0,0,0.25)]">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">Session</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Your session expired</h2>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">
            Please sign in again to continue where you left off.
          </p>
          <button
            type="button"
            onClick={() => router.replace(loginHref)}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[var(--hg-accent)] px-4 text-sm font-semibold text-[#07141d] hover:opacity-90"
          >
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <FloatingChatProvider>
        {/* allow natural page scroll; sidebar remains fixed */}
        <div className="relative flex min-h-screen overflow-x-hidden bg-[var(--hg-bg)]">
          <DashboardGlow />
          {/* Sidebar */}
          <div
            className={`hidden md:flex fixed ${DASHBOARD_LAYOUT.sidebarTopOffset} ${DASHBOARD_LAYOUT.sidebarLeftOffset} z-30 md:transition-[width] md:duration-200`}
            style={{ width: sidebarWidth, height: "calc(100svh - 2rem)", padding: "0.25rem 0" }}
          >
            <DashboardSidebar
              expanded={expanded}
              setExpanded={setExpanded}
              onOpenCookiePreferences={openConsent}
              onOpenSettings={openSettings}
            />
          </div>

          {/* Content column */}
          <div className={`flex-1 flex flex-col md:transition-[margin-left] md:duration-200 ${expanded ? DASHBOARD_LAYOUT.desktopExpandedMarginClass : DASHBOARD_LAYOUT.desktopCollapsedMarginClass}`}>
            <main className={`px-3 ${DASHBOARD_LAYOUT.mobileMainTopPaddingClass} sm:px-5 md:px-7 ${DASHBOARD_LAYOUT.desktopMainTopPaddingClass} pb-20 md:pb-0`}>
              {children}
            </main>

            {showBottomSpacer ? <div className="hidden h-4 shrink-0 md:block" /> : null}
          </div>

          {/* Paint-only safe-area filler when spacer is hidden */}
          {!showBottomSpacer && (
            <div
              aria-hidden
              className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] bg-[var(--hg-bg)]"
              style={{ height: "env(safe-area-inset-bottom, 0px)" }}
            />
          )}

          {showFloating ? <FloatingChatWidget /> : null}

          <DashboardTopBar
            onOpenSettings={openSettings}
          />

          <MobileBottomBar
            onOpenSettings={() => openSettings()}
            onOpenPackages={() => setPackagesOpen(true)}
          />
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
        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          initialSection={settingsSection}
        />
        <PackagesModal
          open={packagesOpen}
          onOpenChange={setPackagesOpen}
        />
      </FloatingChatProvider>
    </>
  );
}
