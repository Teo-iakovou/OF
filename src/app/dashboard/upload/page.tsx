"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/uploads/FileUpload";
import Insights from "@/app/components/analytics/Insights";
import { checkUserPackage } from "@/app/utils/api";

import Spinner from "@/app/components/dashboard/loading spinner/page";
import Reveal from "@/app/components/common/Reveal";
import Link from "next/link";
import type { ResultDoc } from "@/app/types/analysis";
import { Skeleton } from "@/app/components/ui/Skeleton";

export default function UploadPage() {
  // fresh result shown inline AFTER upload only (not persisted anywhere)
  const [result, setResult] = useState<ResultDoc | null>(null);

  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const res = await checkUserPackage();
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

  

  const handleUploadSuccess = (doc: ResultDoc, info?: { duplicate?: boolean }) => {
    setResult(doc); // show inline, one-time

    // update local usage UI
    setUploadsLeft((prev) => {
      if (prev === null) return prev;
      return info?.duplicate ? prev : Math.max(prev - 1, 0);
    });

    // 🔔 broadcast “new analysis” (cross-tab + same-tab)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("analysis:changed", String(Date.now())); // triggers 'storage' in other tabs
        window.dispatchEvent(new Event("analysis:changed"));          // same-tab listeners
      }
    } catch {}
  };

  return (
    // Natural page scroll; sidebar is fixed in layout
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            AI Content Analyzer
          </h1>
        </div>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Scrollable content area */}
      <main>
        <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-8">
          {/* Eligibility & Upload section */}
          {isLoading ? (
            <Reveal as="section" className="mt-8 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
              <Skeleton className="h-7 w-64 mb-4 mx-auto" />
              <Skeleton className="h-4 w-40 mb-6 mx-auto" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </div>
            </Reveal>
          ) : !userPackage ? (
            <div className="mt-10 text-center text-red-400 text-xl">
              You don&apos;t have a package yet. Please purchase a plan to start uploading.
            </div>
          ) : (uploadsLeft ?? 0) <= 0 ? (
            <div className="mt-10 text-center text-yellow-400 text-xl">
              You&apos;ve used all your uploads. Upgrade your plan to continue.
            </div>
          ) : (
            <Reveal as="section" className="mt-8 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                Upload Your Content
              </h2>
              <p className="text-center text-gray-400 mb-6">
                Uploads remaining: <span className="text-pink-400">{uploadsLeft}</span>
              </p>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </Reveal>
          )}

          {/* Fresh insights appear immediately after upload ONLY (not restored on reload) */}
          {result && (
            <Reveal as="section" className="mt-8 mx-auto w-full max-w-4xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-xl">
              <Insights result={result} />
              <div className="text-center mt-4">
                <Link
                  href="/dashboard/history"
                  className="inline-block text-sm text-blue-400 underline hover:text-blue-300"
                >
                  View this in Upload History →
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </main>
    </div>
  );
}
