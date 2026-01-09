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
import PlanStatusPill from "@/app/components/dashboard/PlanStatusPill";

export default function UploadPage() {
  // fresh result shown inline AFTER upload only (not persisted anywhere)
  const [result, setResult] = useState<ResultDoc | null>(null);
  const [lastUploadInfo, setLastUploadInfo] = useState<{ duplicate?: boolean; requestId?: string | null } | null>(null);

  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [activePackageInstanceId, setActivePackageInstanceId] = useState<string | null>(null);
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
        setActivePackageInstanceId(res?.packageInstanceId ?? null);
      } catch (err) {
        console.error("Failed to fetch package info:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, [searchParams, router]);

  

  const handleUploadSuccess = (doc: ResultDoc, info?: { duplicate?: boolean; requestId?: string }) => {
    setResult(doc); // show inline, one-time
    setLastUploadInfo(info ?? null);

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
      <header className="shrink-0 pt-12 md:pt-20 px-4 sm:px-6 md:px-12 lg:px-20 w-full">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center md:text-left">
            AI Content Analyzer
          </h1>
          <PlanStatusPill />
        </div>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Scrollable content area */}
      <main>
        <div className="px-3 sm:px-4 md:px-12 lg:px-20 w-full pb-8 space-y-8 max-w-2xl mx-auto">
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
            <Reveal as="section" className="mx-auto w-full bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
                Upload Your Content
              </h2>
              <p className="text-center text-gray-400 mb-6">
                Uploads remaining: <span className="text-pink-400">{uploadsLeft}</span>
              </p>
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                packageInstanceId={activePackageInstanceId}
              />
            </Reveal>
          )}

          {/* Fresh insights appear immediately after upload ONLY (not restored on reload) */}
          {result && (
            <Reveal as="section" className="mx-auto w-full bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                  {lastUploadInfo?.duplicate ? "Existing insight resurfaced" : "Fresh analysis"}
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-2xl font-semibold text-white">Your latest strategy</h3>
                  <div className="flex flex-col items-start gap-1 text-sm text-gray-400 md:items-end">
                    <p>Generated {new Date(result.createdAt).toLocaleString()}</p>
                    {lastUploadInfo?.requestId ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(lastUploadInfo.requestId || "").catch(() => {})
                        }
                        className="text-xs text-gray-400 hover:text-white underline underline-offset-2 decoration-dotted"
                      >
                        Request ID: {lastUploadInfo.requestId}
                      </button>
                    ) : null}
                  </div>
                </div>
                {result.promotion?.recommendedPlatforms?.[0] && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
                    <p className="font-semibold text-white">
                      Spotlight: {result.promotion.recommendedPlatforms[0].platform}
                    </p>
                    <p className="text-gray-300">
                      Post around {result.promotion.recommendedPlatforms[0].bestTimesLocal?.[0] || "prime time"}
                      {" "}
                      for the strongest hook and use the suggested caption below.
                    </p>
                  </div>
                )}
                {!lastUploadInfo?.duplicate && (
                  <p className="text-sm text-gray-400">
                    These insights are stored automatically—you can revisit or edit them from Upload History anytime.
                  </p>
                )}
              </div>
              <Insights result={result} />
              <div className="text-center">
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
