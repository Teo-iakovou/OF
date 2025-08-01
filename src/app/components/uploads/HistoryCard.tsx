"use client";

interface HistoryCardProps {
  item: {
    _id: string;
    platform: string;
    hashtags: string[];
    createdAt: string;
  };
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
onDeleteClick: (id: string) => void;
}

const HistoryCard = ({
  item,
  selectedItems,
  setSelectedItems,
  onDeleteClick,
}: HistoryCardProps) => {
  const toggleSelection = () => {
    setSelectedItems((prev) =>
      prev.includes(item._id)
        ? prev.filter((id) => id !== item._id)
        : [...prev, item._id]
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl flex justify-between items-start shadow-button hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selectedItems.includes(item._id)}
          onChange={toggleSelection}
          className="h-5 w-5 mt-1 accent-pink-500"
        />
        <div>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Platform:</span>{" "}
            {item.platform}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Hashtags:</span>{" "}
            {item.hashtags?.length > 0 ? (
              <span className="text-pink-400">
                {item.hashtags.slice(0, 5).join(", ")}
              </span>
            ) : (
              "None"
            )}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Date:</span>{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDeleteClick(item._id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg font-semibold"
      >
        Delete
      </button>
    </div>
  );
};

export default HistoryCard;
