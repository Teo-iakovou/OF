"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { startCheckout } from "@/app/utils/api";
import { resolveQuotaContract } from "@/app/utils/quotaContract";

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  lite: "Lite",
  pro: "Pro",
  ultimate: "Ultimate",
};

const PLANS = [
  {
    id: "lite",
    name: "Lite",
    price: "$99",
    description: "Best for getting started and testing AI analysis",
    includes: [
      "AI image analysis with platform strategy",
      "Caption and hashtag suggestions",
      "History and reports",
      "Face enrollment protection",
    ],
    badge: null,
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$189",
    description: "Best for consistent creators posting weekly",
    includes: [
      "Everything in Lite",
      "Higher quotas for uploads and AI usage",
      "Advanced platform-specific strategy",
      "Priority processing and better support",
    ],
    badge: "Most Popular",
    featured: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "$399",
    description: "Best for power users and agency teams",
    includes: [
      "Everything in Pro",
      "Maximum quotas for scale",
      "Talking Head video credits included",
      "Premium support",
    ],
    badge: "Best Value",
    featured: false,
  },
] as const;

function QuotaBar({
  label,
  used,
  limit,
  remaining,
  isUnlimited,
}: {
  label: string;
  used: number | null;
  limit: number | null;
  remaining: number | null;
  isUnlimited: boolean;
}) {
  const fmt = (v: number | null) => {
    if (v === null) return "∞";
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(Math.round(v));
  };
  const pct = isUnlimited || !limit || !used ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{isUnlimited ? "Unlimited" : `${fmt(remaining)} remaining`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#50C0F0]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AccountPlansPage() {
  const locale = useLocale();
  const { loading, hasActiveInstance, data: planData } = usePlanInfo();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const activePlanKey = planData?.packageInstanceId ? (planData.package ?? null) : null;
  const activePlanName = activePlanKey ? (PLAN_DISPLAY_NAMES[activePlanKey] ?? activePlanKey) : null;

  const quotas = resolveQuotaContract(planData, "account.plans");

  const handleCheckout = async (planId: string) => {
    if (loadingPlan) return;
    try {
      setLoadingPlan(planId);
      await startCheckout(planId, null, locale);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active plan card */}
      {hasActiveInstance && activePlanName ? (
        <section className="rounded-2xl border border-[var(--hg-border)] bg-white/5 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Your plan</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{activePlanName}</h2>
          </div>
          <div className="space-y-3">
            <QuotaBar
              label="Uploads"
              used={quotas.uploads.used}
              limit={quotas.uploads.effectiveLimit}
              remaining={quotas.uploads.remaining}
              isUnlimited={quotas.uploads.isUnlimited}
            />
            <QuotaBar
              label="AI Tokens"
              used={quotas.aiTokens.used}
              limit={quotas.aiTokens.effectiveLimit}
              remaining={quotas.aiTokens.remaining}
              isUnlimited={quotas.aiTokens.isUnlimited}
            />
            <QuotaBar
              label="Avatar Videos"
              used={quotas.videos.used}
              limit={quotas.videos.effectiveLimit}
              remaining={quotas.videos.remaining}
              isUnlimited={quotas.videos.isUnlimited}
            />
          </div>
        </section>
      ) : null}

      {/* Heading */}
      <div>
        {hasActiveInstance ? (
          <h1 className="text-xl font-semibold text-white">Want to upgrade or add credits?</h1>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-white">Choose a plan to get started</h1>
            <p className="mt-1 text-sm text-slate-400">
              Unlock AI uploads, video generation, and content strategy.
            </p>
          </>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = hasActiveInstance && activePlanKey === plan.id;
          const busy = loadingPlan === plan.id;
          const ctaLabel = isCurrent
            ? "Current Plan"
            : hasActiveInstance
              ? `Upgrade to ${plan.name}`
              : `Get ${plan.name}`;

          return (
            <article
              key={plan.id}
              className={[
                "relative flex flex-col rounded-2xl border p-5 transition",
                plan.featured
                  ? "border-[var(--hg-accent)]/50 bg-[var(--hg-surface-2)] shadow-[0_10px_32px_rgba(80,192,240,0.12)]"
                  : "border-[var(--hg-border)] bg-white/5",
                isCurrent ? "ring-1 ring-[#50C0F0]/30" : "",
              ].join(" ")}
            >
              {plan.badge ? (
                <div className="absolute right-4 top-0 -translate-y-1/2 bg-[var(--hg-surface-2)] px-1">
                  <span className="inline-block rounded-full border border-[var(--hg-border)] bg-[var(--hg-accent)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#9fd9f3]">
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-2xl font-bold text-white">{plan.price}</p>
                <p className="text-xs text-slate-500">/one-time</p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{plan.description}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {plan.includes.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#50C0F0]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent || busy || loadingPlan !== null}
                onClick={() => handleCheckout(plan.id)}
                className={[
                  "mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                  isCurrent
                    ? "cursor-default border border-[#50C0F0]/30 bg-transparent text-[#50C0F0]/60"
                    : plan.featured
                      ? "bg-[#50C0F0] text-[#07131d] hover:opacity-90 disabled:opacity-60"
                      : "border border-[var(--hg-border)] bg-white/5 text-white hover:border-[var(--hg-accent)]/40 hover:bg-white/10 disabled:opacity-60",
                ].join(" ")}
              >
                {busy ? "Redirecting…" : ctaLabel}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
