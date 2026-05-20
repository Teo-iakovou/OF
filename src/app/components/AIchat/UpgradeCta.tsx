"use client";
import { useTranslations } from "next-intl";
import { PACKAGES_URL } from "@/app/utils/urls";

export function UpgradeCta({ href = PACKAGES_URL }: { href?: string }) {
  const t = useTranslations("dashboard.aiChat.upgradeBanner");
  return (
    <a
      href={href}
      className="inline-flex flex-col gap-0.5 rounded-xl border border-[var(--hg-accent)]/30 bg-[var(--hg-accent)]/10 px-3 py-2 text-xs hover:bg-[var(--hg-accent)]/20 transition"
    >
      <span className="font-semibold text-[var(--hg-accent)]">
        {t("heading")}
      </span>
      <span className="text-[var(--hg-muted)]">
        {t("body")}
      </span>
    </a>
  );
}
