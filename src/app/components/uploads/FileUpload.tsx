"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { analyzeImageMultipart, ttsSynthesize } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  X,
  Loader2,
  Languages,
  Volume2,
} from "lucide-react";

type Status = "idle" | "ready" | "uploading" | "success" | "error";

interface FileUploadProps {
  onUploadSuccess: (result: ResultDoc, info?: { duplicate?: boolean }) => void;
}

const MAX_MB = 25;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [withCaptions, setWithCaptions] = useState(true);
  const [autoDub, setAutoDub] = useState(false);
  const [dubLang, setDubLang] = useState("EN");

  const [dragActive, setDragActive] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
      abortRef.current?.abort();
    };
  }, [previewURL]);

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

  function validate(f: File): string | null {
    if (!ACCEPT.includes(f.type)) return "Unsupported file type. Use PNG, JPG, WEBP, or AVIF.";
    if (f.size > MAX_MB * 1024 * 1024)
      return `File is too large. Max ${MAX_MB} MB.`;
    return null;
  }

  function handleFiles(fileList: FileList | null) {
    const f = fileList?.[0] || null;
    if (!f) return;

    const v = validate(f);
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }

    setError(null);
    setFile(f);
    setStatus("ready");

    setPreviewURL((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
  }

  function onSelectClick() {
    inputRef.current?.click();
  }

  async function onSubmit() {
    if (!file || status === "uploading") return;

    setStatus("uploading");
    setUploadPct(0);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { insights, duplicate } = await analyzeImageMultipart({
        file,
        captions: withCaptions,
        signal: controller.signal,
        onProgress: (pct: number) => setUploadPct(pct),
      });

      onUploadSuccess(insights as ResultDoc, { duplicate });

      if (autoDub) {
        try {
          const first = insights?.promotion?.recommendedPlatforms?.[0];
          const caption = (first?.caption as string) || "";
          if (caption.trim()) {
            const url = await ttsSynthesize(`[${dubLang}] ${caption}`);
            const a = new Audio(url);
            a.play().catch(() => {});
          }
        } catch {
          // silent TTS failure
        }
      }

      setStatus("success");
      // keep preview so user sees what was uploaded; call reset() if you want to clear immediately
    } catch (e: unknown) {
      if (controller.signal.aborted) {
        setError("Upload cancelled.");
      } else {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "string"
            ? e
            : "Upload failed. Please try again.";
        setError(msg);
      }
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  }

  function onCancel() {
    abortRef.current?.abort();
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setFile(null);
    setUploadPct(0);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  /* ───────────────────── UI ───────────────────── */

  return (
    <div className="w-full">
      {/* Card frame */}
      <div className="rounded-2xl bg-[#0B1222]/80 ring-1 ring-white/10 shadow-xl p-4 sm:p-6 backdrop-blur">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              Upload an image
            </h3>
            <p className="text-xs sm:text-sm text-gray-300/80 truncate">
              We’ll analyze it and suggest captions, hashtags & best posting times.
            </p>
          </div>

          {/* Enhancements */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Captions switch */}
            <Switch
              label="Captions"
              checked={withCaptions}
              onChange={setWithCaptions}
            />
            {/* Auto-dub group */}
            <div className="flex items-center gap-2">
              <Switch
                label="Auto-dub"
                checked={autoDub}
                onChange={setAutoDub}
                icon={<Volume2 className="w-3.5 h-3.5" />}
              />
              <div className="relative">
                <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <Languages className="w-4 h-4" />
                </div>
                <select
                  value={dubLang}
                  onChange={(e) => setDubLang(e.target.value)}
                  disabled={!autoDub}
                  className="pl-8 pr-3 py-1.5 rounded-md bg-white/5 text-white border border-white/10 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="EN">EN</option>
                  <option value="ES">ES</option>
                  <option value="FR">FR</option>
                  <option value="DE">DE</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => onSelectClick()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? onSelectClick() : null)}
            className={`relative rounded-xl border-2 border-dashed p-4 sm:p-8 text-center cursor-pointer transition
              ${dragActive ? "border-indigo-400 bg-indigo-400/10" : "border-white/15 bg-white/5 hover:border-white/25"}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(",")}
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-2 text-gray-200">
              <div
                className={`grid place-items-center rounded-full w-12 h-12
                ${dragActive ? "bg-indigo-500/20" : "bg-white/5"}`}
              >
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm sm:text-base">
                <span className="font-semibold text-white">Click to choose</span>{" "}
                or drag & drop your image
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG, WEBP, AVIF — up to {MAX_MB}MB
              </div>
            </div>

            {/* drag overlay */}
            {dragActive && (
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-indigo-400/60" />
            )}
          </div>

          {/* Preview & actions */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5">
            {!file ? (
              <div className="h-full min-h-[200px] grid place-items-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 opacity-60" />
                  <div className="text-sm">No file selected yet</div>
                </div>
              </div>
            ) : (
              <>
                {/* Preview */}
                <div className="flex items-center gap-3">
                  {previewURL ? (
                    <Image
                      src={previewURL}
                      alt="Preview"
                      width={120}
                      height={120}
                      className="w-28 h-28 rounded-lg object-cover border border-white/10 shadow"
                    />
                  ) : null}
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {file.type || "image"} • {formatSize(file.size)}
                    </div>
                    {status === "uploading" && (
                      <div className="mt-3">
                        <Progress pct={uploadPct} />
                      </div>
                    )}
                    {status === "success" && (
                      <div className="mt-3 inline-flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Uploaded & analyzed
                      </div>
                    )}
                  </div>
                </div>

                {/* Errors */}
                {error && (
                  <div className="mt-3 text-xs text-rose-300 bg-rose-900/20 border border-rose-700/40 rounded-md px-3 py-2">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onSubmit}
                    disabled={!file || status === "uploading"}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition
                      ${
                        file && status !== "uploading"
                          ? "bg-indigo-600 hover:bg-indigo-500 shadow"
                          : "bg-white/10 cursor-not-allowed"
                      }`}
                  >
                    {status === "uploading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>Analyze with AI</>
                    )}
                  </button>

                  {status === "uploading" ? (
                    <button
                      onClick={onCancel}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 bg-white/10 hover:bg-white/15 border border-white/10"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 bg-white/10 hover:bg-white/15 border border-white/10"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Smaller UI atoms ───────── */

function Progress({ pct }: { pct: number }) {
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="w-full">
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
          style={{ width: `${v}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-gray-400">{v}%</div>
    </div>
  );
}

function Switch({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 text-xs font-medium rounded-full px-2 py-1
        border transition ${
          checked
            ? "bg-white/10 text-white border-white/20"
            : "bg-transparent text-gray-300 border-white/10 hover:bg-white/5"
        }`}
      title={label}
    >
      <span
        className={`inline-flex h-4 w-7 rounded-full p-0.5 transition
          ${checked ? "bg-indigo-600" : "bg-white/15"}`}
      >
        <span
          className={`h-3 w-3 rounded-full bg-white transition-transform
          ${checked ? "translate-x-3" : ""}`}
        />
      </span>
      {icon}
      <span>{label}</span>
    </button>
  );
}
