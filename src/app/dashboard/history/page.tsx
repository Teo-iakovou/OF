"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Insights from "@/app/components/analytics/Insights";
import HistoryList, { HistoryItem as HistoryItemType } from "@/app/components/uploads/HistoryList";
import { deleteAnalysisResult, fetchAnalysisHistory, getClientEmail } from "@/app/utils/api";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import type { ResultDoc } from "@/app/types/analysis";

export default function HistoryPage() {
  const [history, setHistory] = useState<ResultDoc[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ResultDoc | null>(null);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(async () => {
    const email = getClientEmail();
    if (!email) {
      setHistory([]);
      setSelectedResult(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { results } = await fetchAnalysisHistory(email, 1, 20);
      setHistory(results);
      setSelectedResult((prev) =>
        prev && results.some((r) => r._id === prev._id)
          ? results.find((r) => r._id === prev._id) || null
          : null
      );
    } catch (err) {
      console.error("Failed to load history", err);
      setHistory([]);
      setSelectedResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial + event-driven reloads
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const onLocalStorage = (e: StorageEvent) => {
      if (e.key === "analysis:changed") loadHistory();
    };
    const onCustom = () => loadHistory();
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadHistory();
    };

    window.addEventListener("storage", onLocalStorage);
    window.addEventListener("analysis:changed", onCustom as EventListener);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onLocalStorage);
      window.removeEventListener("analysis:changed", onCustom as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loadHistory]);

  // Close mobile Project Nav on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setHistory((prev) => prev.filter((item) => item._id !== id));
      setSelectedItems((prev) => prev.filter((x) => x !== id));
      setSelectedResult((prev) => (prev?._id === id ? null : prev));
    }
  };

  const handleOpen = (id: string) => {
    const item = history.find((h) => h._id === id) || null;
    setSelectedResult(item);
  };

  return (
    // Fill the dashboard layout; header is fixed-height, content scrolls
    <div className="h-full flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Upload History</h1>
          <button
            onClick={loadHistory}
            className="hidden md:inline px-3 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Mobile Project Nav under the title */}
        <div className="mt-3 md:hidden" ref={menuRef}>
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <div className="relative z-40">
              <ProjectNavDropdownMenu overlayMode onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 md:px-12 lg:px-20 max-w-6xl mx-auto pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left: list */}
            <section className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-button min-h-[280px]">
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
                  history={history as unknown as HistoryItemType[]}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onDeleteClick={handleDelete}
                  onOpenClick={handleOpen}
                />
              )}
            </section>

            {/* Right: details */}
            <section className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-button min-h-[280px]">
              {selectedResult ? (
                <div className="min-h-0">
                  <Insights result={selectedResult} />
                </div>
              ) : (
                <div className="text-gray-400">Select an item from the list to view insights.</div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}