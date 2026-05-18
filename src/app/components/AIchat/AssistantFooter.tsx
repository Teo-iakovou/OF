// src/app/components/AIchat/AssistantFooter.tsx
"use client";

import { useTranslations } from "next-intl";

type Meta = { usedContextIds?: string[]; requestId?: string; latencyMs?: number };

const HINT_ICONS = ["✍️", "🪝", "🎬", "🔁"];

export function AssistantFooter(props: { meta?: Meta }) {
  const t = useTranslations("dashboard.aiChat");
  const hintLabels = [t("footerHint1"), t("footerHint2"), t("footerHint3"), t("footerHint4")];

  return (
    <div className="mt-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/70 p-2.5">
      <p className="mb-2 text-[11px] text-gray-400">
        {t("footerDescription")}
      </p>
      <div className="flex flex-wrap gap-1.5">
      {HINT_ICONS.map((icon, i) => (
        <span
          key={hintLabels[i]}
          className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-[#1a1f2b] px-2.5 py-0.5 text-[11px] text-gray-300"
        >
          <span>{icon}</span>
          {hintLabels[i]}
        </span>
      ))}
      </div>
      {props.meta?.requestId ? (
        <p className="mt-2 text-[10px] text-gray-500">Response ID: {props.meta.requestId}</p>
      ) : null}
    </div>
  );
}
