"use client";

import { Copy, Download, ExternalLink, X } from "lucide-react";

type RecentStatus = "queued" | "processing" | "done" | "failed";

export type TalkingHeadRecentItem = {
  id: string;
  title: string;
  createdAt?: string;
  status: RecentStatus;
  videoUrl?: string | null;
  stage?: string | null;
  progress?: number;
  supportId?: string | null;
  thumbnailUrl?: string | null;
};

type TalkingHeadResultDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TalkingHeadRecentItem | null;
};

const statusStyles: Record<RecentStatus, string> = {
  queued: "bg-white/10 text-white/70 border border-white/15",
  processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
  done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

export default function TalkingHeadResultDrawer({
  open,
  onOpenChange,
  item,
}: TalkingHeadResultDrawerProps) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[96]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl border-l border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-[var(--hg-border-2)] px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--hg-muted)]">
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "Just now"}
                </span>
                <span className={`inline-flex rounded-full px-2 py-0.5 font-medium ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1.5 text-[var(--hg-muted)] hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {item.status === "done" && item.videoUrl ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]">
                  <video controls src={item.videoUrl} className="w-full bg-black" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={item.videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#04131d] hover:opacity-90"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                </div>
              </div>
            ) : null}

            {(item.status === "queued" || item.status === "processing") ? (
              <div className="space-y-4 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4">
                <p className="text-sm text-white">Your video is being generated.</p>
                <div className="space-y-1 text-xs text-[var(--hg-muted)]">
                  <p>Stage: {item.stage || "processing"}</p>
                  <p>Progress: {typeof item.progress === "number" ? `${item.progress.toFixed(0)}%` : "—"}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#50C0F0] transition-all"
                    style={{ width: `${Math.max(8, Math.min(100, item.progress ?? 12))}%` }}
                  />
                </div>
              </div>
            ) : null}

            {item.status === "failed" ? (
              <div className="space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100">
                <p>Video generation failed. Please try again.</p>
                {item.supportId ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span>Support ID: {item.supportId}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(item.supportId || "")}
                      className="inline-flex items-center gap-1 rounded border border-rose-200/40 px-2 py-1 text-[11px] hover:border-rose-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
