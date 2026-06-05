"use client";

import { useTranslations } from "next-intl";
import { BrandIcon } from "./BrandIcons";

type Props = {
  platform: string;
  skipReason: string;
};

export function PlatformSkipState({ platform, skipReason }: Props) {
  const t = useTranslations("dashboard.recommendations");

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--hg-border)] bg-[var(--hg-surface-2)]/40 px-6 py-10 text-center">
      <div className="mb-3 opacity-30">
        <BrandIcon platform={platform} size={48} variant="color" />
      </div>
      <p className="text-sm font-medium text-[var(--hg-muted)]">
        {t("notRecommendedForContent")}
      </p>
      {skipReason ? (
        <p className="mt-2 max-w-xs text-xs text-[var(--hg-muted-2)]">
          <span className="font-medium text-[var(--hg-muted)]">{t("skippedReason")}</span>{" "}
          {skipReason}
        </p>
      ) : null}
    </div>
  );
}
