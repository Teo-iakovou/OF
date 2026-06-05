"use client";

import { useTranslations } from "next-intl";

type FitTier = "great" | "good" | "limited";

type Props = {
  score: number;
  tier: FitTier;
  active?: boolean;
  className?: string;
};

const DOT_COLOR: Record<FitTier, string> = {
  great: "bg-emerald-400",
  good: "bg-amber-400",
  limited: "bg-[var(--hg-muted-2)]",
};

const PILL_STYLE: Record<FitTier, string> = {
  great: "text-emerald-300 bg-emerald-500/12 ring-1 ring-emerald-500/20",
  good: "text-amber-300 bg-amber-500/12 ring-1 ring-amber-500/20",
  limited: "text-[var(--hg-muted)] bg-white/5 ring-1 ring-white/10",
};

export function FitBadge({ score, tier, className = "" }: Props) {
  const t = useTranslations("dashboard.recommendations");

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums leading-none ${PILL_STYLE[tier]} ${className}`}
      title={t("fitScore", { score })}
    >
      <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${DOT_COLOR[tier]}`} />
      {score}<span className="opacity-60">%</span>
    </span>
  );
}
