"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
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
type RawSection = { eyebrow: string; title: string; body: string; cta: string };

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

function isRawSection(value: unknown): value is RawSection {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.eyebrow === "string" &&
    typeof obj.title === "string" &&
    typeof obj.body === "string" &&
    typeof obj.cta === "string"
  );
}

export default function Page() {
  const t = useTranslations("landing");
  const [showLanding, setShowLanding] = useState(false);
  const [shouldPlayIntro, setShouldPlayIntro] = useState<boolean | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const featureIcons = [BrainCircuit, Sparkles, MessageCircle, Video, Bot, Camera];
  const mediaSectionsMeta = [
    { id: "preview-ai-strategy",     videoSrc: "/Avatar_IV_Video 1*.mp4",          ctaHref: "#pricing",   featured: true,  objectPos: "object-top"    },
    { id: "preview-creator-workflow", videoSrc: "/Avatar IV Video_1080p 2*.mp4",    ctaHref: "#how",       featured: false, objectPos: "object-top"    },
    { id: "preview-avatar-content",  videoSrc: "/Avatar IV Video_1080p 3*.mp4",     ctaHref: "#features",  featured: false, objectPos: "object-center" },
  ] as const;
  const livePreviewSectionsRaw = t.raw("livePreview.sections");
  const livePreviewSections = Array.isArray(livePreviewSectionsRaw)
    ? livePreviewSectionsRaw.filter(isRawSection)
    : [];
  const mediaSections = mediaSectionsMeta.map((meta, i) => ({
    ...meta,
    eyebrow:  livePreviewSections[i]?.eyebrow  ?? "",
    title:    livePreviewSections[i]?.title    ?? "",
    body:     livePreviewSections[i]?.body     ?? "",
    ctaLabel: livePreviewSections[i]?.cta      ?? "",
  }));

  useEffect(() => {
    const publishIntroState = (playing: boolean) => {
      try {
        if (playing) sessionStorage.setItem("landingIntroPlaying", "1");
        else sessionStorage.removeItem("landingIntroPlaying");
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent("landing:intro-state", { detail: { playing } }));
      } catch {}
    };

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
          publishIntroState(true);
          setShowLanding(false);
          return;
        }
        publishIntroState(false);
        setShowLanding(true);
      } catch {
        // Safe fallback: avoid blocking render if storage/perf APIs are unavailable.
        publishIntroState(false);
        setShouldPlayIntro(false);
        setShowLanding(true);
      }
    };

    resolveIntroPlayback();

    return () => {
      publishIntroState(false);
    };
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
    return (
      <VideoIntro
        onComplete={() => {
          try {
            sessionStorage.removeItem("landingIntroPlaying");
          } catch {}
          try {
            window.dispatchEvent(new CustomEvent("landing:intro-state", { detail: { playing: false } }));
          } catch {}
          setShowLanding(true);
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
        <LandingNavbar />

        <main>
          <SectionReveal as="section" id="hero" className="relative overflow-hidden border-b border-[var(--hg-border)] scroll-mt-32 md:scroll-mt-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_540px_at_20%_-10%,rgba(80,192,240,0.18),transparent_62%),radial-gradient(900px_420px_at_80%_0%,rgba(80,192,240,0.08),transparent_70%)]" />
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-28 md:grid-cols-2 md:items-center md:px-8 md:py-24">
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
                  {t("hero.title")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.32 }}
                  className="max-w-xl text-base text-[var(--hg-muted)] md:text-lg"
                >
                  {t("hero.subtitle")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.44 }}
                  className="flex flex-wrap gap-3"
                >
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
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <div className="rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{t("hero.workflow.title")}</p>
                    <span className="rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2 py-1 text-[11px] text-[var(--hg-muted)]">
                      {t("hero.workflow.badge")}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {workflowItems.map((line, idx) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 + idx * 0.1 }}
                        className="flex items-center gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-3 text-sm text-white/90"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${idx < 2 ? "text-[var(--hg-accent)]" : "text-[var(--hg-muted)]"}`} />
                        <span>{line}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="brands" className="border-b border-[var(--hg-border)] scroll-mt-32 md:scroll-mt-28">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
              <div className="mb-6 space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("brands.eyebrow")}</p>
                <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("brands.title")}</h2>
              </div>
              <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
                  className="flex w-max items-center gap-x-14"
                >
                  {[...brands, ...brands].map((brand, i) => (
                    <span key={i} className="whitespace-nowrap text-sm font-medium tracking-wide text-[var(--hg-muted)]">
                      {brand}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="how" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24 scroll-mt-32 md:scroll-mt-28">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("how.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("how.title")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.article
                  key={`${step.title}-${index}`}
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
          </SectionReveal>

          <SectionReveal as="section" id="features" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/40 scroll-mt-32 md:scroll-mt-28">
            <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <div className="mb-10 space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("features.eyebrow")}</p>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("features.title")}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((item, index) => {
                  const Icon = featureIcons[index] || BrainCircuit;
                  return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 transition-colors hover:border-[var(--hg-accent)]/30"
                  >
                    <Icon className="h-5 w-5 text-[var(--hg-accent)]" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--hg-muted)]">{item.desc}</p>
                  </motion.article>
                  );
                })}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="workflow-media" className="border-b border-[var(--hg-border)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--hg-surface)_18%,transparent),color-mix(in_oklab,var(--hg-surface)_30%,transparent))]">
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-7 px-4 py-14 md:gap-8 md:px-8 md:py-20">
              <div className="mx-auto max-w-3xl space-y-2.5 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("livePreview.eyebrow")}</p>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("livePreview.title")}</h2>
                <p className="text-sm text-[var(--hg-muted)] md:text-base">
                  {t("livePreview.subtitle")}
                </p>
              </div>
              {mediaSections.map((section, idx) => (
                <motion.article
                  key={section.title}
                  id={section.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                  className={`relative grid scroll-mt-28 items-center gap-5 overflow-hidden rounded-3xl border border-[var(--hg-border)]/85 bg-[var(--hg-surface)]/52 p-4 shadow-[0_14px_36px_rgba(0,0,0,0.24)] md:grid-cols-12 md:gap-7 md:p-5 ${
                    section.featured ? "md:p-6" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_-25%,rgba(80,192,240,0.12),transparent_56%)]" />
                  <div className={`relative z-[1] space-y-3 md:col-span-6 ${idx % 2 === 1 ? "md:order-2" : ""}`}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--hg-muted)]">{section.eyebrow}</p>
                    <h3 className="text-xl font-semibold leading-tight text-white md:text-[1.7rem]">{section.title}</h3>
                    <p className="text-sm text-[var(--hg-muted)] md:text-base">{section.body}</p>
                    <a
                      href={section.ctaHref}
                      className="inline-flex h-9 items-center rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3.5 text-sm font-medium text-white transition hover:border-[var(--hg-accent)]/45 hover:text-[#b7e8fb]"
                    >
                      {section.ctaLabel}
                    </a>
                  </div>
                  <div className={`relative z-[1] md:col-span-6 ${idx % 2 === 1 ? "md:order-1" : ""}`}>
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.3 }}
                      className={`relative h-[380px] w-full overflow-hidden rounded-2xl border border-[var(--hg-border)]/75 shadow-[0_12px_30px_rgba(0,0,0,0.3)] md:h-[460px] lg:h-[520px] ${section.featured ? "md:rounded-[1.3rem]" : ""}`}
                    >
                      <video
                        className={`absolute inset-0 h-full w-full object-cover ${section.objectPos}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      >
                        <source src={section.videoSrc} type="video/mp4" />
                      </video>
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("testimonials.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("testimonials.title")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((quote, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
                >
                  <p className="text-sm text-white/90">"{quote}"</p>
                  <p className="mt-4 text-xs text-[var(--hg-muted)]">{t("testimonials.author", { index: idx + 1 })}</p>
                </motion.article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="pricing" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/25 px-4 py-16 md:px-8 md:py-24 scroll-mt-32 md:scroll-mt-28">
            <div className="mx-auto w-full max-w-6xl">
              <Packages />
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="faq" className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24 scroll-mt-32 md:scroll-mt-28">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("faq.eyebrow")}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("faq.title")}</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item, idx) => {
                const open = faqOpen === idx;
                return (
                  <motion.article
                    key={item.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                    className="overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(open ? null : idx)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-white">{item.q}</span>
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
              <motion.a
                href="#pricing"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.32 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-6 text-sm font-semibold text-[#07131d] hover:opacity-90"
              >
                {t("cta.button")}
              </motion.a>
            </div>
          </SectionReveal>
        </main>

        <LandingFooter />
        <ScrollToTop />
      </div>
    </>
  );
}
