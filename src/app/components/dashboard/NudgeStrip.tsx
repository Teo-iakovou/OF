"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

type NudgeStripProps = {
  uploadsRemaining?: number | null;
  uploadsLimit?: number | null;
  latestUploadAgeDays?: number | null;
  chatRemaining?: number | null;
  chatUsedEver?: boolean;
  videoRemaining?: number | null;
  videoUsedEver?: boolean;
};

type Nudge = {
  id: string;
  messageKey: string;
  ctaKey: string;
  href: string;
};

const DISMISS_KEY = "nudges:dismissed";
const DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

const getDismissed = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
};

const isDismissed = (id: string) => {
  const map = getDismissed();
  const expiry = map[id];
  return typeof expiry === "number" && expiry > Date.now();
};

const dismiss = (id: string) => {
  const map = getDismissed();
  map[id] = Date.now() + DISMISS_TTL_MS;
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify(map));
  } catch {}
};

export default function NudgeStrip({
  uploadsRemaining,
  uploadsLimit,
  latestUploadAgeDays,
  chatRemaining,
  chatUsedEver,
  videoRemaining,
  videoUsedEver,
}: NudgeStripProps) {
  const t = useTranslations("dashboard.home.nudge");
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Record<string, number>>({});

  useEffect(() => {
    setDismissed(getDismissed());
  }, []);

  const nudge = useMemo<Nudge | null>(() => {
    const now = Date.now();
    const isActive = (id: string) => {
      const expiry = dismissed[id];
      return !(typeof expiry === "number" && expiry > now);
    };

    const uploadsLow =
      typeof uploadsRemaining === "number" &&
      typeof uploadsLimit === "number" &&
      uploadsLimit > 0 &&
      uploadsRemaining / uploadsLimit <= 0.2;

    if (uploadsLow && isActive("uploads-low")) {
      return { id: "uploads-low", messageKey: "nudgeUploadsLow", ctaKey: "nudgeBuyMore", href: "/dashboard?settings=1&tab=billing&addon=uploads" };
    }

    const staleUpload =
      typeof latestUploadAgeDays === "number" && latestUploadAgeDays >= 7;

    if (staleUpload && isActive("no-recent-upload")) {
      return { id: "no-recent-upload", messageKey: "nudgeNoRecentUpload", ctaKey: "nudgeUploadNow", href: "/dashboard/upload" };
    }

    const chatUntouched =
      typeof chatRemaining === "number" && chatRemaining > 0 && !chatUsedEver;

    if (chatUntouched && isActive("chat-untouched")) {
      return { id: "chat-untouched", messageKey: "nudgeChatUntouched", ctaKey: "nudgeTryChat", href: "/dashboard/ai-chat" };
    }

    const videoUntouched =
      typeof videoRemaining === "number" && videoRemaining > 0 && !videoUsedEver;

    if (videoUntouched && isActive("video-untouched")) {
      return { id: "video-untouched", messageKey: "nudgeVideoUntouched", ctaKey: "nudgeTryVideo", href: "/dashboard/talking-head" };
    }

    return null;
  }, [dismissed, uploadsRemaining, uploadsLimit, latestUploadAgeDays, chatRemaining, chatUsedEver, videoRemaining, videoUsedEver]);

  if (!nudge) return null;

  const handleDismiss = () => {
    dismiss(nudge.id);
    setDismissed(getDismissed());
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3">
      <p className="text-sm text-[var(--hg-muted)]">{t(nudge.messageKey)}</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(nudge.href)}
          className="whitespace-nowrap rounded-lg border border-[var(--hg-accent)] px-3 py-1.5 text-xs font-medium text-[var(--hg-accent)] transition-colors hover:bg-[var(--hg-accent)] hover:text-[var(--hg-accent-fg)]"
        >
          {t(nudge.ctaKey)}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="rounded-lg p-1 text-[var(--hg-muted)] transition-colors hover:text-[var(--hg-text)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
