"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";
import { FloatingChatProvider } from "@/app/components/AIchat/FloatingChatContext";
import FloatingChatWidget from "@/app/components/AIchat/FloatingChatWidget";
import MobileProjectNavDrawer from "@/app/components/dashboard/buttons/MobileProjectNavDrawer";
import { Menu } from "lucide-react";
import { useConsent } from "@/app/components/consent/ConsentContext";
import { useUser } from "@/app/hooks/useUser";

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 256;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { open: openConsent } = useConsent();
  const { loading: userLoading } = useUser({ required: true });

  const pathname = usePathname();

  useEffect(() => { setHasMounted(true); }, []);

  const sidebarWidth = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  // 👇 routes where we DON'T want the bottom spacer (no footer UI)
  const noBottomSpacerRoutes = ["/dashboard/ai-chat", "/dashboard/ai-coach", "/dashboard/coaching"];
  const showBottomSpacer = !noBottomSpacerRoutes.some((r) => pathname?.startsWith(r));

  // 👇 also hide the floating widget on the dedicated chat routes
  const showFloating = showBottomSpacer;

  if (!hasMounted || userLoading) return null;

  return (
    <>
      <FloatingChatProvider>
          {/* allow natural page scroll; sidebar remains fixed */}
          <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black flex">
            {/* Sidebar */}
            <div
              className="hidden md:flex fixed top-6 left-6 z-30 transition-all duration-200"
              style={{ width: sidebarWidth, height: "calc(100svh - 3rem)", padding: "0.5rem 0" }}
            >
              <DashboardSidebar expanded={expanded} setExpanded={setExpanded} />
            </div>

            {/* Content column */}
          <div className={`flex-1 flex flex-col transition-all duration-200 ${expanded ? "md:ml-64" : "md:ml-16"}`}>
  <main className="px-6 pt-2">{children}</main>

  {showBottomSpacer ? (
    <div className="h-4 shrink-0" />
  ) : null}
</div>

{/* ✅ Paint-only safe-area filler when spacer is hidden */}
{!showBottomSpacer && (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-br from-gray-900 via-gray-800 to-black"
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

            {/* Persistent cookie prefs on dashboard routes (footer is hidden here) */}
            <button
              onClick={openConsent}
              className="fixed bottom-3 right-3 z-40 text-xs text-gray-300/80 hover:text-white underline underline-offset-2"
            >
              Cookie preferences
            </button>
          </div>
        </FloatingChatProvider>
    </>
  );
}
