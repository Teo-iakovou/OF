"use client";
import { useTranslations } from "next-intl";

export function CreditsChip({ used, limit }: { used: number; limit: number }) {
  const t = useTranslations("dashboard.aiChat.creditsChip");
  return (
    <span
      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
      title={t("title")}
    >
      {t("label", { used, limit })}
    </span>
  );
}