"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import FileUpload from "@/app/components/uploads/FileUpload";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import SelectActiveInstance from "@/app/components/dashboard/SelectActiveInstance";
import { formatRemaining } from "@/app/utils/quotaDisplay";
import { PACKAGES_URL } from "@/app/utils/urls";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
import OutOfCreditsModal from "@/app/components/dashboard/OutOfCreditsModal";

import Reveal from "@/app/components/common/Reveal";
import Link from "next/link";
import type { ResultDoc } from "@/app/types/analysis";
import { Skeleton } from "@/app/components/ui/Skeleton";
import UploadStage from "@/app/components/upload/UploadStage";
import RecentCreations from "@/app/components/dashboard/upload/RecentCreations";
import ReportDrawer from "@/app/components/dashboard/report/ReportDrawer";
import { useReportDrawer } from "@/app/components/dashboard/upload/useReportDrawer";
import SpotlightTour from "@/app/components/onboarding/SpotlightTour";
import { useTour } from "@/app/components/onboarding/useTour";

const UPLOAD_TOUR_STEPS = [
  { target: "upload-heading",  titleKey: "step1.title", bodyKey: "step1.body", placement: "bottom" as const },
  { target: "upload-quota",    titleKey: "step2.title", bodyKey: "step2.body", placement: "bottom" as const },
  { target: "upload-dropzone", titleKey: "step3.title", bodyKey: "step3.body", placement: "top"    as const },
  { target: "upload-recent",   titleKey: "step4.title", bodyKey: "step4.body", placement: "top"    as const },
];

export default function UploadPage() {
  const t = useTranslations("dashboard.uploadPage");
  const { isDone: tourDone, markDone: markTourDone } = useTour("upload");
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
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const { data: planData, loading: planLoading, refresh: refreshPlan } = usePlanInfo();
  const activePackageInstanceId = planData?.packageInstanceId ?? null;
  const hasAccess = planData?.hasAccess ?? false;
  const needsSelection = Boolean(planData?.needsInstanceSelection);

  const uploadsRemaining = resolveQuotaContract(planData).uploads.remaining;

  useEffect(() => {
    setUploadsLeft(typeof planData?.uploadsRemaining === "number" ? planData.uploadsRemaining : null);
  }, [planData]);

  useEffect(() => {
    if (!planLoading && uploadsRemaining !== null && uploadsRemaining <= 0 && hasAccess) {
      setShowCreditsModal(true);
    }
  }, [planLoading, uploadsRemaining, hasAccess]);

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
        <div className="relative w-full px-4 pb-20 pt-1 md:pt-10">
          <div className="mx-auto w-full max-w-[980px] space-y-7 md:space-y-9">
            <section className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)] md:text-xs">{t("eyebrow")}</p>
              <h1 data-tour="upload-heading" className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {t("heading")}
              </h1>
              <p className="mt-2 text-sm text-[var(--hg-muted)] md:text-base">
                {t("subtitle")}
              </p>
            </section>
            {planLoading ? (
              <Reveal
                as="section"
                id="upload-card"
                className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5"
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
                className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5"
              >
                <h2 className="text-xl font-semibold text-white">{t("noAccessHeading")}</h2>
                <div className="mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted">
                  {t("noAccessBody")}
                </div>
                <Link
                  href={PACKAGES_URL}
                  className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90"
                >
                  {t("noAccessCta")}
                </Link>
              </Reveal>
            ) : (uploadsLeft ?? 0) <= 0 ? (
              <Reveal
                as="section"
                id="upload-card"
                className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5"
              >
                <h2 className="text-xl font-semibold text-white">{t("noUploadsHeading")}</h2>
                <div className="mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted">
                  {t("noUploadsBody")}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreditsModal(true)}
                    className="inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90"
                  >
                    {t("buyCreditsButton")}
                  </button>
                  <Link
                    href={PACKAGES_URL}
                    className="inline-flex rounded-xl border border-[var(--hg-border)] px-4 py-3 text-sm font-medium text-white hover:border-[#50C0F0] hover:text-[#50C0F0]"
                  >
                    {t("manageBillingLink")}
                  </Link>
                </div>
              </Reveal>
            ) : (
              <div className="space-y-7 md:space-y-8">
                <div id="upload-panel" className="mx-auto w-full max-w-xl">
                  <div id="upload-stage">
                    <UploadStage
                      title={t("uploadStageTitle")}
                      subtitle={t("uploadStageSubtitle")}
                      statusLabel={t("uploadStageStatusLabel")}
                      showHeader={false}
                    >
                      <div data-tour="upload-quota" className="flex items-center justify-between rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/55 px-3.5 py-2.5">
                        <span className="text-xs uppercase tracking-[0.1em] text-[var(--hg-muted-2)]">
                          Upload quota
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {formatRemaining(uploadsLeft)}
                        </span>
                      </div>
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
      <OutOfCreditsModal
        type="uploads"
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
      {tourDone === false && (
        <SpotlightTour
          tourId="upload"
          i18nNamespace="dashboard.uploadPage.tour"
          steps={UPLOAD_TOUR_STEPS}
          onComplete={markTourDone}
        />
      )}
    </div>
  );
}
