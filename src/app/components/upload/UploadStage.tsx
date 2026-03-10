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
        <header className="mb-4 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">AI Workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-[var(--hg-muted)]">{subtitle}</p>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">{statusLabel}</p>
        </header>
      ) : null}
      <Reveal
        as="section"
        className="w-full rounded-3xl border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_92%,transparent)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] md:p-5"
      >
        {children}
      </Reveal>
    </div>
  );
}
