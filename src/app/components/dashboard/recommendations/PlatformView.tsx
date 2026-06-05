"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, CheckCircle2, Loader2, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { RecommendedPlatform } from "@/app/types/analysis";
import { CaptionVariantsBlock } from "@/app/components/dashboard/report/CaptionVariantsBlock";
import { HashtagBlock } from "@/app/components/dashboard/report/HashtagBlock";
import { FitBadge } from "./FitBadge";
import { PlatformPreview } from "./PlatformPreview";

type FeedbackValues = { impressions: string; engagements: string };

type Props = {
  platform: RecommendedPlatform;
  imageUrl?: string | null;
  imageAlt?: string;
  ctaText?: string;
  onCopy: (text: string) => void;
  onSaveCaption: (angle: string, text: string) => Promise<void>;
  onResetCaption: (angle: string) => Promise<void>;
  onRefreshImageUrl?: () => Promise<string | null>;
  feedbackOpen: boolean;
  feedbackValues: FeedbackValues;
  feedbackLoading: boolean;
  feedbackSaved: boolean;
  onFeedbackToggle: () => void;
  onFeedbackChange: (field: "impressions" | "engagements", value: string) => void;
  onFeedbackBump: (field: "impressions" | "engagements", delta: number) => void;
  onFeedbackSubmit: (includeMetrics: boolean) => void;
};

const parseMetric = (value: string) => {
  if (value.trim() === "") return undefined;
  return Math.max(0, Number(value) || 0);
};

function isTimeAfternoon(slot: string): boolean {
  const match = slot.match(/^(\d{1,2})/);
  if (!match) return false;
  const hour = parseInt(match[1], 10);
  return hour >= 18 || hour < 5;
}

