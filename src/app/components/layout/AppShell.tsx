"use client";

import { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import RouteTransitionOverlay from "../navigation/RouteTransitionOverlay";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import { ConsentProvider } from "../consent/ConsentContext";
import ConsentBanner from "../consent/ConsentBanner";
import ConsentModal from "../consent/ConsentModal";
import CartDrawer from "../cart/CartDrawer";
import { CartProvider, useCart } from "../cart/CartContext";
import { AuthModalProvider } from "../auth/AuthModalContext";

type AppShellProps = {
  children: ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isCartOpen, openCart, closeCart } = useCart();
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
    /^\/(lite|pro|ultimate)$/.test(pathWithoutLocale) ||
    pathWithoutLocale === "/login" ||
    pathWithoutLocale === "/signup" ||
    pathWithoutLocale === "/privacy" ||
    pathWithoutLocale === "/terms" ||
    pathWithoutLocale === "/cookies";
  const isDashboardRoute = pathWithoutLocale.startsWith("/dashboard");
  const isAiDashboardRoute = pathWithoutLocale.startsWith("/dashboard/ai");

  return (
    <AuthModalProvider>
      {!isDashboardRoute && !useLandingShell && (
        <Navbar onCartClick={openCart} />
      )}

      <main className="flex-grow">{children}</main>

      <RouteTransitionOverlay />
      {!isDashboardRoute && !isAiDashboardRoute && !useLandingShell && <Footer />}

      <ConsentBanner />
      <ConsentModal />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={() => {}}
      />
    </AuthModalProvider>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <ConsentProvider>
      <CartProvider>
        <AppShellInner>{children}</AppShellInner>
      </CartProvider>
    </ConsentProvider>
  );
}
