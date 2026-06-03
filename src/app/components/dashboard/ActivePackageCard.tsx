"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type ActivePackageCardProps = {
  planKey?: string | null;
  packageInstanceId?: string | null;
  status?: string | null;
  createdAt?: string | Date | null;
  onOpenSwitcher?: () => void;
  profileLabel?: string | null;
  instanceCount?: number;
  className?: string;
};

const planLabel = (planKey?: string | null) => {
  const key = (planKey || "").toLowerCase();
  if (key === "pro") return "Pro";
  if (key === "ultimate") return "Ultimate";
  if (key === "lite") return "Lite";
  return "—";
};

export default function ActivePackageCard({
  planKey,
  packageInstanceId,
  status = "active",
  createdAt,
  onOpenSwitcher,
  profileLabel,
  instanceCount,
  className,
}: ActivePackageCardProps) {
  const t = useTranslations("dashboard.home.activePackage");
  const tSwitcher = useTranslations("dashboard.packageSwitcher");
  const locale = useLocale();
  const [profileName, setProfileName] = useState("");
  const created =
    createdAt instanceof Date
      ? createdAt
      : createdAt
      ? new Date(createdAt)
      : null;

  const isInteractive = Boolean(onOpenSwitcher);
  const displayProfile = profileName || profileLabel;
  const hasMultiple = typeof instanceCount === "number" && instanceCount > 1;

  useEffect(() => {
    if (!packageInstanceId) {
      setProfileName("");
      return;
    }
    try {
      const stored = localStorage.getItem(`profileName:${packageInstanceId}`) || "";
      setProfileName(stored);
    } catch {}
  }, [packageInstanceId]);

  if (!packageInstanceId) return null;

  return (
    <div
      className={`h-full flex flex-col justify-between rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20${isInteractive ? " cursor-pointer" : ""}${className ? ` ${className}` : ""}`}
      {...(isInteractive
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick: () => onOpenSwitcher?.(),
            onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenSwitcher?.();
              }
            },
          }
        : {})}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide hg-muted">{t("sectionLabel")}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{planLabel(planKey)}</h3>
          {displayProfile ? (
            <p className="mt-1 text-sm hg-muted">{displayProfile}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
            {status === "active" ? t("active") : status || t("active")}
          </span>
          {onOpenSwitcher ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenSwitcher();
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 text-xs font-semibold text-[var(--hg-text)] hover:border-[var(--hg-accent)] hover:text-white transition-colors"
            >
              <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
              {hasMultiple
                ? tSwitcher("packageCount", { count: instanceCount })
                : tSwitcher("switchPackage")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-xs uppercase tracking-wide text-[var(--hg-muted-2)]">{t("created")}</p>
        <p className="text-sm text-[var(--hg-text)]">
          {created ? created.toLocaleString(locale) : "—"}
        </p>
      </div>
    </div>
  );
}
