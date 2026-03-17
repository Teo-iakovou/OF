"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown, Lock, ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import SectionReveal from "@/app/components/common/SectionReveal";
import CartDrawer from "@/app/components/cart/CartDrawer";
import { Link, useRouter } from "@/i18n/navigation";
import { packages } from "@/app/components/packages/Packages";
import { useCart } from "@/app/components/cart/CartContext";
import { useUser } from "@/app/hooks/useUser";
import { buildLoginHref } from "@/app/utils/authRedirect";
import {
  startCheckout,
  subscribeCheckoutInFlight,
  getCheckoutInFlightSnapshot,
  getCheckoutInFlightServerSnapshot,
} from "@/app/utils/api";

type RawStep = { num: string; title: string; desc: string };
type RawFaqItem = { q: string; a: string };
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

function isRawStep(value: unknown): value is RawStep {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.num === "string" && typeof obj.title === "string" && typeof obj.desc === "string";
}

function isRawFaqItem(value: unknown): value is RawFaqItem {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.q === "string" && typeof obj.a === "string";
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

export default function PackageDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const selectedPackage = packages.find((pkg) => pkg.id === id);

  const tPricing = useTranslations("pricing");
  const t = useTranslations("packagePage");
  const { cartItems, addToCart } = useCart();
  const { user, loading: userLoading } = useUser({ required: false });

  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [intentHandled, setIntentHandled] = useState(false);
  const [faqOpenDetail, setFaqOpenDetail] = useState<number | null>(0);

  const checkoutInFlight = useSyncExternalStore(
    subscribeCheckoutInFlight,
    getCheckoutInFlightSnapshot,
    getCheckoutInFlightServerSnapshot
  );

  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);

  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const handleCheckout = useCallback(async () => {
    if (isCheckingOut || checkoutInFlight || !selectedPackage || userLoading) return;
    if (!user) {
      router.push(buildLoginHref(pathname, currentPath, "checkout"));
      return;
    }

    try {
      const pkgId = selectedPackage.id || cartItems[0]?.id;
      if (!pkgId) return;
      setIsCheckingOut(true);
      await startCheckout(pkgId, null, locale);
    } catch {
      setIsCheckingOut(false);
    }
  }, [cartItems, checkoutInFlight, currentPath, isCheckingOut, pathname, router, selectedPackage, user, userLoading]);

  useEffect(() => {
    if (intentHandled || userLoading || !user) return;
    if (searchParams.get("intent") === "checkout") {
      setIntentHandled(true);
      void handleCheckout();
    }
  }, [handleCheckout, intentHandled, searchParams, user, userLoading]);

  const handleAddToCart = () => {
    if (!selectedPackage) return;
    if (!user) {
      router.push(buildLoginHref(pathname, currentPath, "checkout"));
      return;
    }
    addToCart(selectedPackage.id);
    setCartOpen(true);
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
        <LandingNavbar />
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 pt-28 md:px-8 md:pt-32">
          <div className="rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-10 text-center">
            <h1 className="text-2xl font-semibold text-white">{t("notFound.title")}</h1>
            <p className="mt-2 text-sm text-[var(--hg-muted)]">{t("notFound.subtitle")}</p>
            <Link
              href="/#pricing"
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-5 text-sm font-semibold text-[#07131d]"
            >
              {t("notFound.backToPricing")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const fallbackPlan: PlanCopy = {
    title: selectedPackage.title,
    price: selectedPackage.price,
    period: selectedPackage.period,
    outcome: selectedPackage.outcome,
    includes: selectedPackage.includes,
    highlights: selectedPackage.highlights,
    badge: selectedPackage.badge,
    cta: t("hero.primaryCta"),
  };

  const rawPlan = tPricing.raw(`plans.${selectedPackage.id}`);
  const plan = isPlanCopy(rawPlan) ? rawPlan : fallbackPlan;

  const socialRaw = t.raw("sections.socialProof.items");
  const socialItems = isStringArray(socialRaw) ? socialRaw : [];

  const stepsRaw = t.raw("sections.how.steps");
  const howSteps = Array.isArray(stepsRaw) ? stepsRaw.filter(isRawStep) : [];

  const faqRaw = t.raw("faq.items");
  const genericFaq = Array.isArray(faqRaw) ? faqRaw.filter(isRawFaqItem) : [];

  const planSpecificRaw = t.raw(`faq.planSpecific.${selectedPackage.id}`);
  const planSpecificAnswer = typeof planSpecificRaw === "string" ? planSpecificRaw : plan.outcome;

  const faqItems = [
    {
      q: t("faq.planSpecificQuestion", { plan: plan.title }),
      a: planSpecificAnswer,
    },
    ...genericFaq,
  ];

  const includedItems = [...plan.includes, ...plan.highlights].slice(0, 9);

  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <LandingNavbar />

      <main className="pt-28 md:pt-32">

        {/* Hero */}
        <SectionReveal as="section" className="border-b border-[var(--hg-border)]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-start md:px-8 md:py-16">
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]"
              >
                {t("hero.eyebrow")}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-semibold leading-tight text-white md:text-5xl"
              >
                {plan.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-xl text-base text-[var(--hg-muted)] md:text-lg"
              >
                {plan.outcome}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="flex items-end gap-2"
              >
                <span className="text-4xl font-bold leading-none text-white md:text-5xl">{plan.price}</span>
                <span className="text-base text-[var(--hg-muted)]">{plan.period}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  onClick={() => void handleCheckout()}
                  disabled={isCheckingOut || checkoutInFlight || userLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-5 text-sm font-semibold text-[#07131d] hover:opacity-90 disabled:opacity-60"
                >
                  {isCheckingOut || checkoutInFlight ? t("hero.processingCta") : t("hero.primaryCta")}
                </motion.button>
                <Link
                  href="/#pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-5 text-sm font-semibold text-white hover:border-[var(--hg-accent)]/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("hero.secondaryCta")}
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{t("hero.summary.title")}</p>
                {plan.badge ? (
                  <span className="rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2 py-1 text-[11px] text-[var(--hg-muted)]">
                    {plan.badge}
                  </span>
                ) : null}
              </div>
              <ul className="space-y-3">
                {plan.includes.slice(0, 4).map((item, idx) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.09 }}
                    className="flex items-start gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-3 text-sm text-white/90"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hg-accent)]" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={handleAddToCart}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-sm font-semibold text-white hover:border-[var(--hg-accent)]/50 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("hero.summary.addToCart")}
              </button>
            </motion.div>
          </div>
        </SectionReveal>

        {/* Social proof — marquee */}
        <SectionReveal as="section" className="border-b border-[var(--hg-border)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
            <div className="mb-6 space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("sections.socialProof.eyebrow")}</p>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("sections.socialProof.title")}</h2>
            </div>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="flex w-max items-center gap-x-14"
              >
                {[...socialItems, ...socialItems].map((item, i) => (
                  <span key={i} className="whitespace-nowrap text-sm font-medium tracking-wide text-[var(--hg-muted)]">
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </SectionReveal>

        {/* What's included */}
        <SectionReveal as="section" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("sections.included.eyebrow")}</p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("sections.included.title")}</h2>
            <p className="text-sm text-[var(--hg-muted)] md:text-base">{t("sections.included.subtitle")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {includedItems.map((item, index) => (
              <motion.article
                key={`${item}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 transition-colors hover:border-[var(--hg-accent)]/30"
              >
                <Sparkles className="h-5 w-5 text-[var(--hg-accent)]" />
                <p className="mt-4 text-sm text-white/90">{item}</p>
              </motion.article>
            ))}
          </div>
        </SectionReveal>

        {/* How it works */}
        <SectionReveal as="section" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/25">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("sections.how.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("sections.how.title")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {howSteps.map((step, index) => (
                <motion.article
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hg-accent)] text-sm font-semibold text-[#07131d]">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--hg-muted)]">{step.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Security + Addons */}
        <SectionReveal as="section" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-5 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("sections.security.eyebrow")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{t("sections.security.title")}</h3>
              <div className="mt-5 space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4"
                >
                  <p className="flex items-start gap-2 text-sm text-white/90">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hg-accent)]" />
                    {t("sections.security.enrollment")}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4"
                >
                  <p className="flex items-start gap-2 text-sm text-white/90">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hg-accent)]" />
                    {t("sections.security.quota")}
                  </p>
                </motion.div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("sections.addons.eyebrow")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{t("sections.addons.title")}</h3>
              <p className="mt-3 text-sm text-[var(--hg-muted)]">{t("sections.addons.subtitle")}</p>
              <ul className="mt-5 space-y-3">
                {plan.highlights.map((item, idx) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="flex items-start gap-2 text-sm text-white/90"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hg-accent)]" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.article>
          </div>
        </SectionReveal>

        {/* FAQ — interactive accordion */}
        <SectionReveal as="section" className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-20">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("faq.eyebrow")}</p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("faq.title")}</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const open = faqOpenDetail === index;
              return (
                <motion.article
                  key={`${item.q}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenDetail(open ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{item.q}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="h-4 w-4 text-[var(--hg-muted)]" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-[var(--hg-muted)]">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </SectionReveal>

        {/* Final CTA */}
        <SectionReveal as="section" className="px-4 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-8 text-center md:p-12">
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-semibold text-white md:text-3xl"
            >
              {t("cta.title")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl text-sm text-[var(--hg-muted)] md:text-base"
            >
              {t("cta.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <motion.button
                onClick={() => void handleCheckout()}
                disabled={isCheckingOut || checkoutInFlight || userLoading}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-6 text-sm font-semibold text-[#07131d] hover:opacity-90 disabled:opacity-60"
              >
                {isCheckingOut || checkoutInFlight ? t("hero.processingCta") : t("cta.primaryCta")}
              </motion.button>
              <Link
                href="/#pricing"
                className="inline-flex h-11 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-6 text-sm font-semibold text-white hover:border-[var(--hg-accent)]/50 transition-colors"
              >
                {t("cta.secondaryCta")}
              </Link>
            </motion.div>
          </div>
        </SectionReveal>
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => void handleCheckout()} />
    </div>
  );
}
