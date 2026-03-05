"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ResultDoc, RecommendedPlatform } from "@/app/types/analysis";

type CinematicResultsProps = {
  result: ResultDoc;
  requestId?: string;
  onViewHistoryHref: string;
};

type Step =
  | { type: "summary" }
  | { type: "platform"; platform: RecommendedPlatform; index: number }
  | { type: "cta" }
  | { type: "safety" };

function extractPreview(rec: RecommendedPlatform) {
  if (typeof rec.caption === "string" && rec.caption.trim()) {
    return rec.caption.trim();
  }
  if (Array.isArray(rec.notes) && rec.notes[0]) {
    return String(rec.notes[0]);
  }
  const previewValues = Object.values(rec.preview || {});
  const stringValue = previewValues.find((v) => typeof v === "string" && v.trim());
  if (typeof stringValue === "string") return stringValue.trim();
  return "Ready for a fresh, tailored post suggestion.";
}

function useTypewriter(text: string, active: boolean) {
  const [value, setValue] = useState(active ? "" : text);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setValue(text);
      indexRef.current = text.length;
      return;
    }
    setValue("");
    indexRef.current = 0;
    const speed = 18;
    const id = window.setInterval(() => {
      indexRef.current += 1;
      setValue(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active]);

  return value;
}

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function CinematicResults({
  result,
  requestId,
  onViewHistoryHref,
}: CinematicResultsProps) {
  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [{ type: "summary" }];
    const platforms = Array.isArray(result?.promotion?.recommendedPlatforms)
      ? result.promotion.recommendedPlatforms
      : [];
    platforms.forEach((platform, index) => {
      list.push({ type: "platform", platform, index });
    });
    list.push({ type: "cta" });
    list.push({ type: "safety" });
    return list;
  }, [result]);

  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    setRevealStep(0);
    if (!result) return;
    const timers: number[] = [];
    for (let i = 1; i <= steps.length; i += 1) {
      const baseDelay = clamp(160, 800 / Math.max(1, steps.length), 280);
      const delay = Math.round(baseDelay * i);
      timers.push(
        window.setTimeout(() => {
          setRevealStep((prev) => (prev < i ? i : prev));
        }, delay)
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [result, steps.length]);

  const summaryBullets = useMemo(() => {
    const niche = result?.promotion?.niche || result?.niche || "General";
    const hasFace = result?.promotion?.hasFace ?? result?.hasFace;
    const topPlatform = result?.promotion?.recommendedPlatforms?.[0]?.platform;
    const safety = result?.promotion?.contentSafety?.csl ?? result?.csl ?? null;
    const bullets = [
      `Niche focus: ${niche}`,
      `Primary platform: ${topPlatform || "Your choice"}`,
      typeof hasFace === "boolean" ? `Face detected: ${hasFace ? "Yes" : "No"}` : null,
      safety !== null ? `Safety score: ${safety}/100` : null,
    ].filter(Boolean) as string[];
    return bullets.slice(0, 3);
  }, [result]);

  const typedSummary = useTypewriter(summaryBullets[0] || "", revealStep >= 1);

  const ctaVariants = Array.isArray(result?.promotion?.ctaVariants)
    ? result.promotion.ctaVariants.filter((v) => typeof v === "string" && v.trim())
    : [];

  return (
    <div className="space-y-4">
      {steps.slice(0, Math.min(revealStep, steps.length)).map((step, idx) => {
        if (step.type === "summary") {
          return (
            <section
              key={`summary-${idx}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Quick summary</h2>
                {requestId ? (
                  <span className="text-xs text-gray-400">ID {requestId}</span>
                ) : null}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {summaryBullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>
                      {index === 0 ? typedSummary || bullet : bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (step.type === "platform") {
          const rec = step.platform;
          const bestTime = Array.isArray(rec.bestTimesLocal) ? rec.bestTimesLocal[0] : null;
          const preview = extractPreview(rec);
          const previewLine = preview;
          return (
            <section
              key={`${rec.platform}-${step.index}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 flex items-center justify-center">
                  {rec.platform.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">{rec.platform}</h3>
                    {bestTime ? (
                      <span className="text-xs text-gray-500">Best time: {bestTime}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{previewLine}</p>
                </div>
              </div>

              <details className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  View details
                </summary>
                <div className="mt-3 space-y-3 text-sm text-gray-600">
                  {rec.caption ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Caption</p>
                      <p className="mt-1">{rec.caption}</p>
                    </div>
                  ) : null}
                  {Array.isArray(rec.hashtags) && rec.hashtags.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Hashtags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rec.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {Array.isArray(rec.notes) && rec.notes.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Notes</p>
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        {rec.notes.map((note, noteIdx) => (
                          <li key={`${note}-${noteIdx}`}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {Array.isArray(rec.subreddits) && rec.subreddits.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Subreddits</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rec.subreddits.map((sub) => (
                          <span
                            key={sub}
                            className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
                          >
                            r/{sub.replace(/^r\//, "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </details>
            </section>
          );
        }

        if (step.type === "cta") {
          return (
            <section
              key={`cta-${idx}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">CTA variants</h3>
                {ctaVariants.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(ctaVariants.join("\n"))}
                    className="text-xs text-cyan-700 underline underline-offset-2"
                  >
                    Copy all
                  </button>
                ) : null}
              </div>
              {ctaVariants.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ctaVariants.map((cta) => (
                    <span
                      key={cta}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                    >
                      {cta}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">No CTA variants available.</p>
              )}
            </section>
          );
        }

        if (step.type === "safety") {
          const safety = result?.promotion?.contentSafety;
          const riskFlags = Array.isArray(result?.promotion?.riskFlags)
            ? result.promotion.riskFlags
            : [];
          return (
            <section
              key={`safety-${idx}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                  Safety & context
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {typeof safety?.csl === "number" ? (
                    <p>Safety score: {safety.csl}/100</p>
                  ) : null}
                  {Array.isArray(safety?.reasons) && safety.reasons.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Reasons</p>
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        {safety.reasons.map((reason, reasonIdx) => (
                          <li key={`${reason}-${reasonIdx}`}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {riskFlags.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Risk flags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {riskFlags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <p className="text-xs text-gray-400">
                    Timezone: {result?.meta?.timezone || "—"}
                  </p>
                </div>
              </details>
            </section>
          );
        }

        return null;
      })}
      <div className="pt-1">
        <a
          href={onViewHistoryHref}
          className="inline-flex text-sm text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
        >
          View in Upload History →
        </a>
      </div>
    </div>
  );
}
