"use client";

interface HistoryCardProps {
  item: {
    _id: string;
    createdAt: string;
    promotion?: {
      recommendedPlatforms?: Array<{
        platform: string;
        bestTimesLocal?: string[];
      }>;
    };
  };
  selectedItems: string[]; // unused (selection removed)
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>; // unused
  onDeleteClick: (id: string) => void;
  onOpenClick: (id: string) => void; // required for navigation
}

const HistoryCard = ({
  item,
  selectedItems: _selectedItems,
  setSelectedItems: _setSelectedItems,
  onDeleteClick,
  onOpenClick,
}: HistoryCardProps) => {
  // selection removed

  // Tiny summary (kept *minimal*): top platform and best time
  const top = item.promotion?.recommendedPlatforms?.[0];
  const topPlatform = top?.platform;
  type PromotionWithOptionalNiche = NonNullable<typeof item.promotion> & { niche?: string };
  const niche = (item.promotion as PromotionWithOptionalNiche | undefined)?.niche;
  const when = new Date(item.createdAt).toLocaleString();
  const meta = [
    niche ? `Niche: ${niche}` : null,
    topPlatform ? `Top platform: ${topPlatform}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenClick(item._id)}
      onKeyDown={(e) => e.key === "Enter" && onOpenClick(item._id)}
      className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer"
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-gray-500">{when}</div>
          <div className="mt-2 text-sm text-gray-600 truncate">
            {meta || "Insights ready"}
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenClick(item._id);
          }}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
        >
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item._id);
          }}
          className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
