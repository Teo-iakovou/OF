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
    <div className={`flex items-center gap-3 text-xs text-[var(--hg-muted)] ${className}`}>
      <span>{t("helpfulPrompt")}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleVote("up")}
          disabled={loading}
          aria-label={t("helpful")}
          className={`transition ${
            vote === "up"
              ? "text-[var(--hg-accent)]"
              : vote === "down"
              ? "opacity-30 cursor-default"
              : "text-gray-600 hover:text-gray-400"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleVote("down")}
          disabled={loading}
          aria-label={t("notHelpful")}
          className={`transition ${
            vote === "down"
              ? "text-[var(--hg-accent)]"
              : vote === "up"
              ? "opacity-30 cursor-default"
              : "text-gray-600 hover:text-gray-400"
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
