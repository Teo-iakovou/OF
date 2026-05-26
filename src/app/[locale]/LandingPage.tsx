"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Home,
  Lock,
  MessageCircle,
  Mic,
  Play,
  Sparkles,
  UploadCloud,
  User,
  Video,
} from "lucide-react";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";
import Packages from "@/app/components/packages/Packages";
import VideoIntro from "@/app/components/features/VideoIntro";
import ScrollToTop from "@/app/components/features/ScrollToTop";
import SectionReveal from "@/app/components/common/SectionReveal";

const WAVEFORM_BARS = [10, 22, 14, 28, 12, 20, 10] as const;


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

export default function LandingPage() {
  const t = useTranslations("landing");
  const [showLanding, setShowLanding] = useState(false);
  const [shouldPlayIntro, setShouldPlayIntro] = useState<boolean | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [stage, setStage] = useState(0);
  const reduce = !!useReducedMotion();

  // Refs for atmosphere layer elements
  const starsRef = useRef<HTMLCanvasElement>(null);
  const curDotRef = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const scrollProgRef = useRef<HTMLDivElement>(null);

  // Refs for workflow card cursor targeting
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const photoTargetRef = useRef<HTMLDivElement>(null);
  const generateTargetRef = useRef<HTMLDivElement>(null);
  const downloadTargetRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });
  const [clickCounter, setClickCounter] = useState(0);
  const prevCursorPos = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
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

  // Talking-head flow stage auto-advance
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStage((s) => (s + 1) % 4), 3500);
    return () => clearInterval(id);
  }, [reduce]);

  // Workflow card cursor — dynamic positioning via refs
  useEffect(() => {
    if (reduce) return;

    setCursorPos((p) => ({ ...p, visible: false }));
    if (stage === 2) return;

    const stageRefs: Array<React.RefObject<HTMLDivElement | null> | null> = [
      photoTargetRef, generateTargetRef, null, downloadTargetRef,
    ];

    const compute = () => {
      const targetRef = stageRefs[stage];
      if (!targetRef?.current || !cursorContainerRef.current) return;
      const tr = targetRef.current.getBoundingClientRect();
      const cr = cursorContainerRef.current.getBoundingClientRect();
      setCursorPos({
        x: tr.left - cr.left + tr.width / 2,
        y: tr.top - cr.top + tr.height / 2,
        visible: true,
      });
    };

    // Wait for AnimatePresence exit (0.4s) + new stage mount before reading DOM
    const timer = setTimeout(() => {
      compute();
      setClickCounter((c) => c + 1);
    }, 450);

    // Recompute immediately on resize (elements already mounted)
    window.addEventListener("resize", compute);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", compute);
    };
  }, [stage, reduce]);

  // Cursor tilt toward direction of movement
  useEffect(() => {
    if (reduce || !cursorPos.visible) {
      setTilt(0);
      return;
    }
    const dx = cursorPos.x - prevCursorPos.current.x;
    const dy = cursorPos.y - prevCursorPos.current.y;
    prevCursorPos.current = { x: cursorPos.x, y: cursorPos.y };
    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      setTilt(Math.max(-15, Math.min(15, dx / 8)));
    }
    const t = setTimeout(() => setTilt(0), 500);
    return () => clearTimeout(t);
  }, [cursorPos.x, cursorPos.y, cursorPos.visible, reduce]);

  // Ambient effects: starfield canvas, cursor trail, scroll-progress bar
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    // Scroll progress bar
    const prog = scrollProgRef.current;
    function onScroll() {
      if (!prog) return;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Starfield canvas
    const canvas = starsRef.current;
    let starAnimId = 0;
    if (canvas && !reduce) {
      const ctx = canvas.getContext("2d")!;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      let W = 0, H = 0;
      type Star = { x: number; y: number; r: number; a: number; ph: number; sp: number };
      let stars: Star[] = [];
      function resize() {
        if (!canvas) return;
        W = canvas.width = window.innerWidth * DPR;
        H = canvas.height = window.innerHeight * DPR;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 22000));
        stars = Array.from({ length: count }, () => ({
          x: Math.random() * W, y: Math.random() * H,
          r: (Math.random() * 0.9 + 0.2) * DPR,
          a: Math.random() * 0.6 + 0.2,
          ph: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.004 + 0.001,
        }));
      }
      function drawStars(t: number) {
        ctx.clearRect(0, 0, W, H);
        for (const s of stars) {
          const op = s.a * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234,240,255,${op})`;
          ctx.fill();
        }
        starAnimId = requestAnimationFrame(drawStars);
      }
      resize();
      drawStars(0);
      window.addEventListener("resize", resize);
    }

    // Custom cursor (pointer devices only)
    const dot = curDotRef.current;
    const ring = curRingRef.current;
    let cursorRaf = 0;
    let cleanupCursor: (() => void) | null = null;
    let cleanupMagnetic: (() => void) | null = null;
    if (dot && ring && window.matchMedia("(pointer:fine)").matches) {
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;
      function onMouseMove(e: MouseEvent) {
        mx = e.clientX; my = e.clientY;
        dot!.style.opacity = "1";
        ring!.style.opacity = "1";
        dot!.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
      }
      function onMouseLeave() {
        dot!.style.opacity = "0";
        ring!.style.opacity = "0";
      }
      function cursorTick() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring!.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
        cursorRaf = requestAnimationFrame(cursorTick);
      }
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
      cursorTick();

      // Grow ring over interactive elements
      const onEnter = () => { ring!.style.width = "56px"; ring!.style.height = "56px"; ring!.style.borderColor = "rgba(80,192,240,.9)"; };
      const onLeave = () => { ring!.style.width = "36px"; ring!.style.height = "36px"; ring!.style.borderColor = "rgba(80,192,240,.7)"; };
      const interactives = document.querySelectorAll("a, button, article");
      interactives.forEach((el) => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
      cleanupCursor = () => interactives.forEach((el) => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    }

    // Magnetic buttons (pointer devices only)
    if (window.matchMedia("(pointer:fine)").matches) {
      const magnetics = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      const handlers: Array<[HTMLElement, EventListener, EventListener]> = [];
      magnetics.forEach((btn) => {
        const onMove: EventListener = (e) => {
          const { clientX, clientY } = e as MouseEvent;
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(clientX - r.left - r.width / 2) * 0.18}px,${(clientY - r.top - r.height / 2) * 0.28}px)`;
        };
        const onLeave: EventListener = () => { btn.style.transform = ""; };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        handlers.push([btn, onMove, onLeave]);
      });
      cleanupMagnetic = () => handlers.forEach(([el, move, leave]) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    }

    // Stat counters: count up when scrolled into view
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cObs.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const target = parseFloat(el.dataset.count!);
        const dec = parseInt(el.dataset.decimals || "0", 10);
        const suf = el.dataset.suffix || "";
        const dur = 1500;
        const start = performance.now();
        function frame(t: number) {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = target * eased;
          el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.3 });
    counters.forEach((c) => cObs.observe(c));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (starAnimId) cancelAnimationFrame(starAnimId);
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
      cObs.disconnect();
      cleanupCursor?.();
      cleanupMagnetic?.();
    };
  }, [showLanding]);

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
      {/* ── Section 1: Atmosphere layer ── */}
      {/* Animated aurora blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="atmo-blob absolute rounded-full opacity-50 mix-blend-screen will-change-transform"
          style={{
            width: "70vw", height: "70vw", left: "-10%", top: "-25%",
            background: "radial-gradient(circle,rgba(80,192,240,.28),transparent 60%)",
            filter: "blur(80px)",
            animation: "float1 22s ease-in-out infinite",
          }}
        />
        <div
          className="atmo-blob absolute rounded-full opacity-50 mix-blend-screen will-change-transform"
          style={{
            width: "55vw", height: "55vw", right: "-15%", top: "10%",
            background: "radial-gradient(circle,rgba(125,212,251,.18),transparent 65%)",
            filter: "blur(80px)",
            animation: "float2 28s ease-in-out infinite",
          }}
        />
        <div
          className="atmo-blob absolute rounded-full opacity-50 mix-blend-screen will-change-transform"
          style={{
            width: "40vw", height: "40vw", left: "40%", top: "60%",
            background: "radial-gradient(circle,rgba(80,192,240,.14),transparent 70%)",
            filter: "blur(80px)",
            animation: "float3 32s ease-in-out infinite",
          }}
        />
      </div>
      {/* Starfield canvas */}
      <canvas
        ref={starsRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      />
      {/* Custom cursor (hidden on touch/coarse pointer via CSS) */}
      <div
        ref={curDotRef}
        aria-hidden
        className="pointer-events-none fixed z-[999] h-2 w-2 rounded-full opacity-0 mix-blend-screen [@media(pointer:coarse)]:hidden"
        style={{
          background: "var(--hg-accent)",
          boxShadow: "0 0 20px var(--hg-accent),0 0 40px rgba(80,192,240,.4)",
          willChange: "transform",
          transition: "transform .08s linear",
        }}
      />
      <div
        ref={curRingRef}
        aria-hidden
        className="pointer-events-none fixed z-[998] h-9 w-9 rounded-full opacity-0 [@media(pointer:coarse)]:hidden"
        style={{ border: "1.5px solid rgba(80,192,240,.7)", willChange: "transform", transition: "transform .2s cubic-bezier(.2,.8,.2,1),opacity .25s,width .2s,height .2s" }}
      />
      {/* Scroll progress bar */}
      <div
        ref={scrollProgRef}
        aria-hidden
        className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 origin-left scale-x-0"
        style={{ background: "var(--hg-accent)", transition: "transform .1s" }}
      />

      <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
        <LandingNavbar />

        <main>
          {/* ── Section 3: Hero ── */}
          <SectionReveal as="section" id="hero" className="relative overflow-hidden scroll-mt-32 md:scroll-mt-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_540px_at_20%_-10%,rgba(80,192,240,0.18),transparent_62%),radial-gradient(900px_420px_at_80%_0%,rgba(80,192,240,0.08),transparent_70%)]" />
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-20 pt-28 md:grid-cols-2 md:items-center md:px-8 md:py-24">

              {/* Left column */}
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
                  {t("hero.title")}{" "}
                  <span className="gradient-word">{t("hero.titleHighlight")}</span>
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
                    data-magnetic
                    className="btn-sheen relative isolate overflow-hidden inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-5 text-sm font-semibold text-[#07131d] transition hover:opacity-90 hover:shadow-[0_14px_40px_rgba(80,192,240,.55)]"
                  >
                    <span className="relative z-[1]">{t("hero.primaryCta")}</span>
                  </a>
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-5 text-sm font-semibold text-white transition hover:border-[var(--hg-accent)]/50 hover:-translate-y-px"
                  >
                    {t("hero.secondaryCta")}
                  </Link>
                </motion.div>

                {/* Stat counters */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.56 }}
                  className="flex flex-wrap gap-7 border-t border-[var(--hg-border-2)] pt-6 mt-2"
                >
                  <div className="flex flex-col gap-1">
                    <span
                      data-count="12400" data-suffix="+"
                      className="text-[28px] font-extrabold leading-none tracking-[-0.02em] text-white"
                      style={{ fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}
                    >0</span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--hg-muted)]">{t("hero.stats.strategies")}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      data-count="4.9" data-decimals="1" data-suffix="★"
                      className="text-[28px] font-extrabold leading-none tracking-[-0.02em] text-white"
                      style={{ fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}
                    >0</span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--hg-muted)]">{t("hero.stats.rating")}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      data-count="38" data-suffix="%"
                      className="text-[28px] font-extrabold leading-none tracking-[-0.02em] text-white"
                      style={{ fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}
                    >0</span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--hg-muted)]">{t("hero.stats.cadence")}</span>
                  </div>
                </motion.div>
              </div>

              {/* Right column — workflow card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <div className="wf-card-glow rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  {/* Browser viewport — mini dashboard */}
                  <div className="overflow-hidden rounded-xl border border-[var(--hg-border)] bg-[var(--hg-bg)]">
                    {/* Safari-style chrome bar */}
                    <div className="flex items-center justify-between border-b border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                      </div>
                      <div className="mx-3 flex flex-1 items-center justify-center">
                        <div className="flex w-full max-w-[220px] items-center justify-center gap-1.5 overflow-hidden rounded-md bg-[var(--hg-surface-2)] px-2.5 py-1 text-[10px]">
                          <Lock className="h-2.5 w-2.5 shrink-0 text-[var(--hg-muted)]" />
                          <span className="shrink-0 text-[var(--hg-muted)]">echo-fy.com</span>
                          <span className="truncate text-white/30">/dashboard/ai-video-avatar</span>
                        </div>
                      </div>
                      <div className="w-[42px]" />
                    </div>
                    <div className="flex" style={{ minHeight: 320 }}>
                      {/* Mini sidebar rail */}
                      <div className="flex w-10 shrink-0 flex-col items-center gap-3.5 border-r border-[var(--hg-border)] bg-[var(--hg-surface)] py-3">
                        {/* Logo */}
                        <Image src="/echofy-removebg-preview.png" alt="" width={20} height={20} className="mb-0.5 h-5 w-5 object-contain" />
                        <div className="flex h-6 w-full items-center justify-center text-[var(--hg-muted)]">
                          <Home className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex h-6 w-full items-center justify-center text-[var(--hg-muted)]">
                          <UploadCloud className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex h-6 w-full items-center justify-center border-l-2 border-[var(--hg-accent)] bg-[var(--hg-accent)]/10 text-[var(--hg-accent)]">
                          <Video className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex h-6 w-full items-center justify-center text-[var(--hg-muted)]">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Main content area */}
                      <div ref={cursorContainerRef} className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
                        {/* Animated cursor — position driven by refs */}
                        {!reduce && (
                          <motion.div
                            className="pointer-events-none absolute left-0 top-0 z-20"
                            animate={{
                              x: cursorPos.x,
                              y: cursorPos.y,
                              opacity: cursorPos.visible ? 1 : 0,
                              rotate: tilt,
                            }}
                            transition={{
                              x: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
                              y: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
                              opacity: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
                              rotate: { duration: 0.25, ease: "easeOut" },
                            }}
                          >
                            {/* Idle pulse ring at tip */}
                            <motion.span
                              className="absolute left-0 top-0 h-3 w-3 rounded-full border border-white/50"
                              animate={{ scale: [0.5, 2.2], opacity: [0.55, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                            />
                            {/* Click ripple — re-keyed on each click */}
                            <motion.span
                              key={clickCounter}
                              className="absolute left-0 top-0 h-3 w-3 rounded-full bg-white/20"
                              initial={{ scale: 0, opacity: 0.9 }}
                              animate={{ scale: 3.5, opacity: 0 }}
                              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                            />
                            {/* Arrow with idle float */}
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <motion.svg
                                key={clickCounter}
                                width="14"
                                height="18"
                                viewBox="0 0 14 18"
                                fill="none"
                                animate={{ scale: [1, 1, 0.68, 1, 1] }}
                                transition={{ duration: 0.35, delay: 0.4, times: [0, 0.4, 0.65, 0.85, 1] }}
                                style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.7))" }}
                              >
                                <path
                                  d="M2 2L2 13L5.2 9.8L7.4 15.5L9 14.8L6.8 9L12 9L2 2Z"
                                  fill="white"
                                  stroke="rgba(0,0,0,0.4)"
                                  strokeWidth="0.8"
                                  strokeLinejoin="round"
                                />
                              </motion.svg>
                            </motion.div>
                          </motion.div>
                        )}
                        {reduce ? (
                          <div className="flex w-full flex-col gap-2">
                            {[
                              { Icon: User, label: t("hero.workflowPreview.formTitle") },
                              { Icon: Mic, label: t("hero.workflowPreview.generateButton") },
                              { Icon: Sparkles, label: t("hero.workflowPreview.generateButton") },
                              { Icon: Play, label: t("hero.workflowPreview.resultTitle") },
                            ].map(({ Icon, label }, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] px-2.5 py-2 text-[11px] text-white/80">
                                <Icon className="h-3 w-3 shrink-0 text-[var(--hg-accent)]" />
                                {label}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <AnimatePresence mode="wait">
                            {/* Stage 0 — empty form */}
                            {stage === 0 && (
                              <motion.div
                                key="dash-stage-0"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                                className="w-full"
                              >
                                <p className="mb-3 text-[11px] font-semibold text-white">{t("hero.workflowPreview.formTitle")}</p>
                                <motion.div
                                  ref={photoTargetRef}
                                  key={`p0-${clickCounter}`}
                                  className="mb-2 h-14 rounded-lg border border-dashed border-[var(--hg-border)] bg-[var(--hg-surface)] flex items-center justify-center gap-1.5 text-[10px] text-[var(--hg-muted)]"
                                  animate={{ scale: [1, 0.95, 1] }}
                                  transition={{ duration: 0.25, delay: 0.4, ease: "easeOut" }}
                                >
                                  <User className="h-3 w-3" />
                                  {t("hero.workflowStages.photo")}
                                </motion.div>
                                <div className="mb-3 h-10 rounded-lg border border-dashed border-[var(--hg-border)] bg-[var(--hg-surface)] flex items-center justify-center gap-1.5 text-[10px] text-[var(--hg-muted)]">
                                  <Mic className="h-3 w-3" />
                                  {t("hero.workflowStages.audio")}
                                </div>
                                <div className="h-7 w-full rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] flex items-center justify-center text-[10px] text-[var(--hg-muted)] opacity-50">
                                  {t("hero.workflowPreview.generateButton")}
                                </div>
                              </motion.div>
                            )}

                            {/* Stage 1 — filled form */}
                            {stage === 1 && (
                              <motion.div
                                key="dash-stage-1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                                className="w-full"
                              >
                                <p className="mb-3 text-[11px] font-semibold text-white">{t("hero.workflowPreview.formTitle")}</p>
                                <div className="relative mb-2 mx-auto aspect-[9/16] w-28 overflow-hidden rounded-xl border border-[var(--hg-border)]">
                                  <Image
                                    src="/photo_2026-03-09_17-38-29.jpg"
                                    alt=""
                                    fill
                                    className="object-cover object-center"
                                    sizes="112px"
                                  />
                                </div>
                                <div className="mb-3 h-10 rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] flex items-center justify-center gap-[2px] px-3">
                                  {WAVEFORM_BARS.map((maxH, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-[2px] rounded-full bg-[var(--hg-accent)]"
                                      style={{ height: (maxH / 28) * 20 }}
                                    />
                                  ))}
                                </div>
                                <motion.div
                                  key={`p1-${clickCounter}`}
                                  animate={{ scale: [1, 0.95, 1] }}
                                  transition={{ duration: 0.25, delay: 0.4, ease: "easeOut" }}
                                >
                                  <motion.div
                                    ref={generateTargetRef}
                                    className="h-7 w-full rounded-lg bg-[var(--hg-accent)] flex items-center justify-center text-[10px] font-semibold text-[#07131d]"
                                    animate={{ boxShadow: ["0 0 0px rgba(80,192,240,0)", "0 0 12px rgba(80,192,240,0.5)", "0 0 0px rgba(80,192,240,0)"] }}
                                    transition={{ duration: 1.6, repeat: Infinity }}
                                  >
                                    {t("hero.workflowPreview.generateButton")}
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            )}

                            {/* Stage 2 — generating */}
                            {stage === 2 && (
                              <motion.div
                                key="dash-stage-2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                                className="flex w-full flex-col items-center gap-3"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Sparkles className="h-8 w-8 text-[var(--hg-accent)]" />
                                </motion.div>
                                <p className="text-[11px] text-[var(--hg-muted)]">{t("hero.workflowStages.processing")}</p>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--hg-surface-2)]">
                                  <motion.div
                                    className="h-full rounded-full bg-[var(--hg-accent)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.3, ease: "easeOut" }}
                                  />
                                </div>
                              </motion.div>
                            )}

                            {/* Stage 3 — result */}
                            {stage === 3 && (
                              <motion.div
                                key="dash-stage-3"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                                className="w-full"
                              >
                                <div className="mb-2 flex items-center gap-1.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--hg-accent)]" />
                                  <p className="text-[11px] font-semibold text-white">{t("hero.workflowPreview.resultTitle")}</p>
                                </div>
                                <div className="relative mb-3 mx-auto aspect-[9/16] w-36 overflow-hidden rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]">
                                  <video
                                    src="/Avatar_IV_Video%201%2A.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 h-full w-full object-cover"
                                  />
                                </div>
                                <div className="mx-auto flex w-36 gap-2">
                                  <motion.div
                                    ref={downloadTargetRef}
                                    key={`p3-${clickCounter}`}
                                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface)] py-1.5 text-[10px] text-[var(--hg-muted)]"
                                    animate={{ scale: [1, 0.95, 1] }}
                                    transition={{ duration: 0.25, delay: 0.4, ease: "easeOut" }}
                                  >
                                    <Download className="h-2.5 w-2.5" />
                                    {t("hero.workflowPreview.downloadButton")}
                                  </motion.div>
                                  <div className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--hg-accent)]/10 border border-[var(--hg-accent)]/30 py-1.5 text-[10px] text-[var(--hg-accent)]">
                                    <ExternalLink className="h-2.5 w-2.5" />
                                    {t("hero.workflowPreview.openButton")}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    </div>

                    {/* Stage dot indicators */}
                    {!reduce && (
                      <div className="flex justify-center gap-1.5 border-t border-[var(--hg-border)] py-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              stage === i ? "w-4 bg-[var(--hg-accent)]" : "w-1 bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-ind">
              <span>Scroll</span>
              <span className="w-px h-[30px] rounded-px bg-gradient-to-b from-[var(--hg-accent)] to-transparent" />
            </div>
          </SectionReveal>

          {/* ── Section 4: Divider ── */}
          <hr className="divider" aria-hidden />

          <SectionReveal as="section" id="brands" className="scroll-mt-32 md:scroll-mt-28">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
              <div className="mb-6 space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">{t("brands.eyebrow")}</p>
                <h2 className="text-2xl font-semibold text-white md:text-[28px]">{t("brands.title")}</h2>
              </div>
              <div className="brands-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <div className="brands-track gap-x-14">
                  {[...brands, ...brands].map((brand, i) => (
                    <span key={i} className="whitespace-nowrap text-sm font-medium tracking-wide text-[var(--hg-muted)] transition-colors hover:text-[var(--hg-accent)]">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* ── Section 6: Divider ── */}
          <hr className="divider" aria-hidden />

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
                  className="rounded-[20px] border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
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

          {/* ── Section 8: Divider ── */}
          <hr className="divider" aria-hidden />

          <SectionReveal as="section" id="features" className="bg-[color:color-mix(in_oklab,var(--hg-surface)_40%,transparent)] scroll-mt-32 md:scroll-mt-28">
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
                    className="rounded-[20px] border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 transition-[transform,border-color] duration-[220ms] hover:border-[color:color-mix(in_oklab,var(--hg-accent)_30%,transparent)]"
                  >
                    <Icon className="h-[22px] w-[22px] text-[var(--hg-accent)]" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--hg-muted)]">{item.desc}</p>
                  </motion.article>
                  );
                })}
              </div>
            </div>
          </SectionReveal>

          {/* ── Section 10: Wave divider ── */}
          <div
            className="wave-div"
            aria-hidden
            style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--hg-surface) 40%, transparent), color-mix(in oklab, var(--hg-surface) 18%, transparent))" }}
          >
            <div className="wave-track">
              <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="wave-svg">
                <path className="wave-line" d="M0,30 C200,4 400,56 600,30 C800,4 1000,56 1200,30" />
              </svg>
              <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="wave-svg">
                <path className="wave-line" d="M0,30 C200,4 400,56 600,30 C800,4 1000,56 1200,30" />
              </svg>
            </div>
          </div>

          <SectionReveal as="section" id="workflow-media" className=" bg-[linear-gradient(180deg,color-mix(in_oklab,var(--hg-surface)_18%,transparent),color-mix(in_oklab,var(--hg-surface)_30%,transparent))]">
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

          {/* ── Section 12: Wave divider ── */}
          <div
            className="wave-div"
            aria-hidden
            style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--hg-surface) 30%, transparent), transparent)" }}
          >
            <div className="wave-track">
              <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="wave-svg">
                <path className="wave-line" d="M0,30 C200,4 400,56 600,30 C800,4 1000,56 1200,30" />
              </svg>
              <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="wave-svg">
                <path className="wave-line" d="M0,30 C200,4 400,56 600,30 C800,4 1000,56 1200,30" />
              </svg>
            </div>
          </div>

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
                  className="rounded-[20px] border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6"
                >
                  <p className="text-sm text-white/90">"{quote}"</p>
                  <p className="mt-4 text-xs text-[var(--hg-muted)]">{t("testimonials.author", { index: idx + 1 })}</p>
                </motion.article>
              ))}
            </div>
          </SectionReveal>

          {/* ── Section 14: Divider ── */}
          <hr className="divider" aria-hidden />

          <SectionReveal as="section" id="pricing" className="bg-[color:color-mix(in_oklab,var(--hg-surface)_25%,transparent)] px-4 py-16 md:px-8 md:py-24 scroll-mt-32 md:scroll-mt-28">
            <div className="mx-auto w-full max-w-6xl">
              <Packages />
            </div>
          </SectionReveal>

          {/* ── Section 16: Divider ── */}
          <hr className="divider" aria-hidden />

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
                    className={`overflow-hidden rounded-2xl border transition-[border-color,background] duration-[250ms] ${
                      open
                        ? "border-[color:color-mix(in_oklab,var(--hg-accent)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--hg-accent)_4%,var(--hg-surface))]"
                        : "border-[var(--hg-border)] bg-[var(--hg-surface)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(open ? null : idx)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:text-[var(--hg-accent)]"
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
            <div className="final-card mx-auto flex w-full max-w-6xl flex-col items-center gap-4 rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-8 text-center md:p-12">
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
                data-magnetic
                className="btn-sheen relative isolate overflow-hidden inline-flex h-11 items-center rounded-xl bg-[var(--hg-accent)] px-6 text-sm font-semibold text-[#07131d] hover:opacity-90 hover:shadow-[0_14px_40px_rgba(80,192,240,.55)]"
              >
                {t("cta.button")}
              </motion.a>
            </div>
          </SectionReveal>
        </main>

        {/* Wave stack — transitions page bg into footer surface bg */}
        <div className="wave-stack" aria-hidden style={{ background: "var(--hg-surface)" }}>
          <div className="wave-layer wave-layer-1">
            <div className="wave-track-fill">
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,30 C200,5 400,55 600,30 C800,5 1000,55 1200,30 L1200,140 L0,140 Z" />
              </svg>
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,30 C200,5 400,55 600,30 C800,5 1000,55 1200,30 L1200,140 L0,140 Z" />
              </svg>
            </div>
          </div>
          <div className="wave-layer wave-layer-2">
            <div className="wave-track-fill">
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,55 C200,25 400,85 600,55 C800,25 1000,85 1200,55 L1200,140 L0,140 Z" />
              </svg>
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,55 C200,25 400,85 600,55 C800,25 1000,85 1200,55 L1200,140 L0,140 Z" />
              </svg>
            </div>
          </div>
          <div className="wave-layer wave-layer-3">
            <div className="wave-track-fill">
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,80 C200,55 400,105 600,80 C800,55 1000,105 1200,80 L1200,140 L0,140 Z" />
              </svg>
              <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="wave-fill-svg">
                <path d="M0,80 C200,55 400,105 600,80 C800,55 1000,105 1200,80 L1200,140 L0,140 Z" />
              </svg>
            </div>
          </div>
        </div>

        <LandingFooter />
        <ScrollToTop />
      </div>
    </>
  );
}
