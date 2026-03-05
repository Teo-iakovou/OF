"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type FaceEnrollModalProps = {
  open: boolean;
  onSuccess: (payload: { requestId?: string | null; faceId?: string | null }) => void;
  onError?: (err: unknown) => void;
  loading?: boolean;
};

type ErrorMeta = {
  code?: string | null;
  message?: string | null;
  requestId?: string | null;
};

const mapErrorToUserMessage = (meta: ErrorMeta) => {
  const code = meta.code || "";
  if (code === "FACE_ALREADY_ENROLLED") {
    return "Face already enrolled for this package.";
  }
  if (code === "MULTIPLE_FACES_NOT_ALLOWED") {
    return "Please upload a photo with exactly one face.";
  }
  if (code === "FACE_REQUIRED_FOR_ENROLLMENT") {
    return "No face detected. Please upload a clear single-face photo.";
  }
  return meta.message || "Enrollment failed. Please try again.";
};

export default function FaceEnrollModal({
  open,
  onSuccess,
  onError,
  loading,
}: FaceEnrollModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMeta, setErrorMeta] = useState<ErrorMeta | null>(null);

  if (!open) return null;

  const isLoading = typeof loading === "boolean" ? loading : localLoading;

  const pickFile = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  const upload = async (file: File) => {
    setErrorMeta(null);
    if (typeof loading !== "boolean") setLocalLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/profile/enroll-face", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
        const code =
          typeof payload.errorCode === "string"
            ? payload.errorCode
            : typeof payload.error === "string"
              ? payload.error
              : null;
        const message =
          typeof payload.message === "string"
            ? payload.message
            : typeof payload.error === "string"
              ? payload.error
              : null;
        const requestId =
          typeof payload.requestId === "string" ? payload.requestId : null;
        const meta = { code, message, requestId };
        setErrorMeta(meta);
        onError?.(meta);
        return;
      }
      const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const requestId = typeof payload.requestId === "string" ? payload.requestId : null;
      const faceId = typeof payload.faceId === "string" ? payload.faceId : null;
      onSuccess({ requestId, faceId });
    } catch (err) {
      setErrorMeta({ message: err instanceof Error ? err.message : "Network error." });
      onError?.(err);
    } finally {
      if (typeof loading !== "boolean") setLocalLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-[71] w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-[#0b1222] p-6 shadow-2xl text-white">
        <h2 className="text-xl font-semibold">Face enrollment required</h2>
        <p className="mt-2 text-sm text-gray-300">
          Upload a clear, single-face photo to unlock all features for this package.
        </p>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={pickFile}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Upload face photo
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
        </div>

        {errorMeta ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            <p>{mapErrorToUserMessage(errorMeta)}</p>
            {errorMeta.requestId ? (
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(errorMeta.requestId || "")}
                className="mt-2 text-xs text-rose-200 underline underline-offset-2"
              >
                Copy request ID
              </button>
            ) : null}
          </div>
        ) : null}

        {process.env.NODE_ENV !== "production" && errorMeta ? (
          <details className="mt-3 text-xs text-gray-400">
            <summary className="cursor-pointer">Debug</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(errorMeta, null, 2)}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}
