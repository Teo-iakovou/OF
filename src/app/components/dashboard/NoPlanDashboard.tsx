"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoPlanDashboard() {
  const t = useTranslations("dashboard.noPlan");
  const steps = t.raw("steps") as { title: string; detail: string }[];
  const lockedCards = t.raw("lockedCards") as { title: string; desc: string }[];

  return (
    <div className="space-y-6">
      <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">{t("heading")}</h2>
            <p className="text-gray-300">{t("subheading")}</p>
          </div>
          <Link
            href="/account/plans"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-700 px-5 py-2 text-white font-semibold"
          >
            {t("cta")}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-semibold text-white">{t("stepsHeading")}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm uppercase tracking-[0.2em]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-white">
                  {idx + 1}
                </span>
                {t("stepLabel", { num: idx + 1 })}
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
              <Lock className="h-4 w-4" /> {t("lockedBadge")}
            </div>
            <h4 className="text-xl font-semibold text-white">{card.title}</h4>
            <p className="text-gray-300 text-sm">{card.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-white">{t("demoHeading")}</h3>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-gray-200">
          <p>{t("demoLine1")}</p>
          <p className="text-gray-400">{t("demoBackup")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t("demoCtaLabel")}</p>
            <p className="text-white">{t("demoCtaText")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t("demoHashtagsLabel")}</p>
            <p className="font-mono text-xs text-gray-200">{t("demoHashtags")}</p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#101628] p-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t("demoCaptionLabel")}</p>
          <p className="text-white">{t("demoCaption")}</p>
        </div>
      </section>
    </div>
  );
}
