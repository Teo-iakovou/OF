"use client";

import "./styles/globals.css";
import ToastNotification from "./components/notifications/ToastNotification";
import LoginToastTrigger from "./components/notifications/LoginToastTrigger";
import RouteTransitionOverlay from "./components/navigation/RouteTransitionOverlay";
import Navbar from "../app/components/navigation/Navbar";
import Footer from "../app/components/navigation/Footer";
import { ConsentProvider } from "./components/consent/ConsentContext";
import ConsentBanner from "./components/consent/ConsentBanner";
import ConsentModal from "./components/consent/ConsentModal";
import { usePathname } from "next/navigation";
import CartDrawer from "./components/cart/CartDrawer";
import { CartProvider } from "./components/cart/CartContext";
import { useState } from "react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const handleCartClick = () => setCartDrawerOpen(true);

  return (
    <html lang="en">
      {/* <head /> is optional; Next injects it for you */}
      <body className="bg-of-background font-sans min-h-[100svh] flex flex-col">
        <ConsentProvider>
        <CartProvider>
          {!pathname.startsWith("/dashboard") && (
            <Navbar onCartClick={handleCartClick} />
          )}

          <main className="flex-grow">{children}</main>

          <ToastNotification />
          <RouteTransitionOverlay />
          <LoginToastTrigger />
          {!pathname.startsWith("/dashboard/ai") && <Footer />}

          {/* Consent UI (always mounted) */}
          <ConsentBanner />
          <ConsentModal />

          <CartDrawer
            isOpen={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            onCheckout={() => {}}
          />
        </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
