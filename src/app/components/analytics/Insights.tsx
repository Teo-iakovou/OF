"use client";

import { useMemo, useState } from "react";
import type { ResultDoc, RecommendedPlatform } from "@/app/types/analysis";
import ClipboardButton from "@/app/components/dashboard/buttons/clipboard";

type Props = { result: ResultDoc };

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-200 border border-gray-700">
    {children}
  </span>
);

/* ───────────────────────── Actions helper ───────────────────────── */

type ActionCopy = { kind: "copy"; label: string; text: string };
type ActionLink = { kind: "link"; label: string; href: string };
type Actions = { primary: ActionCopy | ActionLink; secondary?: ActionCopy | ActionLink };

function platformAction(rec: RecommendedPlatform): Actions {
  const caption = (rec.caption || "").trim();
  const link = rec.link?.url || "";
  const tags = (rec.hashtags || []).join(" ");

  // Instagram / TikTok → copy caption + copy bio link
  if (rec.platform === "Instagram" || rec.platform === "TikTok") {
    return {
      primary: { kind: "copy", label: "Copy caption", text: caption },
      secondary: link ? { kind: "copy", label: "Copy bio link", text: link } : undefined,
    };
  }

  // Twitter/X → open intent; copy hashtags as secondary
  if (rec.platform === "Twitter") {
    const intent = new URL("https://twitter.com/intent/tweet");
    if (caption) intent.searchParams.set("text", caption);
    if (link) intent.searchParams.set("url", link);
    return {
      primary: { kind: "link", label: "Open X compose", href: intent.toString() },
      secondary: tags ? { kind: "copy", label: "Copy hashtags", text: tags } : undefined,
    };
  }

  // Reddit → copy caption; link to submit
  if (rec.platform === "Reddit") {
    return {
      primary: { kind: "copy", label: "Copy title/caption", text: caption },
      secondary: { kind: "link", label: "Open Reddit", href: "https://www.reddit.com/submit" },
    };
  }

  // Fallback
  return {
    primary: { kind: "copy", label: "Copy caption", text: caption },
    secondary: link ? { kind: "copy", label: "Copy link", text: link } : undefined,
  };
}

/* ───────────────────────── Card ───────────────────────── */

function PlatformCard({ rec }: { rec: RecommendedPlatform }) {
  const best = rec.bestTimesLocal?.[0] || "—";
  const tags = (rec.hashtags || []).join(" ");
  const actions = platformAction(rec);

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-white">{rec.platform}</div>
        <Pill>Best: {best}</Pill>
      </div>

      {rec.caption ? (
        <div className="text-sm text-gray-100 whitespace-pre-wrap">{rec.caption}</div>
      ) : (
        <div className="text-sm text-gray-400 italic">No caption (fast mode)</div>
      )}

      {tags && (
        <div className="text-xs text-gray-300 break-words"># {tags.replace(/#/g, "").trim()}</div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        {actions.primary.kind === "link" ? (
          <a
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm"
            href={actions.primary.href}
            target="_blank"
            rel="noreferrer"
          >
            {actions.primary.label}
          </a>
        ) : (
          <ClipboardButton
            label={actions.primary.label}
            text={actions.primary.text}
            className="bg-sky-600 hover:bg-sky-700"
          />
        )}

        {actions.secondary &&
          (actions.secondary.kind === "link" ? (
            <a
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
              href={actions.secondary.href}
              target="_blank"
              rel="noreferrer"
            >
              {actions.secondary.label}
            </a>
          ) : (
            <ClipboardButton
              label={actions.secondary.label}
              text={actions.secondary.text}
              className="bg-gray-700 hover:bg-gray-600"
            />
          ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Main ───────────────────────── */

export default function Insights({ result }: Props) {
  const recs = useMemo(
    () => result?.promotion?.recommendedPlatforms || [],
    [result?.promotion?.recommendedPlatforms]
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Top summary: pick best platform/time combo
  const summary = useMemo(() => {
    if (!recs.length) return null;
    const top = recs[0];
    const backup = recs[1];
    return {
      line1: `Post on ${top.platform} at ${top.bestTimesLocal?.[0] || "—"}.`,
      line2: backup ? `Backup: ${backup.platform} at ${backup.bestTimesLocal?.[0] || "—"}.` : "",
    };
  }, [recs]);

  // Derived badges (only when advanced is open)
  const advBadges = useMemo(() => {
    const b: string[] = [];
    if (result.niche) b.push(`Niche: ${result.niche}`);
    if (typeof result.csl === "number") b.push(`CSL: ${result.csl}/3`);
    if (result.hasFace) b.push("Face detected");
    const tz = result?.meta?.timezone;
    if (tz) b.push(`TZ: ${tz}`);
    return b;
  }, [result]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-400">Your AI Insights</h3>
        {summary && (
          <p className="mt-2 text-sm sm:text-base text-gray-200">
            {summary.line1} {summary.line2}
          </p>
        )}
      </div>

      {/* Platform recommendations */}
      <div className="grid md:grid-cols-2 gap-4">
        {recs.map((rec, i) => (
          <PlatformCard key={`${rec.platform}-${i}`} rec={rec} />
        ))}
      </div>

      {/* CTA Variants */}
      {result?.promotion?.ctaVariants?.length ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="text-sm font-semibold mb-2 text-white">CTA Ideas</div>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
            {result.promotion.ctaVariants.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Advanced details toggle */}
      <div className="pt-1">
        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="text-xs text-gray-400 underline hover:text-gray-200"
        >
          {showAdvanced ? "Hide advanced details" : "Show advanced details"}
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {advBadges.map((x, i) => (
                <Pill key={i}>{x}</Pill>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="text-sm font-semibold mb-2 text-white">Safety Notes</div>
            {result.promotion?.riskFlags?.length ? (
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                {result.promotion.riskFlags.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-400">—</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}