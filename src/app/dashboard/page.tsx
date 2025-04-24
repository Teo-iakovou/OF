"use client";

import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6">Dashboard Overview</h1>
        <p className="text-gray-400 text-lg mb-4">
          Welcome back! Here’s what’s happening with your content:
        </p>

        {/* Example Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-pink-400">
              📊 Upload Summary
            </h3>
            <p className="text-gray-300">You have 4 uploads remaining today.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-purple-400">
              📈 Insights
            </h3>
            <p className="text-gray-300">
              View your best-performing content here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
