"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitOutputFeedback, getOutputFeedback } from "@/app/utils/api";

type Vote = "up" | "down" | null;

interface ThumbsFeedbackProps {
  type: "upload_report" | "video";
  referenceId: string;
  className?: string;
}

export function ThumbsFeedback({ type, referenceId, className = "" }: ThumbsFeedbackProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("dashboard.feedback" as any);
  const [vote, setVote] = useState<Vote>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getOutputFeedback(type, referenceId)
      .then((existing) => {
        if (!cancelled) setVote(existing);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type, referenceId]);

  const handleVote = async (newVote: "up" | "down") => {
    if (loading || vote === newVote) return;
    const previous = vote;
    setVote(newVote);
    try {
      await submitOutputFeedback(type, referenceId, newVote);
    } catch {
      setVote(previous);
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-1 opacity-60 transition-opacity duration-200 hover:opacity-100 ${className}`}
    >
      <button
        type="button"
        onClick={() => void handleVote("up")}
        disabled={loading}
        aria-label={t("helpfulYes")}
        className={`rounded-md p-1.5 transition-colors duration-150 ${
          vote === "up"
            ? "bg-emerald-500/10 text-emerald-400"
            : vote === "down"
            ? "cursor-default text-[var(--hg-muted-2)] opacity-30 hover:bg-transparent"
            : "text-[var(--hg-muted-2)] hover:bg-[var(--hg-surface)] hover:text-[var(--hg-muted)]"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => void handleVote("down")}
        disabled={loading}
        aria-label={t("helpfulNo")}
        className={`rounded-md p-1.5 transition-colors duration-150 ${
          vote === "down"
            ? "bg-rose-500/10 text-rose-400"
            : vote === "up"
            ? "cursor-default text-[var(--hg-muted-2)] opacity-30 hover:bg-transparent"
            : "text-[var(--hg-muted-2)] hover:bg-[var(--hg-surface)] hover:text-[var(--hg-muted)]"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
