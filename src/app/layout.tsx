"use client";

import "./styles/globals.css";
import ToastNotification from "./components/notifications/ToastNotification";
import Navbar from "../app/components/navigation/Navbar";
import Footer from "../app/components/navigation/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-of-background font-sans min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Toast Notifications */}
        <ToastNotification />
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
