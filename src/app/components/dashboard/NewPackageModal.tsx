"use client";

import { useEffect, useRef } from "react";
import { X, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PackageInstanceSummary } from "@/app/utils/api";

type NewPackageModalProps = {
  open: boolean;
  newInstance: PackageInstanceSummary | null;
  onSwitch: () => void;
  onDismiss: () => void;
};

const formatPlanLabel = (value: string | null) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function NewPackageModal({
  open,
  newInstance,
  onSwitch,
  onDismiss,
}: NewPackageModalProps) {
  const t = useTranslations("dashboard.home.newPackageModal");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onDismiss]);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open || !newInstance) return null;

  const planLabel = formatPlanLabel(newInstance.planKey ?? null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("closeAriaLabel")}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t("closeAriaLabel")}
        tabIndex={-1}
      />

      <div
        ref={containerRef}
        className="relative w-full max-w-sm rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--hg-muted)] transition-colors hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
          aria-label={t("closeAriaLabel")}
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--hg-accent-soft)]">
          <PackageCheck
            className="h-6 w-6 text-[var(--hg-accent)]"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="text-base font-semibold text-[var(--hg-text)]">
          {t("heading")}
        </h2>
        <p className="mt-2 text-sm text-[var(--hg-muted)]">
          {t("body", { plan: planLabel })}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--hg-border)] px-4 py-2.5 text-sm font-medium text-[var(--hg-muted)] transition-colors hover:border-[var(--hg-accent)]/40 hover:text-[var(--hg-text)]"
          >
            {t("keepButton")}
          </button>
          <button
            type="button"
            onClick={onSwitch}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--hg-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("switchButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
