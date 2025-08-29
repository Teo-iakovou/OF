"use client";

export function QuickPromptsBar({
  prompts,
  onPick,
  className = "",
  label = "Suggested prompts",
  sendOnClick = false,
}: {
  prompts: string[];
  onPick: (text: string, opts?: { send?: boolean }) => void;
  className?: string;
  label?: string;
  /** If true, clicking a chip will immediately send it (instead of just filling the textarea) */
  sendOnClick?: boolean;
}) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 text-xs font-medium text-gray-400">{label}</div>

      {/* Wrapping grid: no horizontal scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {prompts.map((p, i) => (
          <button
            key={`${i}-${p.slice(0, 28)}`}
            type="button"
            onClick={() => onPick(p, { send: sendOnClick })}
            title={p}
            className="text-left px-3 py-2 rounded-lg bg-[#202636] border border-gray-700/70 hover:border-gray-600 hover:bg-[#253045] text-gray-100 text-xs leading-snug transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}