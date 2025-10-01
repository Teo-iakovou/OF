"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getRenderJob } from "@/app/utils/api";
import { BASE_URL } from "@/app/utils/fetcher";

const VOICES = [
  { id: "en_male_1", label: "English Male" },
  { id: "en_female_1", label: "English Female" },
];

export default function UploadTalkingHead() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(VOICES[0].id);
  const [consent, setConsent] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"queued" | "running" | "succeeded" | "failed" | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return !!text && consent && text.length <= 1200 && !isSubmitting;
  }, [text, consent, isSubmitting]);

  // Polling
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!jobId) return;
    // Clear any existing interval
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await getRenderJob(jobId);
        setStatus(r.status);
        if (r.status === "succeeded") {
          if (pollRef.current) clearInterval(pollRef.current);
          setVideoUrl(r.videoUrl || null);
        }
        if (r.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setError(r.error || "Render failed");
        }
      } catch (e: any) {
        // soft-fail polling (do not clear interval immediately)
        console.warn("Polling error", e?.message || e);
      }
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setStatus(null);
    setIsSubmitting(true);
    try {
      if (!file) throw new Error("Please select an image file");
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);
      fd.append("voiceId", voiceId);
      fd.append("consent", String(consent));

      const res = await fetch(`${BASE_URL}/api/render/generate`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to start render");
      setJobId(data.jobId);
      setStatus("queued");
    } catch (err: any) {
      setError(err?.message || "Failed to start render");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Image (JPEG/PNG)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
          <p className="text-xs text-gray-500">Max 10 MB. For stub, file is not uploaded.</p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Script (max 1,200 chars)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={1200}
            className="w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type what you want the avatar to say..."
          />
          <div className="text-xs text-gray-500 text-right">{text.length}/1200</div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Voice</label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full bg-gray-900 text-gray-100 rounded-md p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="consent" className="text-sm text-gray-300">
            I confirm I own rights to the image and script and consent to processing.
          </label>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-md font-semibold ${
            canSubmit ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Generate"}
        </button>
      </form>

      {/* Status */}
      {jobId && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Job: {jobId}</div>
          <div className="text-white font-medium mt-1">Status: {status ?? "starting"}</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 text-red-300 rounded p-3">{error}</div>
      )}

      {/* Result */}
      {videoUrl && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <video controls src={videoUrl} className="w-full rounded" />
          <a
            href={videoUrl}
            target="_blank"
            className="inline-block text-sm text-blue-400 underline hover:text-blue-300"
          >
            Download video
          </a>
        </div>
      )}
    </div>
  );
}
