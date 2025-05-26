"use client";
import Navbar from "@/app/components/navigation/Navbar";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar (desktop only) */}
        <div className="hidden md:block w-64">
          <DashboardSidebar />
        </div>
        {/* Main content */}
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-20 text-white min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
