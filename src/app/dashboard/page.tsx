"use client";

import { useMemo } from "react";
import { useUser } from "@/app/hooks/useUser";
import Link from "next/link";
import UserPlanCard from "@/app/components/dashboard/overview/UserPlanCard";
import QuickStartPanel from "@/app/components/dashboard/overview/QuickStartPanel";
import TipsCard from "@/app/components/dashboard/overview/TipsCard";
import { Skeleton } from "@/app/components/ui/Skeleton";
import Reveal from "@/app/components/common/Reveal";

export default function DashboardPage() {
  const { user, loading } = useUser({ required: false });
  const displayName = useMemo(() => {
    const email = user?.email || "";
    if (!email) return ""; // avoid placeholder flicker
    const base = email.split("@")[0] || "";
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
  }, [user]);


  return (
    // Natural page scroll; sidebar is fixed in layout
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Scrollable content area */}
      <main>
        <div className="px-4 md:px-12 lg:px-20 max-w-6xl mx-auto space-y-6 md:space-y-10 pb-6">
          {/* Welcome hero */}
          <Reveal as="section" className="rounded-2xl bg-gray-900 border border-gray-700 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Welcome back</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 min-h-[1.75rem]">
                  {loading ? (
                    <Skeleton className="h-7 w-40" />
                  ) : displayName ? (
                    `${displayName} 👋`
                  ) : (
                    ""
                  )}
                </h2>
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
          </Reveal>

          {/* Sections */}
          <Reveal as="div">
            <UserPlanCard />
          </Reveal>
          <Reveal as="div" delay={100}>
            <QuickStartPanel />
          </Reveal>
          <Reveal as="div" delay={200}>
            <TipsCard />
          </Reveal>
        </div>
      </main>
    </div>
  );
}
