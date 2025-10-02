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
  const topPlatform = top?.platform || "—";
  const topTime = top?.bestTimesLocal?.[0] || "—";
  const when = new Date(item.createdAt).toLocaleString();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenClick(item._id)}
      onKeyDown={(e) => e.key === "Enter" && onOpenClick(item._id)}
      className="flex items-center justify-between gap-4 bg-gray-800 border border-gray-700 p-4 sm:p-5 rounded-xl shadow-button hover:shadow-lg hover:bg-gray-800/80 transition cursor-pointer"
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-white font-semibold truncate">
            Analysis • {when}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {topPlatform} • Best {topTime}
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
          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm"
        >
          Open
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item._id);
          }}
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
