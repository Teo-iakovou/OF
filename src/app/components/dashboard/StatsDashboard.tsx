"use client";

import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import HistoryList from "@/app/components/uploads/HistoryList";
import Insights from "@/app/components/analytics/Insights";
import { fetchAnalysisHistory } from "@/app/utils/api";

export default function StatsDashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [insights, setInsights] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    console.log("Deleting:", id);
    setHistory((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalysisHistory(1);
        setHistory(data?.results || []);

        if (data?.results?.length > 0) {
          setInsights(data.results[0]);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    loadData();
  }, []);

  const layout = [
    { i: "history", x: 0, y: 0, w: 6, h: 4 },
    { i: "insights", x: 6, y: 0, w: 6, h: 4 },
    { i: "lastUpload", x: 0, y: 4, w: 6, h: 2 },
    { i: "planUsage", x: 6, y: 4, w: 6, h: 2 },
  ];

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-button p-4 md:p-6 space-y-4">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        isDraggable
        isResizable={false}
      >
        {/* Upload History */}
        <div
          key="history"
          className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto"
        >
          <h2 className="text-lg font-semibold text-pink-400 mb-2">
            📁 Upload History
          </h2>
          <HistoryList
            history={history}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            handleDelete={handleDelete}
          />
        </div>

        {/* Insights */}
        <div
          key="insights"
          className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto"
        >
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            📊 Insights
          </h2>
          {insights && <Insights insights={insights} />}
        </div>

        {/* Last Upload */}
        <div key="lastUpload" className="bg-gray-800 rounded-2xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">
            📅 Last Upload
          </h2>
          <p className="text-gray-300">
            {history.length > 0
              ? new Date(history[0].createdAt).toLocaleString()
              : "No uploads yet"}
          </p>
        </div>

        {/* Plan Usage */}
        <div key="planUsage" className="bg-gray-800 rounded-2xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-green-400 mb-2">
            📦 Plan Usage
          </h2>
          <p className="text-gray-300">3 of 10 uploads used</p>
        </div>
      </GridLayout>
    </div>
  );
}