export function PlatformView({
  platform,
  imageUrl,
  imageAlt,
  ctaText,
  onCopy,
  onSaveCaption,
  onResetCaption,
  onRefreshImageUrl,
  feedbackOpen,
  feedbackValues,
  feedbackLoading,
  feedbackSaved,
  onFeedbackToggle,
  onFeedbackChange,
  onFeedbackBump,
  onFeedbackSubmit,
}: Props) {
  const t = useTranslations("dashboard.recommendations");
  const rd = useTranslations("dashboard.reportDrawer");

  const [postedAt, setPostedAt] = useState<Date | null>(null);
  const hasSetPostedAt = useRef(false);

  useEffect(() => {
    if (feedbackSaved && !hasSetPostedAt.current) {
      setPostedAt(new Date());
      hasSetPostedAt.current = true;
    }
  }, [feedbackSaved]);

  // Backward compat: fall back to legacy single caption string if captions[] is absent
  const captionVariants = platform.captions?.length
    ? platform.captions
    : platform.caption?.trim()
      ? [{ angle: "default" as const, text: platform.caption }]
      : null;

  const previewCaption = captionVariants?.[0]?.text ?? undefined;
  const fitScore = platform.fitScore ?? null;

  const previewImpressions = parseMetric(feedbackValues.impressions);
  const previewEngagements = parseMetric(feedbackValues.engagements);
  const engagementRate =
    typeof previewImpressions === "number" &&
    previewImpressions > 0 &&
    typeof previewEngagements === "number" &&
    previewEngagements >= 0
      ? (previewEngagements / Math.max(1, previewImpressions)) * 100
      : null;

  const hasRightContent =
    captionVariants?.length ||
    platform.hashtags?.length ||
    platform.subreddits?.length ||
    ctaText;

  return (
    <div className="mt-4 space-y-5">
      {/* Platform header — full width above grid */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-white">{platform.platform}</h3>
          {fitScore ? (
            <FitBadge score={fitScore.score} tier={fitScore.tier} active />
          ) : null}
        </div>
        {platform.bestTimesLocal?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {platform.bestTimesLocal.map((slot) => {
              const isEvening = isTimeAfternoon(slot);
              const TimeIcon = isEvening ? Moon : Sun;
              return (
                <span
                  key={slot}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--hg-muted)]"
                >
                  <TimeIcon
                    className={`h-3 w-3 ${isEvening ? "text-indigo-400" : "text-amber-400"}`}
                    strokeWidth={1.5}
                  />
                  {slot}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 2-column grid: preview (left) + content (right) */}
      <div className={`grid grid-cols-1 gap-5 items-start ${hasRightContent ? "md:grid-cols-[280px_1fr]" : ""}`}>
        {/* LEFT column — platform preview mockup */}
        <div className="min-w-0">
          <p className="mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
            {t("previewHeading")}
          </p>
          <PlatformPreview
            platform={platform.platform}
            caption={previewCaption}
            hashtags={platform.hashtags}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            onRefreshUrl={onRefreshImageUrl}
          />
        </div>

        {/* RIGHT column — captions, hashtags, subreddits, CTA */}
        {hasRightContent ? (
          <div className="min-w-0 space-y-5">
            {captionVariants?.length ? (
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
                  {t("captionsHeading")}
                </p>
                <CaptionVariantsBlock
                  variants={captionVariants}
                  onCopy={onCopy}
                  copyLabel={rd("copyCaptionButton")}
                  angleLabels={{
                    hook: rd("captionAngleHook"),
                    aspirational: rd("captionAngleAspirational"),
                    cta: rd("captionAngleCta"),
                    default: rd("captionAngleDefault"),
                  }}
                  onSaveVariant={onSaveCaption}
                  onResetVariant={onResetCaption}
                  captionPlaceholder={rd("captionPlaceholder")}
                  captionAriaLabel={rd("captionAriaLabel")}
                  resetLabel={rd("resetToAI")}
                />
              </div>
            ) : null}

            {platform.hashtags?.length ? (
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
                  {t("hashtagsHeading")}
                </p>
                <HashtagBlock
                  tags={platform.hashtags}
                  hashtagPack={platform.hashtagPack}
                  platform={platform.platform}
                  onCopyAll={onCopy}
                  copyAllLabel={rd("copyHashtagsButton")}
                  showMoreLabel={(count) => rd("showMoreHashtags", { count })}
                  showLessLabel={rd("showLessHashtags")}
                  copiedLabel={rd("hashtagCopied")}
                />
              </div>
            ) : null}

            {platform.subreddits?.length ? (
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
                  {t("subredditsHeading")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {platform.subreddits.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-xs text-orange-200"
                    >
                      r/{sub}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {ctaText ? (
              <div className="rounded-r-md border-l-2 border-[var(--hg-accent)]/40 bg-[var(--hg-accent)]/5 py-1.5 pl-3">
                <p className="mb-0.5 text-[10px] uppercase tracking-wider text-[var(--hg-muted-2)]">
                  {t("ctaLabel")}
                </p>
                <p className="text-sm leading-relaxed text-white/90">{ctaText}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Feedback section — full width below grid */}
      <div className="border-t border-[var(--hg-border)]/80 pt-3">
        <AnimatePresence mode="wait">
          {feedbackSaved ? (
            <motion.div
              key="posted"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                {rd("savedIndicator")}
                {postedAt ? (
                  <span className="opacity-60">
                    · {postedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                ) : null}
              </span>
            </motion.div>
          ) : feedbackOpen ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/65 p-2.5"
            >
              <p className="text-xs font-medium text-white">{rd("feedbackHeading")}</p>
              <p className="mt-1 text-xs text-[var(--hg-muted)]">{rd("feedbackDescription")}</p>

              {/* Premium stat-card metric inputs */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {/* Impressions */}
                <label className="block">
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--hg-muted-2)] mb-1.5">
                    {rd("impressionsLabel")}
                  </span>
                  <div className="relative rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 transition-colors focus-within:border-[var(--hg-accent)]/60">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      className="w-full bg-transparent pr-10 text-base font-medium tabular-nums text-white focus:outline-none placeholder:font-normal placeholder:text-[var(--hg-muted-2)]"
                      value={feedbackValues.impressions}
                      onChange={(e) => onFeedbackChange("impressions", e.target.value)}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-[11px] text-[var(--hg-muted)]">
                      {rd("metricsViewsHint")}
                    </span>
                  </div>
                </label>

                {/* Engagements */}
                <label className="block">
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--hg-muted-2)] mb-1.5">
                    {rd("engagementsLabel")}
                  </span>
                  <div className="relative rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 transition-colors focus-within:border-[var(--hg-accent)]/60">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      className="w-full bg-transparent text-base font-medium tabular-nums text-white focus:outline-none placeholder:font-normal placeholder:text-[var(--hg-muted-2)]"
                      value={feedbackValues.engagements}
                      onChange={(e) => onFeedbackChange("engagements", e.target.value)}
                    />
                    {engagementRate !== null ? (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-[11px] text-[var(--hg-accent)]/70">
                        {engagementRate.toFixed(1)}%
                      </span>
                    ) : null}
                  </div>
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--hg-accent)] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--hg-accent)]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={feedbackLoading}
                  onClick={() => onFeedbackSubmit(true)}
                >
                  {feedbackLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  {feedbackLoading ? rd("savingLabel") : rd("saveButton")}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--hg-border)] px-3 py-2 text-sm text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={feedbackLoading}
                  onClick={() => onFeedbackSubmit(false)}
                >
                  {feedbackLoading ? rd("savingLabel") : rd("markWithoutMetrics")}
                </button>
                <button
                  type="button"
                  className="ml-auto text-sm text-[var(--hg-muted)] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={feedbackLoading}
                  onClick={onFeedbackToggle}
                >
                  {rd("cancelButton")}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--hg-muted)] transition hover:text-[var(--hg-accent)]"
                onClick={onFeedbackToggle}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                {rd("markAsPostedButton")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
