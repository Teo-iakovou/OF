"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Copy, Sparkles } from "lucide-react";

import { useUser } from "@/app/hooks/useUser";
import UpgradeRequiredBanner from "@/app/components/common/UpgradeRequiredBanner";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import OutOfCreditsModal from "@/app/components/dashboard/OutOfCreditsModal";
import { getRemaining } from "@/app/utils/quota";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
import { PACKAGES_URL } from "@/app/utils/urls";
import TalkingHeadResultDrawer, {
  type TalkingHeadRecentItem,
} from "@/app/components/dashboard/talking-head/TalkingHeadResultDrawer";

type HistoryItem = {
  jobId: string;
  videoUrl: string;
  createdAt?: string;
  options?: {
    thumbnailUrl?: string;
  } | null;
};

type HistoryCacheEntry = {
  ts: number;
  items?: HistoryItem[];
  inFlight?: Promise<HistoryItem[]>;
};

const HISTORY_CACHE_TTL_MS = 5_000;
const talkingHeadHistoryCache = new Map<string, HistoryCacheEntry>();

type UpgradeInfo = {
  code?: string;
  error?: string;
  feature?: string;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
} | null;

function TalkingHeadSkeleton() {
  return (
    <div className="space-y-8">
      <section className="dashboard-mobile-card mx-auto w-full max-w-3xl rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 md:p-6">
        <div className="animate-pulse space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-[var(--hg-surface-2)]" />
              <div className="h-10 w-full rounded-lg bg-[var(--hg-surface-2)]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-[var(--hg-surface-2)]" />
              <div className="h-10 w-full rounded-lg bg-[var(--hg-surface-2)]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded-xl bg-[var(--hg-surface-2)]" />
            <div className="h-10 w-20 rounded-xl bg-[var(--hg-surface-2)]" />
          </div>
        </div>
      </section>

      <section className="dashboard-mobile-container w-full pb-8 pt-1 md:pt-2">
        <div className="animate-pulse border-b border-[var(--hg-border-2)] pb-4">
          <div className="mb-1 h-3 w-16 rounded bg-[var(--hg-surface-2)]" />
          <div className="h-7 w-40 rounded bg-[var(--hg-surface-2)]" />
        </div>
        <div className="dashboard-scroll-row mt-3 flex gap-3 overflow-hidden md:mt-4 md:gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[min(230px,calc(100vw-2rem))] shrink-0 animate-pulse rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 sm:w-[270px]"
            >
              <div className="h-32 w-full rounded-xl bg-[var(--hg-surface-2)] sm:h-36" />
              <div className="mt-3.5 space-y-1.5">
                <div className="h-4 w-32 rounded bg-[var(--hg-surface-2)]" />
                <div className="h-3 w-20 rounded bg-[var(--hg-surface-2)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const statusClass: Record<TalkingHeadRecentItem["status"], string> = {
  queued: "bg-white/10 text-white/70 border border-white/15",
  processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
  done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

export default function UploadTalkingHead() {
  useUser({ required: true });
  const locale = useLocale();
  const t = useTranslations("dashboard.uploadTalkingHead");
  const tOOC = useTranslations("outOfCredits");
  const { data: planData, loading: planLoading, refresh: refreshPlan, hasActiveInstance } = usePlanInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const packageInstanceId = planData?.packageInstanceId ?? null;

  const quotas = resolveQuotaContract(planData, "upload.talkingHead");
  const videosLimit = quotas.videos.effectiveLimit;
  const videosUsed = quotas.videos.used;
  const videosRemaining =
    typeof quotas.videos.remaining === "number"
      ? Math.max(0, quotas.videos.remaining)
      : getRemaining(videosLimit, quotas.videos.addons, videosUsed);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDurationError, setAudioDurationError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [forceUpsell, setForceUpsell] = useState(false);

  const [heygenLoading, setHeygenLoading] = useState(false);
  const [heygenProgress, setHeygenProgress] = useState(0);
  const [heygenError, setHeygenError] = useState<string | null>(null);
  const [heygenVideoUrl, setHeygenVideoUrl] = useState<string | null>(null);
  const [heygenWarning, setHeygenWarning] = useState<{
    creditsToConsume: number;
    durationSeconds: number;
  } | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<TalkingHeadRecentItem | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const isOutOfCredits =
    forceUpsell || (typeof videosRemaining === "number" ? videosRemaining <= 0 : false);

  useEffect(() => {
    if (isOutOfCredits) setShowCreditsModal(true);
  }, [isOutOfCredits]);

  const canGenerate = useMemo(() => {
    return !!imageFile && !!audioFile && !heygenLoading && !audioDurationError;
  }, [imageFile, audioFile, heygenLoading, audioDurationError]);

  function handleAudioChange(file: File | null) {
    setAudioDurationError(null);
    setAudioFile(file);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);
      if (audio.duration > 60) {
        setAudioDurationError(t("errors.audioDurationExceeded"));
        setAudioFile(null);
      }
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
    });
  }

  const loadHistory = useCallback(async (force = false) => {
    if (!packageInstanceId) {
      setHistory([]);
      setHistoryLoading(false);
      return;
    }

    const cacheKey = `sadtalker:${packageInstanceId}`;
    const cached = talkingHeadHistoryCache.get(cacheKey);
    const now = Date.now();

    if (!force && cached?.items && now - cached.ts < HISTORY_CACHE_TTL_MS) {
      setHistory(cached.items);
      setHistoryLoading(false);
      return;
    }

    const request =
      !force && cached?.inFlight
        ? cached.inFlight
        : (async () => {
            const res = await fetch(`/api/sadtalker/history`, {
              method: "GET",
              cache: "no-store",
            });
            if (!res.ok) {
              throw new Error(`History request failed (${res.status})`);
            }
            const data = await res.json();
            return Array.isArray(data.items) ? (data.items as HistoryItem[]) : [];
          })();

    talkingHeadHistoryCache.set(cacheKey, {
      ts: cached?.ts ?? 0,
      items: cached?.items,
      inFlight: request,
    });

    try {
      if (!cached?.items) setHistoryLoading(true);
      const nextItems = await request;
      talkingHeadHistoryCache.set(cacheKey, {
        ts: Date.now(),
        items: nextItems,
      });
      setHistory(nextItems);
    } catch (err) {
      console.warn("[heygen-ui] history error", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [packageInstanceId]);

  useEffect(() => {
    const status = searchParams.get("status");
    const kind = searchParams.get("kind");
    if (status === "success" && kind === "addon") {
      refreshPlan(true);
      router.replace(pathname);
    }
  }, [searchParams, refreshPlan, router, pathname]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!heygenLoading) return;
    const interval = setInterval(() => {
      setHeygenProgress((prev) => {
        if (prev < 15) return Math.min(prev + 2.3, 15);
        if (prev < 30) return Math.min(prev + 4.5, 30);
        if (prev < 85) return Math.min(prev + 0.28, 85);
        return prev;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [heygenLoading]);

  const recentItems = useMemo<TalkingHeadRecentItem[]>(() => {
    return history.map((item) => ({
      id: item.jobId,
      title: t("videoItemTitle"),
      createdAt: item.createdAt,
      status: "done" as const,
      videoUrl: item.videoUrl,
      stage: null,
      progress: undefined,
      supportId: null,
      thumbnailUrl: item.options?.thumbnailUrl || null,
    }));
  }, [history, t]);

  async function handleGenerate(confirmed: boolean) {
    if (!imageFile) {
      setHeygenError(t("errors.facePhotoRequired"));
      return;
    }
    if (!audioFile) {
      setHeygenError(t("errors.audioRequired"));
      return;
    }

    setHeygenError(null);
    setError(null);
    setErrorCode(null);
    setErrorRequestId(null);
    setHeygenProgress(0);
    setHeygenLoading(true);
    if (!confirmed) {
      setHeygenWarning(null);
      setHeygenVideoUrl(null);
    }

    try {
      const formData = new FormData();
      formData.append("source_image", imageFile);
      formData.append("driven_audio", audioFile);
      formData.append("confirmed", confirmed ? "true" : "false");

      const res = await fetch("/api/heygen/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.warning) {
        setHeygenWarning({
          creditsToConsume: data.creditsToConsume,
          durationSeconds: data.durationSeconds,
        });
        return;
      }

      if (!res.ok) {
        const codeRaw =
          typeof data?.errorCode === "string"
            ? data.errorCode
            : typeof data?.code === "string"
              ? data.code
              : "";

        if (codeRaw === "VIDEO_DURATION_EXCEEDED") {
          setHeygenError(t("errors.audioDurationExceeded"));
          return;
        }

        if (
          codeRaw === "ACTIVE_INSTANCE_REQUIRED" ||
          codeRaw === "FACE_ENROLLMENT_REQUIRED" ||
          codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" ||
          codeRaw === "MULTIPLE_FACES_NOT_ALLOWED" ||
          codeRaw === "FACE_MISMATCH"
        ) {
          const mappedMessage =
            codeRaw === "ACTIVE_INSTANCE_REQUIRED"
              ? t("errors.noActiveInstance")
              : codeRaw === "FACE_ENROLLMENT_REQUIRED"
              ? t("errors.faceEnrollmentRequired")
              : codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT"
                ? t("errors.noFaceDetected")
                : codeRaw === "MULTIPLE_FACES_NOT_ALLOWED"
                  ? t("errors.multipleFaces")
                  : t("errors.faceVerificationFailed");
          setError(mappedMessage);
          setErrorCode(codeRaw);
          setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
          return;
        }

        if (data?.code === "UPGRADE_REQUIRED") {
          setError(data?.error || t("errors.upgradeRequired"));
          setErrorCode(typeof data?.code === "string" ? data.code : null);
          setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
          setUpgradeInfo({
            code: data.code,
            error: data?.error,
            feature: data?.feature,
            plan: data?.plan ?? null,
            remaining: typeof data?.remaining === "number" ? data.remaining : null,
            limit: typeof data?.limit === "number" ? data.limit : null,
          });
          return;
        }

        setHeygenError(data?.error || t("errors.videoGenerationFailed"));
        return;
      }

      setHeygenVideoUrl(data.videoUrl ?? null);
      setHeygenWarning(null);
      setHeygenProgress(100);
      await loadHistory(true);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err: unknown) {
      setHeygenError(err instanceof Error ? err.message : t("errors.videoGenerationFailed"));
    } finally {
      setHeygenLoading(false);
    }
  }

  if (planLoading || planData === null) return <TalkingHeadSkeleton />;
  if (!hasActiveInstance) return null;

  return (
    <div className="space-y-8">
      <OutOfCreditsModal
        type="videos"
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />

      {isOutOfCredits ? (
        <section className="dashboard-mobile-card mx-auto w-full max-w-3xl rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 text-white">
          <h2 className="text-xl font-semibold">{t("heading")}</h2>
          <div className="mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted">
            {tOOC("videos.inlineMessage")}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowCreditsModal(true)}
              className="inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90"
            >
              {tOOC("buyCredits")}
            </button>
            <Link
              href={PACKAGES_URL}
              className="inline-flex rounded-xl border border-[var(--hg-border)] px-4 py-3 text-sm font-medium text-white hover:border-[#50C0F0] hover:text-[#50C0F0]"
            >
              {tOOC("manageBilling")}
            </Link>
          </div>
        </section>
      ) : (
      <section className="dashboard-mobile-card mx-auto w-full max-w-3xl rounded-2xl hg-surface p-5 md:p-6 text-white">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div data-tour="avt-image" className="space-y-2">
              <label className="block text-sm hg-muted">{t("facePhotoLabel")}</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="dashboard-native-file block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
              />
            </div>
            <div data-tour="avt-audio" className="space-y-2">
              <label className="block text-sm hg-muted">{t("audioLabel")}</label>
              <input
                type="file"
                accept="audio/mpeg,audio/wav"
                onChange={(e) => handleAudioChange(e.target.files?.[0] ?? null)}
                className="dashboard-native-file block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
              />
              <p className="text-xs text-[var(--hg-muted-2)]">{t("audioMaxDurationHint")}</p>
              {audioDurationError ? (
                <p className="text-xs text-rose-300">{audioDurationError}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              data-tour="avt-generate"
              type="button"
              disabled={!canGenerate || isOutOfCredits}
              onClick={() => void handleGenerate(false)}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                canGenerate && !isOutOfCredits
                  ? "bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90"
                  : "bg-[var(--hg-surface-2)] text-[var(--hg-muted-2)] cursor-not-allowed"
              }`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {heygenLoading ? t("generatingButton") : t("generateButton")}
            </button>
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setAudioFile(null);
                setAudioDurationError(null);
                setError(null);
                setErrorCode(null);
                setErrorRequestId(null);
                setHeygenError(null);
                setHeygenVideoUrl(null);
                setHeygenWarning(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white"
            >
              {t("resetButton")}
            </button>
          </div>

          {heygenLoading ? (
            <div className="mt-3">
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${heygenProgress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--hg-muted)]">
                {heygenProgress < 15
                  ? t("progress.uploading")
                  : heygenProgress < 30
                  ? t("progress.verifying")
                  : heygenProgress < 85
                  ? t("progress.generating")
                  : t("progress.almostDone")}
              </p>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p>{error}</p>
            {errorRequestId ? (
              <div className="flex items-center gap-2 text-xs">
                <span>{t("supportIdLabel", { id: errorRequestId })}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(errorRequestId)}
                  className="inline-flex items-center gap-1 rounded border border-rose-200/40 px-2 py-1 text-[11px] hover:border-rose-100"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {t("copyButton")}
                </button>
              </div>
            ) : null}
            {errorCode === "FACE_ENROLLMENT_REQUIRED" ? (
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("enroll", "1");
                  const q = next.toString();
                  router.push(q ? `${pathname}?${q}` : pathname);
                }}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--hg-accent)] px-3 text-xs font-semibold text-[#04131d] hover:opacity-90"
              >
                {t("errorCtas.enrollFace")}
              </button>
            ) : null}
            {errorCode === "ACTIVE_INSTANCE_REQUIRED" ? (
              <button
                type="button"
                onClick={() => {
                  try {
                    window.dispatchEvent(new Event("dashboard:open-packages"));
                  } catch {}
                  router.push("/#packages");
                }}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--hg-accent)] px-3 text-xs font-semibold text-[#04131d] hover:opacity-90"
              >
                {t("errorCtas.viewPackages")}
              </button>
            ) : null}
            {upgradeInfo ? (
              <UpgradeRequiredBanner
                code={upgradeInfo.code}
                error={upgradeInfo.error}
                feature={upgradeInfo.feature}
                plan={upgradeInfo.plan}
                remaining={upgradeInfo.remaining}
                limit={upgradeInfo.limit}
              />
            ) : null}
          </div>
        ) : null}

        {/* ── HeyGen warning ──────────────────────────────────────────────── */}
        {heygenWarning ? (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100 space-y-3">
            <p className="font-semibold">{t("creditWarning.heading")}</p>
            <p>
              {t("creditWarning.body", { seconds: heygenWarning.durationSeconds, count: heygenWarning.creditsToConsume })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleGenerate(true)}
                disabled={heygenLoading}
                className="inline-flex h-9 items-center rounded-lg bg-amber-400 px-3 text-xs font-semibold text-[#07131d] hover:opacity-90 disabled:opacity-50"
              >
                {t("creditWarning.confirmButton", { count: heygenWarning.creditsToConsume })}
              </button>
              <button
                type="button"
                onClick={() => setHeygenWarning(null)}
                className="inline-flex h-9 items-center rounded-lg border border-amber-400/40 px-3 text-xs text-amber-200 hover:border-amber-300"
              >
                {t("creditWarning.cancelButton")}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Generation error ─────────────────────────────────────────────── */}
        {heygenError ? (
          <div className="mt-4 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p className="mt-1">{heygenError}</p>
          </div>
        ) : null}

        {/* ── Video result ─────────────────────────────────────────────────── */}
        {heygenVideoUrl ? (
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
              <Sparkles className="h-4 w-4" />
              {t("videoReadyIndicator")}
            </p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={heygenVideoUrl}
              controls
              playsInline
              className="w-full rounded-xl border border-[var(--hg-border)] bg-black"
            />
          </div>
        ) : null}
      </section>
      )}

      {!isOutOfCredits && <section data-tour="avt-history" className="dashboard-mobile-container w-full pb-8 pt-1 md:pt-2">
        <div className="flex items-baseline justify-between border-b border-[var(--hg-border-2)] pb-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">{t("results.eyebrow")}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white/95 md:text-3xl">{t("results.heading")}</h2>
          </div>
        </div>

        {historyLoading && recentItems.length === 0 ? (
          <div className="dashboard-scroll-row mt-3 flex gap-3 overflow-x-auto pb-2 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`recent-video-skeleton-${idx}`}
                className="w-[min(230px,calc(100vw-2rem))] shrink-0 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 sm:w-[270px]"
              >
                <div className="h-32 w-full rounded-lg bg-[var(--hg-surface-2)]" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-40 rounded bg-[rgba(255,255,255,0.08)]" />
                  <div className="h-3 w-24 rounded bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
            ))}
            <div className="w-4 shrink-0" aria-hidden />
          </div>
        ) : null}

        {!historyLoading && recentItems.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5">
            <h3 className="text-base font-semibold text-white">{t("results.emptyHeading")}</h3>
            <p className="mt-1 text-sm hg-muted">{t("results.emptyBody")}</p>
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
              {t("results.emptyButton")}
            </button>
          </div>
        ) : null}

        {recentItems.length > 0 ? (
          <div className="dashboard-scroll-row mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
            {recentItems.map((item) => {
              const createdAt = item.createdAt
                ? new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                    .format(new Date(item.createdAt))
                    .replace(",", " •")
                : "—";

              return (
                <div key={item.id} className="w-[min(230px,calc(100vw-2rem))] shrink-0 snap-start sm:w-[270px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecent(item);
                      setDrawerOpen(true);
                    }}
                    className="group w-full rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 text-left shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--hg-accent)]/28 hover:shadow-[0_16px_34px_rgba(0,0,0,0.22)] motion-reduce:transition-none"
                  >
                    <div className="relative h-32 w-full overflow-hidden rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] sm:h-36">
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt={t("videoSourceAlt")}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--hg-muted-2)] text-sm">
                          {t("thumbnailNoPreview")}
                        </div>
                      )}
                    </div>
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] font-semibold tracking-tight text-white">{t("videoItemTitle")}</p>
                        <span
                          className={`inline-flex items-center rounded-full border border-[var(--hg-border)] px-2 py-0.5 text-[11px] ${statusClass[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--hg-muted)]">{createdAt}</p>
                    </div>
                  </button>
                </div>
              );
            })}
            <div className="w-4 shrink-0" aria-hidden />
          </div>
        ) : null}
      </section>}

      <TalkingHeadResultDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedRecent} />
    </div>
  );
}
