"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Check, Crown, Shield, Sparkles, X, Zap } from "lucide-react";
import { startCheckout } from "@/app/utils/api";
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@/app/hooks/useUser";
import { buildLoginHref } from "@/app/utils/authRedirect";

type PackagesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PLANS = [
  {
    id: "lite",
    name: "Lite",
    price: "$99",
    bestFor: "Getting started and trying AI analysis",
    includes: [
      "AI image analysis with platform strategy for Instagram, TikTok, and Twitter",
      "Caption and hashtag suggestions",
      "History and reports in your dashboard",
      "One-time profile face enrollment protection",
    ],
    highlights: ["Uploads included", "Fast results", "Basic email support"],
    cta: "Select Lite",
    badge: null,
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$189",
    bestFor: "Consistent creators posting weekly",
    includes: [
      "Everything in Lite",
      "Higher quotas for uploads and AI usage",
      "Advanced platform-specific strategy output",
      "Priority processing and better support",
    ],
    highlights: ["Most popular", "Deeper recommendations", "Faster pipeline"],
    cta: "Upgrade to Pro",
    badge: "Most popular",
    featured: true,
  },
  {
    id: "ultimate",
    name: "Elite",
    price: "$399",
    bestFor: "Power users and agency teams",
    includes: [
      "Everything in Pro",
      "Maximum quotas for scale",
      "Talking Head video credits included",
      "Highest priority processing and premium support",
    ],
    highlights: ["Best value for teams", "Maximum quotas", "Priority support"],
    cta: "Upgrade to Elite",
    badge: "Best value",
    featured: false,
  },
];

export default function PackagesModal({ open, onOpenChange }: PackagesModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser({ required: false });
  const [mounted, setMounted] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close packages"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="absolute left-1/2 top-1/2 z-[130] overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-2xl"
        style={{
          width: "min(980px, calc(100vw - 32px))",
          height: "min(720px, calc(100vh - 32px))",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center justify-between border-b border-[var(--hg-border-2)] px-4 py-3 md:px-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Plans that fit your scale</h2>
            <p className="text-xs text-[var(--hg-muted)]">Choose a plan and continue to checkout.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-[var(--hg-muted)] hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-5">
            {PLANS.map((plan) => {
              const loading = loadingPlan === plan.id;
              return (
                <article
                  key={plan.id}
                  className={[
                    "relative flex min-h-[430px] flex-col rounded-2xl border bg-[var(--hg-surface-2)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--hg-accent)]/50 hover:shadow-[0_14px_30px_rgba(80,192,240,0.16)]",
                    plan.featured
                      ? "border-[var(--hg-accent)]/60 shadow-[0_10px_32px_rgba(80,192,240,0.14)]"
                      : "border-[var(--hg-border)]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white">{plan.price}</p>
                    </div>
                  </div>
                  {plan.badge ? (
                    <div className="absolute right-4 top-0 -translate-y-1/2 bg-[var(--hg-surface-2)] px-1">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-accent)]/15 px-2.5 py-1 text-[11px] font-medium text-[#9fd9f3]">
                        {plan.name === "Pro" ? <Sparkles className="h-3.5 w-3.5" /> : <Crown className="h-3.5 w-3.5" />}
                        {plan.badge}
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.13em] text-[var(--hg-muted)]">Best for</p>
                    <p className="mt-1.5 text-sm text-white/90">{plan.bestFor}</p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.13em] text-[var(--hg-muted)]">Includes</p>
                    <ul className="mt-2.5 space-y-2 text-sm text-[var(--hg-muted)]">
                      {plan.includes.map((feature) => (
                        <li key={`${plan.id}-${feature}`} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--hg-accent)]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.13em] text-[var(--hg-muted)]">Key highlights</p>
                    <ul className="mt-2.5 space-y-2 text-sm text-white/90">
                      {plan.highlights.map((highlight, index) => (
                        <li key={`${plan.id}-highlight-${highlight}`} className="flex items-center gap-2.5">
                          {index === 0 ? (
                            <Zap className="h-3.5 w-3.5 shrink-0 text-[var(--hg-accent)]" />
                          ) : (
                            <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--hg-accent)]" />
                          )}
                          <span className="font-medium">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      if (userLoading) return;
                      if (!user) {
                        router.push(buildLoginHref(pathname, `/${plan.id}`, "checkout"));
                        onOpenChange(false);
                        return;
                      }
                      try {
                        setLoadingPlan(plan.id);
                        await startCheckout(plan.id);
                      } finally {
                        setLoadingPlan(null);
                      }
                    }}
                    className="mt-auto w-full rounded-xl bg-[#50C0F0] px-4 py-2.5 text-sm font-semibold text-[#07131d] shadow-[0_10px_20px_rgba(80,192,240,0.22)] transition duration-200 ease-out hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? "Redirecting..." : plan.cta}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
