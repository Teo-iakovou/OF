"use client";

import { useEffect, useState } from "react";
import HistoryList from "@/app/components/uploads/HistoryList";
import { deleteAnalysisResult, fetchAnalysisHistory } from "@/app/utils/api";

interface HistoryItem {
  _id: string;
  platform: string;
  hashtags: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Upload History
      </h1>

      <div className="bg-gray-800 rounded-xl p-6 shadow-button">
        <HistoryList
          history={history}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
