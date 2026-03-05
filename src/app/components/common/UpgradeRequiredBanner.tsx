"use client";

import Link from "next/link";
import clsx from "clsx";
import { PACKAGES_URL } from "@/app/utils/urls";

interface Props {
  code?: string | null;
  error?: string | null;
  feature?: string | null;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
  className?: string;
}

export default function UpgradeRequiredBanner({
  code,
  error,
  feature,
  plan,
  remaining,
  limit,
  className = "",
}: Props) {
  if (code !== "UPGRADE_REQUIRED") return null;

  const hasCounts = typeof remaining === "number" || typeof limit === "number";

  return (
    <div
      className={clsx(
        "rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100 space-y-2",
        className,
      )}
    >
      <p className="font-semibold text-rose-200">{error || "Upgrade required"}</p>
      {feature ? (
        <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">{feature}</p>
      ) : null}
      {hasCounts ? (
        <p className="text-xs text-rose-100/80">
          {typeof remaining === "number" ? `${Math.max(0, remaining)} left` : ""}
          {typeof limit === "number" ? ` / ${limit} total` : ""}
        </p>
      ) : null}
      {plan ? <p className="text-xs text-rose-100/80">Current plan: {plan}</p> : null}
      <Link
        href={PACKAGES_URL}
        className="inline-flex items-center gap-2 rounded-full bg-rose-400/20 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400/30"
      >
        Upgrade plan →
      </Link>
    </div>
  );
}
