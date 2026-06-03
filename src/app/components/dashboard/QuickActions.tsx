"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UploadCloud, MessageCircle, Video } from "lucide-react";

type QuickActionsProps = {
  uploadsRemaining?: number | null;
  chatRemaining?: number | null;
  videoRemaining?: number | null;
  className?: string;
};

type ActionButtonProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
};

const isExhausted = (remaining?: number | null) =>
  typeof remaining === "number" ? remaining <= 0 : false;

function ActionButton({
  href,
  icon,
  label,
  sublabel,
  variant = "secondary",
  disabled = false,
  onClick,
}: ActionButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return;
        onClick?.();
        router.push(href);
      }}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
        disabled
          ? "cursor-not-allowed border-[var(--hg-border)] bg-[var(--hg-surface)] opacity-50"
          : variant === "primary"
          ? "border-transparent bg-[var(--hg-accent)] text-white hover:opacity-90"
          : "border-[var(--hg-border)] bg-[var(--hg-surface)] text-[var(--hg-text)] hover:bg-[var(--hg-surface-2)]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          variant === "primary" ? "bg-white/15" : "bg-[var(--hg-surface-2)]"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
        <div
          className={`truncate text-xs ${
            variant === "primary" ? "text-white/70" : "text-[var(--hg-muted)]"
          }`}
        >
          {sublabel}
        </div>
      </div>
    </button>
  );
}

export default function QuickActions({
  uploadsRemaining,
  chatRemaining,
  videoRemaining,
  className,
}: QuickActionsProps) {
  const t = useTranslations("dashboard.home.quickActions");

  return (
    <div className={`h-full flex flex-col justify-between rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20${className ? ` ${className}` : ""}`}>
      <p className="text-xs uppercase tracking-wide hg-muted">{t("sectionLabel")}</p>
      <div className="mt-4 flex flex-col gap-3">
        <ActionButton
          href="/dashboard/upload"
          icon={<UploadCloud className="h-5 w-5" />}
          label={t("uploadContent")}
          sublabel={t("uploadSublabel")}
          variant="primary"
          disabled={isExhausted(uploadsRemaining)}
        />
        <ActionButton
          href="/dashboard/ai-chat"
          icon={<MessageCircle className="h-5 w-5" />}
          label={t("aiChat")}
          sublabel={t("chatSublabel")}
          disabled={isExhausted(chatRemaining)}
        />
        <ActionButton
          href="/dashboard/talking-head"
          icon={<Video className="h-5 w-5" />}
          label={t("aiVideoAvatar")}
          sublabel={t("videoSublabel")}
          disabled={isExhausted(videoRemaining)}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("dashboard:close-settings"));
            }
          }}
        />
      </div>
    </div>
  );
}
