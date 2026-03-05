"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Copy, Sparkles } from "lucide-react";

import { useUser } from "@/app/hooks/useUser";
import UpgradeRequiredBanner from "@/app/components/common/UpgradeRequiredBanner";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { createAddonCheckoutSession } from "@/app/utils/api";
import { getRemaining } from "@/app/utils/quota";
import TalkingHeadResultDrawer, {
  type TalkingHeadRecentItem,
} from "@/app/components/dashboard/talking-head/TalkingHeadResultDrawer";

type JobState =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "active"
  | "completed"
  | "waiting"
  | null;

type HistoryItem = {
  jobId: string;
  remoteJobId?: string | null;
  videoUrl: string;
  createdAt?: string;
  durationMs?: number;
  options?: {
    source_image?: string;
    sourceImage?: string;
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

const HISTORY_USER_FALLBACK = "web-client";

const FIXED_OPTIONS = {
  preprocess: "full",
  resolution: "512p",
  enhancer: "gfpgan",
  backgroundEnhancer: "",
  expressionScale: 1,
  poseStyle: 0,
  batchSize: 2,
  still: false,
} as const;

const statusClass: Record<TalkingHeadRecentItem["status"], string> = {
  queued: "bg-white/10 text-white/70 border border-white/15",
  processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
  done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

function toRecentStatus(state: JobState): TalkingHeadRecentItem["status"] {
  if (state === "failed") return "failed";
  if (state === "succeeded" || state === "completed") return "done";
  if (state === "queued" || state === "waiting") return "queued";
  return "processing";
}

export default function UploadTalkingHead() {
  const { user } = useUser({ required: true });
  const historyUserId = user?.id || HISTORY_USER_FALLBACK;
  const { data: planData, refresh: refreshPlan, hasActiveInstance } = usePlanInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const packageInstanceId = planData?.packageInstanceId ?? null;

  const videosLimit =
    typeof planData?.videosLimit === "number"
      ? planData.videosLimit
      : planData?.sadtalkerVideosLimit ?? null;
  const videosUsed =
    typeof planData?.videosUsed === "number"
      ? planData.videosUsed
      : planData?.sadtalkerVideosUsed ?? null;
  const videosAddon =
    typeof planData?.addons?.sadtalkerVideos === "number"
      ? planData.addons.sadtalkerVideos
      : planData?.addonsVideos ?? 0;
  const videosRemaining =
    typeof planData?.videosRemaining === "number"
      ? Math.max(0, planData.videosRemaining)
      : getRemaining(videosLimit, videosAddon, videosUsed);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobState, setJobState] = useState<JobState>(null);
  const [jobStage, setJobStage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoReadyAt, setVideoReadyAt] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [forceUpsell, setForceUpsell] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<TalkingHeadRecentItem | null>(null);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const isOutOfCredits =
    forceUpsell || (typeof videosRemaining === "number" ? videosRemaining <= 0 : false);
  const hasActiveJob =
    jobState === "queued" || jobState === "running" || jobState === "active" || jobState === "waiting";

  const canSubmit = useMemo(() => {
    return !!imageFile && !!audioFile && !isSubmitting && !hasActiveJob;
  }, [imageFile, audioFile, isSubmitting, hasActiveJob]);

  const loadHistory = useCallback(async () => {
    try {
      if (!historyUserId) return;
      setHistoryLoading(true);
      const res = await fetch(`/api/sadtalker/history?userId=${encodeURIComponent(historyUserId)}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`History request failed (${res.status})`);
      }
      const data = await res.json();
      setHistory(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.warn("[sadtalker-ui] history error", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyUserId]);

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
    if (!jobId) return;
    if (pollRef.current) clearInterval(pollRef.current);

    const poll = async () => {
      try {
        const res = await fetch(`/api/sadtalker/status?id=${encodeURIComponent(jobId)}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Status request failed (${res.status})`);
        }
        const data = await res.json();
        const nextState = (data.state ?? null) as JobState;
        setJobState(nextState);
        setJobStage(data.remoteState ?? null);
        if (typeof data.progress === "number") setProgress(data.progress);

        const isSuccessState = nextState === "succeeded" || nextState === "completed";
        if (isSuccessState && data.result?.videoUrl) {
          const nextVideoUrl = data.result.videoUrl;
          setVideoUrl(nextVideoUrl);
          const now = new Date().toISOString();
          setVideoReadyAt(now);
          if (pollRef.current) clearInterval(pollRef.current);
          await loadHistory();
          setSelectedRecent({
            id: jobId,
            title: "Avatar Video",
            createdAt: now,
            status: "done",
            stage: data.remoteState ?? null,
            progress: typeof data.progress === "number" ? data.progress : undefined,
            videoUrl: nextVideoUrl,
            supportId: null,
            thumbnailUrl: null,
          });
          setDrawerOpen(true);
        } else if (nextState === "failed") {
          setError(data.error?.message || "Video generation failed.");
          if (typeof data?.requestId === "string") setErrorRequestId(data.requestId);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch (err) {
        console.warn("[sadtalker-ui] polling error", err);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId, loadHistory]);

  const recentItems = useMemo<TalkingHeadRecentItem[]>(() => {
    const historyItems: TalkingHeadRecentItem[] = history.map((item) => ({
      id: item.remoteJobId || item.jobId,
      title: "Avatar Video",
      createdAt: item.createdAt,
      status: "done",
      videoUrl: item.videoUrl,
      stage: null,
      progress: undefined,
      supportId: null,
      thumbnailUrl:
        item.options?.thumbnailUrl || item.options?.source_image || item.options?.sourceImage || null,
    }));

    if (!jobId) return historyItems;

    const liveItem: TalkingHeadRecentItem = {
      id: jobId,
      title: "Avatar Video",
      createdAt: videoReadyAt || new Date().toISOString(),
      status: toRecentStatus(jobState),
      videoUrl,
      stage: jobStage,
      progress,
      supportId: errorRequestId,
      thumbnailUrl: null,
    };

    const exists = historyItems.some((item) => item.id === liveItem.id);
    return exists ? historyItems : [liveItem, ...historyItems];
  }, [history, jobId, jobState, videoUrl, jobStage, progress, errorRequestId, videoReadyAt]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isOutOfCredits) return;

    setError(null);
    setErrorCode(null);
    setErrorRequestId(null);
    setForceUpsell(false);
    setUpgradeInfo(null);
    setVideoUrl(null);
    setVideoReadyAt(null);
    setJobState(null);
    setProgress(undefined);
    setJobStage(null);

    if (!imageFile) {
      setError("Please choose a face photo (PNG/JPG).");
      return;
    }
    if (!audioFile) {
      setError("Please choose a voice audio file (MP3/WAV).");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("source_image", imageFile);
      formData.append("driven_audio", audioFile);
      formData.append("preprocess", FIXED_OPTIONS.preprocess);
      formData.append("resolution", FIXED_OPTIONS.resolution);
      formData.append("expression_scale", FIXED_OPTIONS.expressionScale.toString());
      formData.append("pose_style", FIXED_OPTIONS.poseStyle.toString());
      formData.append("batch_size", FIXED_OPTIONS.batchSize.toString());
      formData.append("still", FIXED_OPTIONS.still ? "true" : "false");
      if (FIXED_OPTIONS.enhancer) formData.append("enhancer", FIXED_OPTIONS.enhancer);
      if (FIXED_OPTIONS.backgroundEnhancer) {
        formData.append("background_enhancer", FIXED_OPTIONS.backgroundEnhancer);
      }
      formData.append("userId", historyUserId);

      const res = await fetch("/api/sadtalker/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const codeRaw =
          typeof data?.errorCode === "string"
            ? data.errorCode
            : typeof data?.code === "string"
              ? data.code
              : "";
        if (res.status === 403 && data?.errorCode === "SADTALKER_NO_CREDITS") {
          setError("You're out of video credits.");
          setErrorCode("SADTALKER_NO_CREDITS");
          setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
          setForceUpsell(true);
          refreshPlan(true);
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

        throw new Error(data?.error || "Failed to start video generation");
      }

      setJobId(data.jobId);
      setJobState("queued");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start video generation");
      setErrorCode(null);
      setErrorRequestId(null);
      setUpgradeInfo(null);
    } finally {
      setIsSubmitting(false);
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
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {(jobId || isSubmitting) ? (
            <div className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2 text-xs text-[var(--hg-muted)]">
              <div className="flex items-center justify-between gap-2">
                <span>Status: {jobState || (isSubmitting ? "submitting" : "idle")}</span>
                {typeof progress === "number" ? <span>{progress.toFixed(0)}%</span> : null}
              </div>
              {jobStage ? <p className="mt-1">Stage: {jobStage}</p> : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={!canSubmit || isOutOfCredits}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                canSubmit && !isOutOfCredits
                  ? "bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90"
                  : "bg-[var(--hg-surface-2)] text-[var(--hg-muted-2)] cursor-not-allowed"
              }`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isSubmitting ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setAudioFile(null);
                setError(null);
                setErrorCode(null);
                setErrorRequestId(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white"
            >
              Reset
            </button>
          </div>
        </form>

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
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recent</h3>
        </div>

        {historyLoading && recentItems.length === 0 ? (
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="h-48 w-64 shrink-0 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : null}

        {!historyLoading && recentItems.length === 0 ? (
          <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4 text-sm text-[var(--hg-muted)]">
            No videos yet. Generate your first avatar video.
          </div>
        ) : null}

        {recentItems.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {recentItems.map((item) => {
              const createdAt = item.createdAt
                ? new Date(item.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "Just now";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedRecent(item);
                    setDrawerOpen(true);
                  }}
                  className="group w-[240px] shrink-0 snap-start rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-3 text-left transition hover:border-[var(--hg-accent)]/50"
                >
                  <div className="relative h-28 overflow-hidden rounded-xl border border-[var(--hg-border-2)] bg-black/25">
                    {item.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl}
                        alt="Video source preview"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[var(--hg-muted)]">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-white">Avatar Video</p>
                    <p className="text-xs text-[var(--hg-muted)]">{createdAt}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      <TalkingHeadResultDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedRecent} />
    </div>
  );
}
