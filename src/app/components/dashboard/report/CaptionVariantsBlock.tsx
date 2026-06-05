"use client";

import { useState } from "react";
import { Check, Copy, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { CaptionVariant } from "@/app/types/analysis";
import { EditableCaption } from "@/app/components/dashboard/report/EditableCaption";

interface Props {
  variants: CaptionVariant[];
  onCopy: (text: string) => void;
  copyLabel: string;
  angleLabels?: Record<string, string>;
  onSaveVariant?: (angle: string, newText: string) => Promise<void>;
  onResetVariant?: (angle: string) => Promise<void>;
  captionPlaceholder?: string;
  captionAriaLabel?: string;
  resetLabel?: string;
}

const DEFAULT_ANGLE_LABELS: Record<string, string> = {
  hook: "Hook",
  aspirational: "Aspirational",
  cta: "CTA",
  default: "Caption",
};

export function CaptionVariantsBlock({
  variants,
  onCopy,
  copyLabel,
  angleLabels,
  onSaveVariant,
  onResetVariant,
  captionPlaceholder,
  captionAriaLabel,
  resetLabel,
}: Props) {
  const [copiedAngle, setCopiedAngle] = useState<string | null>(null);
  const labels = { ...DEFAULT_ANGLE_LABELS, ...angleLabels };

  if (!variants.length) return null;

  const handleCopy = (variant: CaptionVariant) => {
    onCopy(variant.text);
    setCopiedAngle(variant.angle);
    window.setTimeout(() => setCopiedAngle((prev) => (prev === variant.angle ? null : prev)), 1500);
  };

  return (
    <div className="flex flex-col gap-2">
      {variants.map((variant, idx) => {
        const isCopied = copiedAngle === variant.angle;
        const isTop = idx === 0;
        const label = labels[variant.angle] ?? variant.angle;

        return (
          <div
            key={`${variant.angle}-${idx}`}
            className={`rounded-[10px] p-3 transition-colors ${
              isTop
                ? "border-[1.5px] border-[var(--hg-accent)]/60 bg-[var(--hg-surface)]"
                : "border border-[var(--hg-border)] bg-[var(--hg-surface)]"
            }`}
            style={{ paddingLeft: "14px", paddingRight: "14px" }}
          >
            {/* Top row: angle badge + copy button */}
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] font-medium leading-none ${
                  variant.angle === "hook"
                    ? "bg-cyan-500/10 text-cyan-300"
                    : variant.angle === "aspirational"
                    ? "bg-violet-500/10 text-violet-300"
                    : variant.angle === "cta"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-[var(--hg-surface-2)] text-[var(--hg-muted)]"
                }`}
              >
                {label}
              </span>

              <motion.button
                type="button"
                animate={isCopied ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={() => handleCopy(variant)}
                className={`inline-flex items-center gap-1.5 rounded-[6px] px-[10px] py-[6px] text-[11px] transition-colors ${
                  isCopied
                    ? "bg-[var(--hg-accent)]/10 text-[var(--hg-accent)]"
                    : "bg-transparent text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-white"
                }`}
              >
                {isCopied ? (
                  <Check className="h-3 w-3" strokeWidth={1.5} />
                ) : (
                  <Copy className="h-3 w-3" strokeWidth={1.5} />
                )}
                {isCopied ? "Copied" : copyLabel}
              </motion.button>
            </div>

            {/* Caption text — editable */}
            {onSaveVariant && onResetVariant ? (
              <EditableCaption
                text={variant.text}
                originalText={variant.originalText}
                angle={variant.angle}
                onSave={(newText) => onSaveVariant(variant.angle, newText)}
                onReset={() => onResetVariant(variant.angle)}
                placeholder={captionPlaceholder}
                ariaLabel={captionAriaLabel}
                resetLabel={resetLabel}
              />
            ) : (
              <p className="text-[13px] leading-[1.55] text-[var(--hg-text)]">{variant.text}</p>
            )}

            {/* Reasoning — separated from caption text */}
            {variant.reasoning ? (
              <div className="mt-2 flex items-start gap-1.5 border-t border-[var(--hg-border)]/60 pt-2">
                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-[var(--hg-muted-2)]" strokeWidth={1.5} />
                <p className="text-[11px] italic leading-[1.5] text-[var(--hg-muted)]">
                  {variant.reasoning}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
