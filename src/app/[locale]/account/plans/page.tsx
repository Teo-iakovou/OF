"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { startCheckout } from "@/app/utils/api";
import { resolveQuotaContract } from "@/app/utils/quotaContract";

const priceFont = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

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
    period: "/one-time",
    description: "Best for getting started and testing AI analysis",
    includes: [
      "AI image analysis with platform strategy",
      "Caption and hashtag suggestions",
      "History and reports",
      "Face enrollment protection",
    ],
    highlights: ["Uploads included", "Fast results", "Email support (basic)"],
    badge: null as string | null,
    featured: false,
    icon: ShieldCheck,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$189",
    period: "/one-time",
    description: "Best for consistent creators posting weekly",
    includes: [
      "Everything in Lite",
      "Higher quotas for uploads and AI usage",
      "Advanced platform-specific strategy",
      "Priority processing and better support",
    ],
    highlights: ["Most popular", "More AI capacity", "Faster turnaround"],
    badge: "Most Popular" as string | null,
    featured: true,
    icon: Sparkles,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "$399",
    period: "/one-time",
    description: "Best for power users and agency teams",
    includes: [
      "Everything in Pro",
      "Maximum quotas for scale",
      "Talking Head video credits included",
      "Premium support",
    ],
    highlights: ["Best value for teams", "Highest priority", "Agency-ready scale"],
    badge: "Best Value" as string | null,
    featured: false,
    icon: Crown,
  },
];

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[400px] animate-pulse rounded-3xl bg-white/5" />
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {PLANS.map((plan, i) => {
          const isCurrent = hasActiveInstance && activePlanKey === plan.id;
          const busy = loadingPlan === plan.id;
          const ctaLabel = isCurrent
            ? "Current Plan"
            : hasActiveInstance
              ? `Upgrade to ${plan.name}`
              : `Get ${plan.name}`;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="flex"
            >
              <motion.article
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className={[
                  "group relative isolate flex min-h-[400px] flex-col w-full rounded-3xl border p-4 md:p-5",
                  "transition-colors duration-200 hover:border-[var(--hg-accent)]/50 hover:shadow-[0_14px_30px_rgba(80,192,240,0.16)]",
                  plan.featured
                    ? "border-[var(--hg-border)] bg-[var(--hg-surface-2)] shadow-[0_18px_45px_rgba(0,0,0,0.38)]"
                    : "border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
                  isCurrent ? "ring-1 ring-[#50C0F0]/30" : "",
                ].join(" ")}
              >
                {/* Featured radial gradient */}
                {plan.featured ? (
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(80,192,240,0.14),transparent_55%)]" />
                ) : null}

                {/* Badge */}
                {plan.badge ? (
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className={`rounded-full px-2 ${
                        plan.featured ? "bg-[var(--hg-surface-2)]" : "bg-[var(--hg-surface)]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-accent)_14%,transparent)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#9fd9f3] shadow-[0_10px_22px_rgba(80,192,240,0.14)]">
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        {plan.badge}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Plan icon */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--hg-border)] bg-white/[0.03]">
                  <plan.icon
                    className={`h-6 w-6 ${plan.featured ? "text-[var(--hg-accent)]" : "text-white/80"}`}
                    aria-hidden="true"
                  />
                </div>

                {/* Plan name + description */}
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <p className="text-sm text-[var(--hg-muted)]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`${priceFont.className} text-3xl md:text-4xl font-extrabold leading-none text-white`}>
                      {plan.price}
                    </span>
                    <span className="text-base text-[var(--hg-muted)]">{plan.period}</span>
                  </div>
                </div>

                {/* Includes */}
                <div className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
                  Includes
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.includes.map((feat) => (
                    <li key={feat} className="flex items-start gap-3.5 text-sm md:text-[15px] leading-6 text-[var(--hg-muted)]">
                      <Check className="h-5 w-5 shrink-0 text-[var(--hg-accent)] mt-0.5" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Highlights */}
                <div className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
                  Highlights
                </div>
                <div className="mb-8 flex flex-wrap gap-2">
                  {plan.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center rounded-full border border-[var(--hg-border)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/90"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  disabled={isCurrent || busy || loadingPlan !== null}
                  onClick={() => handleCheckout(plan.id)}
                  className={[
                    "mt-auto h-12 w-full rounded-2xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hg-accent)]",
                    isCurrent
                      ? "cursor-default border border-[#50C0F0]/30 bg-transparent text-[#50C0F0]/60"
                      : plan.featured
                        ? "bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90 shadow-[0_10px_26px_rgba(80,192,240,0.35)] disabled:opacity-60"
                        : "bg-[var(--hg-surface-2)] text-white border border-[var(--hg-border)] hover:border-[var(--hg-accent)]/50 group-hover:shadow-[inset_0_0_0_1px_rgba(80,192,240,0.35)] disabled:opacity-60",
                  ].join(" ")}
                >
                  {busy ? "Redirecting…" : ctaLabel}
                </button>
              </motion.article>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
