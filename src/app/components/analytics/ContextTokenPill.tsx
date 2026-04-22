"use client";

import { useMemo, useState } from "react";

type ContextTokenPillProps = {
  tokensUsed?: number;
  tokensLimit?: number;
  nearLimit?: boolean;
};

function formatTokens(value: number): string {
  if (value < 1000) return String(Math.round(value));
  if (value < 1_000_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export default function ContextTokenPill({
  tokensUsed,
  tokensLimit,
  nearLimit,
}: ContextTokenPillProps) {
  const [open, setOpen] = useState(false);
  const hasData = typeof tokensUsed === "number" && typeof tokensLimit === "number" && tokensLimit > 0;

  const { usedPct, leftPct, usedDisplay, limitDisplay } = useMemo(() => {
    const used = Math.max(0, Number(tokensUsed ?? 0));
    const limit = Math.max(1, Number(tokensLimit ?? 1));
    const usedPct = Math.max(0, Math.min(100, Math.round((used / limit) * 100)));
    const leftPct = 100 - usedPct;
    return {
      usedPct,
      leftPct,
      usedDisplay: formatTokens(used),
      limitDisplay: formatTokens(limit),
    };
  }, [tokensUsed, tokensLimit]);

  if (!hasData) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setOpen(false)}
        className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:border-white/30"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Context Tokens
        {nearLimit ? (
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
        ) : null}
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-gray-900/95 p-3 text-xs text-gray-100 shadow-lg transition ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="text-[11px] uppercase tracking-wide text-gray-400">Context Window</div>
        <div className="mt-1 text-sm font-semibold text-white">
          {usedPct}% used ({leftPct}% left)
        </div>
        <div className="mt-1 text-gray-300">
          {usedDisplay} / {limitDisplay} context tokens used
        </div>
      </div>
    </div>
  );
}
