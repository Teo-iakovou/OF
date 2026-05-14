"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { createAddonCheckoutSession } from "@/app/utils/api";

type ModalType = "uploads" | "ai" | "videos";

interface AddonPrice {
  id: string;
  label: string;
  credits: number;
  priceCents: number;
  currency: string;
}

interface AddonPriceResponse {
  uploads?: AddonPrice[];
  ai?: AddonPrice[];
  videos?: AddonPrice[];
}

// Maps API addon id → createAddonCheckoutSession params
const CHECKOUT_MAP: Record<string, { addonType: string; addonPack: string }> = {
  upload_5:  { addonType: "uploads",         addonPack: "pack_5"    },
  upload_20: { addonType: "uploads",         addonPack: "pack_20"   },
  ai_100k:   { addonType: "chat",            addonPack: "pack_100k" },
  video_5:   { addonType: "sadtalkerVideos", addonPack: "pack_5"    },
  video_15:  { addonType: "sadtalkerVideos", addonPack: "pack_15"   },
  video_30:  { addonType: "sadtalkerVideos", addonPack: "pack_30"   },
};

function formatPrice(priceCents: number, currency: string): string {
  const amount = priceCents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

interface Props {
  type: ModalType;
  open: boolean;
  onClose: () => void;
}

export default function OutOfCreditsModal({ type, open, onClose }: Props) {
  const t = useTranslations("outOfCredits");
  const router = useRouter();
  const locale = useLocale();
  const { data: planData } = usePlanInfo();
  const packageInstanceId = planData?.packageInstanceId ?? null;

  const [addons, setAddons] = useState<AddonPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch prices once when modal first opens
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;

    setPricesLoading(true);
    setPricesError(false);

    fetch("/api/checkout/addon-prices", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<AddonPriceResponse>;
      })
      .then((data) => {
        setAddons(data[type] ?? []);
        setPricesLoading(false);
      })
      .catch(() => {
        setPricesError(true);
        setPricesLoading(false);
      });
  }, [open, type]);

  function handleRetry() {
    fetchedRef.current = false;
    setAddons([]);
    setPricesError(false);
    // Re-trigger the effect by toggling open (already open), so we reset the ref
    fetchedRef.current = false;
    setPricesLoading(true);
    setPricesError(false);

    fetch("/api/checkout/addon-prices", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<AddonPriceResponse>;
      })
      .then((data) => {
        setAddons(data[type] ?? []);
        setPricesLoading(false);
      })
      .catch(() => {
        setPricesError(true);
        setPricesLoading(false);
      });
  }

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleBuy(addon: AddonPrice) {
    if (!packageInstanceId) return;
    const mapping = CHECKOUT_MAP[addon.id];
    if (!mapping) return;

    setBuyingId(addon.id);
    try {
      const res = await createAddonCheckoutSession({
        addonType: mapping.addonType,
        addonPack: mapping.addonPack,
        packageInstanceId,
        locale,
      });
      if (res?.url) window.location.href = res.url;
    } finally {
      setBuyingId(null);
    }
  }

  function handleUpgradePlan() {
    onClose();
    router.push(`/${locale}/account/plans`);
  }

  if (!mounted || !open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />

      {/* Card */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 text-white shadow-xl">
        {/* Header */}
        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold">{t(`${type}.title`)}</h2>
          <p className="text-sm text-[var(--hg-muted)]">{t(`${type}.subtitle`)}</p>
        </div>

        {/* Addon cards */}
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--hg-muted-2)]">
            {t("addCreditsHeading")}
          </p>

          {pricesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-[var(--hg-surface-2)]"
                />
              ))}
            </div>
          ) : pricesError ? (
            <div className="rounded-xl border border-[var(--hg-border)] px-4 py-3 text-center">
              <p className="text-sm text-[var(--hg-muted)]">{t("errorLoading")}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-2 text-xs text-[var(--hg-accent)] underline underline-offset-2 hover:opacity-80"
              >
                {t("retry")}
              </button>
            </div>
          ) : addons.length === 0 ? null : (
            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{addon.label}</p>
                    <p className="text-xs text-[var(--hg-muted)]">
                      {formatPrice(addon.priceCents, addon.currency)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBuy(addon)}
                    disabled={!packageInstanceId || buyingId !== null}
                    className="rounded-lg bg-[var(--hg-accent)] px-3 py-1.5 text-xs font-semibold text-[#04131d] hover:opacity-90 disabled:opacity-50"
                  >
                    {buyingId === addon.id ? "…" : t("buy")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3 text-xs text-[var(--hg-muted-2)]">
          <div className="h-px flex-1 bg-[var(--hg-border)]" />
          {t("or")}
          <div className="h-px flex-1 bg-[var(--hg-border)]" />
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUpgradePlan}
            className="w-full rounded-xl border border-[var(--hg-border)] px-4 py-2.5 text-sm font-semibold text-white hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] transition-colors"
          >
            {t("upgradePlan")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[var(--hg-muted)] hover:text-white transition-colors"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
