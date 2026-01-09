"use client";

import { useUser } from "@/app/hooks/useUser";
import clsx from "clsx";
import { usePlanInfo } from "@/app/dashboard/PlanContext";

interface Props {
  className?: string;
}

export default function PlanStatusPill({ className }: Props) {
  const { user, loading: userLoading } = useUser({ required: false });
  const { data: planData, loading: planLoading } = usePlanInfo();

  if (userLoading || planLoading) {
    return (
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70",
          className,
        )}
      >
        Checking plan…
      </div>
    );
  }

  if (!user) return null;

  const hasAccess = !!planData?.hasAccess;
  const planName = planData?.package || "";
  const uploadsRemaining =
    typeof planData?.uploadsRemaining === "number" ? Math.max(0, planData.uploadsRemaining) : 0;
  const hasCredits = uploadsRemaining > 0;

  const tone = hasCredits ? "text-cyan-200" : hasAccess ? "text-amber-300" : "text-rose-300";
  const bg = hasCredits ? "bg-cyan-500/10 border-cyan-500/30" : "bg-rose-500/10 border-rose-500/30";

  if (!hasAccess) {
    return (
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-rose-200",
          "bg-rose-500/10 border-rose-500/30",
          className,
        )}
      >
        No active plan · 0 uploads
      </div>
    );
  }

  if (!hasCredits) {
    return (
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium",
          "bg-amber-500/10 border-amber-500/40 text-amber-200",
          className,
        )}
      >
        {planName ? `${planName.toUpperCase()} · No uploads left` : "No uploads left"}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 rounded-full border px-4 py-1.5 text-sm font-medium",
        bg,
        tone,
        className,
      )}
    >
      {planName ? `${planName.toUpperCase()} plan` : "Active plan"}
      <span className="text-white/80">•</span>
      <span className="text-white">{uploadsRemaining}</span>
      <span className="text-white/70">uploads left</span>
    </div>
  );
}
