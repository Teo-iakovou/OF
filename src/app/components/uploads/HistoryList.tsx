import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const HistoryList = ({
  history,
  selectedItems,
  setSelectedItems,
  handleDelete,
}: {
  history: any[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  handleDelete: (id: string) => Promise<void>;
}) => {
  const confirmDelete = (id: string) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  // Show "No history available" when history is empty
  if (!history || history.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-6">
        No analysis history found.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {history.map((item) => (
        <li
          key={item._id}
          className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {/* Checkbox */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedItems.includes(item._id)}
              onChange={() =>
                setSelectedItems((prev) =>
                  prev.includes(item._id)
                    ? prev.filter((id) => id !== item._id)
                    : [...prev, item._id]
                )
              }
              className="h-5 w-5 text-pink-500 focus:ring-pink-400"
            />
            <div>
              <p>
                <strong>Platform:</strong> {item.platform}
              </p>
              <p>
                <strong>Hashtags:</strong>{" "}
                {item.hashtags && item.hashtags.length > 0
                  ? item.hashtags.join(", ")
                  : "None"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => confirmDelete(item._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;
