"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import ActivePackageCard from "@/app/components/dashboard/ActivePackageCard";
import DashboardOnboarding from "@/app/components/dashboard/DashboardOnboarding";
import LastUploadCard from "@/app/components/dashboard/LastUploadCard";
import QuotaUsageCard from "@/app/components/dashboard/QuotaUsageCard";
import QuickActions from "@/app/components/dashboard/QuickActions";
import ProfileSwitcherModal from "@/app/components/dashboard/ProfileSwitcherModal";
import { useCart } from "@/app/components/cart/CartContext";
import { clearApiCaches, selectPackageInstance } from "@/app/utils/api";
import { getRemaining } from "@/app/utils/quota";
import { PACKAGES_URL } from "@/app/utils/urls";
import { useOverviewModel } from "@/app/dashboard/useOverviewModel";
import { useRouter } from "@/i18n/navigation";

function OverviewSkeleton() {
  return (
    <div className="min-h-screen text-white">
      <header className="mx-auto w-full max-w-6xl px-4 pt-3 md:px-8 md:pt-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">Overview</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm hg-muted">See what you can do now and jump into your next action fast.</p>
        </div>
      </header>
      <main className="pb-16">
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 md:space-y-8 md:px-8">
          <section className="h-28 animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="h-[280px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <section className="h-[280px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <section className="h-[220px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <section className="h-[220px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { user, loading } = useUser({ required: true, redirectTo: "/" });
  const didClearCartRef = useRef(false);
  const {
    ready,
    coreLoading,
    coreError,
    planData,
    isNewUser,
    hasActiveInstance,
    isMissingActiveInstance,
    instances,
    instancesLoading,
    instancesError: modelInstancesError,
    latestResult,
    latestLoading,
    refresh,
    loadInstances,
  } = useOverviewModel({ enabled: !loading && !!user });

  const [instancesError, setInstancesError] = useState<string | null>(null);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const planKey = planData?.package || null;
  const packageInstanceId = planData?.packageInstanceId ?? null;
  const activeId = optimisticActiveId ?? packageInstanceId;
  const activeIndex = instances.findIndex((instance) => instance.id === activeId);
  const activeProfileLabel =
    activeIndex >= 0 ? `Profile ${String.fromCharCode(65 + activeIndex)}` : null;

  const uploadsLimitRaw =
    typeof planData?.uploadLimit === "number" ? planData.uploadLimit : null;
  const uploadsUsedRaw = typeof planData?.uploadsUsed === "number" ? planData.uploadsUsed : 0;
  const addonsUploadsRaw =
    typeof planData?.addonsUploads === "number" ? planData.addonsUploads : 0;
  const uploadsLimit = uploadsLimitRaw === 0 ? null : uploadsLimitRaw;
  const uploadsUsed = Math.max(0, uploadsUsedRaw);
  const uploadsRemaining = getRemaining(uploadsLimitRaw, addonsUploadsRaw, uploadsUsed);

  const chatRemainingRaw =
    typeof planData?.chatRemaining === "number" ? Math.max(0, planData.chatRemaining || 0) : null;
  const chatLimitRaw =
    typeof planData?.chatMonthlyLimit === "number"
      ? Math.max(0, planData.chatMonthlyLimit || 0)
      : null;
  const chatUsedRaw =
    typeof planData?.chatUsedThisCycle === "number"
      ? Math.max(0, planData.chatUsedThisCycle || 0)
      : null;
  const chatLimit = chatLimitRaw === 0 ? null : chatLimitRaw;
  const chatUsed = typeof chatUsedRaw === "number" ? chatUsedRaw : null;
  const chatRemaining = chatRemainingRaw ?? getRemaining(chatLimitRaw, 0, chatUsed);

  const videoRemainingRaw =
    typeof planData?.sadtalkerVideosRemaining === "number"
      ? Math.max(0, planData.sadtalkerVideosRemaining || 0)
      : null;
  const videoLimitRaw =
    typeof planData?.sadtalkerVideoLimit === "number"
      ? Math.max(0, planData.sadtalkerVideoLimit || 0)
      : null;
  const videoUsedRaw =
    typeof planData?.sadtalkerVideosUsed === "number"
      ? Math.max(0, planData.sadtalkerVideosUsed || 0)
      : null;
  const videoLimit = videoLimitRaw === 0 ? null : videoLimitRaw;
  const videoUsed = typeof videoUsedRaw === "number" ? videoUsedRaw : null;
  const videoRemaining = videoRemainingRaw ?? getRemaining(videoLimitRaw, 0, videoUsed);

  useEffect(() => {
    setInstancesError(modelInstancesError);
  }, [modelInstancesError]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status !== "success" || didClearCartRef.current) return;
    didClearCartRef.current = true;
    clearCart();
    router.replace("/dashboard");
  }, [searchParams, clearCart, router]);

  useEffect(() => {
    if (!switcherOpen) return;
    void loadInstances();
  }, [switcherOpen, loadInstances]);

  const handleSelectInstance = async (instanceId: string) => {
    const previousId = optimisticActiveId ?? packageInstanceId;
    setOptimisticActiveId(instanceId);
    setSelectingId(instanceId);
    setInstancesError(null);
    try {
      await selectPackageInstance(instanceId);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ai-auth-changed"));
      }
      clearApiCaches();
      await refresh(true);
      setOptimisticActiveId(instanceId);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to select package";
      setInstancesError(message);
      setOptimisticActiveId(previousId ?? null);
      return false;
    } finally {
      setSelectingId(null);
    }
  };

  const handleSelectFromSwitcher = async (instanceId: string) => {
    const ok = await handleSelectInstance(instanceId);
    if (ok) setSwitcherOpen(false);
  };

  const handleOpenSwitcher = () => {
    setSwitcherOpen(true);
  };

  const showSkeleton = !loading && coreLoading && !ready;
  const showGetStarted =
    !loading && ready && !coreError && (isMissingActiveInstance || !hasActiveInstance);

  if (showSkeleton) {
    return <OverviewSkeleton />;
  }

  if (showGetStarted) {
    return (
      <div className="min-h-screen text-white">
        <header className="mx-auto w-full max-w-6xl px-4 pt-3 md:px-8 md:pt-16">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">Overview</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm hg-muted">
              See what you can do now and jump into your next action fast.
            </p>
          </div>
        </header>
        <main className="pb-16">
          <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
            <section className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 shadow-sm shadow-black/20">
              <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">Active package</p>
              <h2 className="text-xl font-semibold text-white">Select a package to continue</h2>
              <p className="mt-2 text-sm hg-muted">
                You need an active package instance to use Uploads, History, and AI Chat.
              </p>
              <a
                href={PACKAGES_URL}
                className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#07131d] hover:opacity-90"
              >
                Select package
              </a>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <header className="mx-auto w-full max-w-6xl px-4 pt-3 md:px-8 md:pt-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">Overview</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm hg-muted">
            See what you can do now and jump into your next action fast.
          </p>
        </div>
      </header>

      <main className="pb-16">
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 md:space-y-8 md:px-8">
          {coreError ? (
            <section className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-200">
              <p>Could not load dashboard overview.</p>
              <p className="mt-1 opacity-90">{coreError}</p>
              <button
                type="button"
                onClick={() => void refresh(true)}
                className="mt-3 inline-flex h-9 items-center rounded-lg border border-rose-300/40 px-3 text-xs font-semibold text-rose-100 hover:border-rose-200/60"
              >
                Retry
              </button>
            </section>
          ) : null}

          <section>
            <DashboardOnboarding
              isNewUser={isNewUser}
              packageInstanceId={packageInstanceId}
              planKey={planKey || undefined}
              uploadsRemaining={uploadsRemaining}
              chatRemaining={chatRemaining}
              videoRemaining={videoRemaining}
            />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section>
              <ActivePackageCard
                planKey={planKey || undefined}
                packageInstanceId={packageInstanceId}
                status={planData?.hasAccess ? "active" : "inactive"}
                createdAt={planData?.packageInstanceCreatedAt}
                onOpenSwitcher={handleOpenSwitcher}
                profileLabel={activeProfileLabel}
              />
            </section>

            <section>
              <QuotaUsageCard
                uploadsUsed={uploadsUsed}
                uploadLimit={uploadsLimit}
                chatUsed={chatUsed}
                chatLimit={chatLimit}
                videoUsed={videoUsed}
                videoLimit={videoLimit}
              />
            </section>

            <section>
              <QuickActions uploadsRemaining={uploadsRemaining} chatRemaining={chatRemaining} />
            </section>

            <section>
              <LastUploadCard result={latestResult} loading={latestLoading} />
            </section>
          </div>

          {instancesError ? (
            <p className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {instancesError}
            </p>
          ) : null}
        </div>
      </main>

      <ProfileSwitcherModal
        open={switcherOpen}
        instances={instances}
        loading={instancesLoading}
        activeInstanceId={activeId}
        selectingId={selectingId}
        onClose={() => setSwitcherOpen(false)}
        onSelect={handleSelectFromSwitcher}
      />
    </div>
  );
}
