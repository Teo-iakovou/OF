"use client";

import { useEffect, useRef } from "react";
import { X, Layers, Check, AlertTriangle, Loader2 } from "lucide-react";
import type { PackageInstanceSummary } from "@/app/utils/api";
import { useLocale, useTranslations } from "next-intl";

type ProfileSwitcherModalProps = {
  open: boolean;
  instances: PackageInstanceSummary[];
  loading: boolean;
  activeInstanceId?: string | null;
  selectingId?: string | null;
  onClose: () => void;
  onSelect: (instanceId: string) => Promise<void> | void;
};

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro Plan",
  ultimate: "Ultimate Plan",
  lite: "Lite Plan",
};

const formatPlanName = (planKey: string | null): string => {
  if (!planKey) return "Package";
  return PLAN_LABELS[planKey.toLowerCase()] ?? (planKey.charAt(0).toUpperCase() + planKey.slice(1));
};

const getStoredProfileName = (id: string): string => {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem(`profileName:${id}`) || ""; } catch { return ""; }
};

export default function ProfileSwitcherModal({
  open,
  instances,
  loading,
  activeInstanceId,
  selectingId,
  onClose,
  onSelect,
}: ProfileSwitcherModalProps) {
  const t = useTranslations("dashboard.packageSwitcher");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      ));
    const initial = getFocusable();
    if (initial.length > 0) initial[0].focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  // Build display names: custom localStorage name > plan name + duplicate counter
  const planCounts: Record<string, number> = {};
  instances.forEach((inst) => {
    const k = (inst.planKey ?? "").toLowerCase();
    planCounts[k] = (planCounts[k] || 0) + 1;
  });
  const planSeen: Record<string, number> = {};
  const displayNames = instances.map((inst) => {
    const custom = getStoredProfileName(inst.id);
    if (custom) return custom;
    const k = (inst.planKey ?? "").toLowerCase();
    const base = formatPlanName(inst.planKey ?? null);
    if (planCounts[k] <= 1) return base;
    planSeen[k] = (planSeen[k] || 0) + 1;
    return `${base} · #${planSeen[k]}`;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-4 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pkg-switcher-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        aria-label={t("closeAriaLabel")}
        tabIndex={-1}
      />

      {/* Card */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[480px] overflow-hidden rounded-[14px] sm:rounded-[18px] border border-[var(--hg-border)]"
        style={{
          background: "var(--hg-surface)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(80,192,240,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-[var(--hg-border)]"
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(80,192,240,0.14)" }}
          >
            <Layers className="h-5 w-5 text-[var(--hg-accent)]" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="pkg-switcher-title"
              className="text-[17px] font-medium text-[var(--hg-text)]"
            >
              {t("title")}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--hg-muted)]">
              {t("subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1.5 text-[var(--hg-muted)] transition-colors hover:text-[var(--hg-text)]"
            aria-label={t("closeAriaLabel")}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[56vh] overflow-y-auto px-4 py-3 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2
                className="h-5 w-5 animate-spin text-[var(--hg-accent)]"
                strokeWidth={1.5}
              />
            </div>
          ) : instances.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--hg-muted)]">
              {t("noInstances")}
            </p>
          ) : (
            instances.map((instance, index) => {
              const isActive = instance.id === activeInstanceId;
              const isSwitching = selectingId === instance.id;
              const displayName = displayNames[index];
              const createdAt = instance.createdAt
                ? new Date(instance.createdAt).toLocaleDateString(locale)
                : null;

              const isUnlimited = instance.uploadsRemaining === null;
              const uploadsLeftCount =
                typeof instance.uploadsRemaining === "number"
                  ? instance.uploadsRemaining
                  : Math.max(
                      0,
                      (instance.uploadLimit ?? 0) - (instance.uploadsUsed ?? 0)
                    );

              const faceEnrolled = instance.faceEnrolled;

              return (
                <div
                  key={instance.id}
                  className="rounded-xl border p-3.5 transition-colors"
                  style={{
                    borderColor: isActive
                      ? "rgba(80,192,240,0.3)"
                      : "var(--hg-border)",
                    background: isActive
                      ? "rgba(80,192,240,0.07)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[var(--hg-text)] truncate">
                        {displayName}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--hg-muted)]">
                        {isUnlimited
                          ? t("unlimited")
                          : t("uploadsLeft", { count: uploadsLeftCount })}
                        {createdAt ? ` · ${createdAt}` : ""}
                      </p>

                      {/* Face enrollment indicator */}
                      {faceEnrolled !== undefined && (
                        <div className="mt-1.5 flex items-center gap-1">
                          {faceEnrolled ? (
                            <>
                              <Check
                                className="h-3 w-3"
                                strokeWidth={2}
                                style={{ color: "#4ade80" }}
                              />
                              <span
                                className="text-[11px]"
                                style={{ color: "#4ade80" }}
                              >
                                {t("faceVerified")}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle
                                className="h-3 w-3"
                                strokeWidth={2}
                                style={{ color: "#fbbf24" }}
                              />
                              <span
                                className="text-[11px]"
                                style={{ color: "#fbbf24" }}
                              >
                                {t("faceSetupNeeded")}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0 self-center">
                      {isActive ? (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{
                            background: "rgba(80,192,240,0.14)",
                            color: "var(--hg-accent)",
                            border: "1px solid rgba(80,192,240,0.25)",
                          }}
                        >
                          {t("active")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!!selectingId}
                          onClick={() => void onSelect(instance.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--hg-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--hg-text)] transition-colors hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:opacity-50"
                        >
                          {isSwitching ? (
                            <>
                              <Loader2
                                className="h-3 w-3 animate-spin"
                                strokeWidth={2}
                              />
                              {t("switching")}
                            </>
                          ) : (
                            t("setActive")
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
