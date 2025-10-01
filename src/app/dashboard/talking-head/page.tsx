"use client";

import Link from "next/link";
import UploadTalkingHead from "@/app/components/render/UploadTalkingHead";

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
          {/* Upload Section */}
          <section className="mt-8 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create a Talking Head</h2>
            <UploadTalkingHead />
          </section>

          {/* Info */}
          <section className="mt-6 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">How it works</h2>
            <p className="text-gray-400">Submit your image and script. We synthesize speech and animate the face, then return a downloadable MP4.</p>
          </section>

          {/* Policy Link */}
          <div className="mt-6 text-center">
            <Link href="/legal/talking-head-policy" className="text-sm text-blue-400 underline hover:text-blue-300">
              Read content policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
