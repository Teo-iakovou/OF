"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { sendFeedback } from "@/app/utils/api";
import { toast } from "sonner";

interface FeedbackWidgetProps {
  /** floating: sidebar pill (desktop expanded). inline: full-width (settings drawer). icon: icon-only (collapsed sidebar / mobile topbar). */
  variant?: "floating" | "inline" | "icon";
}

export function FeedbackWidget({ variant = "floating" }: FeedbackWidgetProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("dashboard.feedback" as any);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await sendFeedback(message.trim());
      toast.success(t("thankYou"));
      setMessage("");
      setOpen(false);
    } catch {
      toast.error(t("error"));
    } finally {
      setSending(false);
    }
  };

  const trigger =
    variant === "floating" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)] hover:text-white"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span>{t("button")}</span>
      </button>
    ) : variant === "inline" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3 text-sm text-white transition hover:border-[var(--hg-accent)]"
      >
        <MessageCircle className="w-4 h-4 text-[var(--hg-accent)] shrink-0" />
        <span>{t("button")}</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t("button")}
        aria-label={t("button")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-[var(--hg-border)] hover:text-[#50C0F0]"
      >
        <MessageCircle size={22} />
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{t("modalTitle")}</h3>
                <p className="mt-1 text-xs text-[var(--hg-muted)]">{t("modalSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("closeAriaLabel")}
                className="rounded-full p-1 text-[var(--hg-muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("placeholder")}
              rows={5}
              className="mt-4 w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--hg-muted)] focus:border-[var(--hg-accent)] focus:outline-none resize-none"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm text-[var(--hg-muted)] hover:text-white"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="rounded-full bg-[var(--hg-accent)] px-4 py-2 text-sm font-semibold text-[#07131d] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? t("sending") : t("send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
