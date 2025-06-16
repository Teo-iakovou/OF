"use client";
import { useState, useRef, useEffect } from "react";
import HistoryList from "@/app/components/uploads/HistoryList";
import { deleteAnalysisResult, fetchAnalysisHistory } from "@/app/utils/api";
import ProjectNavDropdownButton from "@/app/components/dashboard/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/ProjectNavDropdown";

interface HistoryItem {
  _id: string;
  platform: string;
  hashtags: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { results } = await fetchAnalysisHistory(1);
        setHistory(results);
      } catch (err) {
        console.error("Failed to load history", err);
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
      <div className="bg-gray-800 rounded-xl p-6 shadow-button">
        <HistoryList
          history={history}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          handleDelete={handleDelete}
        />
      </div>
    </main>
  );
}
