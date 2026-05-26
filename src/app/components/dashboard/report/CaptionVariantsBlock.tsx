"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import type { CaptionVariant } from "@/app/types/analysis";

interface Props {
  variants: CaptionVariant[];
  onCopy: (text: string) => void;
  copyLabel: string;
  angleLabels?: Record<string, string>;
}

const DEFAULT_ANGLE_LABELS: Record<string, string> = {
  hook: "Hook",
  aspirational: "Aspirational",
  cta: "Call to action",
  default: "Caption",
};

export function CaptionVariantsBlock({ variants, onCopy, copyLabel, angleLabels }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const labels = { ...DEFAULT_ANGLE_LABELS, ...angleLabels };
  const active = variants[activeIdx];
  if (!active) return null;

  return (
    <div className="mt-3 rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/65 p-2.5">
      {variants.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {variants.map((v, i) => (
            <button
              key={`${v.angle}-${i}`}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] transition ${
                i === activeIdx
                  ? "bg-[var(--hg-accent)] font-medium text-[#07131d]"
                  : "bg-white/5 text-[var(--hg-muted)] hover:text-white"
              }`}
            >
              {labels[v.angle] ?? v.angle}
            </button>
          ))}
        </div>
      )}
      <p className="line-clamp-4 text-sm text-[var(--hg-text)]">{active.text}</p>
      <button
        type="button"
        onClick={() => onCopy(active.text)}
        className="mt-2 inline-flex items-center gap-1 rounded-md border border-[var(--hg-border)] px-2 py-1 text-xs text-[var(--hg-muted)] transition hover:text-[var(--hg-accent)]"
      >
        <Copy className="h-3 w-3" />
        {copyLabel}
      </button>
    </div>
  );
}
