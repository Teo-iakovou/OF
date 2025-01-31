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
      title: "Confirm to delete",
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

  // ✅ Show "No history available" when history is empty
  if (!history || history.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-6">
        No analysis history found.
      </div>
    );
  }

  return (
    <ul className="list-disc pl-5">
      {history.map((item) => (
        <li key={item._id} className="mb-4 flex items-center gap-2">
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
          />
          <div>
            <strong>Platform:</strong> {item.platform}
          </div>
          <button
            onClick={() => confirmDelete(item._id)}
            className="text-red-500 hover:underline mt-2"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;
