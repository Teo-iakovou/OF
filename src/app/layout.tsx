import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { Outfit } from "next/font/google";
import "./styles/globals.css";
import SonnerToaster from "./components/notifications/SonnerToaster";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`bg-of-background font-sans min-h-[100svh] flex flex-col ${outfit.variable}`}>
        <SonnerToaster />
        {children}
      </body>
    </html>
  );
}
