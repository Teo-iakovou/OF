"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

export interface TourStep {
  target: string;
  titleKey: string;
  bodyKey: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
}

export interface SpotlightTourProps {
  steps: TourStep[];
  tourId: string;
  i18nNamespace: string;
  onComplete: () => void;
}

const PAD = 8;
const TOOLTIP_W = 320;
const TOOLTIP_GAP = 16;
const TOOLTIP_EST_H = 200;
const CUTOUT_R = 12;
const CUTOUT_PAD = 8;
const SCROLL_SETTLE_MS = 450;
const PARTICLE_COUNT = 10;

interface Rect { x: number; y: number; w: number; h: number }
interface Pos { top: number; left: number }

function tooltipPos(rect: Rect, placement: TourStep["placement"]): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cy = rect.y + rect.h / 2;

  let side: "top" | "bottom" | "left" | "right" =
    placement && placement !== "auto"
      ? (placement as "top" | "bottom" | "left" | "right")
      : cy < vh / 2
      ? "bottom"
      : "top";

  if (side === "bottom" && rect.y + rect.h + CUTOUT_PAD + TOOLTIP_GAP + TOOLTIP_EST_H > vh) side = "top";
  if (side === "top" && rect.y - CUTOUT_PAD - TOOLTIP_GAP - TOOLTIP_EST_H < 0) side = "bottom";

  let top =
    side === "bottom"
      ? rect.y + rect.h + CUTOUT_PAD + TOOLTIP_GAP
      : side === "top"
      ? rect.y - CUTOUT_PAD - TOOLTIP_GAP - TOOLTIP_EST_H
      : Math.max(PAD, cy - TOOLTIP_EST_H / 2);

  let left = rect.x + rect.w / 2 - TOOLTIP_W / 2;
  left = Math.max(PAD, Math.min(left, vw - TOOLTIP_W - PAD));
  top = Math.max(PAD, Math.min(top, vh - TOOLTIP_EST_H - PAD));

  return { top, left };
}

function buildConnectorPath(rect: Rect, tt: Pos): string {
  const tooltipMidX = tt.left + TOOLTIP_W / 2;
  const targetMidX = rect.x + rect.w / 2;
  const tooltipIsBelow = tt.top > rect.y + rect.h;

  if (tooltipIsBelow) {
    const sy = rect.y + rect.h + CUTOUT_PAD;
    const ey = tt.top;
    const mid = (sy + ey) / 2;
    return `M ${targetMidX} ${sy} C ${targetMidX} ${mid} ${tooltipMidX} ${mid} ${tooltipMidX} ${ey}`;
  }
  const sy = rect.y - CUTOUT_PAD;
  const ey = tt.top + TOOLTIP_EST_H;
  const mid = (sy + ey) / 2;
  return `M ${targetMidX} ${sy} C ${targetMidX} ${mid} ${tooltipMidX} ${mid} ${tooltipMidX} ${ey}`;
}

