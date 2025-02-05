"use client";

import { useState } from "react";
import FileUpload from "@/app/components/FileUpload";
import Insights from "@/app/components/Insights";
import { ClipLoader } from "react-spinners";
import { analyzeImage } from "@/app/utils/api";

const UploadPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await analyzeImage(file);
      setInsights(response.insights);
    } catch (err) {
      console.error("Error analyzing image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          AI Content Analyzer
        </h1>
        <p className="text-lg text-gray-400">
          Upload your content and get insights powered by AI.
        </p>
      </header>

      {/* Upload Section */}
      <section className="mt-12 mx-auto max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">
          Upload Your Content
        </h2>
        <FileUpload onUpload={handleFileUpload} />
        {loading && (
          <div className="mt-6 flex justify-center">
            <ClipLoader size={50} color="#FF4D88" />
          </div>
        )}
      </section>

      {/* Insights Section */}
      {insights && (
        <section className="mt-12 mx-auto max-w-4xl bg-gray-800 rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">
            Your AI Insights
          </h2>
          <Insights insights={insights} />
        </section>
      )}

      {/* Footer Section */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2025 AI Content Helper. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UploadPage;
