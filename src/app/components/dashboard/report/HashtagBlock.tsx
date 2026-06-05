"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { HashtagPackMeta } from "@/app/types/analysis";

const TIER_STYLES: Record<string, string> = {
  reach: "bg-sky-500/15 text-sky-300 border-sky-400/20",
  niche: "bg-violet-500/15 text-violet-300 border-violet-400/20",
  balanced: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  trending: "bg-amber-500/15 text-amber-300 border-amber-400/20",
};

const TIER_LABELS: Record<string, string> = {
  reach: "Reach",
  niche: "Niche",
  balanced: "Balanced",
  trending: "Trending",
};

// Reddit uses keyword phrases, not hashtags — skip # prefix for these platforms
const KEYWORD_PLATFORMS = new Set(["Reddit"]);

interface Props {
  tags: string[];
  hashtagPack?: HashtagPackMeta | null;
  platform?: string;
  onCopyAll: (text: string) => void;
  copyAllLabel: string;
  showMoreLabel: (count: number) => string;
  showLessLabel: string;
  copiedLabel: string;
  initialVisible?: number;
}

export function HashtagBlock({
  tags,
  hashtagPack,
  platform,
  onCopyAll,
  copyAllLabel,
  showMoreLabel,
  showLessLabel,
  copiedLabel,
  initialVisible = 12,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!tags.length) return null;

  const isKeywordPlatform = KEYWORD_PLATFORMS.has(platform ?? "");
  const normalized = isKeywordPlatform
    ? tags
    : tags.map((t) => (t.startsWith("#") ? t : `#${t}`));
  const visibleTags = expanded ? normalized : normalized.slice(0, initialVisible);
  const hiddenCount = Math.max(0, normalized.length - visibleTags.length);
  const allText = normalized.join(isKeywordPlatform ? "\n" : " ");
  const tier = hashtagPack?.tier;
  const tierStyle = tier ? (TIER_STYLES[tier] ?? TIER_STYLES.balanced) : null;
  const tierLabel = tier ? (TIER_LABELS[tier] ?? tier) : null;

  const handleChipCopy = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(tag);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = tag;
      ta.style.cssText = "position:fixed;top:-1000px;left:-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
    }
    setCopiedTag(tag);
    window.setTimeout(() => setCopiedTag((prev) => (prev === tag ? null : prev)), 1500);
  };

  const handleCopyAll = () => {
    onCopyAll(allText);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="mt-3">
      {(tierLabel || hashtagPack?.reasoning) && (
        <div className="mb-2 flex items-start gap-2">
          {tierLabel && tierStyle && (
            <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierStyle}`}>
              {tierLabel}
            </span>
          )}
          {hashtagPack?.reasoning && (
            <p className="text-[11px] leading-snug text-[var(--hg-muted)]">{hashtagPack.reasoning}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {visibleTags.map((tag) => (
          <button
            key={tag}
            type="button"
            title={copiedTag === tag ? copiedLabel : tag}
            onClick={() => void handleChipCopy(tag)}
            className={`group inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition ${
              copiedTag === tag
                ? "border-[var(--hg-accent)]/40 bg-[var(--hg-accent)]/10 text-[var(--hg-accent)]"
                : "border-white/10 bg-white/5 text-[var(--hg-muted)] hover:border-[var(--hg-accent)]/30 hover:text-white"
            }`}
          >
            {tag}
            <Copy className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-60" />
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        {allText && (
          <button
            type="button"
            onClick={handleCopyAll}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] transition-colors duration-150 ${
              copiedAll
                ? "border-[var(--hg-accent)]/40 bg-[var(--hg-accent)]/10 text-[var(--hg-accent)]"
                : "border-[var(--hg-border)] text-[var(--hg-muted)] hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)]"
            }`}
          >
            {copiedAll ? (
              <Check className="h-3 w-3" strokeWidth={1.5} />
            ) : (
              <Copy className="h-3 w-3" strokeWidth={1.5} />
            )}
            {copiedAll ? copiedLabel : copyAllLabel}
          </button>
        )}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="text-xs text-[var(--hg-muted)] hover:text-[var(--hg-accent)]"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? showLessLabel : showMoreLabel(hiddenCount)}
          </button>
        )}
      </div>
    </div>
  );
}
