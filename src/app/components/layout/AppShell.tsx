"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import RouteTransitionOverlay from "../navigation/RouteTransitionOverlay";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import { ConsentProvider } from "../consent/ConsentContext";
import ConsentBanner from "../consent/ConsentBanner";
import ConsentModal from "../consent/ConsentModal";
import CartDrawer from "../cart/CartDrawer";
import { CartProvider } from "../cart/CartContext";
import { AuthModalProvider } from "../auth/AuthModalContext";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const handleCartClick = () => setCartDrawerOpen(true);
  const pathWithoutLocale = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "/";
    if (["en", "el", "es", "it"].includes(parts[0])) {
      const stripped = `/${parts.slice(1).join("/")}`;
      return stripped === "/" ? "/" : stripped;
    }
    return pathname;
  })();
  const useLandingShell =
    pathWithoutLocale === "/" ||
    pathWithoutLocale === "/privacy" ||
    pathWithoutLocale === "/terms" ||
    pathWithoutLocale === "/cookies";
  const isDashboardRoute = pathWithoutLocale.startsWith("/dashboard");
  const isAiDashboardRoute = pathWithoutLocale.startsWith("/dashboard/ai");

  return (
    <ConsentProvider>
      <CartProvider>
        <AuthModalProvider>
          {!isDashboardRoute && !useLandingShell && (
            <Navbar onCartClick={handleCartClick} />
          )}

          <main className="flex-grow">{children}</main>

          <RouteTransitionOverlay />
          {!isAiDashboardRoute && !useLandingShell && <Footer />}

          <ConsentBanner />
          <ConsentModal />

          <CartDrawer
            isOpen={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            onCheckout={() => {}}
          />
        </AuthModalProvider>
      </CartProvider>
    </ConsentProvider>
  );
}
