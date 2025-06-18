"use client";
import { useState } from "react";
import DashboardSidebar from "@/app/components/dashboard/sidebar/DashboardSidebar";

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 256;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const sidebarWidth = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex">
      {/* Sidebar (only desktop) */}
      <div
        className="hidden md:flex fixed top-6 left-6 z-30 transition-all duration-200"
        style={{
          width: sidebarWidth,
          height: "calc(100vh - 3rem)",
          padding: "0.5rem 0",
        }}
      >
        <DashboardSidebar expanded={expanded} setExpanded={setExpanded} />
      </div>
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          expanded ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <main className="flex-1 px-6 -mt-14">{children}</main>
      </div>
    </div>
  );
}
