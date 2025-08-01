"use client";
import { useState, useRef, useEffect } from "react";
import HistoryList from "@/app/components/uploads/HistoryList";
import { deleteAnalysisResult, fetchAnalysisHistory } from "@/app/utils/api";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import Spinner from "@/app/components/dashboard/loading spinner/page";

interface HistoryItem {
  _id: string;
  platform: string;
  hashtags: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { results } = await fetchAnalysisHistory(1);
        setHistory(results);
      } catch {
        // Optional: add toast for failed fetch
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteAnalysisResult(itemToDelete);
    setHistory((prev) => prev.filter((item) => item._id !== itemToDelete));
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  return (
    <main>
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Upload History
          </h1>
          <div ref={menuRef} className="relative inline-block md:hidden">
            <ProjectNavDropdownButton open={open} setOpen={setOpen} />
            {open && (
              <ProjectNavDropdownMenu
                overlayMode
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      <div className="bg-gray-800 rounded-xl p-6 shadow-button min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : (
          <HistoryList
            history={history}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
