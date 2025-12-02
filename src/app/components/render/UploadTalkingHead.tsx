"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { SadTalkerJobOptions } from "@/app/api/sadtalker/types";

type JobState = "queued" | "running" | "succeeded" | "failed" | "active" | "completed" | "waiting" | null;

type HistoryItem = {
  jobId: string;
  remoteJobId?: string | null;
  videoUrl: string;
  createdAt?: string;
  durationMs?: number;
  options?: SadTalkerJobOptions | null;
};

const HISTORY_USER_ID = "web-client";

const preprocessOptions = [
  { value: "full", label: "Full" },
  { value: "crop", label: "Crop" },
  { value: "resize", label: "Resize" },
  { value: "none", label: "None" },
];

const enhancerOptions = [
  { value: "", label: "None" },
  { value: "gfpgan", label: "GFPGAN" },
  { value: "RestoreFormer", label: "RestoreFormer" },
];

const backgroundEnhancerOptions = [
  { value: "", label: "None" },
  { value: "realesrgan", label: "Real-ESRGAN" },
  { value: "gpen", label: "GPEN" },
];

const resolutionOptions = [
  { value: "512p", label: "512p (High Quality)" },
  { value: "256p", label: "256p (Faster)" },
];

export default function UploadTalkingHead() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [preprocess, setPreprocess] = useState<string>("full");
  const [resolution, setResolution] = useState<string>("512p");
  const [enhancer, setEnhancer] = useState<string>("");
  const [backgroundEnhancer, setBackgroundEnhancer] = useState<string>("");
  const [expressionScale, setExpressionScale] = useState<number>(1);
  const [poseStyle, setPoseStyle] = useState<number>(0);
  const [batchSize, setBatchSize] = useState<number>(2);
  const [stillMode, setStillMode] = useState<boolean>(false);
  const [inputYaw, setInputYaw] = useState<string>("");
  const [inputPitch, setInputPitch] = useState<string>("");
  const [inputRoll, setInputRoll] = useState<string>("");

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobState, setJobState] = useState<JobState>(null);
  const [jobStage, setJobStage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoReadyAt, setVideoReadyAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`/api/sadtalker/history?userId=${encodeURIComponent(HISTORY_USER_ID)}`, {
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
  }, []);

  const canSubmit = useMemo(() => {
    return !!imageFile && !!audioFile && !isSubmitting;
  }, [imageFile, audioFile, isSubmitting]);

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
        setJobState(data.state ?? null);
        setJobStage(data.remoteState ?? null);
        if (typeof data.progress === "number") setProgress(data.progress);
        const isSuccessState = data.state === "succeeded" || data.state === "completed";
        if (isSuccessState && data.result?.videoUrl) {
          setVideoUrl(data.result.videoUrl);
          setVideoReadyAt(new Date().toISOString());
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.state === "failed") {
          setError(data.error?.message || "SadTalker job failed");
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
  }, [jobId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (videoUrl) {
      loadHistory();
    }
  }, [videoUrl, loadHistory]);

  const renderHistory = () => (
    <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">History</p>
          <h3 className="text-lg font-semibold text-gray-50">Recent talking heads</h3>
          <p className="text-xs text-gray-500">Stored per user ID ({HISTORY_USER_ID}).</p>
        </div>
        <button
          type="button"
          onClick={() => loadHistory()}
          className="inline-flex items-center justify-center rounded-full border border-gray-700 px-4 py-1.5 text-xs font-semibold text-gray-200 hover:border-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>
      {historyLoading && <div className="text-sm text-gray-400">Loading your previous renders…</div>}
      {!historyLoading && history.length === 0 && (
        <div className="text-sm text-gray-400">
          No talking head videos saved yet. Generate one above to populate this list.
        </div>
      )}
      {!historyLoading && history.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => {
            const created = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
            const shortId = item.remoteJobId ? `#${item.remoteJobId.slice(-6)}` : `Job ${item.jobId}`;
            return (
              <article
                key={`${item.jobId}-${item.remoteJobId || "local"}`}
                className="rounded-xl border border-gray-800 bg-gray-950/80 p-3 space-y-3"
              >
                <div className="rounded-lg overflow-hidden bg-black aspect-video">
                  <video
                    src={item.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{shortId}</p>
                  <p className="text-sm text-gray-300">{created}</p>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Open
                  </a>
                  <a
                    href={item.videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/sadtalker/history", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: HISTORY_USER_ID, jobId: item.jobId }),
                        });
                        if (!res.ok) return;
                        setHistory((prev) => prev.filter((row) => row.jobId !== item.jobId));
                      } catch {
                        // best-effort delete; ignore errors
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setVideoReadyAt(null);
    setJobState(null);
    setProgress(undefined);
    setJobStage(null);

    if (!imageFile) {
      setError("Please choose a source image (PNG/JPG).");
      return;
    }
    if (!audioFile) {
      setError("Please choose an audio file (MP3/WAV).");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("source_image", imageFile);
      formData.append("driven_audio", audioFile);
      formData.append("preprocess", preprocess);
      formData.append("resolution", resolution);
      formData.append("expression_scale", expressionScale.toString());
      formData.append("pose_style", poseStyle.toString());
      formData.append("batch_size", batchSize.toString());
      formData.append("still", stillMode ? "true" : "false");
      if (enhancer) formData.append("enhancer", enhancer);
      if (backgroundEnhancer) formData.append("background_enhancer", backgroundEnhancer);
      if (inputYaw.trim()) formData.append("input_yaw", inputYaw.trim());
      if (inputPitch.trim()) formData.append("input_pitch", inputPitch.trim());
      if (inputRoll.trim()) formData.append("input_roll", inputRoll.trim());
      formData.append("userId", HISTORY_USER_ID);

      const res = await fetch("/api/sadtalker/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to enqueue SadTalker job");
      }

      setJobId(data.jobId);
      setJobState("queued");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start SadTalker job";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[
          { label: "Generate", value: "create" as const },
          { label: "My videos", value: "history" as const },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              activeTab === tab.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-gray-800/70 text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Source Image (PNG/JPG)</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">Max 10 MB. Use a clear frontal face for best results.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Driven Audio (MP3/WAV)</label>
            <input
              type="file"
              accept="audio/mpeg,audio/wav"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">Max 15 MB. Audio will drive lip sync.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Preprocess</label>
            <select
              value={preprocess}
              onChange={(e) => setPreprocess(e.target.value)}
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {preprocessOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {resolutionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Face Enhancer</label>
            <select
              value={enhancer}
              onChange={(e) => setEnhancer(e.target.value)}
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {enhancerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Background Enhancer</label>
            <select
              value={backgroundEnhancer}
              onChange={(e) => setBackgroundEnhancer(e.target.value)}
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {backgroundEnhancerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Expression Scale</label>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={expressionScale}
              onChange={(e) => setExpressionScale(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">{expressionScale.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Pose Style</label>
              <input
                type="number"
                min={-10}
                max={10}
                value={poseStyle}
                onChange={(e) => setPoseStyle(Number(e.target.value))}
                className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Batch Size</label>
              <input
                type="number"
                min={1}
                max={8}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={stillMode}
                onChange={(e) => setStillMode(e.target.checked)}
                className="h-4 w-4"
              />
              Use still-mode (keeps head movements minimal)
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Input Yaw (comma separated)</label>
            <input
              type="text"
              value={inputYaw}
              onChange={(e) => setInputYaw(e.target.value)}
              placeholder="e.g. -10,0,10"
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Input Pitch (comma separated)</label>
            <input
              type="text"
              value={inputPitch}
              onChange={(e) => setInputPitch(e.target.value)}
              placeholder="e.g. -3,0,3"
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Input Roll (comma separated)</label>
            <input
              type="text"
              value={inputRoll}
              onChange={(e) => setInputRoll(e.target.value)}
              placeholder="e.g. -2,0,2"
              className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full md:w-auto px-6 py-3 rounded-md font-semibold transition ${
            canSubmit ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting…" : "Generate Talking Head"}
        </button>
      </form>

      {jobId && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">Job</div>
          <div className="text-sm text-gray-300 break-all">{jobId}</div>
          <div className="space-y-1 text-sm text-gray-200">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-semibold text-blue-400">{jobState ?? "queued"}</span>
            </div>
            {jobStage && (
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Current step: <span className="text-gray-300">{jobStage}</span>
              </div>
            )}
          </div>
          {typeof progress === "number" && (
            <div>
              <div className="w-full bg-gray-900/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 transition-all"
                  style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-400">{progress.toFixed(0)}% complete</div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {videoUrl && activeTab === "create" && (
        <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-5 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Result ready</p>
              <h3 className="text-lg font-semibold text-gray-50">Talking head generated successfully</h3>
              {videoReadyAt && (
                <p className="text-xs text-gray-400">
                  Ready {new Date(videoReadyAt).toLocaleString(undefined, { hour12: false })}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={videoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1Z" />
                  <path d="M5 18a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
                </svg>
                Download MP4
              </a>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-5 py-2 text-sm font-semibold text-gray-100 hover:border-blue-400 hover:text-blue-300"
              >
                View in new tab
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 overflow-hidden bg-black">
            <video controls src={videoUrl} className="w-full max-h-[480px] object-contain" />
          </div>
        </section>
      )}

      {activeTab === "create" && renderHistory()}
        </>
      )}

      {activeTab === "history" && renderHistory()}
    </div>
  );
}
