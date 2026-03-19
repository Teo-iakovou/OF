// src/app/components/AIchat/AssistantFooter.tsx
"use client";

type Meta = { usedContextIds?: string[]; requestId?: string; latencyMs?: number };

const HINTS = [
  { icon: "📊", label: "Analyse uploads" },
  { icon: "✍️", label: "Write captions" },
  { icon: "🗓️", label: "Plan content" },
  { icon: "#", label: "Hashtag strategy" },
];

export function AssistantFooter(_props: { meta?: Meta }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {HINTS.map((h) => (
        <span
          key={h.label}
          className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-[#1a1f2b] px-2.5 py-0.5 text-[11px] text-gray-500"
        >
          <span>{h.icon}</span>
          {h.label}
        </span>
      ))}
    </div>
  );
}
