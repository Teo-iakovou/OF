"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DashboardOnboardingProps = {
  isNewUser: boolean;
  packageInstanceId?: string | null;
  planKey?: string;
  uploadsRemaining?: number | null;
  chatRemaining?: number | null;
  videoRemaining?: number | null;
};

type Step = {
  key: "upload" | "history" | "chat" | "video";
  label: string;
  href: string;
  disabled: boolean;
};

const isExhausted = (remaining?: number | null) =>
  typeof remaining === "number" ? remaining <= 0 : false;

const actionLinkBase =
  "inline-flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-800";
const disabledLinkBase = "inline-flex items-center gap-2 text-sm text-gray-400";

function ActionLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className={disabledLinkBase} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={actionLinkBase}>
      {children}
    </Link>
  );
}

export default function DashboardOnboarding({
  isNewUser,
  packageInstanceId,
  uploadsRemaining,
  chatRemaining,
  videoRemaining,
}: DashboardOnboardingProps) {
  const storageKey = `dashboard_onboarding_dismissed:${packageInstanceId || "unknown"}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isNewUser) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === "1") setDismissed(true);
    } catch {}
  }, [isNewUser, storageKey]);

  const steps: Step[] = useMemo(
    () => [
      {
        key: "upload",
        label: "Upload your first image",
        href: "/dashboard/upload",
        disabled: isExhausted(uploadsRemaining),
      },
      {
        key: "history",
        label: "Review your AI strategy",
        href: "/dashboard/history",
        disabled: false,
      },
      {
        key: "chat",
        label: "Try AI Chat",
        href: "/dashboard/ai-chat",
        disabled: isExhausted(chatRemaining),
      },
      {
        key: "video",
        label: "Generate a video",
        href: "/dashboard/talking-head",
        disabled: isExhausted(videoRemaining),
      },
    ],
    [uploadsRemaining, chatRemaining, videoRemaining]
  );

  const recommended = steps.find((step) => !step.disabled)?.key || "upload";

  if (!isNewUser || dismissed) return null;

  const onDismiss = () => {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
    setDismissed(true);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Getting started</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">Start with the basics</h3>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
          aria-label="Dismiss onboarding"
        >
          X
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm text-gray-700">
        {steps.map((step) => (
          <div
            key={step.key}
            className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{step.label}</span>
              {recommended === step.key ? (
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                  Recommended
                </span>
              ) : null}
            </div>
            <ActionLink href={step.href} disabled={step.disabled}>
              {step.disabled ? "Quota exhausted" : "Go to step →"}
            </ActionLink>
          </div>
        ))}
      </div>
    </div>
  );
}
