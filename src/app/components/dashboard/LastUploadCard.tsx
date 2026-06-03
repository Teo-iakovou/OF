"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon, ArrowRight } from "lucide-react";
import { getRecentCreations, type RecentCreation } from "@/app/utils/api";
import { useLocale, useTranslations } from "next-intl";

type LastUploadCardProps = {
  packageInstanceId?: string | null;
  className?: string;
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

const relativeDate = (dateStr: string, locale: string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
};

export default function LastUploadCard({ packageInstanceId, className }: LastUploadCardProps) {
  const t = useTranslations("dashboard.home.lastActivity");
  const locale = useLocale();
  const [item, setItem] = useState<RecentCreation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!packageInstanceId) {
      setItem(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getRecentCreations({ packageInstanceId, limit: 1 })
      .then((res) => {
        if (!cancelled) setItem(res[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [packageInstanceId]);

  const hasThumb =
    item &&
    typeof item.thumbnailUrl === "string" &&
    isLikelyImageUrl(item.thumbnailUrl);

  const nicheLabel = item
    ? item.title.replace(/ report$/i, "") || t("unspecifiedNiche")
    : "";
  const dateLabel = item?.createdAt ? relativeDate(item.createdAt, locale) : "";
  const typeLabel = item?.type || "";

  return (
    <div
      className={`rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-5 py-4 shadow-sm shadow-black/20${className ? ` ${className}` : ""}`}
    >
      {loading ? (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-16 w-16 shrink-0 rounded-xl bg-[var(--hg-surface-2)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-3 w-48 rounded bg-white/10" />
          </div>
          <div className="h-8 w-28 rounded-xl bg-white/10" />
        </div>
      ) : !item ? (
        <p className="text-sm text-[var(--hg-muted)]">{t("noUploads")}</p>
      ) : (
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--hg-border-2)] bg-[var(--hg-surface-2)]">
            {hasThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnailUrl!}
                alt={nicheLabel}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-6 w-6 text-[var(--hg-muted-2)]" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--hg-text)]">
              {t("lastUpload")}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-[var(--hg-muted)]">
              {[dateLabel, typeLabel].filter(Boolean).join(" · ")}
            </p>
            {nicheLabel ? (
              <p className="mt-0.5 truncate text-[12px] text-[var(--hg-muted-2)]">
                {nicheLabel}
              </p>
            ) : null}
          </div>

          {/* CTA */}
          <Link
            href="/dashboard?settings=1&tab=history"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--hg-border)] px-3 py-2 text-xs font-medium text-[var(--hg-text)] transition-colors hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)]"
          >
            {t("viewRecommendations")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
