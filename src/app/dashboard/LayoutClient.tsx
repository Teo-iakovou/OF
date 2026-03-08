"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";
import { FloatingChatProvider } from "@/app/components/AIchat/FloatingChatContext";
import FloatingChatWidget from "@/app/components/AIchat/FloatingChatWidget";
import MobileProjectNavDrawer from "@/app/components/dashboard/buttons/MobileProjectNavDrawer";
import FaceEnrollModal from "@/app/components/dashboard/FaceEnrollModal";
import DashboardGlow from "@/app/components/dashboard/DashboardGlow";
import { ChevronDown, Globe, Menu } from "lucide-react";
import Image from "next/image";
import { useConsent } from "@/app/components/consent/ConsentContext";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import SettingsModal from "@/app/components/dashboard/sidebar/SettingsModal";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

type User = { id: string; email: string; plan?: string | null } | null;
const LOCALES = [
  { key: "en", label: "EN" },
  { key: "el", label: "ΕΛ" },
  { key: "es", label: "ES" },
  { key: "it", label: "IT" },
] as const;
type SupportedLocale = (typeof LOCALES)[number]["key"];

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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const { open: openConsent } = useConsent();
  // Hydrate auth client-side using server-provided user to avoid first-paint 401
  const { user, loading: userLoading } = useUser({ required: true, initialUser });
  const { data: planData, hasActiveInstance, refresh: refreshPlan } = usePlanInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as SupportedLocale;

  const pathname = usePathname();
  const currentLocale = LOCALES.find((item) => item.key === locale) || LOCALES[0];
  const mobileSectionTitle = (() => {
    if (!pathname) return "Dashboard";
    if (pathname.includes("/dashboard/upload")) return "Upload";
    if (pathname.includes("/dashboard/history")) return "Settings";
    if (pathname.includes("/dashboard/ai-chat")) return "AI Chat";
    if (pathname.includes("/dashboard/talking-head")) return "Talking Head";
    if (pathname.includes("/dashboard/billing")) return "Settings";
    if (pathname.includes("/dashboard/account")) return "Settings";
    return "Dashboard";
  })();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setMobileLangOpen(false);
  }, [pathname]);

  const changeLocale = (nextLocale: SupportedLocale) => {
    const query = searchParams.toString();
    const target = `${pathname}${query ? `?${query}` : ""}`;
    router.replace(target, { locale: nextLocale, scroll: false });
    setMobileLangOpen(false);
  };

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
            <main className="px-3 pt-[calc(env(safe-area-inset-top,0px)+6.25rem)] sm:px-5 md:px-6 md:pt-2">
              {children}
            </main>

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

          {/* Mobile app bar */}
          <div className="md:hidden fixed left-0 right-0 top-6 z-40 flex justify-center px-4">
            <div className="w-full max-w-6xl rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_82%,transparent)] shadow-lg shadow-black/20 backdrop-blur-md">
            <div className="mx-auto flex h-[calc(env(safe-area-inset-top,0px)+3.15rem)] w-full items-end justify-between px-4 pb-2">
              <button
                aria-label="Open dashboard menu"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-white"
              >
                <Menu size={18} />
              </button>
              <div className="flex min-w-0 items-center gap-2">
                <Image
                  src="/echofy-removebg-preview.png"
                  alt="Echofy"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
                <span className="truncate text-sm font-semibold text-white/95">{mobileSectionTitle}</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileLangOpen((v) => !v)}
                  aria-label="Change language"
                  className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-2.5 text-xs font-medium text-[var(--hg-muted)] hover:text-[var(--hg-text)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {currentLocale.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {mobileLangOpen ? (
                  <div className="absolute right-0 top-11 z-50 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
                    {LOCALES.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => changeLocale(item.key)}
                        className={`flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium ${
                          item.key === locale
                            ? "bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
                            : "text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            </div>
          </div>

          {/* Mobile Project Navigation Drawer */}
          <MobileProjectNavDrawer
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            onOpenSettings={() => setMobileSettingsOpen(true)}
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
          open={mobileSettingsOpen}
          onOpenChange={setMobileSettingsOpen}
          initialSection="account"
        />
      </FloatingChatProvider>
    </>
  );
}
