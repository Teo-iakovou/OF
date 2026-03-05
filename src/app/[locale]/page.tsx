"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Bot,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Video,
} from "lucide-react";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";
import Packages from "@/app/components/packages/Packages";
import VideoIntro from "@/app/components/features/VideoIntro";
import ScrollToTop from "@/app/components/features/ScrollToTop";
import SectionReveal from "@/app/components/common/SectionReveal";

type RawStep = { num: string; title: string; desc: string };
type RawFeature = { title: string; desc: string };
type RawFaq = { q: string; a: string };

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function isRawStep(value: unknown): value is RawStep {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.num === "string" && typeof obj.title === "string" && typeof obj.desc === "string";
}

function isRawFeature(value: unknown): value is RawFeature {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.title === "string" && typeof obj.desc === "string";
}

function isRawFaq(value: unknown): value is RawFaq {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.q === "string" && typeof obj.a === "string";
}

export default function Page() {
  const t = useTranslations("landing");
  const [showLanding, setShowLanding] = useState(false);
  const [shouldPlayIntro, setShouldPlayIntro] = useState<boolean | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const featureIcons = [BrainCircuit, Sparkles, MessageCircle, Video, Bot, Camera];

  useEffect(() => {
    const resolveIntroPlayback = () => {
      try {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const navType = nav?.type;
        const played = sessionStorage.getItem("introPlayed") === "1";
        // Play on first entry of a tab, and also on hard reloads.
        const shouldPlay = navType === "reload" || !played;
        setShouldPlayIntro(shouldPlay);
        if (shouldPlay) {
          sessionStorage.setItem("introPlayed", "1");
          setShowLanding(false);
          return;
        }
        setShowLanding(true);
      } catch {
        // Safe fallback: avoid blocking render if storage/perf APIs are unavailable.
        setShouldPlayIntro(false);
        setShowLanding(true);
      }
    };

    resolveIntroPlayback();
  }, []);

  const workflowItems = asStringArray(t.raw("hero.workflow.items"));
  const brands = asStringArray(t.raw("brands.items"));
  const stepsRaw = t.raw("how.steps");
  const steps = Array.isArray(stepsRaw) ? stepsRaw.filter(isRawStep) : [];
  const featuresRaw = t.raw("features.items");
  const features = Array.isArray(featuresRaw) ? featuresRaw.filter(isRawFeature) : [];
  const testimonials = asStringArray(t.raw("testimonials.quotes"));
  const faqsRaw = t.raw("faq.items");
  const faqs = Array.isArray(faqsRaw) ? faqsRaw.filter(isRawFaq) : [];

  if (shouldPlayIntro === null) {
    return null;
  }

  if (shouldPlayIntro && !showLanding) {
    return <VideoIntro onComplete={() => setShowLanding(true)} />;
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
        <LandingNavbar />

        <main>
          <SectionReveal as="section" id="hero" className="relative overflow-hidden border-b border-[var(--hg-border)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_540px_at_20%_-10%,rgba(80,192,240,0.18),transparent_62%),radial-gradient(900px_420px_at_80%_0%,rgba(80,192,240,0.08),transparent_70%)]" />
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("hero.eyebrow")}</p>
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {t("hero.title")}
                </h1>
                <p className="max-w-xl text-base text-[var(--hg-muted)] md:text-lg">
                  {t("hero.subtitle")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#pricing"
                    className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-5 text-sm font-semibold text-[#07131d] hover:opacity-90"
                  >
                    {t("hero.primaryCta")}
                  </a>
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-5 text-sm font-semibold text-white hover:border-[var(--hg-accent)]/50"
                  >
                    {t("hero.secondaryCta")}
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{t("hero.workflow.title")}</p>
                    <span className="rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2 py-1 text-[11px] text-[var(--hg-muted)]">
                      {t("hero.workflow.badge")}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {workflowItems.map((line, idx) => (
                      <div
                        key={line}
                        className="flex items-center gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-3 text-sm text-white/90"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${idx < 2 ? "text-[var(--hg-accent)]" : "text-[var(--hg-muted)]"}`} />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" className="border-b border-[var(--hg-border)]">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
              <div className="mb-6 space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("brands.eyebrow")}</p>
                <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("brands.title")}</h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {brands.map((brand) => (
                <span key={brand} className="text-sm font-medium tracking-wide text-[var(--hg-muted)]">
                  {brand}
                </span>
              ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="how" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("how.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("how.title")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hg-accent)] text-sm font-semibold text-[#07131d]">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--hg-muted)]">{step.desc}</p>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="features" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/40">
            <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <div className="mb-10 space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("features.eyebrow")}</p>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("features.title")}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((item, index) => {
                  const Icon = featureIcons[index] || BrainCircuit;
                  return (
                  <article key={`${item.title}-${index}`} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                    <Icon className="h-5 w-5 text-[var(--hg-accent)]" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--hg-muted)]">{item.desc}</p>
                  </article>
                  );
                })}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("testimonials.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("testimonials.title")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((quote, idx) => (
                <article key={idx} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                  <p className="text-sm text-white/90">“{quote}”</p>
                  <p className="mt-4 text-xs text-[var(--hg-muted)]">{t("testimonials.author", { index: idx + 1 })}</p>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="pricing" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/25 px-4 py-16 md:px-8 md:py-24">
            <div className="mx-auto w-full max-w-6xl">
              <Packages />
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="faq" className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("faq.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("faq.title")}</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item, idx) => {
                const open = faqOpen === idx;
                return (
                  <article key={item.q} className="overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(open ? null : idx)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-white">{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-[var(--hg-muted)] transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open ? <p className="px-5 pb-5 text-sm text-[var(--hg-muted)]">{item.a}</p> : null}
                  </article>
                );
              })}
            </div>
          </SectionReveal>

          <SectionReveal as="section" className="px-4 pb-16 md:px-8 md:pb-24">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-8 text-center md:p-12">
              <h3 className="text-2xl font-semibold text-white md:text-3xl">{t("cta.title")}</h3>
              <p className="max-w-2xl text-sm text-[var(--hg-muted)] md:text-base">
                {t("cta.subtitle")}
              </p>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-6 text-sm font-semibold text-[#07131d] hover:opacity-90"
              >
                {t("cta.button")}
              </a>
            </div>
          </SectionReveal>
        </main>

        <LandingFooter />
        <ScrollToTop />
      </div>
    </>
  );
}
