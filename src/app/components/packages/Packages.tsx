"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Outfit } from "next/font/google";
import { useTranslations } from "next-intl";

const priceFont = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const packages = [
  {
    id: "lite",
    title: "Lite",
    price: "$99",
    period: "/one-time",
    outcome: "Best for getting started and testing AI analysis",
    includes: [
      "AI image analysis with platform strategy",
      "Caption and hashtag suggestions",
      "History and reports",
      "One-time face enrollment protection",
    ],
    features: [
      "AI image analysis with platform strategy",
      "Caption and hashtag suggestions",
      "History and reports",
      "One-time face enrollment protection",
    ],
    highlights: ["Uploads included", "Fast results", "Email support (basic)"],
    badge: null,
    icon: ShieldCheck,
    featured: false,
  },
  {
    id: "pro",
    title: "Pro",
    price: "$189",
    period: "/one-time",
    outcome: "Best for consistent creators posting weekly",
    includes: [
      "Everything in Lite",
      "Higher quotas (uploads + more AI usage)",
      "Advanced strategy output (detailed per platform)",
      "Priority processing",
      "Better support",
    ],
    features: [
      "Everything in Lite",
      "Higher quotas (uploads + more AI usage)",
      "Advanced strategy output (detailed per platform)",
      "Priority processing",
      "Better support",
    ],
    highlights: ["Most popular", "More AI capacity", "Faster turnaround"],
    badge: "Most Popular",
    icon: Sparkles,
    featured: true,
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "$399",
    period: "/one-time",
    outcome: "Best for power users and agencies",
    includes: [
      "Everything in Pro",
      "Maximum quotas for scale",
      "Talking Head video credits included",
      "Premium support",
    ],
    features: [
      "Everything in Pro",
      "Maximum quotas for scale",
      "Talking Head video credits included",
      "Premium support",
    ],
    highlights: ["Best value for teams", "Highest priority", "Agency-ready scale"],
    badge: "Best Value",
    icon: Crown,
    featured: false,
  },
];

type PlanCopy = {
  title: string;
  price: string;
  period: string;
  outcome: string;
  includes: string[];
  highlights: string[];
  badge: string | null;
  cta: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPlanCopy(value: unknown): value is PlanCopy {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.title === "string" &&
    typeof obj.price === "string" &&
    typeof obj.period === "string" &&
    typeof obj.outcome === "string" &&
    isStringArray(obj.includes) &&
    isStringArray(obj.highlights) &&
    (typeof obj.badge === "string" || obj.badge === null) &&
    typeof obj.cta === "string"
  );
}

export default function Packages() {
  const t = useTranslations("pricing");
  const fallbackPlans: Record<string, PlanCopy> = {
    lite: {
      title: "Lite",
      price: "$99",
      period: "/one-time",
      outcome: "Best for getting started and testing AI analysis",
      includes: [
        "AI image analysis with platform strategy",
        "Caption and hashtag suggestions",
        "History and reports",
        "One-time face enrollment protection",
      ],
      highlights: ["Uploads included", "Fast results", "Email support (basic)"],
      badge: null,
      cta: "Get started",
    },
    pro: {
      title: "Pro",
      price: "$189",
      period: "/one-time",
      outcome: "Best for consistent creators posting weekly",
      includes: [
        "Everything in Lite",
        "Higher quotas (uploads + more AI usage)",
        "Advanced strategy output (detailed per platform)",
        "Priority processing",
        "Better support",
      ],
      highlights: ["Most popular", "More AI capacity", "Faster turnaround"],
      badge: "Most Popular",
      cta: "Get started",
    },
    ultimate: {
      title: "Ultimate",
      price: "$399",
      period: "/one-time",
      outcome: "Best for power users and agencies",
      includes: [
        "Everything in Pro",
        "Maximum quotas for scale",
        "Talking Head video credits included",
        "Premium support",
      ],
      highlights: ["Best value for teams", "Highest priority", "Agency-ready scale"],
      badge: "Best Value",
      cta: "Get started",
    },
  };

  return (
    <section id="packages" className="scroll-mt-32 space-y-10 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("eyebrow")}</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white">{t("title")}</h2>
        <p className="text-base text-[var(--hg-muted)] max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto px-4">
        {packages.map((pkg, i) => {
          const rawPlan = t.raw(`plans.${pkg.id}`);
          const plan = isPlanCopy(rawPlan) ? rawPlan : fallbackPlans[pkg.id];
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="flex"
            >
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className={`
                  group relative isolate flex min-h-[400px] flex-col w-full rounded-3xl border p-4 md:p-5
                  transition-colors duration-200 hover:border-[var(--hg-accent)]/50 hover:shadow-[0_14px_30px_rgba(80,192,240,0.16)]
                  ${pkg.featured
                    ? 'border-[var(--hg-border)] bg-[var(--hg-surface-2)] shadow-[0_18px_45px_rgba(0,0,0,0.38)]'
                    : 'border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]'
                  }
                `}
              >
                {pkg.featured ? (
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(80,192,240,0.14),transparent_55%)]" />
                ) : null}

                {/* Badge */}
                {plan.badge ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                    className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`rounded-full px-2 ${
                        pkg.featured ? "bg-[var(--hg-surface-2)]" : "bg-[var(--hg-surface)]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-accent)_14%,transparent)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#9fd9f3] shadow-[0_10px_22px_rgba(80,192,240,0.14)]">
                        <Zap className="h-3.5 w-3.5" />
                        {plan.badge}
                      </span>
                    </div>
                  </motion.div>
                ) : null}

                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--hg-border)] bg-white/[0.03]">
                  <pkg.icon className={`h-6 w-6 ${pkg.featured ? "text-[var(--hg-accent)]" : "text-white/80"}`} />
                </div>

                {/* Plan Name */}
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
                  <p className="text-sm text-[var(--hg-muted)]">{plan.outcome}</p>
                </div>

                {/* Pricing */}
                <div className="mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`${priceFont.className} text-3xl md:text-4xl font-extrabold leading-none text-white`}>
                      {plan.price}
                    </span>
                    <span className="text-base text-[var(--hg-muted)]">{plan.period}</span>
                  </div>
                </div>

                <div className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("includesLabel")}</div>
                {/* Features List */}
                <ul className="mb-6 space-y-3">
                  {plan.includes.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.1 + idx * 0.06 + 0.2 }}
                      className="flex items-start gap-3.5 text-sm md:text-[15px] leading-6 text-[var(--hg-muted)]"
                    >
                      <Check className="h-5.5 w-5.5 shrink-0 text-[var(--hg-accent)] mt-0.5" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("highlightsLabel")}</div>
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

                {/* CTA Button */}
                <Link href={`/${pkg.id}`} className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      h-12 w-full rounded-2xl text-sm font-semibold transition-colors
                      ${pkg.featured
                        ? 'bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90 shadow-[0_10px_26px_rgba(80,192,240,0.35)]'
                        : 'bg-[var(--hg-surface-2)] text-white border border-[var(--hg-border)] hover:border-[var(--hg-accent)]/50 group-hover:shadow-[inset_0_0_0_1px_rgba(80,192,240,0.35)]'
                      }
                    `}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
