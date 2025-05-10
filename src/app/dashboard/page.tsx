// app/dashboard/page.tsx
"use client";

export default function DashboardPage() {
  return (
    <div className="pt-10 md:pt-8 p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Dashboard Overview
      </h1>
      <p className="text-gray-400 text-base sm:text-lg mb-4">
        Welcome back! Here’s what’s happening with your content:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-pink-400">
            📊 Upload Summary
          </h3>
          <p className="text-gray-300">You have 4 uploads remaining today.</p>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-400">
            📈 Insights
          </h3>
          <p className="text-gray-300">
            View your best-performing content here.
          </p>
        </div>
      </div>
    </div>
  );
}
