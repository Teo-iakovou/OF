"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link2 } from "lucide-react";
import type { ResultDoc } from "@/app/types/analysis";
import { getUserResultById } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/Skeleton";

type ReportDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultId: string | null;
};

type RequestError = Error & {
  requestId?: string;
};

export default function ReportDrawer({
  open,
  onOpenChange,
  resultId,
}: ReportDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [expandedHashtags, setExpandedHashtags] = useState<Record<string, boolean>>({});
  const [copyLinkStatus, setCopyLinkStatus] = useState<"idle" | "copied">("idle");
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!open || !resultId) return;
    if (result?._id === resultId && reloadToken === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRequestId(null);
    setStage(0);
    setExpandedHashtags({});
    getUserResultById({ id: resultId })
      .then((data) => {
        if (cancelled) return;
        setResult(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err as RequestError;
        setError(e?.message || "Failed to load report.");
        setRequestId(typeof e?.requestId === "string" ? e.requestId : null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, reloadToken, result?._id, resultId]);

  useEffect(() => {
    if (!open) {
      setStage(0);
      return;
    }
    if (loading || !result || error) return;
    if (prefersReducedMotion) {
      setStage(2);
      return;
    }
    setStage(1);
    const timers = [window.setTimeout(() => setStage(2), 150)];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [open, loading, result, error, prefersReducedMotion]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const topPlatform = result?.promotion?.recommendedPlatforms?.[0];
  const recommendedPlatforms = result?.promotion?.recommendedPlatforms || [];
  const canShowTopPick = recommendedPlatforms.length > 1 && !!topPlatform;

  const sectionClass = (visible: boolean) =>
    prefersReducedMotion
      ? "opacity-100 translate-y-0"
      : `transition-all duration-200 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
        }`;

  const copyText = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {}
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopyLink = async () => {
    if (!resultId) return;
    const base = window.location.origin;
    const url = `${base}/dashboard/upload?open=${encodeURIComponent(resultId)}`;
    await copyText(url);
    toast("Copied link");
    setCopyLinkStatus("copied");
    window.setTimeout(() => setCopyLinkStatus("idle"), 2000);
  };

  return (
    <div className="fixed inset-0 z-[85]">
      <button
        type="button"
        aria-label="Close report drawer"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[var(--hg-surface)] p-5 shadow-2xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Promotion Plan</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--hg-text)]">
              {topPlatform?.platform ? `${topPlatform.platform} Strategy` : "Promotion Plan"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
              onClick={() => void handleCopyLink()}
              disabled={!resultId}
            >
              <Link2 className="h-3.5 w-3.5" />
              {copyLinkStatus === "copied" ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-[var(--hg-muted)] hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              X
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p>{error}</p>
            {requestId ? <p className="mt-2 text-xs text-rose-200/80">Request ID: {requestId}</p> : null}
          </div>
        ) : result ? (
          <div className="mt-6 space-y-4">
            {canShowTopPick ? (
              <section
                className={`rounded-xl border border-[var(--hg-accent)]/30 bg-[var(--hg-surface-2)] p-4 ${sectionClass(
                  stage >= 1
                )}`}
              >
                <p className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Top pick</p>
                <p className="mt-1 text-sm font-semibold text-white">{topPlatform.platform}</p>
                {topPlatform.bestTimesLocal?.length ? (
                  <p className="mt-1 text-xs text-[var(--hg-muted)]">
                    Best windows: {topPlatform.bestTimesLocal.join(" • ")}
                  </p>
                ) : null}
              </section>
            ) : null}

            <section
              className={`rounded-xl border border-white/10 bg-[var(--hg-surface-2)] p-4 ${sectionClass(
                stage >= (canShowTopPick ? 2 : 1)
              )}`}
            >
              <h3 className="text-sm font-semibold text-white">Recommended Platforms</h3>
              {recommendedPlatforms.length === 0 ? (
                <div className="mt-3 rounded-lg border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-[var(--hg-muted)]">No promotion plan available yet.</p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)]"
                    onClick={() => setReloadToken((prev) => prev + 1)}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {recommendedPlatforms.map((platform) => {
                    const tags = platform.hashtags || [];
                    const expanded = expandedHashtags[platform.platform] === true;
                    const visibleTags = expanded ? tags : tags.slice(0, 12);
                    const hiddenCount = Math.max(0, tags.length - visibleTags.length);
                    const hashtagsText = tags
                      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
                      .join(" ");
                    return (
                      <div key={platform.platform} className="rounded-lg border border-white/10 bg-black/10 p-3">
                        <p className="text-sm font-medium text-white">{platform.platform}</p>

                        {platform.bestTimesLocal?.length ? (
                          <p className="mt-2 text-xs text-[var(--hg-muted)]">
                            Best windows: {platform.bestTimesLocal.join(" • ")}
                          </p>
                        ) : null}

                        {platform.caption?.trim() ? (
                          <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-2">
                            <p className="line-clamp-3 text-sm text-[var(--hg-text)]">{platform.caption}</p>
                            <button
                              type="button"
                              className="mt-2 text-xs text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                              onClick={() => {
                                void copyText(platform.caption || "");
                                toast("Caption copied");
                              }}
                            >
                              Copy caption
                            </button>
                          </div>
                        ) : null}

                        {visibleTags.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {visibleTags.map((tag) => {
                              const normalized = tag.startsWith("#") ? tag : `#${tag}`;
                              return (
                                <span
                                  key={`${platform.platform}-${normalized}`}
                                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[var(--hg-muted)]"
                                >
                                  {normalized}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-center gap-3">
                          {hashtagsText ? (
                            <button
                              type="button"
                              className="text-xs text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                              onClick={() => {
                                void copyText(hashtagsText);
                                toast("Hashtags copied");
                              }}
                            >
                              Copy hashtags
                            </button>
                          ) : null}
                          {hiddenCount > 0 ? (
                            <button
                              type="button"
                              className="text-xs text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                              onClick={() =>
                                setExpandedHashtags((prev) => ({
                                  ...prev,
                                  [platform.platform]: !expanded,
                                }))
                              }
                            >
                              {expanded ? "Show less" : `+${hiddenCount} more`}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
