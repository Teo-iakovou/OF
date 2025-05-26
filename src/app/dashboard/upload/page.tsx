"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/uploads/FileUpload";
import Insights from "@/app/components/analytics/Insights";
import { checkUserPackage } from "@/app/utils/api";
import EmailModal from "@/app/components/email/EmailModal";
import ProjectNavDropdown from "@/app/components/dashboard/ProjectNavDropdown";

const UploadPage = () => {
  const [insights, setInsights] = useState<any>(null);
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      const status = searchParams.get("status");

      if (!userEmail && status === "success") {
        setShowModal(true);
        return;
      }

      if (!userEmail || userEmail !== "testuser@gmail.com") {
        localStorage.removeItem("userEmail");
        setShowModal(true);
        return;
      }

      try {
        setIsLoading(true);
        const res = await checkUserPackage(userEmail);
        setUserPackage(res?.package ?? null);
        setUploadsLeft(res?.uploadsRemaining ?? null);
      } catch (err) {
        console.error("Failed to fetch package info:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [searchParams, router]);

  const handleEmailSubmit = async (emailFromModal: string) => {
    if (!emailFromModal || emailFromModal !== "testuser@gmail.com") {
      alert("Access restricted: Only testuser@gmail.com is allowed.");
      return;
    }

    localStorage.setItem("userEmail", emailFromModal);
    setShowModal(false);
    router.replace(window.location.origin + window.location.pathname);

    try {
      setIsLoading(true);
      const res = await checkUserPackage(emailFromModal);
      setUserPackage(res?.package ?? null);
      setUploadsLeft(res?.uploadsRemaining ?? null);
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
    <main>
      <header className="pt-14 px-4 sm:px-6 md:px-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          AI Content Analyzer
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Upload your content and get personalized content recommendations
          powered by AI.
        </p>
      </header>
      <ProjectNavDropdown />

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
        <section className="mt-12 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
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

      {insights && (
        <section className="mt-12 mx-auto w-full max-w-4xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">
            Your AI Insights
          </h2>
          <Insights insights={insights} />
        </section>
      )}

      {showModal && (
        <EmailModal
          isOpen={showModal}
          onSubmit={handleEmailSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
};

export default UploadPage;
