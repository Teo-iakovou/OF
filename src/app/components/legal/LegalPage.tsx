"use client";
import React from "react";

export default function LegalPage({
  title,
  updated = "2025-01-01",
  version = "1.0",
  children,
}: {
  title: string;
  updated?: string;
  version?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] px-6 md:px-10 lg:px-16 py-10 md:py-14 text-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-purple-200 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Meta */}
        <div className="mt-2 text-sm text-gray-400">
          Last updated: {updated} • Version: {version}
        </div>

        {/* Content card */}
        <div className="mt-6 rounded-2xl border border-[#232B36] bg-[#0f1520] shadow-2xl">
          <div className="p-6 md:p-8 leading-relaxed space-y-4 text-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

