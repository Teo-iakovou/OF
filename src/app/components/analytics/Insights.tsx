"use client";

import { useMemo } from "react";
import type { ResultDoc, RecommendedPlatform } from "@/app/types/analysis";
import ClipboardButton from "@/app/components/dashboard/buttons/clipboard";
import { useEffect, useRef, useState } from "react";
import { ttsSynthesize } from "@/app/utils/api";
import { FaRedditAlien, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { ReactNode } from "react";
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

  if (rec.platform === "Instagram" || rec.platform === "TikTok") {
    return {
      primary: { kind: "copy", label: "Copy caption", text: caption },
      secondary: link ? { kind: "copy", label: "Copy bio link", text: link } : undefined,
    };
  }

  // ✅ X/Twitter
  if (rec.platform === "Twitter" || rec.platform === "X") {
    const intent = new URL("https://twitter.com/intent/tweet"); // x.com redirects fine
    if (caption) intent.searchParams.set("text", caption);
    if (link) intent.searchParams.set("url", link);
    return {
      primary: { kind: "link", label: "Open X compose", href: intent.toString() },
      secondary: tags ? { kind: "copy", label: "Copy hashtags", text: tags } : undefined,
    };
  }

  if (rec.platform === "Reddit") {
    return {
      primary: { kind: "copy", label: "Copy title/caption", text: caption },
      secondary: { kind: "link", label: "Open Reddit", href: "https://www.reddit.com/submit" },
    };
  }

  return {
    primary: { kind: "copy", label: "Copy caption", text: caption },
    secondary: link ? { kind: "copy", label: "Copy link", text: link } : undefined,
  };
}

// normalize for display
const displayPlatform = (p: string) => (p === "Twitter" ? "X" : p);

// icons & brand color maps (support both keys)
const PLATFORM_ICON: Record<string, ReactNode> = {
  X:        <FaXTwitter className="w-5 h-5" />,
  Twitter:  <FaXTwitter className="w-5 h-5" />,
  Reddit:   <FaRedditAlien className="w-5 h-5" />,
  Instagram:<FaInstagram className="w-5 h-5" />,
  TikTok:   <FaTiktok className="w-5 h-5" />,
};

// Card border gradient (brand-accurate)
const PLATFORM_BORDER: Record<string, string> = {
  X:        "from-zinc-700/80 to-zinc-500/80",        // X is black/white brand
  Twitter:  "from-[#1D9BF0]/60 to-[#1D9BF0]/30",      // Twitter blue
  Reddit:   "from-[#FF4500]/70 to-[#FF8717]/60",      // Reddit orange gradient
  Instagram:"from-[#F58529]/70 to-[#DD2A7B]/70",      // IG orange→pink
  TikTok:   "from-[#25F4EE]/70 to-[#FE2C55]/70",      // TikTok cyan→pink
};

// Icon bubble background (brand-accurate)
const PLATFORM_LOGO_BG: Record<string, string> = {
  X:        "from-black to-zinc-900",
  Twitter:  "from-[#1D9BF0] to-[#1D9BF0]",
  Reddit:   "from-[#FF4500] to-[#FF8717]",
  Instagram:"from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  TikTok:   "from-[#25F4EE] to-[#FE2C55]",
};
/* ───────────────────────── Card ───────────────────────── */

function PlatformCard({ rec }: { rec: RecommendedPlatform }) {
  const best = rec.bestTimesLocal?.[0] || "—";
  const actions = platformAction(rec);
  const title = displayPlatform(rec.platform);
  const Icon = PLATFORM_ICON[rec.platform] ?? PLATFORM_ICON[title];
  const borderGrad = PLATFORM_BORDER[rec.platform] || PLATFORM_BORDER[title] || "from-purple-500/70 to-indigo-500/70";
  const logoBg = PLATFORM_LOGO_BG[rec.platform] || PLATFORM_LOGO_BG[title] || "from-purple-500 to-indigo-500";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  async function toggleTTS() {
    try {
      if (playing) {
        audioRef.current?.pause();
        audioRef.current = null;
        setPlaying(false);
        return;
      }
      if (!rec.caption) return;
      const url = await ttsSynthesize(rec.caption);
      const a = new Audio(url);
      audioRef.current = a;
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      setPlaying(true);
      await a.play().catch(() => setPlaying(false));
    } catch {
      setPlaying(false);
    }
  }

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return (
    <div className={`rounded-2xl p-[1.5px] bg-gradient-to-br ${borderGrad} shadow-[0_0_0_1px_rgba(255,255,255,0.04)] h-full`}>
      <div className="rounded-2xl bg-[#0A0F1E]/90 px-5 py-5 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${logoBg} text-white`}>
              {Icon}
            </span>
            <div className="text-xl font-semibold text-white tracking-tight">{title}</div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-white/80">
            Best: {best}
          </span>
        </div>

        {rec.caption ? (
          <div className="mt-3 flex-1 w-full text-[15px] leading-relaxed text-gray-100 whitespace-pre-wrap break-words">
            {rec.caption}
          </div>
        ) : (
          <div className="mt-3 flex-1 w-full text-[15px] leading-relaxed text-gray-400 italic">No caption (fast mode)</div>
        )}

        <div className="mt-4 flex items-center gap-3">
          {actions.primary.kind === "link" ? (
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-semibold shadow-[0_8px_24px_rgba(56,97,251,0.35)] hover:brightness-110 transition"
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
              className="w-full sm:w-auto rounded-xl px-4 py-2 bg-gradient-to-b from-indigo-500 to-blue-600 hover:brightness-110 text-white font-semibold shadow-[0_8px_24px_rgba(56,97,251,0.35)]"
            />
          )}
          {rec.caption && (
            <button
              type="button"
              onClick={toggleTTS}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 border border-gray-600 text-gray-200 hover:text-white hover:bg-white/5"
            >
              {playing ? "Stop" : "Generate voice-over"}
            </button>
          )}
        </div>
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
      <div className="text-center max-w-3xl mx-auto">
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-purple-200 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(124,58,237,0.35)]">
          Your AI Insights
        </h3>
        {summary && (
          <div className="mt-3 leading-snug">
            <p className="text-base md:text-lg text-gray-200/90">
              {summary.line1}
            </p>
            {summary.line2 ? (
              <p className="text-base md:text-lg text-gray-200/70">
                {summary.line2}
              </p>
            ) : null}
          </div>
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
