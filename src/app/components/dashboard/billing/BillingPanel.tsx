"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, MessageSquare, Sparkles, Video } from "lucide-react";
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
import { ADDON_PACKS as ADDON_PACK_DEFS, type AddonPackEntry } from "@/config/addons";
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

// Pre-compute first index per type (module-level, constant)
const FIRST_INDEX_BY_TYPE: Partial<Record<AddonType, number>> = {};
ADDON_PACK_DEFS.forEach((p, i) => {
  if (!(p.type in FIRST_INDEX_BY_TYPE)) FIRST_INDEX_BY_TYPE[p.type] = i;
});

const ICON_FOR_TYPE: Record<AddonType, React.ComponentType<{ className?: string }>> = {
  uploads: ImagePlus,
  chat: MessageSquare,
  videos: Video,
};

const CATEGORY_KEY_FOR_TYPE: Record<AddonType, string> = {
  uploads: "uploads",
  chat: "aiTokens",
  videos: "videos",
};

// Maps billing ?addon= param → AddonType for scroll/highlight
const PARAM_TO_ADDON_TYPE: Record<string, AddonType> = {
  uploads: "uploads",
  chat: "chat",
  videos: "videos",
};

// Maps AddonType → addon section id
const ADDON_SECTION_ID = (type: AddonType) => `addon-section-${type}`;

type BillingPanelProps = {
  embedded?: boolean;
  refreshToken?: number;
  initialAddon?: "uploads" | "chat" | "videos";
};

