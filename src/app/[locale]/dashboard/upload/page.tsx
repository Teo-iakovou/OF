"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/app/components/uploads/FileUpload";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import SelectActiveInstance from "@/app/components/dashboard/SelectActiveInstance";
import { formatRemaining } from "@/app/utils/quotaDisplay";
import { PACKAGES_URL } from "@/app/utils/urls";

import Reveal from "@/app/components/common/Reveal";
import Link from "next/link";
import type { ResultDoc } from "@/app/types/analysis";
import { Skeleton } from "@/app/components/ui/Skeleton";
import UploadStage from "@/app/components/upload/UploadStage";
import RecentCreations from "@/app/components/dashboard/upload/RecentCreations";
import ReportDrawer from "@/app/components/dashboard/report/ReportDrawer";
import { useReportDrawer } from "@/app/components/dashboard/upload/useReportDrawer";

export default function UploadPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const {
    openDrawer,
    closeDrawer,
    isOpen: reportOpen,
    activeId: reportResultId,
    setIsOpen: setReportOpen,
    openDrawerFromQuery,
  } = useReportDrawer();

  const [uploadsLeft, setUploadsLeft] = useState<number | null>(null);
  const { data: planData, loading: planLoading, refresh: refreshPlan } = usePlanInfo();
  const activePackageInstanceId = planData?.packageInstanceId ?? null;
  const hasAccess = planData?.hasAccess ?? false;
  const needsSelection = Boolean(planData?.needsInstanceSelection);

  

  useEffect(() => {
    setUploadsLeft(typeof planData?.uploadsRemaining === "number" ? planData.uploadsRemaining : null);
  }, [planData]);

  useEffect(() => {
    openDrawerFromQuery();
  }, [openDrawerFromQuery]);

  

  const handleUploadSuccess = (doc: ResultDoc, info?: { duplicate?: boolean; requestId?: string }) => {
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
    if (doc?._id) {
      openDrawer(doc._id);
    }
    setRefreshToken((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white">
      <main>
        <div className="relative w-full px-4 pb-24 pt-2 md:pt-12">
          <div className="mx-auto w-full max-w-[960px] space-y-8 md:space-y-10">
            <section className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Create your next strategy
              </h1>
              <p className="mt-2 text-sm hg-muted md:text-base">
                Upload one image and get platform-ready content ideas in seconds.
              </p>
            </section>
            {planLoading ? (
              <Reveal
                as="section"
                id="upload-card"
                className="mx-auto w-full max-w-xl rounded-2xl hg-surface p-5"
              >
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-64 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
              </Reveal>
            ) : needsSelection ? (
              <SelectActiveInstance onSelected={() => refreshPlan(true)} />
            ) : !hasAccess ? (
              <Reveal
                as="section"
                id="upload-card"
                className="mx-auto w-full max-w-xl rounded-2xl hg-surface p-5"
              >
                <h2 className="text-xl font-semibold text-white">Upload content</h2>
                <div className="mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted">
                  You don&apos;t have a package yet. Please purchase a plan to start uploading.
                </div>
                <Link
                  href={PACKAGES_URL}
                  className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90"
                >
                  View plans →
                </Link>
              </Reveal>
            ) : (uploadsLeft ?? 0) <= 0 ? (
              <Reveal
                as="section"
                id="upload-card"
                className="mx-auto w-full max-w-xl rounded-2xl hg-surface p-5"
              >
                <h2 className="text-xl font-semibold text-white">Upload content</h2>
                <div className="mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted">
                  You&apos;ve used all your uploads. Upgrade your plan to continue.
                </div>
                <Link
                  href={PACKAGES_URL}
                  className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90"
                >
                  Manage billing →
                </Link>
              </Reveal>
            ) : (
              <div className="space-y-8">
                <div id="upload-panel" className="mx-auto w-full max-w-xl">
                  <div id="upload-stage">
                    <UploadStage
                      title="Create"
                      subtitle="Upload an image to generate recommendations."
                      statusLabel="Ready to upload"
                      showHeader={false}
                    >
                      <p className="text-sm hg-muted">
                        Uploads remaining:{" "}
                        <span className="font-semibold text-white">
                          {formatRemaining(uploadsLeft)}
                        </span>
                      </p>
                      <div className="mt-4">
                        <FileUpload
                          onUploadSuccess={handleUploadSuccess}
                          packageInstanceId={activePackageInstanceId}
                        />
                      </div>
                    </UploadStage>
                  </div>
                </div>
                <RecentCreations
                  packageInstanceId={activePackageInstanceId}
                  refreshToken={refreshToken}
                  onOpenCreation={openDrawer}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <ReportDrawer
        open={reportOpen}
        onOpenChange={(next) => {
          setReportOpen(next);
          if (!next) closeDrawer();
        }}
        resultId={reportResultId}
      />
    </div>
  );
}
