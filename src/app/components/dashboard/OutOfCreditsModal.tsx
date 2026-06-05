"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { createAddonCheckoutSession, type AddonType } from "@/app/utils/api";

type ModalType = "uploads" | "chat" | "videos";

interface AddonPrice {
  type: AddonType;
  packKey: string;
  qty: number;
  bestValue: boolean;
  priceId: string | null;
  unitAmount: number | null;
  currency: string | null;
  formattedPrice: string | null;
}

interface AddonPriceResponse {
  uploads?: AddonPrice[];
  chat?: AddonPrice[];
  videos?: AddonPrice[];
}

// Maps modal type → billing ?addon= param (identity — all types match param names)
const BILLING_PARAM: Record<ModalType, string> = {
  uploads: "uploads",
  chat: "chat",
  videos: "videos",
};

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
    if (!packageInstanceId || !addon.priceId) return;
    const buyKey = `${addon.type}:${addon.packKey}`;
    setBuyingId(buyKey);
    try {
      const res = await createAddonCheckoutSession({
        addonType: addon.type,
        addonPack: addon.packKey,
        packageInstanceId,
        locale,
      });
      if (res?.url) window.location.href = res.url;
    } finally {
      setBuyingId(null);
    }
  }

  function handleGoToBilling() {
    onClose();
    const addonParam = BILLING_PARAM[type];
    router.push(`/${locale}/dashboard?settings=1&tab=billing&addon=${addonParam}`);
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
              {addons.map((addon) => {
                const buyKey = `${addon.type}:${addon.packKey}`;
                const qtyLabel = addon.type === "chat"
                  ? addon.qty >= 1_000_000 ? `${addon.qty / 1_000_000}M tokens` : `${addon.qty / 1_000}K tokens`
                  : `${addon.qty} ${addon.type === "videos" ? "videos" : "uploads"}`;
                return (
                  <div
                    key={buyKey}
                    className="flex items-center justify-between rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{qtyLabel}</p>
                      <p className="text-xs text-[var(--hg-muted)]">
                        {addon.formattedPrice ?? "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBuy(addon)}
                      disabled={!packageInstanceId || !addon.priceId || buyingId !== null}
                      className="rounded-lg bg-[var(--hg-accent)] px-3 py-1.5 text-xs font-semibold text-[#04131d] hover:opacity-90 disabled:opacity-50"
                    >
                      {buyingId === buyKey ? "…" : t("buy")}
                    </button>
                  </div>
                );
              })}
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
            onClick={handleGoToBilling}
            className="w-full rounded-xl border border-[var(--hg-border)] px-4 py-2.5 text-sm font-semibold text-white hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] transition-colors"
          >
            {t("buyCreditsCta")}
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
