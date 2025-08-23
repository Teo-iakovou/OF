"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import UserPlanCard from "@/app/components/dashboard/overview/UserPlanCard";
import QuickStartPanel from "@/app/components/dashboard/overview/QuickStartPanel";
import TipsCard from "@/app/components/dashboard/overview/TipsCard";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // derive a friendly display name from the stored email
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("userEmail") || "");
    }
  }, []);
  const displayName = useMemo(() => {
    if (!email) return "Creator";
    const base = email.split("@")[0] || "Creator";
    return base.charAt(0).toUpperCase() + base.slice(1);
  }, [email]);

  // close mobile nav on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    // Fill the dashboard layout area; no outer page scroll here.
    <div className="h-full flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>

        {/* Mobile Project Nav under the title */}
        <div className="mt-3 md:hidden" ref={menuRef}>
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <div className="relative z-40">
              <ProjectNavDropdownMenu overlayMode onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 md:px-12 lg:px-20 max-w-6xl mx-auto space-y-6 md:space-y-10 pb-6">
          {/* Welcome hero */}
          <section className="rounded-2xl bg-gray-900 border border-gray-700 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Welcome back</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">{displayName} 👋</h2>
                <p className="text-gray-300 mt-2">
                  Upload content and get platform-ready captions, hashtags, and best posting times — fast.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dashboard/upload"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                >
                  Upload Content
                </Link>
                <Link
                  href="/dashboard/history"
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium"
                >
                  Insight History
                </Link>
              </div>
            </div>
          </section>

          {/* Sections */}
          <UserPlanCard />
          <QuickStartPanel />
          <TipsCard />
        </div>
      </main>
    </div>
  );
}