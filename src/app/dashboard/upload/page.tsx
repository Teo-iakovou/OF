"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/uploads/FileUpload";
import Insights from "@/app/components/analytics/Insights";
import { checkUserPackage, getClientEmail } from "@/app/utils/api";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import Link from "next/link";
import type { ResultDoc } from "@/app/types/analysis";

export default function UploadPage() {
  // fresh result shown inline AFTER upload only (not persisted anywhere)
  const [result, setResult] = useState<ResultDoc | null>(null);

  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const fetchUserInfo = async () => {
      const userEmail = getClientEmail();
      try {
        setIsLoading(true);
        timeout = setTimeout(() => setShowSpinner(true), 2500);
        const res = await checkUserPackage(userEmail);
        setUserPackage(res?.package ?? null);
        setUploadsLeft(res?.uploadsRemaining ?? null);
      } catch (err) {
        console.error("Failed to fetch package info:", err);
      } finally {
        clearTimeout(timeout);
        setIsLoading(false);
        setShowSpinner(false);
      }
    };
    fetchUserInfo();
  }, [searchParams, router]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

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
    // Fill dashboard layout; header fixed, content scrolls
    <div className="h-full flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            AI Content Analyzer
          </h1>
        </div>

        {/* Mobile Project Nav under the title */}
        <div className="mt-3 md:hidden" ref={menuRef}>
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <div className="relative z-40">
              <ProjectNavDropdownMenu overlayMode onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-8">
          {/* Eligibility & Upload section */}
          {isLoading ? (
            showSpinner ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : null
          ) : !userPackage ? (
            <div className="mt-10 text-center text-red-400 text-xl">
              You don&apos;t have a package yet. Please purchase a plan to start uploading.
            </div>
          ) : (uploadsLeft ?? 0) <= 0 ? (
            <div className="mt-10 text-center text-yellow-400 text-xl">
              You&apos;ve used all your uploads. Upgrade your plan to continue.
            </div>
          ) : (
            <section className="mt-8 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                Upload Your Content
              </h2>
              <p className="text-center text-gray-400 mb-6">
                Uploads remaining: <span className="text-pink-400">{uploadsLeft}</span>
              </p>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </section>
          )}

          {/* Fresh insights appear immediately after upload ONLY (not restored on reload) */}
          {result && (
            <section className="mt-8 mx-auto w-full max-w-4xl bg-gray-800 rounded-lg p-6 sm:p-8 shadow-xl">
              <Insights result={result} />
              <div className="text-center mt-4">
                <Link
                  href="/dashboard/history"
                  className="inline-block text-sm text-blue-400 underline hover:text-blue-300"
                >
                  View this in Upload History →
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}