"use client";

import { useMemo, useState } from "react";
import type { ResultDoc, RecommendedPlatform } from "@/app/types/analysis";
import ClipboardButton from "@/app/components/dashboard/buttons/clipboard";
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

  const summary = useMemo(() => {
    if (!recs.length) return null;
    const top = recs[0];
    const backup = recs[1];
    return {
      line1: `Post on ${top.platform} at ${top.bestTimesLocal?.[0] || "—"}.`,
      line2: backup ? `Backup: ${backup.platform} at ${backup.bestTimesLocal?.[0] || "—"}.` : "",
    };
  }, [recs]);

  const advBadges = useMemo(() => {
    const b: string[] = [];
    if (result.niche) b.push(`Niche: ${result.niche}`);
    if (typeof result.csl === "number") b.push(`CSL: ${result.csl}/3`);
    if (result.hasFace) b.push("Face detected");
    const tz = result?.meta?.timezone;
    if (tz) b.push(`TZ: ${tz}`);
    return b;
  }, [result]);

  const hero = recs[0];
  const backup = recs[1];
  const heroHashtags = useMemo(() => {
    if (!hero?.hashtags?.length) return null;
    return hero.hashtags.slice(0, 5).join(" ");
  }, [hero]);
  const heroCTA = result?.promotion?.ctaVariants?.[0];

  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-gray-900 via-gray-900/60 to-gray-800 p-5 sm:p-6 shadow-inner shadow-black/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Strategy Summary</p>
            {summary ? (
              <div className="mt-2 space-y-1">
                <p className="text-lg text-white">{summary.line1}</p>
                {summary.line2 ? <p className="text-sm text-gray-300">{summary.line2}</p> : null}
              </div>
            ) : (
              <p className="text-lg text-white">No recommendations yet.</p>
            )}
          </div>
          {hero?.bestTimesLocal?.[0] ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Prime window</div>
              <div className="font-semibold text-white">{hero.bestTimesLocal[0]}</div>
              <div className="text-xs text-gray-400">{hero.platform}</div>
            </div>
          ) : null}
        </div>
        <div className="mt-4 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
          {heroCTA ? (
            <div className="rounded-lg border border-white/10 bg-[#101628] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Call to action</p>
              <p className="text-white mt-1">{heroCTA}</p>
            </div>
          ) : null}
          {heroHashtags ? (
            <div className="rounded-lg border border-white/10 bg-[#101628] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Hashtags to start</p>
              <p className="font-mono text-xs text-gray-200 mt-1 break-words">{heroHashtags}</p>
            </div>
          ) : null}
          {backup ? (
            <div className="rounded-lg border border-white/10 bg-[#101628] px-4 py-3 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Backup move</p>
              <p className="text-gray-200 mt-1">
                Shift to {backup.platform} around {backup.bestTimesLocal?.[0] || "your evening block"} if the primary slot is taken.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {recs.map((rec, i) => (
          <PlatformCard key={`${rec.platform}-${i}`} rec={rec} />
        ))}
      </div>

      <div className="space-y-3">
        {result?.promotion?.ctaVariants?.length ? (
          <AccordionItem title="CTA & hook ideas" defaultOpen>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              {result.promotion.ctaVariants.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </AccordionItem>
        ) : null}

        <AccordionItem title="Safety & context">
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex flex-wrap gap-2">
              {advBadges.map((x, i) => (
                <Pill key={i}>{x}</Pill>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Risk flags</div>
              {result.promotion?.riskFlags?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {result.promotion.riskFlags.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No major issues detected.</div>
              )}
            </div>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((val) => !val)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
      >
        {title}
        <span className="text-xs text-gray-400">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}
