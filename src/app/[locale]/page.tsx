"use client";

import { useState } from "react";
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

const featureItems = [
  {
    icon: BrainCircuit,
    title: "AI image analysis",
    desc: "Generate platform-ready posting strategy from one upload.",
  },
  {
    icon: Sparkles,
    title: "Captions + hashtags",
    desc: "Receive optimized copy variations and hashtag sets quickly.",
  },
  {
    icon: MessageCircle,
    title: "AI coach chat",
    desc: "Ask for rewrites, timing suggestions, and creative direction.",
  },
  {
    icon: Video,
    title: "AI video avatar",
    desc: "Turn face photo + audio into ready-to-share talking videos.",
  },
  {
    icon: Bot,
    title: "History and reports",
    desc: "Track outputs, revisit plans, and open report details anytime.",
  },
  {
    icon: Camera,
    title: "Face-bound security",
    desc: "Package-instance enrollment and verification protect usage.",
  },
];

const faqs = [
  {
    q: "How does Echofy generate recommendations?",
    a: "We analyze uploaded visuals and produce platform-focused plans, captions, hashtags, and posting windows.",
  },
  {
    q: "Can I use it for multiple content styles?",
    a: "Yes. Each upload can produce a different strategy and you can compare outputs from your history.",
  },
  {
    q: "Do I need to enroll my face?",
    a: "Yes, one-time enrollment is required per active package instance for security and access control.",
  },
  {
    q: "Is talking-head video included?",
    a: "Yes. Video generation is included by plan, with extra credits available as add-ons.",
  },
  {
    q: "What happens when I reach quota limits?",
    a: "You can upgrade plan capacity or purchase add-ons inside billing without changing your current setup.",
  },
  {
    q: "Where can I review old outputs?",
    a: "Your dashboard history keeps prior analyses and reports so you can reopen them at any time.",
  },
];

export default function Page() {
  const t = useTranslations("landing");
  const [showLanding, setShowLanding] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  if (!showLanding) {
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
                    Get started
                  </a>
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-5 text-sm font-semibold text-white hover:border-[var(--hg-accent)]/50"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Preview Workflow</p>
                    <span className="rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2 py-1 text-[11px] text-[var(--hg-muted)]">
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {["Upload image", "Generate strategy", "Review report", "Publish faster"].map((line, idx) => (
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
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 md:px-8">
              {["CreatorDaily", "PixelStudio", "MonoMedia", "NorthSocial", "HypeOps"].map((brand) => (
                <span key={brand} className="text-sm font-medium tracking-wide text-[var(--hg-muted)]">
                  {brand}
                </span>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="how" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">How it works</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">Three steps to production-ready content</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["1", "Upload", "Add a face image once, then upload content photos for analysis."],
                ["2", "Generate", "Receive strategy, captions, hashtags, and posting windows."],
                ["3", "Scale", "Track in history, optimize with AI chat, and publish consistently."],
              ].map(([num, title, desc]) => (
                <article key={title} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hg-accent)] text-sm font-semibold text-[#07131d]">
                    {num}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-[var(--hg-muted)]">{desc}</p>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal as="section" id="features" className="border-y border-[var(--hg-border)] bg-[var(--hg-surface)]/40">
            <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <div className="mb-10 space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">Features</p>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">Everything you need in one dashboard</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featureItems.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                    <item.icon className="h-5 w-5 text-[var(--hg-accent)]" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--hg-muted)]">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal as="section" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">Testimonials</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">Trusted by creators shipping weekly</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                "Cut my prep time in half and made posting windows obvious.",
                "The report drawer + history flow is super clear and fast.",
                "Talking-head outputs plus captions gave us a reliable content engine.",
              ].map((quote, idx) => (
                <article key={idx} className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6">
                  <p className="text-sm text-white/90">“{quote}”</p>
                  <p className="mt-4 text-xs text-[var(--hg-muted)]">Creator {idx + 1}</p>
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
              <h3 className="text-2xl font-semibold text-white md:text-3xl">Ready to scale your content engine?</h3>
              <p className="max-w-2xl text-sm text-[var(--hg-muted)] md:text-base">
                Start with one upload and transform your weekly content planning workflow.
              </p>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-6 text-sm font-semibold text-[#07131d] hover:opacity-90"
              >
                View plans
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
