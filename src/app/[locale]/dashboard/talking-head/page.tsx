"use client";

import UploadTalkingHead from "@/app/components/render/UploadTalkingHead";

export default function TalkingHeadPage() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-3 md:px-8 md:pt-16">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI Video Avatar</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">
            Upload a face photo + voice audio and we&apos;ll generate a talking video.
          </p>
        </header>

        <main className="mt-8 md:mt-10">
          <UploadTalkingHead />
        </main>
      </div>
    </div>
  );
}
