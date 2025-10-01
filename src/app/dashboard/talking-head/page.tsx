"use client";

import Link from "next/link";
// Temporarily hide upload UI while we fix issues

export default function TalkingHeadPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Talking Head
          </h1>
        </div>
      </header>

      {/* Content */}
      <main>
        <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-8">
          <section className="mt-12 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-3xl font-extrabold mb-3">Coming Soon</h2>
            <p className="text-gray-300 mb-4">We’re polishing the Talking Head experience. Check back shortly.</p>
            <p className="text-gray-400">In the meantime, explore other features from your dashboard.</p>
            <div className="mt-6">
              <Link href="/dashboard" className="inline-block px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                Back to Dashboard
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
