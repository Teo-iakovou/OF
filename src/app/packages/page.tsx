"use client";

import Link from "next/link";
import Packages from "@/app/components/packages/Packages"; // Assuming the component is already created

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Our Packages</h1>
      <p className="text-lg text-center text-gray-300 mb-12">
        Choose the right plan that fits your needs.
      </p>

      {/* Render the Packages component */}
      <div className="container mx-auto">
        <Packages />
      </div>

      <div className="mt-16 flex justify-center gap-4">
        {/* Additional Links or Navigation */}
        <Link href="/pages/packages/upload">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
            Upload Your Content
          </button>
        </Link>
      </div>
    </div>
  );
}
