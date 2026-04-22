"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Copy, Sparkles } from "lucide-react";

import { useUser } from "@/app/hooks/useUser";
import UpgradeRequiredBanner from "@/app/components/common/UpgradeRequiredBanner";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { createAddonCheckoutSession } from "@/app/utils/api";
import { getRemaining } from "@/app/utils/quota";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
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

type UpgradeInfo = {
  code?: string;
  error?: string;
  feature?: string;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
} | null;

const statusClass: Record<TalkingHeadRecentItem["status"], string> = {
  queued: "bg-white/10 text-white/70 border border-white/15",
  processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
  done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

export default function UploadTalkingHead() {
  useUser({ required: true });
  const locale = useLocale();
  const { data: planData, refresh: refreshPlan, hasActiveInstance } = usePlanInfo();
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

  const isOutOfCredits =
    forceUpsell || (typeof videosRemaining === "number" ? videosRemaining <= 0 : false);

  const canGenerate = useMemo(() => {
    return !!imageFile && !!audioFile && !heygenLoading;
  }, [imageFile, audioFile, heygenLoading]);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`/api/sadtalker/history`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`History request failed (${res.status})`);
      }
      const data = await res.json();
      setHistory(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.warn("[heygen-ui] history error", err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

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
      title: "Avatar Video",
      createdAt: item.createdAt,
      status: "done" as const,
      videoUrl: item.videoUrl,
      stage: null,
      progress: undefined,
      supportId: null,
      thumbnailUrl: item.options?.thumbnailUrl || null,
    }));
  }, [history]);

  async function handleGenerate(confirmed: boolean) {
    if (!imageFile) {
      setHeygenError("Please choose a face photo (PNG/JPG).");
      return;
    }
    if (!audioFile) {
      setHeygenError("Please choose a voice audio file (MP3/WAV).");
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

        if (
          codeRaw === "ACTIVE_INSTANCE_REQUIRED" ||
          codeRaw === "FACE_ENROLLMENT_REQUIRED" ||
          codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" ||
          codeRaw === "MULTIPLE_FACES_NOT_ALLOWED" ||
          codeRaw === "FACE_MISMATCH"
        ) {
          const mappedMessage =
            codeRaw === "ACTIVE_INSTANCE_REQUIRED"
              ? "No active package instance. Please select or purchase a package to continue."
              : codeRaw === "FACE_ENROLLMENT_REQUIRED"
              ? "Please enroll your profile face to continue."
              : codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT"
                ? "No face detected. Upload a clear photo with one visible face."
                : codeRaw === "MULTIPLE_FACES_NOT_ALLOWED"
                  ? "Multiple faces detected. Upload an image with only one face."
                  : "Face verification failed. This photo does not match your enrolled face.";
          setError(mappedMessage);
          setErrorCode(codeRaw);
          setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
          return;
        }

        if (data?.code === "UPGRADE_REQUIRED") {
          setError(data?.error || "Upgrade required");
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

        setHeygenError(data?.error || "Video generation failed.");
        return;
      }

      setHeygenVideoUrl(data.videoUrl ?? null);
      setHeygenWarning(null);
      setHeygenProgress(100);
      await loadHistory();
      await new Promise((r) => setTimeout(r, 600));
    } catch (err: unknown) {
      setHeygenError(err instanceof Error ? err.message : "Video generation failed.");
    } finally {
      setHeygenLoading(false);
    }
  }

  if (!hasActiveInstance) return null;

  return (
    <div className="space-y-8 pb-20">
      {isOutOfCredits ? (
        <section className="rounded-2xl hg-surface p-5 text-white space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">You’re out of video credits</h3>
            <p className="text-sm hg-muted">Buy more to continue generating videos.</p>
          </div>
          {error === "You're out of video credits." ? (
            <div className="rounded-md hg-surface-soft px-3 py-2 text-xs hg-muted">
              {error}
              {errorRequestId ? <div className="mt-1">Support ID: {errorRequestId}</div> : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Buy 5", pack: "pack_5" },
              { label: "Buy 15", pack: "pack_15" },
              { label: "Buy 30", pack: "pack_30", badge: "Best value" },
            ].map((pack) => (
              <button
                key={pack.pack}
                type="button"
                onClick={async () => {
                  if (!packageInstanceId) return;
                  try {
                    const res = await createAddonCheckoutSession({
                      addonType: "sadtalkerVideos",
                      addonPack: pack.pack,
                      packageInstanceId,
                      locale,
                    });
                    if (res?.url) window.location.href = res.url;
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Failed to start checkout";
                    setError(message);
                  }
                }}
                disabled={!packageInstanceId}
                className="rounded-full border border-[var(--hg-border)] px-4 py-2 text-xs font-semibold hg-muted hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:opacity-50"
              >
                {pack.label}
                {pack.badge ? (
                  <span className="ml-2 rounded-full border border-[var(--hg-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide hg-muted-2">
                    {pack.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-3xl rounded-2xl hg-surface p-5 md:p-6 text-white">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm hg-muted">Face photo (PNG/JPG)</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm hg-muted">Driven audio (MP3/WAV)</label>
              <input
                type="file"
                accept="audio/mpeg,audio/wav"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
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
              {heygenLoading ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setAudioFile(null);
                setError(null);
                setErrorCode(null);
                setErrorRequestId(null);
                setHeygenError(null);
                setHeygenVideoUrl(null);
                setHeygenWarning(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white"
            >
              Reset
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
                  ? "Uploading files..."
                  : heygenProgress < 30
                  ? "Verifying identity..."
                  : heygenProgress < 85
                  ? "Generating video..."
                  : "Almost done..."}
              </p>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100">
            <p>{error}</p>
            {errorRequestId ? (
              <div className="flex items-center gap-2 text-xs">
                <span>Support ID: {errorRequestId}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(errorRequestId)}
                  className="inline-flex items-center gap-1 rounded border border-rose-200/40 px-2 py-1 text-[11px] hover:border-rose-100"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
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
                Enroll face
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
                View packages
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
            <p className="font-semibold">Credit confirmation required</p>
            <p>
              This audio is <strong>{heygenWarning.durationSeconds}s</strong> long and will use{" "}
              <strong>{heygenWarning.creditsToConsume} video credit{heygenWarning.creditsToConsume !== 1 ? "s" : ""}</strong>. Continue?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleGenerate(true)}
                disabled={heygenLoading}
                className="inline-flex h-9 items-center rounded-lg bg-amber-400 px-3 text-xs font-semibold text-[#07131d] hover:opacity-90 disabled:opacity-50"
              >
                Confirm (use {heygenWarning.creditsToConsume} credit{heygenWarning.creditsToConsume !== 1 ? "s" : ""})
              </button>
              <button
                type="button"
                onClick={() => setHeygenWarning(null)}
                className="inline-flex h-9 items-center rounded-lg border border-amber-400/40 px-3 text-xs text-amber-200 hover:border-amber-300"
              >
                Cancel
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
              Video ready ✓
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

      <section className="w-full pb-8 pt-1 md:pt-2">
        <div className="flex items-baseline justify-between border-b border-[var(--hg-border-2)] pb-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">Generated Results</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white/95 md:text-3xl">Recents</h2>
          </div>
        </div>

        {historyLoading && recentItems.length === 0 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`recent-video-skeleton-${idx}`}
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
        ) : null}

        {!historyLoading && recentItems.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5">
            <h3 className="text-base font-semibold text-white">Create your first avatar video</h3>
            <p className="mt-1 text-sm hg-muted">Upload a face photo and audio to generate a video.</p>
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
              Start generating
            </button>
          </div>
        ) : null}

        {recentItems.length > 0 ? (
          <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-5 md:pr-6 md:scroll-px-6">
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
                <div key={item.id} className="w-[230px] shrink-0 snap-start sm:w-[270px]">
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
                          alt="Video source preview"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--hg-muted-2)] text-sm">
                          No preview
                        </div>
                      )}
                    </div>
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] font-semibold tracking-tight text-white">Avatar Video</p>
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
          </div>
        ) : null}
      </section>

      <TalkingHeadResultDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedRecent} />
    </div>
  );
}
