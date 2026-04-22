"use client";

import { useMemo, useState } from "react";
import { usePlanInfo } from "@/app/dashboard/PlanContext";

function formatTokens(value: number): string {
  if (value < 1000) return String(Math.round(value));
  if (value < 1_000_000) {
    if (value < 10_000) {
      const rounded = Math.round(value / 100) / 10;
      return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)}k`;
    }
    const rounded = Math.round(value / 1000);
    return `${rounded}k`;
  }
  const millions = value / 1_000_000;
  return `${millions.toFixed(millions >= 10 ? 0 : 1)}M`;
}

export default function ChatTokenPill() {
  const { data: planData, hasActiveInstance } = usePlanInfo();
  const [open, setOpen] = useState(false);

  const {
    usedPct,
    leftPct,
    usedDisplay,
    limitDisplay,
    unlimited,
  } = useMemo(() => {
    const used = Math.max(0, Number(planData?.chatUsedTokens ?? 0));
    const limitRaw = Number(planData?.chatLimitTokens ?? 0);
    const unlimited = !Number.isFinite(limitRaw) || limitRaw <= 0;
    const limit = unlimited ? 0 : Math.max(0, limitRaw);
    const usedPct = unlimited ? 0 : Math.max(0, Math.min(100, Math.round((used / limit) * 100)));
    const leftPct = unlimited ? 0 : 100 - usedPct;
    return {
      usedPct,
      leftPct,
      usedDisplay: formatTokens(used),
      limitDisplay: unlimited ? "Unlimited" : formatTokens(limit),
      unlimited,
    };
  }, [planData]);

  if (!hasActiveInstance) return null;

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
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:border-white/30"
        aria-haspopup="true"
        aria-expanded={open}
      >
        AI Tokens
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-gray-900/95 p-3 text-xs text-gray-100 shadow-lg transition ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="text-[11px] uppercase tracking-wide text-gray-400">Monthly AI Tokens</div>
        {unlimited ? (
          <>
            <div className="mt-1 text-sm font-semibold text-white">Included in plan</div>
            <div className="mt-1 text-gray-300">{usedDisplay} AI tokens used this cycle</div>
            <div className="mt-1 text-[11px] text-gray-400">
              Context Tokens are tracked separately per conversation in AI Chat.
            </div>
          </>
        ) : (
          <>
            <div className="mt-1 text-sm font-semibold text-white">
              {usedPct}% used ({leftPct}% left)
            </div>
            <div className="mt-1 text-gray-300">
              {usedDisplay} / {limitDisplay} AI tokens used this cycle
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              Context Tokens are tracked separately per conversation in AI Chat.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
