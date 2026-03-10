"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { analyzeImageMultipart, selectPackageInstance } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import UpgradeRequiredBanner from "@/app/components/common/UpgradeRequiredBanner";
import { PACKAGES_URL } from "@/app/utils/urls";

type Status = "idle" | "ready" | "uploading" | "success" | "error";

interface FileUploadProps {
  onUploadSuccess: (result: ResultDoc, info?: { duplicate?: boolean; requestId?: string }) => void;
  packageInstanceId?: string | null;
}

type UpgradeInfo = {
  code?: string | null;
  error?: string;
  feature?: string;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
} | null;

type AnalyzeRequestError = Error & {
  requestId?: string;
  code?: string;
  feature?: string;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
  payload?: unknown;
};

type ErrorMeta = {
  code?: string | null;
  statusCode?: number | null;
  rawMessage?: string | null;
  requestId?: string | null;
};

const mapErrorToUserMessage = (meta: ErrorMeta) => {
  const code = meta.code || "";
  if (code === "UPGRADE_REQUIRED") {
    return {
      title: "Upgrade required",
      message: "Your plan doesn’t include this feature. Upgrade to continue.",
      actionLabel: "View plans",
      actionHref: PACKAGES_URL,
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "FACE_REQUIRED_FOR_ENROLLMENT") {
    return {
      title: "Face enrollment required",
      message: "Please enroll your profile face to continue.",
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "FACE_ENROLLMENT_REQUIRED") {
    return {
      title: "Face enrollment required",
      message: "Please enroll your profile face to continue.",
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "FACE_MISMATCH") {
    return {
      title: "Face verification failed",
      message: "This upload doesn’t match the enrolled persona for this package.",
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "FACE_ID_DRIFT" || code === "FACE_REENROLL_REQUIRED") {
    return {
      title: "Face verification needs re-enrollment",
      message: "We detected a face ID drift. Please re-enroll your face photo for this package to continue.",
      actionLabel: "Re-enroll face",
      actionHref: "/dashboard?enroll=1",
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "MULTIPLE_FACES_NOT_ALLOWED") {
    return {
      title: "Multiple faces detected",
      message: "Please upload an image with only one visible face.",
      requestId: meta.requestId || undefined,
    };
  }
  if (code === "PERSONA_ALREADY_BOUND") {
    return {
      title: "Persona already bound",
      message: "This persona belongs to another active package.",
      requestId: meta.requestId || undefined,
    };
  }
  return {
    title: "Upload failed",
    message: "We couldn’t analyze that image. Please try again.",
    requestId: meta.requestId || undefined,
  };
};

const MAX_MB = 25;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export default function FileUpload({ onUploadSuccess, packageInstanceId }: FileUploadProps) {
  const { refresh: refreshPlan } = usePlanInfo();
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [errorMeta, setErrorMeta] = useState<ErrorMeta | null>(null);
  const lastPlanRefreshRef = useRef<number>(0);
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo>(null);
  const [personaMismatch, setPersonaMismatch] = useState<{
    packagePersonaKey: string;
    requestedPersonaKey: string;
  } | null>(null);
  const [personaAlreadyBound, setPersonaAlreadyBound] = useState<{
    existingInstanceId?: string;
  } | null>(null);
  const [bindingActionLoading, setBindingActionLoading] = useState(false);

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
      setErrorMeta({ rawMessage: v });
      setUpgradeInfo(null);
      setStatus("error");
      return;
    }

    setError(null);
    setUpgradeInfo(null);
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

  async function onSubmit(fileOverride?: File) {
    const selectedFile = fileOverride ?? file;
    if (!selectedFile || status === "uploading") return;

    setStatus("uploading");
    setUploadPct(0);
    setError(null);
    setErrorRequestId(null);
    setErrorMeta(null);
    setUpgradeInfo(null);
    setPersonaMismatch(null);
    setPersonaAlreadyBound(null);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { insights, duplicate, requestId } = await analyzeImageMultipart({
        file: selectedFile,
        packageInstanceId,
        signal: controller.signal,
        onProgress: (pct: number) => setUploadPct(pct),
      });

      onUploadSuccess(insights as ResultDoc, { duplicate, requestId });
      const now = Date.now();
      if (now - lastPlanRefreshRef.current > 500) {
        lastPlanRefreshRef.current = now;
        refreshPlan(true);
      }

      setStatus("success");
      setErrorRequestId(null);
      setUpgradeInfo(null);
      setPersonaMismatch(null);
      setPersonaAlreadyBound(null);
      // keep preview so user sees what was uploaded; call reset() if you want to clear immediately
    } catch (e: unknown) {
      if (controller.signal.aborted) {
        setError("Upload cancelled.");
        setErrorRequestId(null);
        setErrorMeta({ rawMessage: "Upload cancelled." });
        setUpgradeInfo(null);
      } else {
        const errObj = e as AnalyzeRequestError & { errorCode?: string; error?: string; data?: unknown };
        const nested =
          errObj && typeof errObj.data === "object" && errObj.data
            ? (errObj.data as {
                errorCode?: unknown;
                code?: unknown;
                error?: unknown;
                message?: unknown;
                requestId?: unknown;
                status?: unknown;
              })
            : null;
        const codeRaw =
          (typeof errObj?.errorCode === "string" && errObj.errorCode) ||
          (typeof errObj?.code === "string" && errObj.code) ||
          (typeof errObj?.error === "string" && errObj.error) ||
          (typeof errObj?.message === "string" && errObj.message) ||
          (nested && typeof nested.errorCode === "string" ? nested.errorCode : null) ||
          (nested && typeof nested.code === "string" ? nested.code : null) ||
          (nested && typeof nested.error === "string" ? nested.error : null) ||
          (nested && typeof nested.message === "string" ? nested.message : null) ||
          null;
        const maybeRequestId =
          (typeof errObj?.requestId === "string" && errObj.requestId) ||
          (nested && typeof nested.requestId === "string" ? nested.requestId : null) ||
          null;
        const statusCode =
          (errObj as { status?: number })?.status ??
          (nested && typeof nested.status === "number" ? nested.status : null) ??
          null;
        const maybeUpgrade =
          errObj?.code === "UPGRADE_REQUIRED"
            ? {
                code: errObj.code,
                error: errObj.message,
                feature: errObj.feature,
                plan: errObj.plan ?? null,
                remaining: typeof errObj.remaining === "number" ? errObj.remaining : null,
                limit: typeof errObj.limit === "number" ? errObj.limit : null,
              }
            : null;
        const personaEnrollRequired =
          codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" || codeRaw === "FACE_ENROLLMENT_REQUIRED";
        const faceMismatch = codeRaw === "FACE_MISMATCH";
        const faceIdDrift = codeRaw === "FACE_ID_DRIFT" || codeRaw === "FACE_REENROLL_REQUIRED";
        const multipleFaces = codeRaw === "MULTIPLE_FACES_NOT_ALLOWED";
        if (codeRaw === "PACKAGE_NOT_BOUND_TO_PERSONA" && errObj.payload) {
          const payload = errObj.payload as {
            packagePersonaKey?: unknown;
            requestedPersonaKey?: unknown;
          };
          const packagePersonaKey =
            typeof payload.packagePersonaKey === "string" ? payload.packagePersonaKey : "";
          const requestedPersonaKey =
            typeof payload.requestedPersonaKey === "string" ? payload.requestedPersonaKey : "";
          if (packagePersonaKey && requestedPersonaKey) {
            setPersonaMismatch({ packagePersonaKey, requestedPersonaKey });
          }
        }
        if (codeRaw === "PERSONA_ALREADY_BOUND" && errObj.payload) {
          const payload = errObj.payload as { existingInstanceId?: unknown };
          const existingInstanceId =
            typeof payload.existingInstanceId === "string" ? payload.existingInstanceId : undefined;
          setPersonaAlreadyBound({ existingInstanceId });
        }
        const msg = personaEnrollRequired
          ? "Please enroll your profile face to continue."
          : faceMismatch
            ? "This package is locked to a different persona face. Select the correct package or buy a new one for this persona."
          : faceIdDrift
            ? "We detected a face ID drift. Please re-enroll your face photo for this package to continue."
          : multipleFaces
            ? "Please upload an image with only one visible face to enroll this persona."
          : codeRaw === "PERSONA_ALREADY_BOUND"
            ? "This persona already belongs to another active package. Please select the correct package and try again."
          : e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : "Upload failed. Please try again.";
        if (maybeRequestId && (statusCode === 409 || statusCode === 400 || statusCode === 422)) {
          try {
            window.dispatchEvent(new Event("ai-auth-changed"));
          } catch {}
        }
        setError(msg);
        setErrorRequestId(maybeRequestId);
        setErrorMeta({
          code: codeRaw,
          statusCode,
          rawMessage: e instanceof Error ? e.message : typeof e === "string" ? e : null,
          requestId: maybeRequestId,
        });
        setUpgradeInfo(maybeUpgrade);
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
    setErrorRequestId(null);
    setErrorMeta(null);
    setUpgradeInfo(null);
    setPersonaMismatch(null);
    setPersonaAlreadyBound(null);
    setFile(null);
    setUploadPct(0);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const showDebug = process.env.NODE_ENV !== "production";

  return (
    <div className="w-full max-w-none">
      <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 backdrop-blur">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">Upload image</h3>
            <p className="text-xs text-[var(--hg-muted)]">Drag & drop or click to browse</p>
          </div>
        </div>
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
          className={`relative h-[142px] md:h-[158px] rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition
            ${dragActive ? "border-[#50C0F0] bg-[color:color-mix(in_oklab,var(--hg-accent)_16%,transparent)]" : "border-[var(--hg-border-2)] bg-[var(--hg-surface-2)]/85 hover:border-[var(--hg-border)]"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT.join(",")}
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex h-full flex-col items-center justify-center gap-2 hg-text">
            <div
              className={`grid place-items-center rounded-full w-9 h-9 border border-[var(--hg-border)]
              ${dragActive ? "bg-[color:color-mix(in_oklab,var(--hg-accent)_20%,transparent)]" : "bg-[rgba(255,255,255,0.04)]"}`}
            >
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-white">Click to choose</span>{" "}
              or drag & drop
            </div>
            <div className="text-[11px] text-[var(--hg-muted-2)]">Max {MAX_MB}MB • PNG/JPG/WebP/AVIF</div>
          </div>
          {dragActive && (
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[rgba(80,192,240,0.45)]" />
          )}
        </div>

        {file ? (
          <div className="mt-3 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/55 p-3">
            <div className="flex items-center gap-3">
              {previewURL ? (
                <Image
                  src={previewURL}
                  alt="Preview"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] rounded-md object-cover border border-[var(--hg-border)]"
                />
              ) : (
                <div className="h-[60px] w-[60px] rounded-md bg-[rgba(255,255,255,0.04)] border border-[var(--hg-border)] grid place-items-center">
                  <ImageIcon className="w-4 h-4 opacity-70 text-[var(--hg-muted)]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{file.name}</div>
                <div className="text-xs hg-muted">{file.type || "image"} • {formatSize(file.size)}</div>
                {status === "uploading" ? (
                  <div className="mt-2">
                    <Progress pct={uploadPct} />
                  </div>
                ) : null}
                {status === "success" ? (
                  <div className="mt-2 inline-flex items-center gap-1 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded & analyzed
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="mt-3 text-xs text-rose-300 bg-rose-900/20 border border-rose-700/40 rounded-md px-3 py-2 space-y-2">
            {(() => {
              const mapped = mapErrorToUserMessage(errorMeta || { rawMessage: error });
              return (
                <>
                  <div className="font-semibold text-rose-200">{mapped.title}</div>
                  <div className="break-words whitespace-normal">{mapped.message}</div>
                  {mapped.actionLabel && mapped.actionHref ? (
                    <Link
                      href={mapped.actionHref}
                      className="inline-flex items-center rounded-md border border-rose-700/60 px-2.5 py-1 text-[11px] hover:border-rose-400"
                    >
                      {mapped.actionLabel}
                    </Link>
                  ) : null}
                </>
              );
            })()}
            {errorRequestId && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] hg-muted">
                  Support ID: {errorRequestId}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(errorRequestId)}
                  className="inline-flex items-center gap-1 text-[11px] hg-muted underline hover:text-[#50C0F0]"
                >
                  Copy
                </button>
              </div>
            )}
            {upgradeInfo ? (
              <UpgradeRequiredBanner
                code={upgradeInfo.code}
                error={mapErrorToUserMessage({ code: "UPGRADE_REQUIRED" }).title}
                feature={upgradeInfo.feature}
                plan={upgradeInfo.plan}
                remaining={upgradeInfo.remaining}
                limit={upgradeInfo.limit}
              />
            ) : null}
            {showDebug && errorMeta ? (
              <details className="rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-[11px] text-rose-100">
                <summary className="cursor-pointer text-rose-200">Debug</summary>
                <div className="mt-2 space-y-1 break-words whitespace-normal">
                  <div>Status: {errorMeta.statusCode ?? "—"}</div>
                  <div>Code: {errorMeta.code ?? "—"}</div>
                  <div>Message: {String(errorMeta.rawMessage ?? "—")}</div>
                </div>
              </details>
            ) : null}
            {personaMismatch ? (
              <div className="rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-rose-200">
                <p>
                  This package is bound to persona{" "}
                  <span className="font-semibold">{personaMismatch.packagePersonaKey}</span>.
                  You requested{" "}
                  <span className="font-semibold">{personaMismatch.requestedPersonaKey}</span>.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="text-[11px] underline underline-offset-2 hover:text-white"
                  >
                    Select another package
                  </Link>
                  <Link
                    href="/#packages"
                    className="text-[11px] underline underline-offset-2 hover:text-white"
                  >
                    Buy another package
                  </Link>
                </div>
              </div>
            ) : null}
            {personaAlreadyBound?.existingInstanceId ? (
              <div className="rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-rose-200">
                <p>
                  This persona already belongs to another active package. Please select the correct package and try again.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setBindingActionLoading(true);
                    try {
                      await selectPackageInstance(personaAlreadyBound.existingInstanceId || "");
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new Event("ai-auth-changed"));
                      }
                    } catch (err) {
                      console.error("Failed to select package instance:", err);
                    } finally {
                      setBindingActionLoading(false);
                    }
                  }}
                  disabled={bindingActionLoading}
                  className="mt-2 inline-flex items-center gap-2 rounded-md border border-rose-700/60 px-2.5 py-1 text-[11px] hover:border-rose-400 disabled:opacity-60"
                >
                  {bindingActionLoading ? "Selecting..." : "Select that package"}
                </button>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSubmit()}
            disabled={!file || status === "uploading"}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition
              ${
                file && status !== "uploading"
                  ? "bg-[#50C0F0] text-[#07141d] hover:opacity-90 shadow-[0_10px_24px_rgba(80,192,240,0.24)]"
                  : "bg-[rgba(255,255,255,0.10)] cursor-not-allowed"
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
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-white/90 hover:bg-[rgba(255,255,255,0.08)]"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          ) : (
            <button
              onClick={reset}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-white/90 hover:bg-[rgba(255,255,255,0.08)]"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
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
      <div className="h-2 rounded-full bg-[rgba(255,255,255,0.10)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#50C0F0] to-[#7fd9ff]"
          style={{ width: `${v}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] hg-muted">{v}%</div>
    </div>
  );
}

