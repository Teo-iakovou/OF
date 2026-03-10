"use client";

import Link from "next/link";
import { useEffect } from "react";
import CreationCard from "@/app/components/dashboard/upload/CreationCard";
import { useRecentCreations } from "@/app/hooks/useRecentCreations";

type RecentCreationsProps = {
  packageInstanceId?: string | null;
  onOpenCreation?: (id: string) => void;
  refreshToken?: number;
};

export default function RecentCreations({
  packageInstanceId,
  onOpenCreation,
  refreshToken,
}: RecentCreationsProps) {
  const { items, loading, refresh } = useRecentCreations({
    packageInstanceId: packageInstanceId || null,
  });

  useEffect(() => {
    if (refreshToken === undefined) return;
    refresh();
  }, [refreshToken, refresh]);

  return (
    <section className="w-full pb-8 pt-1 md:pt-2">
      <div className="flex items-baseline justify-between border-b border-[var(--hg-border-2)] pb-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">Generated Results</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white/95 md:text-3xl">Recents</h2>
        </div>
        <Link
          href="/dashboard/history"
          className="text-sm font-medium tracking-tight text-[var(--hg-muted)] transition-colors hover:text-[#50C0F0] md:text-base"
        >
          See all ›
        </Link>
      </div>

      {loading ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`recent-skeleton-${idx}`}
              className="w-[230px] shrink-0 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 sm:w-[270px]"
            >
              <div className="h-32 w-full rounded-lg bg-[var(--hg-surface-2)]" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-40 rounded bg-[rgba(255,255,255,0.08)]" />
                <div className="h-3 w-24 rounded bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5">
          <h3 className="text-base font-semibold text-white">
            Create your first strategy
          </h3>
          <p className="mt-1 text-sm hg-muted">
            Upload an image to generate a report.
          </p>
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById("upload-stage");
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-2 text-sm font-semibold text-[#04131d] hover:opacity-90"
          >
            Upload content
          </button>
        </div>
      ) : (
        <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
          {items.map((item) => {
            const finalThumbnailProp = item.thumbnailUrl;
            return (
              <div key={item.id} className="w-[230px] shrink-0 snap-start sm:w-[270px]">
                <CreationCard
                  id={item.id}
                  title={item.title}
                  createdAt={item.createdAt}
                  type={item.type}
                  status={item.status}
                  thumbnailUrl={finalThumbnailProp}
                  imageKey={item.imageKey}
                  onOpenCreation={onOpenCreation}
                />
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={refresh}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      >
        Refresh
      </button>
    </section>
  );
}
