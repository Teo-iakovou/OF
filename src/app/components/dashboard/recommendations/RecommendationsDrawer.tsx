"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, RotateCw, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import type { CaptionVariant, ResultDoc } from "@/app/types/analysis";
import {
  getUserResultById,
  getUserResultImageUrl,
  postRecommendationFeedback,
  regenerateAnalysisById,
  updateAnalysisById,
} from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { RecommendationsView } from "./RecommendationsView";
import { usePlanInfo } from "@/app/dashboard/PlanContext";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultId: string | null;
  initialData?: ResultDoc | null;
};

type FeedbackValues = { impressions: string; engagements: string };
type RequestError = Error & { requestId?: string };

const normalizePlatform = (value: string) => {
  const v = value.trim().toLowerCase();
  if (v === "instagram") return "Instagram";
  if (v === "tiktok" || v === "tik tok") return "TikTok";
  if (v === "twitter" || v === "x") return "Twitter";
  if (v === "reddit") return "Reddit";
  return value.trim();
};

async function copyText(value: string) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch {}
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.cssText = "position:fixed;top:-1000px;left:-1000px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try { document.execCommand("copy"); } finally { document.body.removeChild(textarea); }
}

export default function RecommendationsDrawer({ open, onOpenChange, resultId, initialData }: Props) {
  const t = useTranslations("dashboard.reportDrawer");
  const locale = useLocale();

  const { data: planData, refresh: refreshPlan } = usePlanInfo();

  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [result, setResult] = useState<ResultDoc | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [feedbackOpen, setFeedbackOpen] = useState<Record<string, boolean>>({});
  const [feedbackValues, setFeedbackValues] = useState<Record<string, FeedbackValues>>({});
  const [feedbackLoading, setFeedbackLoadingState] = useState<Record<string, boolean>>({});
  const [feedbackSaved, setFeedbackSaved] = useState<Record<string, boolean>>({});

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Fetch result
  useEffect(() => {
    if (!open || !resultId) return;
    if (result?._id === resultId && reloadToken === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRequestId(null);
    setFeedbackOpen({});
    setFeedbackValues({});
    setFeedbackLoadingState({});
    setFeedbackSaved({});
    setPreviewUrl(null);

    getUserResultById({ id: resultId })
      .then((data) => { if (!cancelled) setResult(data); })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err as RequestError;
        setError(e?.message || "Failed to load report.");
        setRequestId(typeof e?.requestId === "string" ? e.requestId : null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [open, reloadToken, result?._id, resultId]);

  // Fetch preview image — reloadToken ensures re-fetch after regenerate
  useEffect(() => {
    if (!open || !resultId) return;
    let cancelled = false;
    getUserResultImageUrl({ id: resultId })
      .then((payload) => { if (!cancelled) setPreviewUrl(payload.url); })
      .catch(() => { if (!cancelled) setPreviewUrl(null); });
    return () => { cancelled = true; };
  }, [open, resultId, reloadToken]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Refresh signed image URL (called by PlatformPreview on img error)
  const handleRefreshImageUrl = async (): Promise<string | null> => {
    if (!resultId) return null;
    try {
      const payload = await getUserResultImageUrl({ id: resultId });
      setPreviewUrl(payload.url);
      return payload.url;
    } catch {
      return null;
    }
  };

  const platformCount = (result?.promotion?.recommendedPlatforms ?? []).length;

  // Handlers
  const executeRegenerate = async () => {
    if (regenerating || !result?._id) return;
    setRegenerating(true);
    try {
      await regenerateAnalysisById(String(result._id), { locale });
      toast(t("toasts.regenerateSuccess"));
      refreshPlan();
      setReloadToken((prev) => prev + 1);
    } catch (err: unknown) {
      const e = err as { code?: string; errorCode?: string; status?: number };
      const code = e?.errorCode || e?.code;
      if (code === "UPGRADE_REQUIRED" || e?.status === 403 || e?.status === 402) {
        toast.error(t("toasts.regenerateQuotaExhausted"));
      } else {
        toast.error(t("toasts.regenerateError"));
      }
    } finally {
      setRegenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (regenerating || !result?._id) return;
    const remaining = planData?.uploadsRemaining;
    const body =
      typeof remaining === "number"
        ? t("regenerateToastBody", { n: remaining })
        : t("regenerateToastBodyNoCount");
    toast.custom(
      (toastId) => (
        <div className="w-[320px] rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4 shadow-xl">
          <p className="text-sm font-medium text-[var(--hg-text)]">
            {t("regenerateToastTitle")}
          </p>
          <p className="mt-1 text-xs text-[var(--hg-muted)]">{body}</p>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              className="rounded-lg border border-[var(--hg-border)] px-3 py-1.5 text-xs text-[var(--hg-muted)] transition hover:bg-[var(--hg-surface)] hover:text-[var(--hg-text)]"
              onClick={() => toast.dismiss(toastId)}
            >
              {t("regenerateCancel")}
            </button>
            <button
              className="rounded-lg bg-[var(--hg-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
              onClick={() => {
                toast.dismiss(toastId);
                void executeRegenerate();
              }}
            >
              {t("regenerateConfirm")}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleSaveCaption = async (platformName: string, angle: string, newText: string) => {
    if (!result) return;
    const updatedPromotion = JSON.parse(JSON.stringify(result.promotion)) as typeof result.promotion;
    const platformIdx = (updatedPromotion.recommendedPlatforms as { platform: string; captions?: CaptionVariant[] }[])
      .findIndex((p) => p.platform === platformName);
    if (platformIdx < 0) return;
    const captions: CaptionVariant[] = updatedPromotion.recommendedPlatforms[platformIdx].captions || [];
    const variantIdx = captions.findIndex((v) => v.angle === angle);
    if (variantIdx >= 0) {
      if (!captions[variantIdx].originalText) captions[variantIdx].originalText = captions[variantIdx].text;
      captions[variantIdx].text = newText;
    }
    try {
      await updateAnalysisById(String(result._id), { promotion: updatedPromotion });
    } catch (err) {
      toast.error(t("toasts.captionError"));
      throw err;
    }
    toast(t("toasts.captionSaved"));
    setResult((prev) => prev ? { ...prev, promotion: updatedPromotion } : prev);
  };

  const handleResetCaption = async (platformName: string, angle: string) => {
    if (!result) return;
    const updatedPromotion = JSON.parse(JSON.stringify(result.promotion)) as typeof result.promotion;
    const platformIdx = (updatedPromotion.recommendedPlatforms as { platform: string; captions?: CaptionVariant[] }[])
      .findIndex((p) => p.platform === platformName);
    if (platformIdx < 0) return;
    const captions: CaptionVariant[] = updatedPromotion.recommendedPlatforms[platformIdx].captions || [];
    const variantIdx = captions.findIndex((v) => v.angle === angle);
    if (variantIdx >= 0 && captions[variantIdx].originalText) {
      captions[variantIdx].text = captions[variantIdx].originalText!;
      captions[variantIdx].originalText = null;
    }
    try {
      await updateAnalysisById(String(result._id), { promotion: updatedPromotion });
    } catch (err) {
      toast.error(t("toasts.captionError"));
      throw err;
    }
    toast(t("toasts.captionReset"));
    setResult((prev) => prev ? { ...prev, promotion: updatedPromotion } : prev);
  };

  const handleFeedbackToggle = (key: string) =>
    setFeedbackOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFeedbackChange = (key: string, field: "impressions" | "engagements", value: string) =>
    setFeedbackValues((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { impressions: "", engagements: "" }), [field]: value },
    }));

  const handleFeedbackBump = (key: string, field: "impressions" | "engagements", delta: number) => {
    const current = feedbackValues[key] ?? { impressions: "", engagements: "" };
    const currentVal = current[field].trim() === "" ? 0 : Math.max(0, Number(current[field]) || 0);
    handleFeedbackChange(key, field, String(Math.max(0, currentVal + delta)));
  };

  const handleFeedbackSubmit = (key: string, platformName: string, includeMetrics: boolean) => {
    if (!result?._id) return;
    const values = feedbackValues[key] ?? { impressions: "", engagements: "" };
    const parseVal = (v: string) => {
      if (v.trim() === "") return undefined;
      return Math.max(0, Number(v) || 0);
    };
    const parsedImpressions = parseVal(values.impressions);
    const parsedEngagements = parseVal(values.engagements);
    const platform = result.promotion?.recommendedPlatforms?.find((p) => p.platform === platformName);

    setFeedbackLoadingState((prev) => ({ ...prev, [key]: true }));
    void postRecommendationFeedback({
      resultId: result._id,
      platform: normalizePlatform(platformName),
      variantIds: {
        platformMixId: result?.promotion?.selectedIds?.platformMixId ?? null,
        hashtagPackId: platform?.selectedIds?.hashtagPackId ?? null,
        timePackId: platform?.selectedIds?.timePackId ?? null,
        captionStyleId: platform?.selectedIds?.captionStyleId ?? null,
        ctaId: platform?.selectedIds?.ctaId || result?.promotion?.selectedIds?.ctaId || null,
      },
      ...(includeMetrics && typeof parsedImpressions === "number" ? { impressions: parsedImpressions } : {}),
      ...(includeMetrics && typeof parsedEngagements === "number" ? { engagement: parsedEngagements } : {}),
    })
      .then(() => {
        setFeedbackSaved((prev) => ({ ...prev, [key]: true }));
        setFeedbackOpen((prev) => ({ ...prev, [key]: false }));
        toast.success(t("toasts.feedbackSaved"));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : t("toasts.feedbackError");
        const reqId = typeof (err as { requestId?: unknown })?.requestId === "string"
          ? ((err as { requestId?: string }).requestId as string)
          : "";
        if (reqId) {
          toast.error(message, {
            action: { label: "Copy requestId", onClick: () => { void copyText(reqId); } },
            description: `Request ID: ${reqId}`,
          });
        } else {
          toast.error(message);
        }
      })
      .finally(() => {
        setFeedbackLoadingState((prev) => ({ ...prev, [key]: false }));
      });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="rec-modal-root"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 cursor-default"
            style={{
              background: "rgba(10,10,11,0.55)",
              WebkitBackdropFilter: "blur(8px)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => onOpenChange(false)}
          />

          {/* Floating modal */}
          <motion.div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-none border border-[var(--hg-border)] bg-[var(--hg-surface)] sm:inset-[2.5%] sm:rounded-[18px]"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.06)" }}
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 6, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center gap-3 border-b border-[var(--hg-border)] px-4 py-3 sm:px-5 sm:py-4"
              style={{ background: "color-mix(in srgb, var(--hg-surface-2) 60%, transparent)" }}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--hg-accent)]/15">
                <Sparkles className="h-3.5 w-3.5 text-[var(--hg-accent)]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium tracking-[-0.01em] text-[var(--hg-text)]">
                  {t("drawerTitle")}
                </p>
                <p className="text-[11px] text-[var(--hg-muted)]">
                  {result
                    ? t("platformsAnalyzedSubtitle", { count: platformCount })
                    : "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2.5 py-1.5 text-[13px] text-[var(--hg-muted)] transition disabled:cursor-wait disabled:opacity-50 hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)]"
                  onClick={() => handleRegenerate()}
                  disabled={regenerating || !result?._id}
                  title={t("regenerateTooltip")}
                >
                  {regenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <RotateCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                  <span className="hidden sm:inline">
                    {regenerating ? t("regenerating") : t("regenerateButton")}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={t("closeButtonLabel")}
                  className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--hg-muted)] transition-colors duration-150 hover:bg-[var(--hg-surface)] hover:text-white"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="modal-scroll flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              {loading ? (
                <div className="space-y-4 pt-1">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                  <p>{error}</p>
                  {requestId ? (
                    <p className="mt-2 text-xs text-rose-200/80">Request ID: {requestId}</p>
                  ) : null}
                </div>
              ) : result ? (
                <RecommendationsView
                  result={result}
                  previewUrl={previewUrl}
                  onRefreshImageUrl={handleRefreshImageUrl}
                  onSaveCaption={handleSaveCaption}
                  onResetCaption={handleResetCaption}
                  onReload={() => setReloadToken((prev) => prev + 1)}
                  feedbackOpen={feedbackOpen}
                  feedbackValues={feedbackValues}
                  feedbackLoading={feedbackLoading}
                  feedbackSaved={feedbackSaved}
                  onFeedbackToggle={handleFeedbackToggle}
                  onFeedbackChange={handleFeedbackChange}
                  onFeedbackBump={handleFeedbackBump}
                  onFeedbackSubmit={handleFeedbackSubmit}
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
