"use client";
import ProjectNavDropdown from "@/app/components/dashboard/ProjectNavDropdown";
import StatsDashboard from "@/app/components/dashboard/StatsDashboard";

export default function DashboardPage() {
  return (
    <div className="pt-14 px-4 sm:px-6 md:px-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Dashboard
      </h1>
      <ProjectNavDropdown />
      <StatsDashboard />
    </div>
  );
}
