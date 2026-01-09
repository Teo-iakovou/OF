"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import ToastNotification from "../notifications/ToastNotification";
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

  return (
    <ConsentProvider>
      <CartProvider>
        <AuthModalProvider>
          {!pathname.startsWith("/dashboard") && (
            <Navbar onCartClick={handleCartClick} />
          )}

          <main className="flex-grow">{children}</main>

          <ToastNotification />
          <RouteTransitionOverlay />
          {!pathname.startsWith("/dashboard/ai") && <Footer />}

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
