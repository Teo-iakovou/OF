"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import SelectActiveInstance from "@/app/components/dashboard/SelectActiveInstance";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import {
  createAddonCheckoutSession,
  fetchActivePackageInstances,
  selectPackageInstance,
  startCheckout,
  type AddonType,
  type PackageInstanceSummary,
} from "@/app/utils/api";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
import { formatRemaining } from "@/app/utils/quotaDisplay";

const formatTokenCount = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
};

const formatRemainingTokens = (
  remaining: number | null,
  limit: number | null,
  isUnlimited = false,
  unlimitedLabel = "Unlimited",
) => {
  if (isUnlimited) return unlimitedLabel;
  if (limit === null) return "—";
  return formatTokenCount(remaining);
};

const formatStatus = (status?: string | null, activeLabel = "Active") => {
  if (!status) return activeLabel;
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  lite: "Lite",
  pro: "Pro",
  ultimate: "Ultimate",
};

const formatPlanLabel = (value: string | null) => {
  if (!value) return "—";
  return PLAN_DISPLAY_NAMES[value] ?? (value.charAt(0).toUpperCase() + value.slice(1));
};

const PURCHASABLE_PLANS = [
  { id: "lite", displayName: "Lite", price: "$99", description: "Getting started and testing AI analysis" },
  { id: "pro", displayName: "Pro", price: "$189", description: "Consistent creators posting weekly" },
  { id: "ultimate", displayName: "Ultimate", price: "$399", description: "Power users and agency teams" },
] as const;

const ADDON_PACKS: Array<{
  labelKey: string;
  type: AddonType;
  pack: string;
  badgeKey?: string;
}> = [
  { labelKey: "addonLabel5Uploads", type: "uploads", pack: "pack_5" },
  { labelKey: "addonLabel20Uploads", type: "uploads", pack: "pack_20", badgeKey: "addonBadgeBestValue" },
  { labelKey: "addonLabel100kChat", type: "chat", pack: "pack_100k" },
  { labelKey: "addonLabel5Videos", type: "sadtalkerVideos", pack: "pack_5" },
  { labelKey: "addonLabel15Videos", type: "sadtalkerVideos", pack: "pack_15" },
  { labelKey: "addonLabel30Videos", type: "sadtalkerVideos", pack: "pack_30", badgeKey: "addonBadgeBestValue" },
];

type BillingPanelProps = {
  embedded?: boolean;
  refreshToken?: number;
};

