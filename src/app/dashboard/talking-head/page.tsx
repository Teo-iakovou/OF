"use client";

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
          <section className="mt-12 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Generate a Talking Head</h2>
            <p className="text-gray-300 mb-6">
              Upload a face photo, enter a script, choose a voice, and we’ll render a video.
            </p>
            <UploadTalkingHead />
          </section>
        </div>
      </main>
    </div>
  );
}