// Stagger variants for tooltip children (Layer 3)
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function SpotlightTour({ steps, onComplete, i18nNamespace }: SpotlightTourProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(i18nNamespace as any);
  const reduce = !!useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0, y: 0 });
  const gotItRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Scroll target into view → wait for scroll to settle → lock scroll + measure position
  useEffect(() => {
    if (!mounted || dismissed) return;
    setIsReady(false);
    setRect(null);

    const step = steps[stepIdx];
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null;
    if (!el) {
      if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
      else setDismissed(true);
      return;
    }

    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    el.scrollIntoView({ block: "center", behavior: reduce ? "instant" : "smooth" });

    const delay = reduce ? 0 : SCROLL_SETTLE_MS;
    const timer = setTimeout(() => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      const r = el.getBoundingClientRect();
      setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
      setIsReady(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mounted, stepIdx, steps, reduce, dismissed]);

  // Recompute on resize (scroll is locked so position is stable)
  useEffect(() => {
    if (!mounted) return;
    function onResize() {
      const step = steps[stepIdx];
      if (!step) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted, steps, stepIdx]);

  // Deterministic particles — no Math.random() to keep SSR-safe
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const dist = 45 + (i % 4) * 12; // 45 57 69 81 45 57 69 81 45 57
      return { key: i, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    }), []
  );

  const handleNext = () => { if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1); };
  const handleSkip = () => { setDismissed(true); };
  const handleGotIt = () => {
    if (reduce) { onComplete(); return; }
    if (gotItRef.current) {
      const r = gotItRef.current.getBoundingClientRect();
      setConfettiOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setCelebrating(true);
    setTimeout(() => onComplete(), 700);
  };

  if (!mounted || dismissed) return null;

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  // Derived cutout geometry
  const cx = rect ? rect.x - CUTOUT_PAD : 0;
  const cy = rect ? rect.y - CUTOUT_PAD : 0;
  const cw = rect ? rect.w + CUTOUT_PAD * 2 : 0;
  const ch = rect ? rect.h + CUTOUT_PAD * 2 : 0;

  const tt: Pos = rect ? tooltipPos(rect, step.placement) : { top: 0, left: 0 };
  const tooltipIsBelow = rect ? tt.top > rect.y + rect.h : true;
  // Layer 3: tooltip entrance slides from above if below target, from below if above target
  const tooltipSlideY = tooltipIsBelow ? -12 : 12;

  // Layer 6: radial gradient geometry
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gradX = rect ? rect.x + rect.w / 2 : vw / 2;
  const gradY = rect ? rect.y + rect.h / 2 : vh / 2;
  const gradR = Math.hypot(vw, vh);

  // Layer 4: connector path
  const connPath = rect ? buildConnectorPath(rect, tt) : "";

  const overlay = (
    <div
      className="fixed inset-0 z-[2147483650]"
      style={{ pointerEvents: isReady && !celebrating ? "auto" : "none" }}
      onMouseDown={(e) => e.stopPropagation()}
    >

      {/* ── LAYERS 6 + 2: Dark radial-gradient scrim with animated cutout ──── */}
      {isReady && (
        <svg
          className="pointer-events-none"
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            {/* Layer 6: radial gradient centered on target */}
            <radialGradient
              id="tour-grad"
              cx={gradX}
              cy={gradY}
              r={gradR}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"  stopColor="rgba(0,0,0,0.50)" />
              <stop offset="42%" stopColor="rgba(0,0,0,0.78)" />
            </radialGradient>

            {/* Mask that punches out the spotlight hole */}
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {/* Layer 2: cutout expands from target center */}
              <motion.rect
                key={`cutout-${stepIdx}`}
                initial={
                  reduce
                    ? { x: cx, y: cy, width: cw, height: ch, rx: CUTOUT_R }
                    : {
                        x: (rect?.x ?? 0) + (rect?.w ?? 0) / 2,
                        y: (rect?.y ?? 0) + (rect?.h ?? 0) / 2,
                        width: 0,
                        height: 0,
                        rx: 0,
                      }
                }
                animate={{ x: cx, y: cy, width: cw, height: ch, rx: CUTOUT_R }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
                }
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#tour-grad)" mask="url(#tour-mask)" />
        </svg>
      )}

      {/* ── LAYERS 2 + 1: Ring — entrance then continuous pulse ──────────── */}
      {isReady && (
        <>
          {/* Entrance ring (Layer 2: scale 0.6 → 1 with 0.15s delay after cutout) */}
          <motion.div
            key={`ring-${stepIdx}`}
            className="pointer-events-none"
            style={{
              position: "fixed",
              left: cx, top: cy, width: cw, height: ch,
              borderRadius: CUTOUT_R,
              border: "2px solid var(--hg-accent)",
            }}
            initial={reduce ? {} : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }
            }
          />

          {/* Pulse overlay (Layer 1: radar-ping boxShadow + gentle scale, starts after entrance) */}
          {!reduce && (
            <motion.div
              key={`pulse-${stepIdx}`}
              className="pointer-events-none"
              style={{
                position: "fixed",
                left: cx, top: cy, width: cw, height: ch,
                borderRadius: CUTOUT_R,
              }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(80,192,240,0.55)",
                  "0 0 0 14px rgba(80,192,240,0)",
                ],
                scale: [1, 1.015, 1],
              }}
              transition={{
                boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeOut",    delay: 0.65 },
                scale:     { duration: 2.4, repeat: Infinity, ease: "easeInOut",  delay: 0.65 },
              }}
            />
          )}
        </>
      )}

      {/* ── LAYER 4: Connector line — draws on after entrance settles ──────── */}
      {isReady && rect && (
        <svg
          className="pointer-events-none"
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <motion.path
            key={`conn-${stepIdx}`}
            d={connPath}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{
              pathLength: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.45, ease: "easeOut" },
              opacity:    { duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.45 },
            }}
            stroke="var(--hg-accent)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      )}

      {/* ── LAYERS 3 + 5: Tooltip card with staggered children + dot progress ─ */}
      <AnimatePresence mode="wait">
        {isReady && !celebrating && (
          <motion.div
            key={`tooltip-${stepIdx}`}
            initial={reduce ? false : { opacity: 0, y: tooltipSlideY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? {} : { opacity: 0, y: tooltipIsBelow ? -8 : 8, scale: 0.96 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 280, damping: 28 }
            }
            className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            style={{ position: "fixed", top: tt.top, left: tt.left, width: TOOLTIP_W }}
          >
            {/* Layer 5: Progress dots */}
            <div className="mb-3 flex items-center gap-1.5">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ width: 6, height: 6 }}
                  animate={
                    i === stepIdx
                      ? { backgroundColor: "var(--hg-accent)", scale: 1.2, boxShadow: "0 0 8px rgba(80,192,240,0.65)" }
                      : i < stepIdx
                      ? { backgroundColor: "rgba(80,192,240,0.38)", scale: 1, boxShadow: "none" }
                      : { backgroundColor: "rgba(255,255,255,0.18)", scale: 1, boxShadow: "none" }
                  }
                  transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                />
              ))}
            </div>

            {/* Layer 3: Staggered children */}
            {reduce ? (
              <div>
                <h3 className="text-base font-semibold text-white">
                  {(t as (k: string) => string)(step.titleKey)}
                </h3>
                <p className="mt-2 text-sm text-[var(--hg-muted)]">
                  {(t as (k: string) => string)(step.bodyKey)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-xs text-[var(--hg-muted)] transition-colors hover:text-white"
                  >
                    {(t as (k: string) => string)("skip")}
                  </button>
                  <button
                    ref={gotItRef}
                    type="button"
                    onClick={isLast ? handleGotIt : handleNext}
                    className="rounded-full bg-[var(--hg-accent)] px-4 py-2 text-sm font-semibold text-[#07131d] transition-opacity hover:opacity-90"
                  >
                    {isLast
                      ? (t as (k: string) => string)("gotIt")
                      : (t as (k: string) => string)("next")}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.h3
                  variants={staggerChild}
                  className="text-base font-semibold text-white"
                >
                  {(t as (k: string) => string)(step.titleKey)}
                </motion.h3>
                <motion.p
                  variants={staggerChild}
                  className="mt-2 text-sm text-[var(--hg-muted)]"
                >
                  {(t as (k: string) => string)(step.bodyKey)}
                </motion.p>
                <motion.div
                  variants={staggerChild}
                  className="mt-4 flex items-center justify-between"
                >
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-xs text-[var(--hg-muted)] transition-colors hover:text-white"
                  >
                    {(t as (k: string) => string)("skip")}
                  </button>
                  <button
                    ref={gotItRef}
                    type="button"
                    onClick={isLast ? handleGotIt : handleNext}
                    className="rounded-full bg-[var(--hg-accent)] px-4 py-2 text-sm font-semibold text-[#07131d] transition-opacity hover:opacity-90"
                  >
                    {isLast
                      ? (t as (k: string) => string)("gotIt")
                      : (t as (k: string) => string)("next")}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAYER 7: Final-step celebration ──────────────────────────────────── */}
      {celebrating && !reduce && (
        <>
          {/* Ring glow burst */}
          <motion.div
            className="pointer-events-none"
            style={{
              position: "fixed",
              left: cx, top: cy, width: cw, height: ch,
              borderRadius: CUTOUT_R,
            }}
            initial={{ boxShadow: "0 0 0 0 rgba(80,192,240,0.75)" }}
            animate={{ boxShadow: "0 0 48px 12px rgba(80,192,240,0)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Sparkle particles emanating from Got it button */}
          <div
            className="pointer-events-none"
            style={{ position: "fixed", left: confettiOrigin.x, top: confettiOrigin.y }}
          >
            {particles.map((p) => (
              <motion.div
                key={p.key}
                className="absolute h-1.5 w-1.5 rounded-full bg-[var(--hg-accent)]"
                style={{ left: -3, top: -3 }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
