"use client";

export function QuickPromptsBar({
  prompts,
  onPick,
  className = "",
  label = "Suggested prompts",
  category,
  sendOnClick = false,
}: {
  prompts: string[];
  onPick: (text: string, opts?: { send?: boolean }) => void;
  className?: string;
  label?: string;
  category?: string;
  /** If true, clicking a chip will immediately send it (instead of just filling the textarea) */
  sendOnClick?: boolean;
}) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-gray-400">{label}</div>
        {category ? (
          <span className="rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--hg-muted)]">
            {category}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {prompts.map((p, i) => (
          <button
            key={`${i}-${p.slice(0, 28)}`}
            type="button"
            onClick={() => onPick(p, { send: sendOnClick })}
            title={p}
            className="text-left rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2.5 text-xs leading-snug text-gray-100 transition hover:border-white/25 hover:bg-[#253045]"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
