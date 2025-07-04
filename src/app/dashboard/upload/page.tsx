"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/uploads/FileUpload";
import Insights from "@/app/components/analytics/Insights";
import { checkUserPackage } from "@/app/utils/api";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import type { InsightsProps } from "@/app/components/analytics/Insights";

const UploadPage = () => {
  const [insights, setInsights] = useState<InsightsProps["insights"] | null>(
    null
  );
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail") || ""
          : "";
      // No need for modal—layout guarantees userEmail exists!
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

  // Optional: Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleUploadSuccess = (insightsData: InsightsProps["insights"]) => {
    setInsights(insightsData);
    setUploadsLeft((prev) => (prev !== null ? prev - 1 : 0));
  };

  return (
    <main>
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            AI Content Analyzer
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

      {isLoading ? (
        <p className="text-center mt-12 text-gray-400">
          Loading package details...
        </p>
      ) : !userPackage ? (
        <div className="mt-12 text-center text-red-400 text-xl">
          You don&apos;t have a package yet. Please purchase a plan to start
          uploading.
        </div>
      ) : (uploadsLeft ?? 0) <= 0 ? (
        <div className="mt-12 text-center text-yellow-400 text-xl">
          You&apos;ve used all your uploads. Upgrade your plan to continue.
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
    </main>
  );
};

export default UploadPage;
