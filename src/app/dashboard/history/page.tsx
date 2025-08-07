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

    useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setHistory([]);
          setLoading(false);
          return;
        }
        const { results } = await fetchAnalysisHistory(1, "", "", email);
        setHistory(results);
      } catch (err) {
        console.error("Failed to load history", err);
        setHistory([]);
      }
      setLoading(false);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

 return (
    <main>
      {/* Header */}
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Upload History
          </h1>
          {/* Navigation dropdown for mobile */}
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

      {/* Content */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-button min-h-[320px] max-w-6xl mx-auto">
        {loading ? (
          <Spinner />
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <svg width="40" height="40" fill="none" className="mb-2 opacity-50">
              <circle cx="20" cy="20" r="18" stroke="#38bdf8" strokeWidth="2" />
              <path d="M14 20l4 4 8-8" stroke="#38bdf8" strokeWidth="2" />
            </svg>
            <div className="text-gray-400 text-lg">
              No uploads yet. Start by uploading your first file!
            </div>
          </div>
        ) : (
          <HistoryList
            history={history}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onDeleteClick={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
