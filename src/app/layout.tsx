import type { ReactNode } from "react";
import "./styles/globals.css";
import AppShell from "./components/layout/AppShell";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* <head /> is optional; Next injects it for you */}
      <body className="bg-of-background font-sans min-h-[100svh] flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
