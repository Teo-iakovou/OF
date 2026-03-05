"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import SelectActiveInstance from "@/app/components/dashboard/SelectActiveInstance";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import {
  createAddonCheckoutSession,
  fetchActivePackageInstances,
  selectPackageInstance,
  type AddonType,
  type PackageInstanceSummary,
} from "@/app/utils/api";
import { getRemaining } from "@/app/utils/quota";
import { formatRemaining } from "@/app/utils/quotaDisplay";

const formatTokenCount = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return String(value);
};

const formatRemainingTokens = (remaining: number | null, limit: number | null) => {
  if (limit === null) return "—";
  if (limit === 0) return "Unlimited";
  return formatTokenCount(remaining);
};

const formatStatus = (status?: string | null) => {
  if (!status) return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatPlanLabel = (value: string | null) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const ADDON_PACKS: Array<{
  label: string;
  type: AddonType;
  pack: string;
  badge?: string;
}> = [
  { label: "5 Uploads", type: "uploads", pack: "pack_5" },
  { label: "20 Uploads", type: "uploads", pack: "pack_20", badge: "Best value" },
  { label: "100k Chat Tokens", type: "chat", pack: "pack_100k" },
  { label: "5 Videos", type: "sadtalkerVideos", pack: "pack_5" },
  { label: "15 Videos", type: "sadtalkerVideos", pack: "pack_15" },
  { label: "30 Videos", type: "sadtalkerVideos", pack: "pack_30", badge: "Best value" },
];

type BillingPanelProps = {
  embedded?: boolean;
  refreshToken?: number;
};

export default function BillingPanel({ embedded = false, refreshToken = 0 }: BillingPanelProps) {
  const { data: planData, loading: planLoading, refresh: refreshPlan, hasActiveInstance } =
    usePlanInfo();
  const [instances, setInstances] = useState<PackageInstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);

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
      setErrorMessage("Unauthorized. Please sign in again.");
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
      setErrorMessage("Failed to select package instance.");
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
      });
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      setErrorMessage("Missing checkout URL.");
    } catch (err: unknown) {
      const payload = (err as { payload?: { error?: string; requestId?: string } })?.payload;
      const error = typeof payload?.error === "string" ? payload.error : null;
      const requestId = typeof payload?.requestId === "string" ? payload.requestId : null;
      setErrorRequestId(requestId);
      if (error === "ADDON_PRICE_NOT_CONFIGURED") {
        setErrorMessage(
          "This add-on is temporarily unavailable due to configuration. Please contact support and share Support ID.",
        );
      } else {
        setErrorMessage("Failed to create add-on checkout session.");
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
        <h2 className="text-lg font-semibold text-white">Select a package to continue</h2>
        <p className="mt-2 text-sm text-gray-400">
          You need an active package instance to buy add-ons.
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
              <span>Support ID: {errorRequestId}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(errorRequestId)}
                className="rounded-md border border-rose-200/60 px-2 py-1 text-[11px] uppercase tracking-wide hover:border-rose-100"
              >
                Copy
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
          <p className="text-sm text-gray-200">No active packages.</p>
        </section>
      ) : (
        <div className="space-y-4">
          {instances.map((instance) => {
            const isSelected = instance.id === planInstanceId;
            const uploadRemaining = formatLimit(
              instance.uploadLimit,
              getRemaining(instance.uploadLimit, instance.addonsUploads, instance.uploadsUsed),
            );
            const chatRemainingRaw = getRemaining(
              instance.chatMonthlyLimit ?? null,
              instance.addonsChat,
              instance.chatUsedThisCycle,
            );
            const isChatUnlimited = instance.chatMonthlyLimit === 0;
            const isUploadUnlimited = instance.uploadLimit === 0;
            const videoRemaining = formatLimit(
              instance.sadtalkerVideoLimit ?? null,
              getRemaining(
                instance.sadtalkerVideoLimit ?? null,
                instance.addonsVideos,
                instance.sadtalkerVideosUsed,
              ),
            );
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
                      Created {new Date(instance.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">{isSelected ? "Selected" : "Not selected"}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectInstance(instance.id)}
                      disabled={isSelected || actionKey === `select:${instance.id}`}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:border-white/40 disabled:opacity-50"
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-200 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>Uploads: {uploadRemaining}</div>
                  <div>
                    <div>
                      AI Chat:{" "}
                      {formatRemainingTokens(
                        typeof chatRemainingRaw === "number" ? chatRemainingRaw : null,
                        instance.chatMonthlyLimit ?? null,
                      )}{" "}
                      tokens
                    </div>
                    {isChatUnlimited ? (
                      <div className="mt-1 text-xs text-gray-400">
                        Unlimited plan tokens — each conversation has a memory limit. When it fills
                        up, summarize to continue.
                      </div>
                    ) : null}
                  </div>
                  <div>Videos: {videoRemaining}</div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Buy add-ons</p>
                  <div className="flex flex-wrap gap-2">
                    {ADDON_PACKS.map((pack) => {
                      const key = `${instance.id}:${pack.type}:${pack.pack}`;
                      const busy = actionKey === key;
                      const isIncluded =
                        (pack.type === "chat" && isChatUnlimited) ||
                        (pack.type === "uploads" && isUploadUnlimited);
                      const label = isIncluded ? "Included" : pack.label;
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={disabled || busy || isIncluded}
                          onClick={() => handleAddonPurchase(instance.id, pack.type, pack.pack)}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:border-white/40 disabled:opacity-50"
                        >
                          {busy ? "Redirecting…" : label}
                          {pack.badge ? (
                            <span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                              {pack.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  {disabled ? (
                    <p className="mt-2 text-xs text-gray-400">
                      Add-ons are only available for active packages.
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
          <p className="text-xs uppercase tracking-wide text-gray-400">Selected package</p>
          <h3 className="text-lg font-semibold text-white">
            {(() => {
              const profileLabel = profileLabelById.get(selectedInstance.id) || null;
              const planLabel = formatPlanLabel(selectedInstance.planKey || null);
              return profileLabel ? `${planLabel} — ${profileLabel}` : planLabel;
            })()}
          </h3>
          <p className="text-sm text-gray-300">Active instance: {selectedInstance.id}</p>
        </section>
      ) : null}
    </div>
  );
}
