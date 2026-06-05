"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { ResultDoc } from "@/app/types/analysis";
import { ThumbsFeedback } from "@/app/components/feedback/ThumbsFeedback";
import { PlatformTabBar } from "./PlatformTabBar";
import { PlatformView } from "./PlatformView";
import { PlatformSkipState } from "./PlatformSkipState";

type FeedbackValues = { impressions: string; engagements: string };

type Props = {
  result: ResultDoc;
  previewUrl: string | null;
  onRefreshImageUrl?: () => Promise<string | null>;
  onSaveCaption: (platform: string, angle: string, text: string) => Promise<void>;
  onResetCaption: (platform: string, angle: string) => Promise<void>;
  onReload: () => void;
  feedbackOpen: Record<string, boolean>;
  feedbackValues: Record<string, FeedbackValues>;
  feedbackLoading: Record<string, boolean>;
  feedbackSaved: Record<string, boolean>;
  onFeedbackToggle: (key: string) => void;
  onFeedbackChange: (key: string, field: "impressions" | "engagements", value: string) => void;
  onFeedbackBump: (key: string, field: "impressions" | "engagements", delta: number) => void;
  onFeedbackSubmit: (key: string, platform: string, includeMetrics: boolean) => void;
};

const platformKey = (name: string, idx: number) => `${name}-${idx}`;

export function RecommendationsView({
  result,
  previewUrl,
  onRefreshImageUrl,
  onSaveCaption,
  onResetCaption,
  onReload,
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
  const [activePlatformIndex, setActivePlatformIndex] = useState(0);

  const recommendedPlatforms = result.promotion?.recommendedPlatforms || [];
  const ctaText = result.promotion?.ctaVariants?.[0] || "";
  const recommendedCount = recommendedPlatforms.filter((p) => !p.skipReason).length;

  const fitScores = Object.fromEntries(
    recommendedPlatforms.map((p) => [p.platform, p.fitScore ?? null])
  );

  const safeIndex = Math.min(activePlatformIndex, Math.max(0, recommendedPlatforms.length - 1));
  const activePlatform = recommendedPlatforms[safeIndex] ?? null;
  const activeKey = activePlatform ? platformKey(activePlatform.platform, safeIndex) : null;

  return (
    <div>
      {/* Summary card */}
      <section className="mb-5 space-y-1.5 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/75 px-5 py-4">
        <p className="text-[10px] uppercase tracking-wider text-[var(--hg-muted)]">{rd("summaryEyebrow")}</p>
        <h2 className="text-base font-medium text-white">{rd("summaryTitle")}</h2>
        <p className="text-sm text-[var(--hg-muted)]">
          {recommendedPlatforms.length > 0
            ? rd("recommendationCount", { count: recommendedCount })
            : rd("noRecommendationsMessage")}
        </p>
      </section>

      {/* Platform content */}
      {recommendedPlatforms.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-black/10 p-4">
          <p className="text-sm text-[var(--hg-muted)]">{t("noRecommendations")}</p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)]"
            onClick={onReload}
          >
            {t("retryButton")}
          </button>
        </div>
      ) : (
        <section>
          <PlatformTabBar
            platforms={recommendedPlatforms.map((p) => p.platform)}
            fitScores={fitScores}
            activeIndex={safeIndex}
            onSelect={setActivePlatformIndex}
          />
          <div className="px-4 pb-5">
            <AnimatePresence mode="wait">
              {activePlatform ? (
                <motion.div
                  key={safeIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {activePlatform.skipReason ? (
                    <PlatformSkipState
                      platform={activePlatform.platform}
                      skipReason={activePlatform.skipReason}
                    />
                  ) : (
                    <PlatformView
                      platform={activePlatform}
                      imageUrl={previewUrl}
                      imageAlt={rd("uploadedImageAlt")}
                      ctaText={ctaText}
                      onCopy={(text) => navigator.clipboard.writeText(text).catch(() => {})}
                      onSaveCaption={(angle, text) => onSaveCaption(activePlatform.platform, angle, text)}
                      onResetCaption={(angle) => onResetCaption(activePlatform.platform, angle)}
                      onRefreshImageUrl={onRefreshImageUrl}
                      feedbackOpen={activeKey ? (feedbackOpen[activeKey] ?? false) : false}
                      feedbackValues={activeKey ? (feedbackValues[activeKey] ?? { impressions: "", engagements: "" }) : { impressions: "", engagements: "" }}
                      feedbackLoading={activeKey ? (feedbackLoading[activeKey] ?? false) : false}
                      feedbackSaved={activeKey ? (feedbackSaved[activeKey] ?? false) : false}
                      onFeedbackToggle={() => activeKey && onFeedbackToggle(activeKey)}
                      onFeedbackChange={(field, value) => activeKey && onFeedbackChange(activeKey, field, value)}
                      onFeedbackBump={(field, delta) => activeKey && onFeedbackBump(activeKey, field, delta)}
                      onFeedbackSubmit={(includeMetrics) => activeKey && onFeedbackSubmit(activeKey, activePlatform.platform, includeMetrics)}
                    />
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Thumbs feedback — subtle, right-aligned, no heading */}
      {result._id ? (
        <div className="mt-2 px-4 pb-2">
          <ThumbsFeedback type="upload_report" referenceId={String(result._id)} />
        </div>
      ) : null}
    </div>
  );
}
