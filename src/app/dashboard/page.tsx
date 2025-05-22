"use client";

import StatsDashboard from "@/app/components/dashboard/StatsDashboard";

export default function DashboardPage() {
  return (
    <div className="pt-10 md:pt-8 p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Dashboard Overview
      </h1>
      <StatsDashboard />
    </div>
  );
}
