"use client";

import "./styles/globals.css";
import ToastNotification from "./components/notifications/ToastNotification";
import Navbar from "../app/components/navigation/Navbar";
import Footer from "../app/components/navigation/Footer";
import { usePathname } from "next/navigation";
import CartDrawer from "./components/cart/CartDrawer";
import { CartProvider } from "./components/cart/CartContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // This handler gets passed to Navbar and anywhere else you want to open the drawer
  const handleCartClick = () => setCartDrawerOpen(true);

  return (
    <html lang="en">
      <body className="bg-of-background font-sans min-h-screen flex flex-col">
        <CartProvider>
          {/* Conditionally show Navbar */}
          {!pathname.startsWith("/dashboard") && (
            <Navbar onCartClick={handleCartClick} />
          )}

          {/* Main Content */}
          <main className="flex-grow">{children}</main>

          <ToastNotification />
          {!pathname.startsWith("/dashboard/ai") && <Footer />}

          {/* --- CART DRAWER --- */}
          <CartDrawer
            isOpen={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            onCheckout={() => {}}
          />
        </CartProvider>
      </body>
    </html>
  );
}
