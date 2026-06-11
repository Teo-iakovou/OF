"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  Upload,
  Check,
  Loader2,
  HelpCircle,
  Lock,
  Copy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SUPPORT_EMAIL } from "@/config/contact";

type FaceEnrollModalProps = {
  open: boolean;
  onSuccess: (payload: { requestId?: string | null; faceId?: string | null }) => void;
  onError?: (err: unknown) => void;
  loading?: boolean;
};

type Stage =
  | { kind: "initial" }
  | { kind: "camera"; stream: MediaStream | null }
  | { kind: "analyzing" }
  | { kind: "success"; faceId: string | null; requestId: string | null }
  | { kind: "error"; code: string; canRetry: boolean; requestId: string | null };

// Error codes that allow retry (return to initial). FACE_ALREADY_ENROLLED is intentionally
// absent — the backend never returns this code (confirmed by audit).
const RETRYABLE = new Set([
  "FACE_REQUIRED_FOR_ENROLLMENT",
  "MULTIPLE_FACES_NOT_ALLOWED",
  "ENROLL_FACE_FAILED",
  "CAMERA_UNAVAILABLE",
  "IMAGE_BLOCKED",
  "IMAGE_MODERATION_UNAVAILABLE",
  "IMAGE_TOO_LARGE",
  "__default",
]);

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]),[href],input:not([type="hidden"]):not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function FaceEnrollModal({ open, onSuccess, onError }: FaceEnrollModalProps) {
  const t = useTranslations("dashboard.faceEnroll");
  const [stage, setStage] = useState<Stage>({ kind: "initial" });
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // Keep stream in a ref so cleanup is never stale inside effects
  const streamRef = useRef<MediaStream | null>(null);

  // Precompute all error translations with explicit keys so TypeScript is happy
  const errorCopy = useMemo(
    () => ({
      FACE_REQUIRED_FOR_ENROLLMENT: {
        title: t("errors.FACE_REQUIRED_FOR_ENROLLMENT.title"),
        body: t("errors.FACE_REQUIRED_FOR_ENROLLMENT.body"),
      },
      MULTIPLE_FACES_NOT_ALLOWED: {
        title: t("errors.MULTIPLE_FACES_NOT_ALLOWED.title"),
        body: t("errors.MULTIPLE_FACES_NOT_ALLOWED.body"),
      },
      ACTIVE_INSTANCE_REQUIRED: {
        title: t("errors.ACTIVE_INSTANCE_REQUIRED.title"),
        body: t("errors.ACTIVE_INSTANCE_REQUIRED.body"),
      },
      ENROLL_FACE_FAILED: {
        title: t("errors.ENROLL_FACE_FAILED.title"),
        body: t("errors.ENROLL_FACE_FAILED.body"),
      },
      CAMERA_UNAVAILABLE: {
        title: t("errors.CAMERA_UNAVAILABLE.title"),
        body: t("errors.CAMERA_UNAVAILABLE.body"),
      },
      __default: {
        title: t("errors.__default.title"),
        body: t("errors.__default.body"),
      },
      IMAGE_BLOCKED: {
        title: t("errors.IMAGE_BLOCKED.title"),
        body: t("errors.IMAGE_BLOCKED.body"),
      },
      IMAGE_MODERATION_UNAVAILABLE: {
        title: t("errors.IMAGE_MODERATION_UNAVAILABLE.title"),
        body: t("errors.IMAGE_MODERATION_UNAVAILABLE.body"),
      },
      IMAGE_TOO_LARGE: {
        title: t("errors.IMAGE_TOO_LARGE.title"),
        body: t("errors.IMAGE_TOO_LARGE.body"),
      },
    }),
    [t]
  );

  // Reset to initial each time the gate opens
  useEffect(() => {
    if (open) setStage({ kind: "initial" });
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus to first interactive element on open and on each stage transition
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const id = setTimeout(() => {
      if (!modalRef.current) return;
      const items = getFocusables(modalRef.current);
      items[0]?.focus();
    }, 50);
    return () => clearTimeout(id);
  }, [open, stage.kind]);

  // Tab-key focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const items = getFocusables(modalRef.current);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Stop camera stream when modal closes
  useEffect(() => {
    if (!open) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [open]);

  // Ensure stream is stopped on unmount regardless of state
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setStage({ kind: "camera", stream });
    } catch {
      stopStream();
      // canRetry: true so "Try again" returns to initial where the user can pick "Upload file"
      setStage({ kind: "error", code: "CAMERA_UNAVAILABLE", canRetry: true, requestId: null });
      // Auto-trigger file picker as fallback — may be blocked without user gesture in some browsers
      setTimeout(() => fileInputRef.current?.click(), 800);
    }
  }

  async function handleCapture() {
    if (stage.kind !== "camera" || !videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror horizontally to match the selfie preview, giving Rekognition the correct orientation
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
    );
    if (!blob) return;
    stopStream();
    await submitImage(blob);
  }

  function handleCancelCamera() {
    stopStream();
    setStage({ kind: "initial" });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset input so the same file can be re-selected after an error
    if (e.target) e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStage({ kind: "error", code: "__default", canRetry: true, requestId: null });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStage({ kind: "error", code: "__default", canRetry: true, requestId: null });
      return;
    }
    void submitImage(file);
  }

  async function submitImage(input: Blob | File) {
    setStage({ kind: "analyzing" });
    try {
      const form = new FormData();
      // Third arg (filename) is required — multer upload.single("image") needs it
      form.append("image", input, "capture.jpg");

      const res = await fetch("/api/profile/enroll-face", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      if (!res.ok) {
        // Backend sends either errorCode OR error field depending on which handler triggered
        const code = String(
          (payload.errorCode as string | undefined) ??
            (payload.error as string | undefined) ??
            "ENROLL_FACE_FAILED"
        );
        const canRetry = RETRYABLE.has(code);
        const requestId = typeof payload.requestId === "string" ? payload.requestId : null;
        setStage({ kind: "error", code, canRetry, requestId });
        onError?.(payload);
        return;
      }

      const faceId = typeof payload.faceId === "string" ? payload.faceId : null;
      const requestId = typeof payload.requestId === "string" ? payload.requestId : null;
      setStage({ kind: "success", faceId, requestId });
      setTimeout(() => {
        onSuccess({ requestId, faceId });
      }, 800);
    } catch (err) {
      setStage({ kind: "error", code: "__default", canRetry: true, requestId: null });
      onError?.(err);
    }
  }

  function handleCopyRef(id: string) {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Derive header content from current stage
  const header = (() => {
    if (stage.kind === "error") {
      const copy =
        errorCopy[stage.code as keyof typeof errorCopy] ?? errorCopy.__default;
      return { title: copy.title, body: copy.body, variant: "error" as const };
    }
    if (stage.kind === "success") {
      return {
        title: t("title.success"),
        body: t("body.success"),
        variant: "success" as const,
      };
    }
    if (stage.kind === "analyzing") {
      return {
        title: t("title.analyzing"),
        body: t("body.analyzing"),
        variant: "default" as const,
      };
    }
    if (stage.kind === "camera") {
      return {
        title: t("title.camera"),
        body: t("body.camera"),
        variant: "default" as const,
      };
    }
    return {
      title: t("title.initial"),
      body: t("body.initial"),
      variant: "default" as const,
    };
  })();

  const showFooter =
    stage.kind === "initial" || stage.kind === "camera" || stage.kind === "error";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />

          {/* Centering wrapper */}
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6 overflow-y-auto">
            {/* Modal card */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="face-enroll-title"
              aria-describedby="face-enroll-body"
              className="relative w-full max-w-[460px] rounded-[14px] sm:rounded-[18px] border border-[var(--hg-border)] bg-[var(--hg-surface)] overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)",
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* ── Header (consistent across all stages) ── */}
              <div className="px-6 pt-6 pb-0">
                <div className="flex gap-3.5 items-start">
                  {/* Shield icon */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-[12px] border"
                    style={
                      header.variant === "error"
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.08) 100%)",
                            borderColor: "rgba(239,68,68,0.2)",
                          }
                        : header.variant === "success"
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.08) 100%)",
                            borderColor: "rgba(52,211,153,0.2)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg, rgba(80,192,240,0.18) 0%, rgba(80,192,240,0.08) 100%)",
                            borderColor: "rgba(80,192,240,0.2)",
                          }
                    }
                  >
                    {header.variant === "error" ? (
                      <ShieldAlert
                        className="w-[22px] h-[22px] text-rose-400"
                        strokeWidth={1.5}
                      />
                    ) : header.variant === "success" ? (
                      <ShieldCheck
                        className="w-[22px] h-[22px] text-emerald-400"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <ShieldCheck
                        className="w-[22px] h-[22px] text-[var(--hg-accent)]"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  {/* Title + body */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <h2
                      id="face-enroll-title"
                      className="text-[17px] font-medium leading-snug tracking-[-0.02em] text-[var(--hg-text)]"
                    >
                      {header.title}
                    </h2>
                    <p
                      id="face-enroll-body"
                      aria-live="polite"
                      className="text-[13px] leading-[1.55] text-[var(--hg-muted)]"
                    >
                      {header.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Stage body (animated transitions) ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.kind}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* ── INITIAL ── */}
                  {stage.kind === "initial" && (
                    <div className="px-6 pt-5 pb-5 space-y-3">
                      {/* Tips */}
                      <div className="rounded-[10px] border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3.5 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--hg-muted)] mb-2.5">
                          {t("tips.header")}
                        </p>
                        <div className="space-y-1.5">
                          {(["facing", "lighting", "noObstructions"] as const).map(
                            (key) => (
                              <div key={key} className="flex items-center gap-2">
                                <Check
                                  className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"
                                  strokeWidth={1.5}
                                />
                                <span className="text-[12px] text-[var(--hg-text)] opacity-80">
                                  {t(`tips.${key}`)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Capture options */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => void startCamera()}
                          className="flex flex-col items-center gap-2 rounded-[12px] border px-4 py-4 text-center transition-opacity hover:opacity-80 active:opacity-70"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(80,192,240,0.18) 0%, rgba(80,192,240,0.10) 100%)",
                            borderColor: "rgba(80,192,240,0.25)",
                          }}
                        >
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-[8px]"
                            style={{ background: "rgba(80,192,240,0.15)" }}
                          >
                            <Camera
                              className="w-[18px] h-[18px] text-[var(--hg-accent)]"
                              strokeWidth={1.5}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[var(--hg-text)]">
                            {t("actions.takePhoto")}
                          </span>
                          <span className="text-[11px] text-[var(--hg-muted)]">
                            {t("actions.takePhotoSub")}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-2 rounded-[12px] border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-4 text-center transition-opacity hover:opacity-80 active:opacity-70"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[var(--hg-surface)]">
                            <Upload
                              className="w-[18px] h-[18px] text-[var(--hg-muted)]"
                              strokeWidth={1.5}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[var(--hg-text)]">
                            {t("actions.uploadFile")}
                          </span>
                          <span className="text-[11px] text-[var(--hg-muted)]">
                            {t("actions.uploadFileSub")}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── CAMERA ── */}
                  {stage.kind === "camera" && (
                    <div className="px-6 pt-5 pb-5 space-y-3">
                      {/* Video preview */}
                      <div className="relative w-full overflow-hidden rounded-[12px] border border-[var(--hg-border)] bg-black aspect-[4/3]">
                        <video
                          ref={(el) => {
                            videoRef.current = el;
                            if (el && stage.stream) {
                              el.srcObject = stage.stream;
                            }
                          }}
                          playsInline
                          muted
                          autoPlay
                          className="w-full h-full object-cover"
                          // Mirror the live preview for natural selfie feel
                          style={{ transform: "scaleX(-1)" }}
                        />
                        {/* Decorative face-alignment guide */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            style={{
                              width: "58%",
                              aspectRatio: "3 / 4",
                              border: "2px dashed rgba(80,192,240,0.4)",
                              borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Capture / Cancel */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleCapture()}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border py-3 text-[13px] font-medium transition-opacity hover:opacity-80"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(80,192,240,0.20) 0%, rgba(80,192,240,0.12) 100%)",
                            borderColor: "rgba(80,192,240,0.30)",
                            color: "var(--hg-accent)",
                          }}
                        >
                          {/* Custom shutter icon */}
                          <svg
                            viewBox="0 0 20 20"
                            className="w-5 h-5 flex-shrink-0"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <circle cx="10" cy="10" r="4.5" fill="currentColor" />
                          </svg>
                          {t("actions.capture")}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelCamera}
                          className="flex items-center justify-center rounded-[12px] border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-5 py-3 text-[13px] font-medium text-[var(--hg-muted)] transition-opacity hover:opacity-80"
                        >
                          {t("actions.cancel")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── ANALYZING ── */}
                  {stage.kind === "analyzing" && (
                    <div className="px-6 pt-7 pb-9 flex flex-col items-center gap-3">
                      <div className="relative flex items-center justify-center w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle at center, rgba(80,192,240,0.20) 0%, transparent 70%)",
                          }}
                        />
                        <Loader2
                          className="w-8 h-8 animate-spin text-[var(--hg-accent)]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-[12px] text-[var(--hg-muted-2)] text-center">
                        {t("body.analyzingSteps")}
                      </p>
                    </div>
                  )}

                  {/* ── SUCCESS ── */}
                  {stage.kind === "success" && (
                    <div className="px-6 pt-7 pb-9 flex flex-col items-center gap-3">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 rounded-full border"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.08) 100%)",
                          borderColor: "rgba(52,211,153,0.2)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.1, 1] }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <Check
                          className="w-7 h-7 text-emerald-400"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>
                  )}

                  {/* ── ERROR ── */}
                  {stage.kind === "error" && (
                    <div className="px-6 pt-5 pb-5 space-y-3">
                      {stage.canRetry && (
                        <button
                          type="button"
                          onClick={() => setStage({ kind: "initial" })}
                          className="w-full flex items-center justify-center rounded-[12px] bg-[var(--hg-accent)] px-4 py-3 text-[13px] font-semibold text-[#04131d] transition-opacity hover:opacity-90"
                        >
                          {t("actions.tryAgain")}
                        </button>
                      )}

                      {/* Reference ID for support tickets */}
                      {stage.requestId && (
                        <div className="flex items-center justify-between gap-2 rounded-[8px] border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2">
                          <span className="text-[11px] font-mono text-[var(--hg-muted-2)] truncate">
                            {t("errors.referenceId", {
                              id: stage.requestId.slice(0, 8) + "…",
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyRef(stage.requestId!)}
                            className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[var(--hg-muted)] transition-colors hover:text-[var(--hg-text)]"
                            aria-label={t("_legacy.copyRequestId")}
                          >
                            {copied ? (
                              <Check
                                className="w-3 h-3 text-emerald-400"
                                strokeWidth={1.5}
                              />
                            ) : (
                              <Copy className="w-3 h-3" strokeWidth={1.5} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Hidden file input — always rendered so ref is always valid */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* ── Footer ── */}
              {showFooter && (
                <div className="border-t border-[var(--hg-border)] px-5 py-3 flex items-center justify-between">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center gap-1.5 text-[12px] text-[var(--hg-muted)] transition-colors hover:text-[var(--hg-text)]"
                  >
                    <HelpCircle className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                    {t("actions.contactSupport")}
                  </a>
                  <span className="flex items-center gap-1 text-[10px] text-[var(--hg-muted-2)]">
                    <Lock className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={1.5} />
                    {t("actions.encrypted")}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
