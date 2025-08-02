import Insights from '@/app/components/analytics/Insights';
import HistoryList from '@/app/components/uploads/HistoryList';
import { fetchAnalysisHistory } from '@/app/utils/api';
import { useEffect, useState } from 'react';

export default function StatsDashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [insights, setInsights] = useState<any | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalysisHistory(1);
        setHistory(data?.results || []);
        if (data?.results?.length > 0) setInsights(data.results[0]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    loadData();
  }, []);
  const handleDelete = async (id: string) => {
    // Optionally call an API to delete from backend here!
    setHistory((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mt-8">
      {/* Upload History */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto min-h-[220px]">
        <h2 className="text-lg font-semibold text-pink-400 mb-2">
          📁 Upload History
        </h2>
        <HistoryList
          history={history}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
  onDeleteClick={handleDelete}
        />
      </div>
      {/* Insights */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md overflow-auto min-h-[220px]">
        <h2 className="text-lg font-semibold text-purple-400 mb-2">
          📊 Insights
        </h2>
        {insights ? <Insights insights={insights} /> : <p>No insights yet</p>}
      </div>
      {/* Last Upload */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md col-span-1">
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
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md col-span-1">
        <h2 className="text-lg font-semibold text-green-400 mb-2">
          📦 Plan Usage
        </h2>
        <p className="text-gray-300">3 of 10 uploads used</p>
      </div>
    </div>
  );
}
