"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";
import EmailModal from "@/app/components/email/EmailModal";
import { FloatingChatProvider } from "@/app/components/AIchat/FloatingChatContext";
import FloatingChatWidget from "@/app/components/AIchat/FloatingChatWidget";
import MobileProjectNavDrawer from "@/app/components/dashboard/buttons/MobileProjectNavDrawer";
import { Menu } from "lucide-react";

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 256;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
    setShowEmailModal(!email);
    setHasMounted(true);
  }, []);

  const handleEmailSubmit = (email: string) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
    setShowEmailModal(false);
  };

  const sidebarWidth = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  // 👇 routes where we DON'T want the bottom spacer (no footer UI)
  const noBottomSpacerRoutes = ["/dashboard/ai-chat", "/dashboard/ai-coach", "/dashboard/coaching"];
  const showBottomSpacer = !noBottomSpacerRoutes.some((r) => pathname?.startsWith(r));

  // 👇 also hide the floating widget on the dedicated chat routes
  const showFloating = showBottomSpacer;

  if (!hasMounted) return null;

  return (
    <>
      <EmailModal
        isOpen={showEmailModal}
        onSubmit={handleEmailSubmit}
        onClose={() => setShowEmailModal(false)}
      />

      {!showEmailModal && (
        <FloatingChatProvider email={userEmail}>
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
          </div>
        </FloatingChatProvider>
      )}
    </>
  );
}
