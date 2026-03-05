"use client";

import Reveal from "@/app/components/common/Reveal";

type UploadStageProps = {
  title?: string;
  subtitle?: string;
  statusLabel?: string;
  showHeader?: boolean;
  children: React.ReactNode;
};

export default function UploadStage({
  title = "Upload content",
  subtitle = "Analyze your image to get captions, hashtags, and timing insights.",
  statusLabel = "Ready to upload",
  showHeader = true,
  children,
}: UploadStageProps) {
  return (
    <div className="w-full">
      {showHeader ? (
        <header className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">{statusLabel}</p>
        </header>
      ) : null}
      <Reveal
        as="section"
        className="w-full rounded-2xl p-5"
      >
        {children}
      </Reveal>
    </div>
  );
}
