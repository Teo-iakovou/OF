// src/app/components/AIchat/AssistantFooter.tsx
"use client";

type Meta = { usedContextIds?: string[]; requestId?: string; latencyMs?: number };

const HINTS = [
  { icon: "✍️", label: "Ask for 3 caption angles" },
  { icon: "🪝", label: "Generate stronger hooks" },
  { icon: "🎬", label: "Create avatar script ideas" },
  { icon: "🔁", label: "Repurpose across platforms" },
];

export function AssistantFooter(props: { meta?: Meta }) {
  return (
    <div className="mt-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/70 p-2.5">
      <p className="mb-2 text-[11px] text-gray-400">
        Your AI content strategy coach can help you go from idea to publish-ready output.
      </p>
      <div className="flex flex-wrap gap-1.5">
      {HINTS.map((h) => (
        <span
          key={h.label}
          className="inline-flex items-center gap-1 rounded-full border border-gray-700/60 bg-[#1a1f2b] px-2.5 py-0.5 text-[11px] text-gray-300"
        >
          <span>{h.icon}</span>
          {h.label}
        </span>
      ))}
      </div>
      {props.meta?.requestId ? (
        <p className="mt-2 text-[10px] text-gray-500">Response ID: {props.meta.requestId}</p>
      ) : null}
    </div>
  );
}
