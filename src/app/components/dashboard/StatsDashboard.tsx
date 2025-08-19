"use client";

import { useEffect, useState } from "react";
import Insights from "@/app/components/analytics/Insights"; // ← new path
import HistoryList, {
  HistoryItem as HistoryItemType,
} from "@/app/components/uploads/HistoryList";
import { fetchAnalysisHistory, deleteAnalysisResult } from "@/app/utils/api";
import { getClientEmail } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

export default function StatsDashboard() {
  const [history, setHistory] = useState<ResultDoc[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultDoc | null>(null);

  useEffect(() => {
    const email = getClientEmail();
    if (!email) return;

    let cancelled = false;
    (async () => {
      try {
        const { results } = await fetchAnalysisHistory(email, 1, 10);
        if (cancelled) return;
        setHistory(results);
        if (results.length > 0) setSelectedResult(results[0]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) {
          setHistory([]);
          setSelectedResult(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);
    } catch (e) {
      console.warn("Delete on server failed, removing locally anyway.", e);
    } finally {
      setHistory((prev) => prev.filter((item) => item._id !== id));
      setSelectedItems((prev) => prev.filter((x) => x !== id));
      setSelectedResult((prev) => (prev?._id === id ? null : prev));
    }
  };

   const handleOpen = (id: string) => {
    const item = history.find(h => h._id === id) || null;
    setSelectedResult(item);
  };

  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mt-8">
      {/* Upload History */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto min-h-[220px]">
        <h2 className="text-lg font-semibold text-pink-400 mb-2">📁 Upload History</h2>
        <HistoryList
          history={history as unknown as HistoryItemType[]}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          onDeleteClick={handleDelete}
            onOpenClick={handleOpen}
          


        />
      </div>

      {/* Insights (full ResultDoc) */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto min-h-[220px]">
        <h2 className="text-lg font-semibold text-purple-400 mb-2">📊 Insights</h2>
        {selectedResult ? <Insights result={selectedResult} /> : <p>No insights yet</p>}
      </div>

      {/* Last Upload */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md col-span-1">
        <h2 className="text-lg font-semibold text-blue-400 mb-2">📅 Last Upload</h2>
        <p className="text-gray-300">
          {history.length > 0
            ? new Date(history[0].createdAt).toLocaleString()
            : "No uploads yet"}
        </p>
      </div>

      {/* Plan Usage (placeholder) */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md col-span-1">
        <h2 className="text-lg font-semibold text-green-400 mb-2">📦 Plan Usage</h2>
        <p className="text-gray-300">3 of 10 uploads used</p>
      </div>
    </div>
  );
}