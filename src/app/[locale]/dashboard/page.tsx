"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ActivePackageCard from "@/app/components/dashboard/ActivePackageCard";
import LastUploadCard from "@/app/components/dashboard/LastUploadCard";
import QuotaRingTile from "@/app/components/dashboard/QuotaRingTile";
import ManageCreditsTile from "@/app/components/dashboard/ManageCreditsTile";
import QuickActions from "@/app/components/dashboard/QuickActions";
import ProfileSwitcherModal from "@/app/components/dashboard/ProfileSwitcherModal";
import NewPackageModal from "@/app/components/dashboard/NewPackageModal";
import { useCart } from "@/app/components/cart/CartContext";
import { checkUserPackage, clearApiCaches, fetchActivePackageInstances, selectPackageInstance, verifyAddonSession, verifySession, type DashboardQuotaResponse, type PackageInstanceSummary } from "@/app/utils/api";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
import { useOverviewModel } from "@/app/dashboard/useOverviewModel";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { useRouter } from "@/i18n/navigation";
import NoPlanDashboard from "@/app/components/dashboard/NoPlanDashboard";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, AlertTriangle } from "lucide-react";
import { VIDEO_ADDONS_ENABLED } from "@/lib/featureFlags";

function OverviewSkeleton() {
  const t = useTranslations("dashboard.home");
  return (
    <div className="min-h-screen text-white">
      <header className="mx-auto w-full max-w-6xl px-4 pt-3 md:px-8 md:pt-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">{t("sectionOverview")}</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-sm hg-muted">{t("subheading")}</p>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-6xl animate-pulse px-4 pt-8 md:px-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {/* Zone 1 */}
            <div className="h-[200px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] md:col-span-2" />
            <div className="h-[200px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] md:col-span-2" />
            {/* Zone 2 */}
            <div className="h-[140px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <div className="h-[140px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <div className="h-[140px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]" />
            <div className="h-[140px] rounded-2xl bg-[var(--hg-surface-2)]" />
            {/* Zone 3 */}
            <div className="h-[80px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] md:col-span-4" />
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
  const planInfo = usePlanInfo();
  const handledCheckoutRef = useRef(false);
  const handledAddonCheckoutRef = useRef(false);
  const checkoutStatus = searchParams.get("status");
  const checkoutSessionId = searchParams.get("session_id");
  const checkoutKind = searchParams.get("kind");
  const {
    ready,
    coreLoading,
    coreError,
    planData,
    hasActiveInstance,
    isMissingActiveInstance,
    instances,
    instancesLoading,
    instancesError: modelInstancesError,
    refresh,
    loadInstances,
  } = useOverviewModel({
    enabled: !planInfo.loading,
    planLoading: planInfo.loading,
    planData: planInfo.data,
    hasActiveInstance: planInfo.hasActiveInstance,
    isMissingActiveInstance: planInfo.isMissingActiveInstance,
    isNewUser: planInfo.isNewUser,
  });

  const [instancesError, setInstancesError] = useState<string | null>(null);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activationTimeout, setActivationTimeout] = useState(false);
  const [newPackage, setNewPackage] = useState<PackageInstanceSummary | null>(null);

  const planKey = planData?.package || null;
  const packageInstanceId = planData?.packageInstanceId ?? null;
  const activeId = optimisticActiveId ?? packageInstanceId;
  const activeIndex = instances.findIndex((instance) => instance.id === activeId);
  const activeProfileLabel =
    activeIndex >= 0 ? `Profile ${String.fromCharCode(65 + activeIndex)}` : null;

  const quotas = resolveQuotaContract(planData as DashboardQuotaResponse | null, "dashboard.page");
  const uploadsLimit = quotas.uploads.effectiveLimit;
  const uploadsUsed = quotas.uploads.used;
  const uploadsRemaining = quotas.uploads.remaining;
  const uploadsUnlimited = quotas.uploads.isUnlimited;
  const chatLimit = quotas.aiTokens.effectiveLimit;
  const chatUsed = quotas.aiTokens.used;
  const chatRemaining = quotas.aiTokens.remaining;
  const chatUnlimited = quotas.aiTokens.isUnlimited;
  const videoLimit = quotas.videos.effectiveLimit;
  const videoUsed = quotas.videos.used;
  const videoRemaining = quotas.videos.remaining;
  const videoUnlimited = quotas.videos.isUnlimited;

  const t = useTranslations("dashboard.home");
  const tActivation = useTranslations("dashboard.home.checkoutActivation");
  const tBillingPage = useTranslations("dashboard.billingPage");
  const locale = useLocale();

  useEffect(() => {
    setInstancesError(modelInstancesError);
  }, [modelInstancesError]);

  useEffect(() => {
    if (checkoutStatus !== "promo_success") return;
    clearCart();
    clearApiCaches();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ai-auth-changed"));
    }
    router.replace("/dashboard");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus]);

  useEffect(() => {
    if (checkoutStatus !== "success") return;
    if (checkoutKind === "addon") return;
    if (handledCheckoutRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        clearCart();
        setActivating(true);

        // === Happy path: use verifySession response directly ===
        if (checkoutSessionId) {
          let verifyResult: Awaited<ReturnType<typeof verifySession>> | null = null;
          try {
            verifyResult = await verifySession(checkoutSessionId);
          } catch {
            verifyResult = null;
          }
          if (cancelled) return;

          if (verifyResult?.applied && verifyResult.activePackageInstanceId) {
            const newInstanceId = verifyResult.activePackageInstanceId;
            clearApiCaches();
            // Start refresh (sets inFlight synchronously), then dispatch so
            // PlanContext deduplicates onto the same in-flight promise.
            const refreshPromise = refresh(true, true);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("ai-auth-changed"));
            }
            await refreshPromise;
            if (cancelled) return;

            // Read the actual active instance from the freshly-populated cache.
            // checkUserPackage() without force reads pkgCache — no extra network call.
            let currentActiveId: string | null = null;
            try {
              const freshPlan = await checkUserPackage();
              currentActiveId = freshPlan?.packageInstanceId ?? null;
            } catch {
              currentActiveId = null;
            }
            if (cancelled) return;

            // If backend auto-activated the new instance (first-time buyer or
            // stale pointer), currentActiveId === newInstanceId.
            // If backend left the old package active (returning buyer),
            // currentActiveId !== newInstanceId.
            const isFirstTimeOrAutoActivated =
              !currentActiveId || currentActiveId === newInstanceId;

            if (isFirstTimeOrAutoActivated) {
              if (!cancelled) {
                handledCheckoutRef.current = true;
                router.replace("/dashboard");
              }
            } else {
              // Returning buyer: backend kept old package active.
              try {
                const allInstances = await fetchActivePackageInstances();
                if (cancelled) return;
                const newInst =
                  allInstances.find((i) => i.id === newInstanceId) ??
                  allInstances
                    .filter((i) => i.id !== currentActiveId)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )[0] ??
                  null;
                if (newInst && newInst.id !== currentActiveId) {
                  if (!cancelled) {
                    handledCheckoutRef.current = true;
                    setNewPackage(newInst);
                  }
                } else {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("ai-auth-changed"));
                  }
                  if (!cancelled) {
                    handledCheckoutRef.current = true;
                    router.replace("/dashboard");
                  }
                }
              } catch {
                if (!cancelled) {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("ai-auth-changed"));
                  }
                  handledCheckoutRef.current = true;
                  router.replace("/dashboard");
                }
              }
            }
            return;
          }
        }

        // === Fallback: verifySession didn't confirm. Poll briefly for webhook. ===
        if (cancelled) return;
        const knownIds = new Set<string>(
          (await fetchActivePackageInstances().catch(() => [])).map((i) => i.id)
        );
        if (cancelled) return;

        let fallbackNewInstance: PackageInstanceSummary | null = null;
        let success = false;

        for (let attempt = 0; attempt < 20 && !cancelled; attempt++) {
          if (attempt > 0) {
            await new Promise<void>((r) => setTimeout(r, 500));
          }
          if (cancelled) break;
          try {
            const polledInstances = await fetchActivePackageInstances();
            const found = polledInstances.find((i) => !knownIds.has(i.id));
            if (found) {
              success = true;
              fallbackNewInstance = found;
              break;
            }
          } catch {}
        }

        if (cancelled) return;

        if (success && fallbackNewInstance) {
          clearApiCaches();
          // Start refresh (sets inFlight synchronously), then dispatch so
          // PlanContext deduplicates onto the same in-flight promise.
          const fallbackRefreshPromise = refresh(true, true);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("ai-auth-changed"));
          }
          await fallbackRefreshPromise;
          if (cancelled) return;

          let currentActiveId: string | null = null;
          try {
            const freshPlan = await checkUserPackage();
            currentActiveId = freshPlan?.packageInstanceId ?? null;
          } catch {
            currentActiveId = null;
          }
          if (cancelled) return;

          if (!currentActiveId || currentActiveId === fallbackNewInstance.id) {
            if (!cancelled) {
              handledCheckoutRef.current = true;
              router.replace("/dashboard");
            }
          } else {
            if (!cancelled) {
              handledCheckoutRef.current = true;
              setNewPackage(fallbackNewInstance);
            }
          }
        } else {
          if (!cancelled) {
            handledCheckoutRef.current = true;
            setActivationTimeout(true);
          }
        }
      } catch (err) {
        console.error("[checkout] handler error", err);
        if (!cancelled) handledCheckoutRef.current = true;
      } finally {
        // Always clears the spinner — even when cancelled causes an early return.
        setActivating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus, checkoutKind]);

  useEffect(() => {
    if (checkoutKind !== "addon") return;
    if (!checkoutStatus) return;
    if (handledAddonCheckoutRef.current) return;
    handledAddonCheckoutRef.current = true;

    if (checkoutStatus === "cancel") {
      toast.info(tBillingPage("toasts.checkoutCancelled"));
      router.replace("/dashboard", { scroll: false });
      return;
    }

    if (checkoutStatus !== "success" || !checkoutSessionId) return;

    let cancelled = false;
    let verifyingToastId: string | number | undefined;

    (async () => {
      verifyingToastId = toast.custom(
        () => (
          <div className="flex w-[320px] items-center gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3 shadow-xl">
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            <p className="text-sm text-[var(--hg-text)]">{tBillingPage("toasts.verifyingPurchase")}</p>
          </div>
        ),
        { duration: Infinity }
      );

      const backoff = [2000, 3000, 5000, 5000, 5000];
      let applied = false;
      let verifyResult: Awaited<ReturnType<typeof verifyAddonSession>> | null = null;

      for (const delay of backoff) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        if (cancelled) break;
        try {
          const res = await verifyAddonSession(checkoutSessionId);
          if (res?.applied) {
            applied = true;
            verifyResult = res;
            break;
          }
        } catch {
          // Keep polling; webhook delivery can lag behind the redirect.
        }
      }

      toast.dismiss(verifyingToastId);
      if (cancelled) return;

      if (applied) {
        clearApiCaches();
        await planInfo.refresh(true);
        await refresh(true, true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("dashboard:addon-purchase-applied"));
          window.dispatchEvent(new Event("ai-auth-changed"));
        }
        const delta = verifyResult?.delta;
        let successMsg = tBillingPage("toasts.addonSuccess.generic");
        if (delta?.addonType && delta?.addonQty) {
          const qty =
            delta.addonType === "chat"
              ? `${delta.addonQty / 1_000_000}M`
              : String(delta.addonQty);
          if (delta.addonType === "videos") {
            successMsg = tBillingPage("toasts.addonSuccess.videos", { qty });
          } else if (delta.addonType === "uploads") {
            successMsg = tBillingPage("toasts.addonSuccess.uploads", { qty });
          } else if (delta.addonType === "chat") {
            successMsg = tBillingPage("toasts.addonSuccess.chat", { qty });
          }
        }
        toast.success(successMsg);
        router.replace("/dashboard", { scroll: false });
        return;
      }

      toast(tBillingPage("toasts.creditsPending"), {
        description: tBillingPage("toasts.creditsPendingDesc"),
        duration: 10000,
      });
      router.replace("/dashboard", { scroll: false });
    })();

    return () => {
      cancelled = true;
      if (verifyingToastId !== undefined) toast.dismiss(verifyingToastId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutKind, checkoutStatus, checkoutSessionId]);

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
      clearApiCaches();
      // Start a silent refresh (no coreLoading/ready flip) so the skeleton
      // gate stays closed and NewPackageModal remains mounted while the
      // network call is in flight. pkgCache.inFlight is set synchronously
      // before the first await, so the dispatch below fires while inFlight
      // is live — PlanContext deduplicates onto the same call.
      const refreshPromise = refresh(true, true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ai-auth-changed"));
      }
      await refreshPromise;
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

  const handleSwitchToNewPackage = async () => {
    if (!newPackage) return;
    const ok = await handleSelectInstance(newPackage.id);
    if (ok) setNewPackage(null);
  };

  const showSkeleton = coreLoading && !ready && planData === null;
  const showGetStarted =
    ready && !coreError && (isMissingActiveInstance || !hasActiveInstance);

  const activatingOverlay = activating ? (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-[var(--hg-accent)]" strokeWidth={1.5} />
      <p className="text-base font-semibold text-white">{tActivation("activating")}</p>
      <p className="mt-1 text-sm text-[var(--hg-muted)]">{tActivation("activatingSubtitle")}</p>
    </div>
  ) : null;

  if (showSkeleton) {
    return (
      <>
        <OverviewSkeleton />
        {activatingOverlay}
      </>
    );
  }

  if (showGetStarted) {
    return (
      <>
        <NoPlanDashboard />
        {activatingOverlay}
      </>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <header className="mx-auto w-full max-w-6xl px-4 pt-3 md:px-8 md:pt-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.14em] hg-muted-2">{t("sectionOverview")}</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-sm hg-muted">
            {t("subheading")}
          </p>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
          {coreError ? (
            <section className="mb-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-200">
              <p>{t("loadError")}</p>
              <p className="mt-1 opacity-90">{coreError}</p>
              <button
                type="button"
                onClick={() => void refresh(true)}
                className="mt-3 inline-flex h-9 items-center rounded-lg border border-rose-300/40 px-3 text-xs font-semibold text-rose-100 hover:border-rose-200/60"
              >
                {t("retry")}
              </button>
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {/* Zone 1: Package + Quick Actions */}
            <ActivePackageCard
              className="md:col-span-2"
              planKey={planKey || undefined}
              packageInstanceId={packageInstanceId}
              status={planData?.hasAccess ? "active" : "inactive"}
              createdAt={planData?.packageInstanceCreatedAt}
              onOpenSwitcher={handleOpenSwitcher}
              profileLabel={activeProfileLabel}
              instanceCount={planData?.instancesCount}
            />
            <QuickActions
              className="md:col-span-2"
              uploadsRemaining={uploadsRemaining}
              chatRemaining={chatRemaining}
              videoRemaining={videoRemaining}
            />

            {/* Zone 2: Quota ring tiles + manage credits */}
            <QuotaRingTile
              label={t("quota.uploads")}
              used={uploadsUsed}
              effectiveLimit={uploadsLimit}
              isUnlimited={uploadsUnlimited}
              topUpHref={`/${locale}/dashboard?settings=1&tab=billing&addon=uploads`}
              topUpLabel={t("quota.topUp")}
            />
            <QuotaRingTile
              label={t("quota.aiTokens")}
              used={chatUsed}
              effectiveLimit={chatLimit}
              isUnlimited={chatUnlimited}
              topUpHref={`/${locale}/dashboard?settings=1&tab=billing&addon=chat`}
              topUpLabel={t("quota.topUp")}
            />
            <QuotaRingTile
              label={t("quota.videos")}
              used={videoUsed}
              effectiveLimit={videoLimit}
              isUnlimited={videoUnlimited}
              topUpHref={`/${locale}/dashboard?settings=1&tab=billing&addon=videos`}
              topUpLabel={t("quota.topUp")}
              topUpDisabled={!VIDEO_ADDONS_ENABLED}
              comingSoonLabel={t("quota.comingSoon")}
            />
            <ManageCreditsTile locale={locale} />

            {/* Zone 3: Last upload */}
            <LastUploadCard className="md:col-span-4" packageInstanceId={packageInstanceId} />
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

      <NewPackageModal
        open={newPackage !== null}
        newInstance={newPackage}
        onSwitch={() => void handleSwitchToNewPackage()}
        onDismiss={() => setNewPackage(null)}
      />

      {activatingOverlay}

      {activationTimeout && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm px-4 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-amber-400" strokeWidth={1.5} />
          <p className="text-base font-semibold text-white">{tActivation("timeoutTitle")}</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--hg-muted)]">{tActivation("timeoutBody")}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex rounded-xl bg-[var(--hg-accent)] px-5 py-2.5 text-sm font-medium text-[var(--hg-accent-fg)] hover:opacity-90"
          >
            {tActivation("timeoutRefresh")}
          </button>
        </div>
      )}
    </div>
  );
}
