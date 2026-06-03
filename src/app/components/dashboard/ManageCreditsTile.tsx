"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

type ManageCreditsTileProps = {
  locale: string;
  className?: string;
};

export default function ManageCreditsTile({ locale, className }: ManageCreditsTileProps) {
  const t = useTranslations("dashboard.home.manageCredits");

  return (
    <div
      className={`flex flex-col justify-center rounded-2xl bg-[var(--hg-surface-2)] p-4${className ? ` ${className}` : ""}`}
    >
      <Wallet className="h-[22px] w-[22px] text-[#50C0F0]" strokeWidth={1.5} />
      <p className="mt-3 text-sm font-medium text-[var(--hg-text)]">
        {t("heading")}
      </p>
      <p className="mt-1 text-[13px] text-[var(--hg-muted)] leading-snug">
        {t("body")}
      </p>
      <Link
        href={`/${locale}/dashboard/billing`}
        className="mt-3 text-[13px] font-medium text-[#50C0F0] hover:opacity-80 transition-opacity"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
