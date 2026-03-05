"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Link2, X } from "lucide-react";
import { toast } from "sonner";
import type { ResultDoc } from "@/app/types/analysis";
import { getUserResultById, postRecommendationFeedback } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/Skeleton";

type ReportDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultId: string | null;
  initialData?: ResultDoc | null;
};

type RequestError = Error & {
  requestId?: string;
};

const normalizePlatform = (value: string) => {
  const v = value.trim().toLowerCase();
  if (v === "instagram") return "Instagram";
  if (v === "tiktok" || v === "tik tok") return "TikTok";
  if (v === "twitter" || v === "x") return "Twitter";
  if (v === "reddit") return "Reddit";
  return value.trim();
};

export default function ReportDrawer({
  open,
  onOpenChange,
  resultId,
  initialData,
}: ReportDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultDoc | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [expandedHashtags, setExpandedHashtags] = useState<Record<string, boolean>>({});
  const [copyLinkStatus, setCopyLinkStatus] = useState<"idle" | "copied">("idle");
  const [feedbackOpen, setFeedbackOpen] = useState<Record<string, boolean>>({});
  const [feedbackValues, setFeedbackValues] = useState<
    Record<string, { impressions: string; engagements: string }>
  >({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({});
  const [feedbackSaved, setFeedbackSaved] = useState<Record<string, boolean>>({});
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
    setFeedbackOpen({});
    setFeedbackValues({});
    setFeedbackLoading({});
    setFeedbackSaved({});

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
      setStage(3);
      return;
    }
    setStage(1);
    const timers = [
      window.setTimeout(() => setStage(2), 140),
      window.setTimeout(() => setStage(3), 300),
    ];
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

  const recommendedPlatforms = result?.promotion?.recommendedPlatforms || [];
  const topPlatform = recommendedPlatforms[0];
  const createdAtLabel = result?.createdAt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
        .format(new Date(result.createdAt))
        .replace(",", " •")
    : "—";
  const creationType = topPlatform?.platform ? `${topPlatform.platform} strategy` : "Photo strategy";

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

  const platformKey = (platformName: string, idx: number) => `${platformName}-${idx}`;
  const parseOptionalMetric = (value: string) => {
    if (value.trim() === "") return undefined;
    return Math.max(0, Number(value) || 0);
  };

  const handleCopyLink = async () => {
    if (!resultId) return;
    const base = window.location.origin;
    const url = `${base}/dashboard/history?open=${encodeURIComponent(resultId)}`;
    await copyText(url);
    setCopyLinkStatus("copied");
    window.setTimeout(() => setCopyLinkStatus("idle"), 2000);
    toast("Copied link");
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
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Promotion Plan</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--hg-text)]">
              {topPlatform?.platform ? `${topPlatform.platform} Strategy` : "Promotion Plan"}
            </h2>
            <p className="mt-1 text-xs text-[var(--hg-muted)]">
              {createdAtLabel} • {creationType}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[var(--hg-muted)] hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p>{error}</p>
            {requestId ? <p className="mt-2 text-xs text-rose-200/80">Request ID: {requestId}</p> : null}
          </div>
        ) : result ? (
          <div className="mt-6 space-y-4">
            <section className={`rounded-xl border border-white/10 bg-[var(--hg-surface-2)] p-4 ${sectionClass(stage >= 1)}`}>
              <h3 className="text-sm font-semibold text-white">Where to promote this photo</h3>

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
                  {recommendedPlatforms.map((platform, idx) => {
                    const key = platformKey(platform.platform, idx);
                    const tags = platform.hashtags || [];
                    const expanded = expandedHashtags[key] === true;
                    const visibleTags = expanded ? tags : tags.slice(0, 12);
                    const hiddenCount = Math.max(0, tags.length - visibleTags.length);
                    const hashtagsText = tags
                      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
                      .join(" ");
                    const ctaText = result?.promotion?.ctaVariants?.[0] || platform?.notes?.[0] || "";
                    const policyHints = Array.isArray(platform.policyHints)
                      ? platform.policyHints.slice(0, 3)
                      : [];
                    const policyWhy = typeof platform.policyWhy === "string" ? platform.policyWhy : "";
                    const values = feedbackValues[key] || { impressions: "", engagements: "" };
                    const isFeedbackOpen = feedbackOpen[key] === true;
                    const isSubmitting = feedbackLoading[key] === true;
                    const isSaved = feedbackSaved[key] === true;
                    const previewImpressions = parseOptionalMetric(values.impressions);
                    const previewEngagements = parseOptionalMetric(values.engagements);
                    const showEngagementRate =
                      typeof previewImpressions === "number" &&
                      previewImpressions > 0 &&
                      typeof previewEngagements === "number" &&
                      previewEngagements >= 0;
                    const engagementRate = showEngagementRate
                      ? (previewEngagements / Math.max(1, previewImpressions)) * 100
                      : null;
                    const submitFeedback = (includeMetrics: boolean) => {
                      if (!result?._id) return;
                      const parsedImpressions = parseOptionalMetric(values.impressions);
                      const parsedEngagements = parseOptionalMetric(values.engagements);

                      setFeedbackLoading((prev) => ({ ...prev, [key]: true }));
                      void postRecommendationFeedback({
                        resultId: result._id,
                        platform: normalizePlatform(platform.platform),
                        variantIds: {
                          platformMixId: result?.promotion?.selectedIds?.platformMixId ?? null,
                          hashtagPackId: platform.selectedIds?.hashtagPackId ?? null,
                          timePackId: platform.selectedIds?.timePackId ?? null,
                          captionStyleId: platform.selectedIds?.captionStyleId ?? null,
                          ctaId:
                            platform.selectedIds?.ctaId ||
                            result?.promotion?.selectedIds?.ctaId ||
                            null,
                        },
                        ...(includeMetrics && typeof parsedImpressions === "number"
                          ? { impressions: parsedImpressions }
                          : {}),
                        ...(includeMetrics && typeof parsedEngagements === "number"
                          ? { engagement: parsedEngagements }
                          : {}),
                      })
                        .then(() => {
                          setFeedbackSaved((prev) => ({ ...prev, [key]: true }));
                          setFeedbackOpen((prev) => ({ ...prev, [key]: false }));
                          toast.success("Feedback saved");
                        })
                        .catch((err: unknown) => {
                          const message =
                            err instanceof Error ? err.message : "Failed to save feedback";
                          const reqId =
                            typeof (err as { requestId?: unknown })?.requestId === "string"
                              ? ((err as { requestId?: string }).requestId as string)
                              : "";
                          if (reqId) {
                            toast.error(message, {
                              action: {
                                label: "Copy requestId",
                                onClick: () => {
                                  void copyText(reqId);
                                },
                              },
                              description: `Request ID: ${reqId}`,
                            });
                            return;
                          }
                          toast.error(message);
                        })
                        .finally(() => {
                          setFeedbackLoading((prev) => ({
                            ...prev,
                            [key]: false,
                          }));
                        });
                    };
                    const bumpMetric = (
                      field: "impressions" | "engagements",
                      delta: number
                    ) => {
                      const current = parseOptionalMetric(values[field]) ?? 0;
                      const next = Math.max(0, current + delta);
                      setFeedbackValues((prev) => ({
                        ...prev,
                        [key]: {
                          ...values,
                          [field]: String(next),
                        },
                      }));
                    };

                    return (
                      <div key={key} className="rounded-lg border border-white/10 bg-black/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-white">{platform.platform}</p>
                          {platform.bestTimesLocal?.length ? (
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {platform.bestTimesLocal.map((slot) => (
                                <span
                                  key={`${platform.platform}-${slot}`}
                                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[var(--hg-muted)]"
                                >
                                  {slot}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

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

                        <div className="mt-3 flex flex-wrap items-center gap-3">
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
                                  [key]: !expanded,
                                }))
                              }
                            >
                              {expanded ? "Show less" : `+${hiddenCount} more`}
                            </button>
                          ) : null}
                        </div>

                        {ctaText ? (
                          <p className="mt-3 text-xs text-[var(--hg-muted)]">
                            <span className="font-medium text-white">CTA:</span> {ctaText}
                          </p>
                        ) : null}

                        {policyHints.length ? (
                          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-[var(--hg-muted)]">
                            {policyHints.map((hint, idx) => (
                              <li key={`${platform.platform}-hint-${idx}`}>{hint}</li>
                            ))}
                          </ul>
                        ) : null}

                        {policyWhy ? (
                          <p className="mt-2 text-xs text-[var(--hg-muted)]">
                            <span className="font-medium text-white">Why:</span> {policyWhy}
                          </p>
                        ) : null}

                        <div className="mt-3 border-t border-white/10 pt-3">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs text-[var(--hg-muted)] hover:text-[var(--hg-accent)] disabled:opacity-70"
                            onClick={() => {
                              if (isSaved) return;
                              setFeedbackOpen((prev) => ({
                                ...prev,
                                [key]: !isFeedbackOpen,
                              }));
                            }}
                            disabled={isSubmitting || isSaved}
                          >
                            {!isSaved ? (
                              <ChevronRight
                                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                                  isFeedbackOpen ? "rotate-90" : "rotate-0"
                                }`}
                              />
                            ) : null}
                            {isSaved ? "Saved ✓" : "Mark as posted"}
                          </button>

                          {isFeedbackOpen ? (
                            <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2">
                              <div className="mb-2">
                                <p className="text-xs font-medium text-white">
                                  Help the AI learn from this post
                                </p>
                                <p className="mt-1 text-xs text-[var(--hg-muted)]">
                                  Enter how this post performed (optional). This improves future
                                  recommendations for this profile.
                                </p>
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <label className="text-xs text-[var(--hg-muted)]">
                                  Impressions
                                  <div className="relative mt-1">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 pr-8 text-xs text-white outline-none focus:border-[var(--hg-accent)]"
                                      value={values.impressions}
                                      onChange={(event) =>
                                        setFeedbackValues((prev) => ({
                                          ...prev,
                                          [key]: {
                                            ...values,
                                            impressions: event.target.value,
                                          },
                                        }))
                                      }
                                    />
                                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col">
                                      <button
                                        type="button"
                                        className="rounded p-0.5 text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                                        onClick={() => bumpMetric("impressions", 1)}
                                        aria-label="Increase impressions"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        className="rounded p-0.5 text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                                        onClick={() => bumpMetric("impressions", -1)}
                                        aria-label="Decrease impressions"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="mt-1 text-[11px] text-[var(--hg-muted)]">
                                    Total views of this post.
                                  </p>
                                </label>
                                <label className="text-xs text-[var(--hg-muted)]">
                                  Engagements
                                  <div className="relative mt-1">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 pr-8 text-xs text-white outline-none focus:border-[var(--hg-accent)]"
                                      value={values.engagements}
                                      onChange={(event) =>
                                        setFeedbackValues((prev) => ({
                                          ...prev,
                                          [key]: {
                                            ...values,
                                            engagements: event.target.value,
                                          },
                                        }))
                                      }
                                    />
                                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col">
                                      <button
                                        type="button"
                                        className="rounded p-0.5 text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                                        onClick={() => bumpMetric("engagements", 1)}
                                        aria-label="Increase engagements"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        className="rounded p-0.5 text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
                                        onClick={() => bumpMetric("engagements", -1)}
                                        aria-label="Decrease engagements"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="mt-1 text-[11px] text-[var(--hg-muted)]">
                                    Likes + comments + shares.
                                  </p>
                                </label>
                              </div>

                              {engagementRate !== null ? (
                                <p className="mt-2 text-xs text-[var(--hg-muted)]">
                                  Engagement rate: {engagementRate.toFixed(1)}%
                                </p>
                              ) : null}

                              <div className="mt-2 flex flex-wrap justify-end gap-2">
                                <button
                                  type="button"
                                  className="rounded-md border border-white/15 px-2.5 py-1.5 text-xs text-[var(--hg-muted)] hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={isSubmitting || !result?._id || isSaved}
                                  onClick={() => submitFeedback(false)}
                                >
                                  {isSubmitting ? "Saving..." : "Just mark as posted"}
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md border border-white/15 px-2.5 py-1.5 text-xs text-white hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={isSubmitting || !result?._id || isSaved}
                                  onClick={() => submitFeedback(true)}
                                >
                                  {isSubmitting ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {Array.isArray(result?.promotion?.riskFlags) && result.promotion.riskFlags.length > 0 ? (
              <section className={`rounded-xl border border-white/10 bg-[var(--hg-surface-2)] p-4 ${sectionClass(stage >= 2)}`}>
                <h3 className="text-sm font-semibold text-white">Posting Safety Tips</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--hg-muted)]">
                  {result.promotion.riskFlags.map((tip, idx) => (
                    <li key={`risk-${idx}`}>{tip}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
