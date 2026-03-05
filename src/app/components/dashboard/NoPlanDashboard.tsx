"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

const checklist = [
  { title: "Choose a plan", detail: "Pick Lite, Pro, or Ultimate based on your workflow." },
  { title: "Upload your first content", detail: "Drop in a photo or promo image to analyze instantly." },
  { title: "Get your strategy", detail: "Receive captions, posting times, and platform guidance." },
];

const lockedCards = [
  { title: "AI Uploads", desc: "Turn raw photos into cross-platform plans with instant insights." },
  { title: "AI Coach Chat", desc: "Ask strategic questions and fine-tune campaigns in plain language." },
  { title: "Talking Head Studio", desc: "Generate SadTalker videos for promos and personalized shoutouts." },
];

const demoSummary = {
  primary: {
    line1: "Post on Instagram at 18:00 for best engagement.",
    backup: "Backup slot: TikTok at 21:00 for late-night momentum.",
  },
  caption: "🔥 New drop tonight! Set your reminders now and be ready for the reveal.",
  hashtags: "#CreatorLife #ExclusiveDrop #BehindTheScenes",
  cta: "Share a sneak peek with your top fans before midnight.",
};

export default function NoPlanDashboard() {
  return (
    <div className="space-y-6">
      <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">You don’t have an active plan yet</h2>
            <p className="text-gray-300">Pick a plan to unlock uploads, AI chat, and talking head tools.</p>
          </div>
          <Link
            href="/#packages"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-700 px-5 py-2 text-white font-semibold"
          >
            Explore plans →
          </Link>
        </div>
      </section>

      <section className="grid gap-4 bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-semibold text-white">Get started in 3 steps</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {checklist.map((item, idx) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm uppercase tracking-[0.2em]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-white">
                  {idx + 1}
                </span>
                Step {idx + 1}
              </div>
              <p className="text-white text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {lockedCards.map((card) => (
          <div key={card.title} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-sm text-rose-300 uppercase tracking-[0.3em]">
              <Lock className="h-4 w-4" /> Locked Preview
            </div>
            <h4 className="text-xl font-semibold text-white">{card.title}</h4>
            <p className="text-gray-300 text-sm">{card.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-white">Strategy Summary Demo</h3>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-gray-200">
          <p>{demoSummary.primary.line1}</p>
          <p className="text-gray-400">{demoSummary.primary.backup}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">CTA idea</p>
            <p className="text-white">{demoSummary.cta}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Hashtags</p>
            <p className="font-mono text-xs text-gray-200">{demoSummary.hashtags}</p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Demo caption</p>
          <p className="text-white">{demoSummary.caption}</p>
        </div>
      </section>
    </div>
  );
}
