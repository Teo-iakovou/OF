"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type QuickActionsProps = {
  uploadsRemaining?: number | null;
  chatRemaining?: number | null;
};

const isExhausted = (remaining?: number | null) =>
  typeof remaining === "number" ? remaining <= 0 : false;

const ActionButton = ({
  href,
  onClick,
  label,
  primary = false,
  disabled = false,
  tooltip,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  primary?: boolean;
  disabled?: boolean;
  tooltip?: string;
}) => {
  const base =
    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-center text-sm font-medium transition";
  const enabledStyles = primary
    ? "bg-[#50C0F0] text-[#07131d] hover:opacity-90"
    : "bg-[var(--hg-surface-2)] text-[var(--hg-text)] border border-[var(--hg-border)] hover:border-[var(--hg-accent)]/40";
  const disabledStyles = "cursor-not-allowed border border-[var(--hg-border-2)] bg-[var(--hg-surface-2)] text-[var(--hg-muted-2)]";

  const tActions = useTranslations("dashboard.home.quickActions");
  if (disabled) {
    return (
      <span className={`${base} ${disabledStyles}`} title={tooltip || tActions("unavailable")}>
        {label}
      </span>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${enabledStyles}`}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={`${base} ${enabledStyles}`}>
      {label}
    </Link>
  );
};

export default function QuickActions({ uploadsRemaining, chatRemaining }: QuickActionsProps) {
  const t = useTranslations("dashboard.home.quickActions");
  const router = useRouter();
  const uploadDisabled = isExhausted(uploadsRemaining);
  const chatDisabled = isExhausted(chatRemaining);

  return (
    <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20">
      <p className="text-xs uppercase tracking-wide hg-muted">{t("sectionLabel")}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{t("heading")}</h3>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 [&>*]:w-full">
        <ActionButton
          href="/dashboard/upload"
          label={t("uploadContent")}
          primary
          disabled={uploadDisabled}
          tooltip={t("uploadTooltip")}
        />
        <ActionButton
          href="/dashboard/ai-chat"
          label={t("aiChat")}
          disabled={chatDisabled}
          tooltip={t("chatTooltip")}
        />
        <ActionButton
          label={t("aiVideoAvatar")}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("dashboard:close-settings"));
            }
            router.push("/dashboard/talking-head");
          }}
        />
      </div>
    </div>
  );
}
