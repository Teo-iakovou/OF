"use client";

import Link from "next/link";

type QuotaRingTileProps = {
  label: string;
  used: number;
  effectiveLimit: number | null;
  isUnlimited: boolean;
  topUpHref?: string;
  topUpDisabled?: boolean;
  comingSoonLabel?: string;
  topUpLabel?: string;
  className?: string;
};

const RADIUS = 28;
const STROKE = 6;
const CIRC = 2 * Math.PI * RADIUS;

const formatCenter = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(Math.round(n));
};

const arcColor = (pct: number, isUnlimited: boolean): string => {
  if (isUnlimited) return "#50C0F0";
  if (pct > 0.2) return "#50C0F0";
  if (pct > 0.1) return "#fbbf24";
  if (pct > 0) return "#f87171";
  return "transparent";
};

const topUpColor = (pct: number): string =>
  pct < 0.1 ? "#f87171" : "#50C0F0";

export default function QuotaRingTile({
  label,
  used,
  effectiveLimit,
  isUnlimited,
  topUpHref,
  topUpDisabled,
  comingSoonLabel = "Coming soon",
  topUpLabel = "top up →",
  className,
}: QuotaRingTileProps) {
  const remaining = isUnlimited
    ? Infinity
    : Math.max(0, (effectiveLimit ?? 0) - used);

  const remainingPct = isUnlimited
    ? 1
    : effectiveLimit && effectiveLimit > 0
    ? remaining / effectiveLimit
    : 0;

  const color = arcColor(remainingPct, isUnlimited);
  const dashOffset = CIRC * (1 - (isUnlimited ? 1 : remainingPct));
  const showTopUp = !isUnlimited && remainingPct <= 0.2;

  const centerText = isUnlimited
    ? "∞"
    : formatCenter(remaining === Infinity ? 0 : remaining);

  const ariaLabel = isUnlimited
    ? `${label}: unlimited`
    : `${label}: ${remaining} remaining of ${effectiveLimit ?? 0}`;

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 shadow-sm shadow-black/20${className ? ` ${className}` : ""}`}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{ transform: "rotate(-90deg)" }}
        role="img"
        aria-label={ariaLabel}
      >
        {/* Background ring */}
        <circle
          cx="36"
          cy="36"
          r={RADIUS}
          fill="none"
          stroke="#1e2d3a"
          strokeWidth={STROKE}
        />
        {/* Active arc */}
        {color !== "transparent" && (
          <circle
            cx="36"
            cy="36"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
          />
        )}
      </svg>

      <p className="mt-1 text-lg font-bold leading-none text-white">
        {centerText}
      </p>

      <p className="mt-1 text-[13px] text-[var(--hg-muted)] text-center leading-tight">
        {label}
      </p>

      {!isUnlimited && effectiveLimit !== null && (
        <p className="mt-0.5 text-[11px] text-[var(--hg-muted-2)] text-center">
          of {formatCenter(effectiveLimit)}
        </p>
      )}

      {showTopUp && (
        <div className="mt-2">
          {topUpDisabled ? (
            <span className="text-[11px] text-[var(--hg-muted)]">
              {comingSoonLabel}
            </span>
          ) : topUpHref ? (
            <Link
              href={topUpHref}
              className="text-[11px] font-medium"
              style={{ color: topUpColor(remainingPct) }}
            >
              {topUpLabel}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
