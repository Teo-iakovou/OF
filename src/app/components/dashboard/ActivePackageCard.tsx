"use client";

import type React from "react";
import { useEffect, useState } from "react";

type ActivePackageCardProps = {
  planKey?: string | null;
  packageInstanceId?: string | null;
  status?: string | null;
  createdAt?: string | Date | null;
  onOpenSwitcher?: () => void;
  profileLabel?: string | null;
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
}: ActivePackageCardProps) {
  const [profileName, setProfileName] = useState("");
  const created =
    createdAt instanceof Date
      ? createdAt
      : createdAt
      ? new Date(createdAt)
      : null;

  const isInteractive = Boolean(onOpenSwitcher);
  const displayProfile = profileName || profileLabel;

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
      className={`rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20${
        isInteractive ? " cursor-pointer" : ""
      }`}
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
          <p className="text-xs uppercase tracking-wide hg-muted">Active package</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{planLabel(planKey)}</h3>
          {displayProfile ? (
            <p className="mt-1 text-sm hg-muted">{displayProfile}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
            {status === "active" ? "Active" : status || "Active"}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenSwitcher?.();
            }}
            className="inline-flex h-8 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 text-xs font-semibold text-[var(--hg-text)] hover:border-[var(--hg-accent)]/40 hover:text-white"
          >
            Switch profile
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm hg-muted">
        <div>
          <p className="text-xs uppercase tracking-wide hg-muted">Package instance ID</p>
          <p className="mt-1 text-[var(--hg-text)]">{packageInstanceId || "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide hg-muted">Created</p>
          <p className="mt-1 text-[var(--hg-text)]">
            {created ? created.toLocaleString() : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
