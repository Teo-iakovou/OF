"use client";

import "./styles/globals.css";
import ToastNotification from "./components/notifications/ToastNotification";
import Navbar from "../app/components/navigation/Navbar";
import Footer from "../app/components/navigation/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-of-background font-sans min-h-screen flex flex-col">
        {/* Conditionally show Navbar */}
        {!pathname.startsWith("/dashboard") && <Navbar />}

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        <ToastNotification />
        {!pathname.startsWith("/dashboard/ai") && <Footer />}
      </body>
    </html>
  );
}
