"use client";

import Link from "next/link";
import Reveal from "@/app/components/common/Reveal";
import type { MouseEvent } from "react";

const glowStyles: Record<string, { base: string; hover: string; border: string }> = {
  lite: {
    base: "0 4px 18px rgba(59,130,246,0.08)",
    hover: "0 16px 55px rgba(59,130,246,0.25)",
    border: "border-cyan-300/15",
  },
  pro: {
    base: "0 4px 18px rgba(236,72,153,0.08)",
    hover: "0 16px 55px rgba(236,72,153,0.25)",
    border: "border-pink-300/15",
  },
  ultimate: {
    base: "0 4px 18px rgba(168,85,247,0.08)",
    hover: "0 16px 55px rgba(168,85,247,0.25)",
    border: "border-purple-300/15",
  },
};

const haloClasses: Record<string, string> = {
  lite: "from-cyan-400/30 via-transparent to-transparent",
  pro: "from-pink-400/30 via-transparent to-transparent",
  ultimate: "from-purple-400/30 via-transparent to-transparent",
};

const cardBackgrounds: Record<string, string> = {
  lite:
    "radial-gradient(circle at 20% 0%, rgba(131,216,255,0.38), transparent 55%), linear-gradient(145deg, rgba(24,41,95,0.98), rgba(9,14,37,0.95))",
  pro:
    "radial-gradient(circle at 50% -20%, rgba(255,170,221,0.4), transparent 60%), linear-gradient(145deg, rgba(38,24,88,0.98), rgba(10,7,29,0.95))",
  ultimate:
    "radial-gradient(circle at 80% 0%, rgba(195,157,255,0.4), transparent 60%), linear-gradient(145deg, rgba(30,18,92,0.98), rgba(9,8,31,0.95))",
};

export const packages = [
  {
    id: "lite",
    title: "Lite",
    price: "$49",
    description: "Kickstart your AI workflow with essentials.",
    features: ["Basic Analytics", "5 Uploads / day", "Email Support"],
    button: "Select Lite",
  },
  {
    id: "pro",
    title: "Pro",
    price: "$349",
    description: "Accelerate creation with priority rendering.",
    features: ["Custom AI Insights", "Unlimited Uploads", "Dedicated 24/7 Support"],
    button: "Select Pro",
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "$499",
    description: "Enterprise-grade orchestration and coaching.",
    features: ["Full AI Integration", "Premium Support", "Custom Reports"],
    button: "Select Ultimate",
  },
];

export default function Packages() {
  return (
    <section id="packages" className="scroll-mt-32 space-y-10 text-white ">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Choose your flow</p>
        <h2 className="text-4xl font-bold">Tailored plans for every creator</h2>
        <p className="text-lg text-white/70 max-w-3xl mx-auto">
          Pick the bandwidth and support that matches your ambitions. Upgrade anytime as your SadTalker productions
          scale.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg, i) => (
          <Reveal
            as="div"
            key={pkg.id}
            delay={i * 150}
            className="w-full max-w-[18rem] sm:max-w-[19rem]"
          >
            <div
              className={`relative min-h-[28rem] rounded-[28px] group backdrop-blur p-8 transition duration-[900ms] hover:-translate-y-2 hover:scale-[1.002]`}
              style={{ boxShadow: glowStyles[pkg.id].base, backgroundImage: cardBackgrounds[pkg.id] }}
              onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.transition = "box-shadow 0.9s ease, transform 0.9s ease";
                e.currentTarget.style.boxShadow = glowStyles[pkg.id].hover;
              }}
              onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.transition = "box-shadow 0.9s ease, transform 0.9s ease";
                e.currentTarget.style.boxShadow = glowStyles[pkg.id].base;
              }}
            >
              <div
                className={`text-sm pointer-events-none absolute -inset-6 opacity-0 blur-[120px] transition duration-[900ms] group-hover:opacity-30 bg-gradient-to-r ${haloClasses[pkg.id]}`}
              />
            {pkg.id === "pro" && (
              <div
                className="absolute -top-4 left-1/2 flex min-w-[11rem] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white/40 px-5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-white shadow-[0_18px_65px_rgba(255,95,180,0.5)]"
                style={{
                  background:
                    "linear-gradient(125deg, #ff5fb2 0%, #ff68b8 45%, #ff5fb2 100%)",
                }}
              >
                <span className="pointer-events-none absolute inset-0 bg-white/25 opacity-30 blur-3xl" />
                <span className="relative">Most Popular</span>
              </div>
            )}
            <div className="space-y-3 text-center">
              <h3 className="text-2xl font-bold">{pkg.title}</h3>
              <p className="text-white/70 text-sm">{pkg.description}</p>
              <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                {pkg.price}
              </p>
            </div>
            <ul className="mt-8 space-y-4 text-white/80">
              {pkg.features.map((feature) => (
                <li key={`${pkg.id}-${feature}`} className="flex items-center gap-3 text-base">
                  <span className="h-2 w-2 rounded-full bg-white/70" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={`/${pkg.id}`} className="mt-8 block">
              <button className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 py-3 font-semibold text-white shadow-lg hover:opacity-90 transition">
                {pkg.button}
              </button>
            </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
