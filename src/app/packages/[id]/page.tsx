"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FileUpload from "@/app/components/FileUpload";
import Insights from "@/app/components/Insights";
import HistoryList from "@/app/components/HistoryList";
import Pagination from "@/app/components/Pagination";
import SearchFilter from "@/app/components/SearchFilter";
import Analytics from "@/app/components/Analytics";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { exportToCSV } from "@/app/utils/csvUtils";
import { filterHistory, bulkDelete } from "@/app/utils/historyUtils";
import {
  analyzeImage,
  fetchAnalysisHistory,
  deleteAnalysisResult,
} from "@/app/utils/api";

export default function PackagePage() {
  const { id } = useParams();

  type PackageKey = "lite" | "pro" | "ultimate";

  const packages: Record<
    PackageKey,
    { title: string; price: string; features: string[]; color: string }
  > = {
    lite: {
      title: "Lite Package",
      price: "$49",
      features: ["Basic Analytics", "5 Uploads/Day", "Email Support"],
      color: "from-blue-500 to-blue-700",
    },
    pro: {
      title: "Pro Package",
      price: "$349",
      features: [
        "Custom AI Insights",
        "Unlimited Uploads",
        "Dedicated 24/7 Support",
      ],
      color: "from-pink-500 to-pink-700",
    },
    ultimate: {
      title: "Ultimate Package",
      price: "$499",
      features: [
        "Full AI Integration",
        "Unlimited Uploads",
        "Premium Support",
        "Custom Reports",
      ],
      color: "from-purple-500 to-purple-700",
    },
  };

  const selectedPackage = packages[id as PackageKey];

  const [insights, setInsights] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch analysis history
  const fetchHistory = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchAnalysisHistory(page);

      console.log("Fetched history:", data); // ✅ Debugging log

      // ✅ Ensure history state is always an array
      setHistory(data.results || []);

      // ✅ Ensure totalPages is never NaN
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / 10)));

      // ✅ Handle case when there is no data
      if (!data.results || data.results.length === 0) {
        console.warn("No analysis history found.");
      }
    } catch (err: any) {
      console.error("Error fetching history:", err);
      toast.error("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await analyzeImage(file);

      console.log("Received Insights from API:", response); // ✅ Debugging log

      if (!response.insights || !response.insights.objects) {
        throw new Error("Unexpected API response format");
      }

      setInsights(response.insights);
      fetchHistory(currentPage); // Refresh history
      toast.success("Image uploaded and analyzed successfully!");
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      toast.error("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  // Handle delete request
  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);

      // ✅ Refresh history AFTER deleting
      await fetchHistory(currentPage);

      toast.success("Result deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting result:", err);
      toast.error("Failed to delete analysis result.");
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  if (!selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <h1 className="text-4xl font-bold text-red-500">
          Package not found. 😔
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${selectedPackage.color} flex flex-col items-center text-black`}
    >
      <div className="max-w-3xl bg-black bg-opacity-70 rounded-xl shadow-2xl p-10 mt-12">
        <h1 className="text-5xl font-extrabold text-center mb-6">
          {selectedPackage.title}
        </h1>
        <p className="text-3xl font-bold text-center mb-6">
          {selectedPackage.price}
        </p>
        <ul className="mb-8 space-y-4 pl-6 list-disc">
          {selectedPackage.features.map((feature, idx) => (
            <li key={idx} className="text-lg text-gray-300">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* File Upload Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold mb-6">Upload Your Content</h2>
        <FileUpload onUpload={handleFileUpload} />
        {loading && (
          <div className="mt-6 flex justify-center">
            <ClipLoader size={50} color="#FF4D88" />
          </div>
        )}
      </section>

      {/* Insights Section */}
      {insights && (
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6">Your Insights</h2>
          <Insights insights={insights} />
        </section>
      )}

      {/* Analytics Section */}
      {history.length > 0 && (
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6">Analytics Overview</h2>
          <Analytics history={history} />
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="mb-12">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPlatform={filterPlatform}
          setFilterPlatform={setFilterPlatform}
        />
      </section>

      {/* History List */}
      <section className="mb-12">
        <HistoryList
          history={filterHistory(history, searchTerm, filterPlatform)}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          handleDelete={handleDelete}
        />
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
