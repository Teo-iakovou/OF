// app/dashboard/layout.tsx
"use client";

import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-16 min-h-screen bg-black text-white flex flex-col">
      {/* Mobile Sidebar at the top */}
      <div className="block md:hidden w-full">
        <DashboardSidebar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block w-64">
          <DashboardSidebar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
