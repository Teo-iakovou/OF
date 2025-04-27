"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/uploads/FileUpload";
import Insights from "@/app/components/analytics/Insights";
import { checkUserPackage } from "@/app/utils/api";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

const UploadPage = () => {
  const [insights, setInsights] = useState<any>(null);
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false); // 🆕 modal control
  const [emailInput, setEmailInput] = useState(""); // 🆕 email input

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      let userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;

      const status = searchParams.get("status");

      if (!userEmail && status === "success") {
        setShowModal(true); // 🆕 open modal instead of prompt
        return;
      }

      if (!userEmail) {
        console.warn("No email found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        const res = await checkUserPackage(userEmail);
        if (res?.hasAccess) {
          setUserPackage(res.package ?? null);
          setUploadsLeft(res.uploadsRemaining ?? null);
        } else {
          setUserPackage(null);
          setUploadsLeft(null);
        }
      } catch (err) {
        console.error("Failed to fetch package info:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [searchParams, router]);

  const handleEmailSubmit = async () => {
    if (!emailInput) return;

    localStorage.setItem("userEmail", emailInput);
    setShowModal(false);

    // Remove ?status=success from URL
    const cleanUrl = window.location.origin + window.location.pathname;
    router.replace(cleanUrl);

    // Refresh package info
    try {
      setIsLoading(true);
      const res = await checkUserPackage(emailInput);
      if (res?.hasAccess) {
        setUserPackage(res.package ?? null);
        setUploadsLeft(res.uploadsRemaining ?? null);
      }
    } catch (err) {
      console.error("Failed to fetch package info after email submit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (insightsData: any) => {
    setInsights(insightsData);
    setUploadsLeft((prev) => (prev !== null ? prev - 1 : 0));
  };

  return (
    <div className="flex min-h-screen text-white relative">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            AI Content Analyzer
          </h1>
          <p className="text-lg text-gray-400">
            Upload your content and get personalized content recommendations
            powered by AI.
          </p>
        </header>

        {isLoading ? (
          <p className="text-center mt-12 text-gray-400">
            Loading package details...
          </p>
        ) : !userPackage ? (
          <div className="mt-12 text-center text-red-400 text-xl">
            You don't have a package yet. Please purchase a plan to start
            uploading.
          </div>
        ) : (uploadsLeft ?? 0) <= 0 ? (
          <div className="mt-12 text-center text-yellow-400 text-xl">
            You've used all your uploads. Upgrade your plan to continue.
          </div>
        ) : (
          <section className="mt-12 mx-auto max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center text-pink-500">
              Upload Your Content
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Uploads remaining:{" "}
              <span className="text-pink-400">{uploadsLeft}</span>
            </p>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </section>
        )}

        {/* AI Insights */}
        {insights && (
          <section className="mt-12 mx-auto max-w-4xl bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">
              Your AI Insights
            </h2>
            <Insights insights={insights} />
          </section>
        )}
      </main>

      {/* 🆕 Email Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Enter your email
            </h2>
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-3 rounded-lg mb-4 text-black"
            />
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition"
            >
              Confirm Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