export default function BillingPanel({
  embedded = false,
  refreshToken = 0,
  initialAddon,
}: BillingPanelProps) {
  const t = useTranslations("dashboard.billing");
  const locale = useLocale();
  const { data: planData, loading: planLoading, refresh: refreshPlan, hasActiveInstance } =
    usePlanInfo();
  const [instances, setInstances] = useState<PackageInstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveAddonPrices, setLiveAddonPrices] = useState<Record<string, Record<string, { formattedPrice: string | null }>> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [highlightAddon, setHighlightAddon] = useState<string | null>(null);
  const scrolledRef = useRef(false);

  const planInstanceId = planData?.packageInstanceId ?? null;
  const needsSelection = Boolean(planData?.needsInstanceSelection);

  // Scroll to and briefly highlight the addon section matching initialAddon
  useEffect(() => {
    if (!initialAddon || scrolledRef.current) return;
    scrolledRef.current = true;
    setHighlightAddon(initialAddon);

    const scrollTimer = setTimeout(() => {
      const targetType = PARAM_TO_ADDON_TYPE[initialAddon];
      const el = targetType
        ? document.getElementById(ADDON_SECTION_ID(targetType))
        : null;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);

    const clearTimer = setTimeout(() => setHighlightAddon(null), 2500);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          showProfiles ? t("profileLabel", { letter: String.fromCharCode(65 + index) }) : null,
        );
      });
    });
    return labelMap;
  }, [instances, t]);

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
    fetch("/api/checkout/addon-prices", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) return;
        // data shape: { uploads: [{packKey, formattedPrice, ...}], chat: [...], videos: [...] }
        const indexed: Record<string, Record<string, { formattedPrice: string | null }>> = {};
        for (const [type, entries] of Object.entries(data) as [string, Array<{ packKey: string; formattedPrice: string | null }>][]) {
          indexed[type] = {};
          for (const entry of entries) {
            indexed[type][entry.packKey] = { formattedPrice: entry.formattedPrice };
          }
        }
        setLiveAddonPrices(indexed);
      })
      .catch(() => {/* non-critical */});
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
            const isActiveInstance = instance.id === planInstanceId;
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

            const uploadBarPct = !isUploadUnlimited && quotas.uploads.effectiveLimit
              ? Math.min(100, (quotas.uploads.used / quotas.uploads.effectiveLimit) * 100) : 0;
            const uploadBarColor = quotas.uploads.remaining === 0
              ? "bg-red-400"
              : quotas.uploads.remaining !== null && quotas.uploads.effectiveLimit
                ? quotas.uploads.remaining / quotas.uploads.effectiveLimit < 0.2 ? "bg-amber-400" : "bg-[var(--hg-accent)]"
                : "bg-[var(--hg-accent)]";

            const chatBarPct = !isChatUnlimited && quotas.aiTokens.effectiveLimit
              ? Math.min(100, (quotas.aiTokens.used / quotas.aiTokens.effectiveLimit) * 100) : 0;
            const chatBarColor = quotas.aiTokens.remaining === 0
              ? "bg-red-400"
              : quotas.aiTokens.remaining !== null && quotas.aiTokens.effectiveLimit
                ? quotas.aiTokens.remaining / quotas.aiTokens.effectiveLimit < 0.2 ? "bg-amber-400" : "bg-[var(--hg-accent)]"
                : "bg-[var(--hg-accent)]";

            const videoBarPct = !isVideoUnlimited && quotas.videos.effectiveLimit
              ? Math.min(100, (quotas.videos.used / quotas.videos.effectiveLimit) * 100) : 0;
            const videoBarColor = quotas.videos.remaining === 0
              ? "bg-red-400"
              : quotas.videos.remaining !== null && quotas.videos.effectiveLimit
                ? quotas.videos.remaining / quotas.videos.effectiveLimit < 0.2 ? "bg-amber-400" : "bg-[var(--hg-accent)]"
                : "bg-[var(--hg-accent)]";

            return (
              <section
                key={instance.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{headerLabel}</div>
                    <h2 className="text-lg font-semibold text-white">{formatStatus(instance.status, t("statusActive"))}</h2>
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

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="flex flex-col gap-2 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-white/5 p-2">
                        <ImagePlus className="h-4 w-4 text-[var(--hg-muted)]" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">{t("uploads")}</p>
                    </div>
                    <p className="text-3xl font-bold leading-none text-white">
                      {isUploadUnlimited ? "∞" : uploadRemaining}
                    </p>
                    <p className="text-xs text-[var(--hg-muted)]">
                      {isUploadUnlimited ? t("unlimited") : t("remaining")}
                    </p>
                    {!isUploadUnlimited && quotas.uploads.effectiveLimit ? (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full transition-all ${uploadBarColor}`} style={{ width: `${uploadBarPct}%` }} />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-white/5 p-2">
                        <MessageSquare className="h-4 w-4 text-[var(--hg-muted)]" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">{t("aiTokens")}</p>
                    </div>
                    <p className="text-3xl font-bold leading-none text-white">
                      {isChatUnlimited
                        ? "∞"
                        : formatTokenCount(typeof chatRemainingRaw === "number" ? chatRemainingRaw : null)}
                    </p>
                    <p className="text-xs text-[var(--hg-muted)]">
                      {isChatUnlimited ? t("unlimited") : `${t("remaining")} ${t("tokensUnit")}`}
                    </p>
                    {!isChatUnlimited && quotas.aiTokens.effectiveLimit ? (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full transition-all ${chatBarColor}`} style={{ width: `${chatBarPct}%` }} />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-white/5 p-2">
                        <Video className="h-4 w-4 text-[var(--hg-muted)]" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">{t("videos")}</p>
                    </div>
                    <p className="text-3xl font-bold leading-none text-white">
                      {isVideoUnlimited ? "∞" : videoRemaining}
                    </p>
                    <p className="text-xs text-[var(--hg-muted)]">
                      {isVideoUnlimited ? t("unlimited") : t("remaining")}
                    </p>
                    {!isVideoUnlimited && quotas.videos.effectiveLimit ? (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full transition-all ${videoBarColor}`} style={{ width: `${videoBarPct}%` }} />
                      </div>
                    ) : null}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {t("tokensMonthlyDesc")}
                  {isChatUnlimited ? <>{" "}{t("tokensUnlimitedDesc")}</> : null}
                </p>

                <div className="border-t border-[var(--hg-border)] pt-5">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">{t("buyAddons")}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ADDON_PACK_DEFS.map((pack: AddonPackEntry, packIndex: number) => {
                      const key = `${instance.id}:${pack.type}:${pack.packKey}`;
                      const busy = actionKey === key;
                      const isIncluded =
                        (pack.type === "chat" && isChatUnlimited) ||
                        (pack.type === "uploads" && isUploadUnlimited);
                      const isBestValue = pack.bestValue;
                      const Icon = ICON_FOR_TYPE[pack.type];
                      const categoryLabel = t(CATEGORY_KEY_FOR_TYPE[pack.type] as Parameters<typeof t>[0]);
                      const formattedPrice = liveAddonPrices?.[pack.type]?.[pack.packKey]?.formattedPrice ?? "—";

                      const qtyLabel = pack.type === "chat"
                        ? pack.qty >= 1_000_000 ? `${pack.qty / 1_000_000}M tokens` : `${pack.qty / 1_000}K tokens`
                        : `${pack.qty} ${pack.type === "videos" ? "videos" : "uploads"}`;

                      // Attach scroll-target id to the first card of each type, for the active instance
                      const isFirstOfType = FIRST_INDEX_BY_TYPE[pack.type] === packIndex;
                      const sectionId = (isActiveInstance && isFirstOfType)
                        ? ADDON_SECTION_ID(pack.type)
                        : undefined;

                      // Highlight ring when this pack's type matches the initialAddon param
                      const isHighlighted =
                        isActiveInstance &&
                        highlightAddon !== null &&
                        PARAM_TO_ADDON_TYPE[highlightAddon] === pack.type;

                      return (
                        <div
                          key={key}
                          id={sectionId}
                          className={[
                            "relative flex flex-col gap-3 rounded-2xl border p-4 transition-all",
                            isBestValue
                              ? "border-[rgba(80,192,240,0.40)] bg-[rgba(80,192,240,0.05)] shadow-[0_0_24px_rgba(80,192,240,0.08)]"
                              : "border-[var(--hg-border)] bg-[var(--hg-surface-2)]",
                            isIncluded ? "opacity-55" : "",
                            isHighlighted ? "ring-2 ring-[#50C0F0]" : "",
                          ].join(" ")}
                        >
                          {isBestValue && (
                            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--hg-accent-soft)] px-2 py-0.5">
                              <Sparkles className="h-2.5 w-2.5 text-[var(--hg-accent)]" />
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--hg-accent)]">
                                {t("addonBadgeBestValue")}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div
                              className={[
                                "rounded-xl p-2",
                                isBestValue ? "bg-[var(--hg-accent-soft)]" : "bg-white/5",
                              ].join(" ")}
                            >
                              <Icon
                                className={[
                                  "h-4 w-4",
                                  isBestValue ? "text-[var(--hg-accent)]" : "text-[var(--hg-muted)]",
                                ].join(" ")}
                              />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">
                              {categoryLabel}
                            </p>
                          </div>
                          <p
                            className={[
                              "text-sm font-semibold leading-tight",
                              isBestValue ? "text-white" : "text-[var(--hg-text)]",
                            ].join(" ")}
                          >
                            {qtyLabel}
                          </p>
                          <p className="text-lg font-bold text-white">{formattedPrice}</p>
                          <div className="mt-auto">
                            {isIncluded ? (
                              <div className="flex items-center gap-1.5 text-xs text-[var(--hg-muted)]">
                                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                                {t("included")}
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={disabled || busy}
                                onClick={() => handleAddonPurchase(instance.id, pack.type, pack.packKey)}
                                className={[
                                  "w-full rounded-xl py-2 text-xs font-semibold transition-all",
                                  isBestValue
                                    ? "bg-[var(--hg-accent)] text-[#07141d] hover:opacity-90"
                                    : "border border-[var(--hg-border)] bg-white/5 text-white hover:border-white/30 hover:bg-white/8",
                                  busy ? "cursor-not-allowed opacity-75" : "",
                                  disabled ? "disabled:opacity-50" : "",
                                ].join(" ")}
                              >
                                {busy ? (
                                  <span className="flex items-center justify-center gap-1.5">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    {t("redirecting")}
                                  </span>
                                ) : t("buyButton")}
                              </button>
                            )}
                          </div>
                        </div>
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