export default function BillingPanel({ embedded = false, refreshToken = 0 }: BillingPanelProps) {
  const t = useTranslations("dashboard.billing");
  const locale = useLocale();
  const { data: planData, loading: planLoading, refresh: refreshPlan, hasActiveInstance } =
    usePlanInfo();
  const [instances, setInstances] = useState<PackageInstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const planInstanceId = planData?.packageInstanceId ?? null;
  const needsSelection = Boolean(planData?.needsInstanceSelection);

  const profileLabelById = useMemo(() => {
    const grouped = new Map<string, PackageInstanceSummary[]>();
    instances.forEach((instance) => {
      const key = instance.planKey || "unknown";
      const list = grouped.get(key) || [];
      list.push(instance);
      grouped.set(key, list);
    });

    const labelMap = new Map<string, string | null>();
    grouped.forEach((list) => {
      const showProfiles = list.length > 1;
      list.forEach((instance, index) => {
        labelMap.set(
          instance.id,
          showProfiles ? `Profile ${String.fromCharCode(65 + index)}` : null,
        );
      });
    });
    return labelMap;
  }, [instances]);

  const refreshAll = useCallback(async () => {
    setErrorMessage(null);
    setErrorRequestId(null);
    try {
      const list = await fetchActivePackageInstances();
      setInstances(list);
    } catch {
      setErrorMessage(t("unauthorized"));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      await refreshAll();
      if (!cancelled) setLoading(false);
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [refreshAll, refreshToken]);

  const handleSelectInstance = async (instanceId: string) => {
    setActionKey(`select:${instanceId}`);
    setErrorMessage(null);
    setErrorRequestId(null);
    try {
      await selectPackageInstance(instanceId);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ai-auth-changed"));
      }
      await Promise.all([refreshPlan(true), refreshAll()]);
    } catch {
      setErrorMessage(t("failedSelectInstance"));
    } finally {
      setActionKey(null);
    }
  };

  const handleAddonPurchase = async (
    instanceId: string,
    addonType: AddonType,
    addonPack: string,
  ) => {
    setActionKey(`${instanceId}:${addonType}:${addonPack}`);
    setErrorMessage(null);
    setErrorRequestId(null);
    try {
      const res = await createAddonCheckoutSession({
        addonType,
        addonPack,
        packageInstanceId: instanceId,
        locale,
      });
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      setErrorMessage(t("missingCheckoutUrl"));
    } catch (err: unknown) {
      const payload = (err as { payload?: { error?: string; requestId?: string } })?.payload;
      const error = typeof payload?.error === "string" ? payload.error : null;
      const requestId = typeof payload?.requestId === "string" ? payload.requestId : null;
      setErrorRequestId(requestId);
      if (error === "ADDON_PRICE_NOT_CONFIGURED") {
        setErrorMessage(t("addonUnavailable"));
      } else {
        setErrorMessage(t("addonCheckoutFailed"));
      }
    } finally {
      setActionKey(null);
    }
  };

  const formatLimit = (limit: number | null | undefined, remaining: number | null | undefined) => {
    if (limit === null || typeof remaining === "undefined") return "—";
    return formatRemaining(remaining);
  };

  const selectedInstance = useMemo(
    () => instances.find((instance) => instance.id === planInstanceId),
    [instances, planInstanceId],
  );

  if (!planLoading && !hasActiveInstance && !embedded) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">{t("noActivePlanHeading")}</h2>
        <p className="mt-2 text-sm text-gray-400">
          {t("noActivePlanDesc")}{" "}
          <a href="/account/plans" className="text-[#50C0F0] underline hover:opacity-80">
            {t("viewPlans")}
          </a>
        </p>
      </section>
    );
  }

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      {errorMessage ? (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-900/20 p-4">
          <p className="text-sm text-rose-100">{errorMessage}</p>
          {errorRequestId ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-rose-200">
              <span>{t("supportId", { id: errorRequestId })}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(errorRequestId)}
                className="rounded-md border border-rose-200/60 px-2 py-1 text-[11px] uppercase tracking-wide hover:border-rose-100"
              >
                {t("copy")}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {!planLoading && needsSelection ? (
        <SelectActiveInstance onSelected={() => refreshPlan(true)} />
      ) : null}

      {loading ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : instances.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-200">{t("noActivePackages")}</p>
        </section>
      ) : (
        <div className="space-y-4">
          {instances.map((instance) => {
            const quotas = resolveQuotaContract(instance, "billing.panel.instance");
            const isSelected = instance.id === planInstanceId;
            const uploadRemaining = formatLimit(quotas.uploads.effectiveLimit, quotas.uploads.remaining);
            const chatRemainingRaw = quotas.aiTokens.remaining;
            const isChatUnlimited = quotas.aiTokens.isUnlimited;
            const isUploadUnlimited = quotas.uploads.isUnlimited;
            const isVideoUnlimited = quotas.videos.isUnlimited;
            const videoRemaining = formatLimit(quotas.videos.effectiveLimit, quotas.videos.remaining);
            const disabled = instance.status !== "active";
            const profileLabel = profileLabelById.get(instance.id) || null;
            const planLabel = formatPlanLabel(instance.planKey || null);
            const headerLabel = profileLabel ? `${planLabel} — ${profileLabel}` : planLabel;

            return (
              <section
                key={instance.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{headerLabel}</div>
                    <h2 className="text-lg font-semibold text-white">{formatStatus(instance.status)}</h2>
                    <p className="text-xs text-gray-400">
                      {t("createdAt", { date: new Date(instance.createdAt).toLocaleDateString(locale) })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">{isSelected ? t("selected") : t("notSelected")}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectInstance(instance.id)}
                      disabled={isSelected || actionKey === `select:${instance.id}`}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:border-white/40 disabled:opacity-50"
                    >
                      {isSelected ? t("selected") : t("select")}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-200 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>{t("uploads")}: {isUploadUnlimited ? t("unlimited") : uploadRemaining}</div>
                  <div>
                    <div>
                      {t("aiTokens")}:{" "}
                      {formatRemainingTokens(
                        typeof chatRemainingRaw === "number" ? chatRemainingRaw : null,
                        quotas.aiTokens.effectiveLimit,
                        isChatUnlimited,
                        t("unlimited"),
                      )}{" "}
                      {t("tokensUnit")}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {t("tokensMonthlyDesc")}
                    </div>
                    {isChatUnlimited ? (
                      <div className="mt-1 text-xs text-gray-400">
                        {t("tokensUnlimitedDesc")}
                      </div>
                    ) : null}
                  </div>
                  <div>{t("videos")}: {isVideoUnlimited ? t("unlimited") : videoRemaining}</div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{t("buyAddons")}</p>
                  <div className="flex flex-wrap gap-2">
                    {ADDON_PACKS.map((pack) => {
                      const key = `${instance.id}:${pack.type}:${pack.pack}`;
                      const busy = actionKey === key;
                      const isIncluded =
                        (pack.type === "chat" && isChatUnlimited) ||
                        (pack.type === "uploads" && isUploadUnlimited);
                      const label = isIncluded ? t("included") : t(pack.labelKey as Parameters<typeof t>[0]);
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={disabled || busy || isIncluded}
                          onClick={() => handleAddonPurchase(instance.id, pack.type, pack.pack)}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:border-white/40 disabled:opacity-50"
                        >
                          {busy ? t("redirecting") : label}
                          {pack.badgeKey ? (
                            <span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                              {t(pack.badgeKey as Parameters<typeof t>[0])}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  {disabled ? (
                    <p className="mt-2 text-xs text-gray-400">
                      {t("addonsDisabled")}
                    </p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {selectedInstance ? (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">{t("selectedPackageLabel")}</p>
          <h3 className="text-lg font-semibold text-white">
            {(() => {
              const profileLabel = profileLabelById.get(selectedInstance.id) || null;
              const planLabel = formatPlanLabel(selectedInstance.planKey || null);
              return profileLabel ? `${planLabel} — ${profileLabel}` : planLabel;
            })()}
          </h3>
          <p className="text-sm text-gray-300">{t("activeInstance", { id: selectedInstance.id })}</p>
        </section>
      ) : null}
    </div>
  );
}
