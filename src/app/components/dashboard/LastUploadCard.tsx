"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchLatestResultForPackageInstance } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

type LastUploadCardProps = {
  packageInstanceId?: string | null;
  result?: ResultDoc | null;
  loading?: boolean;
};

const summaryFor = (result: ResultDoc) => {
  const niche = result.niche ? `Niche: ${result.niche}` : null;
  const platform = result.promotion?.recommendedPlatforms?.[0]?.platform;
  const platformLine = platform ? `Top platform: ${platform}` : null;
  return [niche, platformLine].filter(Boolean).join(" · ");
};

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif)(?:$|[?#])/i;
const IMAGE_HINT_RE = /(image|thumbnail|thumb|photo|picture|avatar|preview|format=webp|format=jpeg|format=jpg|format=png)/i;

const isLikelyImageUrl = (value: string) => {
  if (!value.startsWith("http")) return false;
  try {
    const parsed = new URL(value);
    const joined = `${parsed.pathname}${parsed.search}`.toLowerCase();
    return IMAGE_EXT_RE.test(joined) || IMAGE_HINT_RE.test(joined);
  } catch {
    const lower = value.toLowerCase();
    return IMAGE_EXT_RE.test(lower) || IMAGE_HINT_RE.test(lower);
  }
};

const extractImageUrl = (result: ResultDoc | null) => {
  const meta = (result as unknown as { meta?: Record<string, unknown> } | null)?.meta;
  if (!meta || typeof meta !== "object") return null;
  const candidates = [
    meta.thumbnailUrl,
    meta.imageUrl,
    meta.assetUrl,
    (meta.upload as { url?: unknown } | undefined)?.url,
    (meta.image as { url?: unknown } | undefined)?.url,
    (meta.r2 as { publicUrl?: unknown } | undefined)?.publicUrl,
    meta.r2Url,
    meta.fileUrl,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && isLikelyImageUrl(candidate)) {
      return candidate;
    }
  }
  return null;
};

export default function LastUploadCard({ packageInstanceId, result, loading }: LastUploadCardProps) {
  const [internalResult, setInternalResult] = useState<ResultDoc | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const shouldUseInternalFetch = typeof result === "undefined";

  useEffect(() => {
    if (!shouldUseInternalFetch) return;
    let cancelled = false;
    if (!packageInstanceId) {
      setInternalResult(null);
      return;
    }
    setInternalLoading(true);
    fetchLatestResultForPackageInstance(packageInstanceId)
      .then((res) => {
        if (!cancelled) setInternalResult(res);
      })
      .catch(() => {
        if (!cancelled) setInternalResult(null);
      })
      .finally(() => {
        if (!cancelled) setInternalLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [packageInstanceId, shouldUseInternalFetch]);

  const effectiveResult = shouldUseInternalFetch ? internalResult : result ?? null;
  const effectiveLoading = shouldUseInternalFetch ? internalLoading : Boolean(loading);

  const createdAt = useMemo(() => {
    if (!effectiveResult?.createdAt) return null;
    const d = new Date(effectiveResult.createdAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [effectiveResult?.createdAt]);

  const previewUrl = useMemo(() => extractImageUrl(effectiveResult), [effectiveResult]);

  useEffect(() => {
    setImageLoaded(false);
  }, [previewUrl]);

  const renderContent = () => {
    if (effectiveLoading) {
      return (
        <>
          <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-28 animate-pulse rounded bg-white/10" />
        </>
      );
    }

    if (!effectiveResult) {
      return (
        <p className="text-sm hg-muted">
          No uploads yet. Upload your first image to see insights here.
        </p>
      );
    }

    return (
      <>
        <p className="text-sm hg-muted">Created {createdAt?.toLocaleString()}</p>
        <p className="mt-2 text-sm text-[var(--hg-text)]">{summaryFor(effectiveResult) || "AI insights ready."}</p>
        <Link
          href="/dashboard?settings=1&tab=history"
          className="mt-4 inline-flex text-sm font-medium text-[#50C0F0] hover:text-[#7ed2f5]"
        >
          View Full Insight →
        </Link>
      </>
    );
  };

  return (
    <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20">
      <p className="text-xs uppercase tracking-wide hg-muted">Last activity</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Last upload</h3>
      <div className="mt-3 flex min-h-24 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--hg-border-2)] bg-[var(--hg-surface-2)]">
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Last upload preview"
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              {!imageLoaded ? <div className="absolute inset-0 animate-pulse bg-white/10" /> : null}
            </>
          ) : (
            <Image
              src="/echofy-removebg-preview.png"
              alt="Last upload preview"
              fill
              sizes="96px"
              className="object-contain p-3"
            />
          )}
        </div>

        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
