"use client";

import { useUser } from "@/app/hooks/useUser";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { formatRemaining } from "@/app/utils/quotaDisplay";

interface Props {
  className?: string;
}

export default function PlanStatusPill({ className }: Props) {
  const t = useTranslations("dashboard.planStatusPill");
  const { user, loading: userLoading } = useUser({ required: false });
  const {
    data: planData,
    loading: planLoading,
    hasActiveInstance,
    isMissingActiveInstance,
  } = usePlanInfo();

  if (userLoading || planLoading) {
    return (
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70",
          className,
        )}
      >
        {t("checking")}
      </div>
    );
  }

  if (!user) return null;
  if (isMissingActiveInstance || !hasActiveInstance || !planData) return null;

  const hasAccess = !!planData?.hasAccess;
  const planName = planData?.package || "";
  const uploadsRemaining =
    typeof planData?.uploadsRemaining === "number" ? Math.max(0, planData.uploadsRemaining) : null;
  const hasCredits = uploadsRemaining === null ? true : uploadsRemaining > 0;
  const uploadsRemainingLabel = formatRemaining(uploadsRemaining);

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
        {t("noActivePlan")}
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
        {planName
          ? t("planNoUploadsLeft", { planName: planName.toUpperCase() })
          : t("noUploadsLeft")}
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
      {planName ? t("namedPlan", { planName: planName.toUpperCase() }) : t("activePlan")}
      <span className="text-white/80">•</span>
      <span className="text-white">{uploadsRemainingLabel}</span>
      <span className="text-white/70">{t("uploadsLeftSuffix")}</span>
    </div>
  );
}
