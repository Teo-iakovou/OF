"use client";

import Link from "next/link";
import Image from "next/image";
import Packages from "@/app/components/packages/Packages";
import FeatureComparison from "./components/sections/FeatureComparison";
import ScrollToTop from "./components/features/ScrollToTop";
import FeedbackWidget from "./components/features/FeedbackWidget";
import Section from "@/app/components/common/Section";

const HERO_PARTICLES = Array.from({ length: 40 }).map((_, idx) => ({
  id: idx,
  top: Math.random() * 100,
  left: Math.random() * 100,
  opacity: Math.random() * 0.6 + 0.2,
}));

export default function Page() {
  return (
    <>
      <div className="bg-[#050819] text-white min-h-screen flex flex-col">
        <Section
          id="hero"
          variant="gradient"
          className="text-white"
          contentClassName="relative flex w-full flex-col gap-16 md:flex-row md:items-center"
          decorations={
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#44186f] via-[#1b1e5a] to-[#020414]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,186,255,0.35),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(71,153,255,0.35),transparent_55%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-60" />
              <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-pink-500/30 blur-[180px]" />
              <div className="absolute right-0 bottom-0 h-[32rem] w-[32rem] rounded-full bg-blue-600/40 blur-[220px]" />
              <div className="absolute inset-0 opacity-30">
                {HERO_PARTICLES.map((particle) => (
                  <span
                    key={particle.id}
                    className="absolute h-1 w-1 rounded-full bg-white/80"
                    style={{
                      top: `${particle.top}%`,
                      left: `${particle.left}%`,
                      opacity: particle.opacity,
                    }}
                  />
                ))}
              </div>
            </>
          }
        >
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Next-gen creation</p>
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Orchestrate content with <span className="text-cyan-300">neural precision</span>
            </h1>
            <p className="text-lg text-slate-200/90 md:text-xl">
              Upload, analyze, and animate avatars with cinematic quality. A single workspace for SadTalker, coaching
              insights, and AI-powered storytelling.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#packages"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:brightness-110"
              >
                Explore Plans
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white hover:border-white/50"
              >
                Enter Studio
              </Link>
            </div>
          </div>
          <div className="relative flex-[1.2] min-h-[520px] overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-br from-[#03102a]/80 via-[#0b1d3f]/55 to-transparent blur-[350px]" />
            <Image
              src="/ai%20image.png"
              alt="Futuristic AI profile rendered in neon circuitry"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover object-center mix-blend-screen drop-shadow-[0_150px_260px_rgba(59,130,246,0.65)]"
              style={{
                maskImage:
                  "radial-gradient(circle at 58% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 55%, transparent 95%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 58% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 55%, transparent 95%)",
              }}
            />
          </div>
        </Section>

        <Section
          id="packages"
          variant="dark"
          topDivider
          topDividerColor="#050819"
          className="text-white"
        >
          <Packages />
        </Section>

        <Section
          id="features"
          variant="gradient"
          topDivider
          topDividerColor="#050819"
          topDividerFlip
          bottomDivider
          bottomDividerColor="#01030a"
          className="text-white"
        >
          <FeatureComparison />
        </Section>

        <ScrollToTop />

        <FeedbackWidget />
      </div>
    </>
  );
}
