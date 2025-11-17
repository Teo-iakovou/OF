"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type JobState = "queued" | "running" | "succeeded" | "failed" | "active" | "completed" | "waiting" | null;

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
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

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
        if (typeof data.progress === "number") setProgress(data.progress);
        if (data.state === "succeeded" && data.result?.videoUrl) {
          setVideoUrl(data.result.videoUrl);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setJobState(null);
    setProgress(undefined);

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
    } catch (err: any) {
      setError(err?.message || "Failed to start SadTalker job");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
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
          <div className="flex items-center justify-between text-sm text-gray-200">
            <span>Status</span>
            <span className="font-semibold text-blue-400">{jobState ?? "queued"}</span>
          </div>
          {typeof progress === "number" && (
            <div className="w-full bg-gray-900/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all"
                style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {videoUrl && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-4 space-y-3">
          <video controls src={videoUrl} className="w-full rounded-lg shadow-lg" />
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Your video is ready.</span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
