"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getUserResultImageUrl } from "@/app/utils/api";

type CreationCardProps = {
  id: string;
  title: string;
  createdAt: string;
  type: string;
  status: string;
  thumbnailUrl?: string | null;
  imageKey?: string | null;
  onOpenCreation?: (id: string) => void;
};

function isLikelyPrivateR2Url(url: string): boolean {
  const lower = url.toLowerCase();
  const hasSignedQuery =
    lower.includes("x-amz-") || lower.includes("signature") || lower.includes("token=");
  try {
    const parsed = new URL(url);
    const hostIsR2 = parsed.hostname.includes("r2.cloudflarestorage.com");
    const hasUploadsPath = parsed.pathname.includes("/aiplatform/uploads/");
    return (hostIsR2 || hasUploadsPath) && !hasSignedQuery;
  } catch {
    const hasUploadsPath = lower.includes("/aiplatform/uploads/");
    return hasUploadsPath && !hasSignedQuery;
  }
}

export default function CreationCard({
  id,
  title,
  createdAt,
  type,
  status,
  thumbnailUrl,
  imageKey,
  onOpenCreation,
}: CreationCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [resolvedThumbUrl, setResolvedThumbUrl] = useState<string | null>(null);
  const fetchAttemptRef = useRef<string | null>(null);
  const dateLabel = createdAt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(createdAt)).replace(",", " •")
    : "—";
  const normalizedType = (type || "").trim();
  const knownPlatforms = new Set(["instagram", "tiktok", "onlyfans"]);
  const displayMap: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    onlyfans: "OnlyFans",
  };
  const normalizedLower = normalizedType.toLowerCase();
  const titleText = knownPlatforms.has(normalizedLower)
    ? `${displayMap[normalizedLower] || normalizedType} Strategy`
    : title || "Content Strategy";
  const pill = status || "Ready";
  const shouldPreferSigned = Boolean(
    imageKey && thumbnailUrl && isLikelyPrivateR2Url(thumbnailUrl),
  );
  const previewUrl = useMemo(
    () => resolvedThumbUrl || (shouldPreferSigned ? null : thumbnailUrl || null),
    [resolvedThumbUrl, shouldPreferSigned, thumbnailUrl],
  );
  const showFallback = !previewUrl || imgFailed;

  useEffect(() => {
    if (!imageKey) return;
    const shouldFetchSigned = !thumbnailUrl || shouldPreferSigned || imgFailed;
    if (!shouldFetchSigned) return;
    const fetchKey = `${id}:${imageKey}`;
    if (fetchAttemptRef.current === fetchKey) return;
    fetchAttemptRef.current = fetchKey;
    let cancelled = false;
    getUserResultImageUrl({ id })
      .then((payload) => {
        if (cancelled) return;
        setResolvedThumbUrl(payload.url);
      })
      .catch(() => {
        if (cancelled) return;
        setResolvedThumbUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id, imageKey, imgFailed, shouldPreferSigned, thumbnailUrl]);

  useEffect(() => {
    setImgFailed(false);
  }, [previewUrl]);

  return (
    <button
      type="button"
      onClick={() => onOpenCreation?.(id)}
      className="group w-full text-left rounded-2xl hg-surface p-4 hover:shadow-md transition motion-reduce:transition-none"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)]">
        {!showFallback ? (
          <img
            src={previewUrl}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--hg-muted-2)] text-sm">
            No preview
          </div>
        )}
        {normalizedType ? (
          <div className="absolute top-2 left-2 rounded-full border border-[var(--hg-border)] bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[10px] text-[var(--hg-muted)]">
            {displayMap[normalizedLower] || normalizedType}
          </div>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-white truncate">{titleText}</p>
          <span className="inline-flex items-center rounded-full border border-[var(--hg-border)] bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[11px] text-[var(--hg-muted)]">
            {pill}
          </span>
        </div>
        <p className="text-xs hg-muted">{dateLabel}</p>
      </div>
    </button>
  );
}
