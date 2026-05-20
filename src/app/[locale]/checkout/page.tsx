"use client";

import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Zap } from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import {
  startCheckout,
  redeemPromoCode,
  subscribeCheckoutInFlight,
  getCheckoutInFlightSnapshot,
  getCheckoutInFlightServerSnapshot,
} from "@/app/utils/api";
import { useUser } from "@/app/hooks/useUser";
import { buildLoginHref } from "@/app/utils/authRedirect";
import { packages } from "@/app/components/packages/Packages";

const priceFont = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

const KNOWN_PROMO_ERRORS = new Set([
  "PROMO_CODE_REQUIRED",
  "PROMO_CODE_INVALID",
  "PROMO_CODE_INACTIVE",
  "PROMO_CODE_EXPIRED",
  "PROMO_CODE_ALREADY_USED_BY_YOU",
  "PROMO_CODE_EXHAUSTED",
  "PROMO_REDEEM_FAILED",
]);

const CheckoutContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const personaKey = searchParams.get("personaKey");
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const selectedPackage = packages.find((pkg) => pkg.id === packageId);

  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);
  const pathname = usePathname();
  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);
  const { user, loading: userLoading } = useUser({ required: false });
  const tPromo = useTranslations("promo");
  const t = useTranslations("checkout");
  const checkoutInFlight = useSyncExternalStore(
    subscribeCheckoutInFlight,
    getCheckoutInFlightSnapshot,
    getCheckoutInFlightServerSnapshot
  );

  const handleStripePayment = async () => {
    if (!packageId || loading || checkoutInFlight) return;
    if (userLoading) return;
    if (!user) {
      router.push(buildLoginHref(pathname, currentPath, "checkout"));
      return;
    }
    setLoading(true);
    try {
      await startCheckout(packageId, personaKey, locale);
    } catch (error) {
      console.error("Stripe checkout error:", error);
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) {
      setPromoError(tPromo("PROMO_CODE_REQUIRED"));
      return;
    }
    if (userLoading) return;
    if (!user) {
      router.push(buildLoginHref(pathname, currentPath, "checkout"));
      return;
    }
    setPromoApplying(true);
    setPromoError(null);
    try {
      await redeemPromoCode(trimmed);
      router.push("/dashboard?status=success");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const errorKey = code && KNOWN_PROMO_ERRORS.has(code) ? code : "errorGeneric";
      setPromoError(tPromo(errorKey));
    } finally {
      setPromoApplying(false);
    }
  };

  const busy = loading || Boolean(checkoutInFlight);

  if (!packageId) {
    return (
      <div
        className="flex min-h-screen flex-col bg-[var(--hg-bg)] text-white"
        style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}
      >
        <LandingNavbar hideLinks />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-sm text-[var(--hg-muted)]">{t("noPackageSelected")}</p>
            <a href="/account/plans" className="text-sm text-[var(--hg-accent)] hover:underline">
              {t("backToPlans")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div
        className="flex min-h-screen flex-col bg-[var(--hg-bg)] text-white"
        style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}
      >
        <LandingNavbar hideLinks />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[var(--hg-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--hg-accent)] border-t-transparent" />
            {t("loadingUser")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col text-[var(--hg-text)]"
      style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}
    >
      <LandingNavbar hideLinks />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,192,240,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(80,192,240,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Two-column body */}
      <div className="relative flex flex-1">

      {/* ── Left panel: order summary, hidden on mobile ── */}
      <div className="relative hidden flex-col overflow-hidden bg-[var(--hg-bg)] md:flex md:w-1/2">
        {/* Static blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[var(--hg-accent)]"
          style={{ opacity: 0.04 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[var(--hg-accent)]"
          style={{ opacity: 0.04 }}
        />

        <div className="relative flex flex-1 flex-col justify-center px-14 py-16 lg:px-16">
          <div className="max-w-sm">
            {/* Section label */}
            <p className="mb-6 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
              {t("orderSummary")}
            </p>

            {selectedPackage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative isolate rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
              >
                {selectedPackage.featured && (
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(80,192,240,0.12),transparent_55%)]" />
                )}

                {/* Badge */}
                {selectedPackage.badge && (
                  <div className="mb-4 inline-flex">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-accent)_14%,transparent)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#9fd9f3]">
                      <Zap className="h-3 w-3" aria-hidden />
                      {selectedPackage.badge}
                    </span>
                  </div>
                )}

                {/* Plan icon + name */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--hg-border)] bg-white/[0.03]">
                    <selectedPackage.icon
                      className={`h-6 w-6 ${selectedPackage.featured ? "text-[var(--hg-accent)]" : "text-white/80"}`}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedPackage.title}</h2>
                    <p className="text-xs text-[var(--hg-muted)]">{selectedPackage.outcome}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5 flex items-baseline gap-1">
                  <span className={`${priceFont.className} text-4xl font-extrabold leading-none text-white`}>
                    {selectedPackage.price}
                  </span>
                  <span className="text-sm text-[var(--hg-muted)]">{selectedPackage.period}</span>
                </div>

                {/* Includes */}
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
                  {t("includes")}
                </p>
                <ul className="mb-5 space-y-2.5">
                  {selectedPackage.includes.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm leading-5 text-[var(--hg-muted)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hg-accent)]" aria-hidden />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Highlights */}
                <p className="mb-2.5 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
                  {t("highlights")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPackage.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center rounded-full border border-[var(--hg-border)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/90"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-red-400">{t("invalidPackage")}</p>
            )}

            {/* One-time payment note */}
            <p className="mt-6 text-xs text-[var(--hg-muted)]/60">{t("oneTimePayment")}</p>
          </div>
        </div>
      </div>

      {/* ── Right panel: payment ── */}
      <div className="relative flex flex-1 flex-col bg-[var(--hg-bg)] md:w-1/2">
        {/* Centered payment content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-[400px]">
            {/* Mobile: compact plan summary */}
            {selectedPackage && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-4 py-3 md:hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-white/[0.03]">
                  <selectedPackage.icon
                    className={`h-5 w-5 ${selectedPackage.featured ? "text-[var(--hg-accent)]" : "text-white/80"}`}
                    aria-hidden
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{selectedPackage.title}</p>
                  <p className="text-xs text-[var(--hg-muted)]">{selectedPackage.period}</p>
                </div>
                <span className={`${priceFont.className} text-xl font-extrabold text-white`}>
                  {selectedPackage.price}
                </span>
              </div>
            )}

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="font-semibold text-white" style={{ fontSize: 24, lineHeight: 1.3 }}>
                {t("heading")}
              </h1>
              <p className="mt-1 text-[13px] text-[var(--hg-muted)]">{t("subheading")}</p>
            </motion.div>

            {/* Stripe pay button */}
            <button
              type="button"
              disabled={!selectedPackage || busy}
              onClick={() => void handleStripePayment()}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--hg-accent)] text-sm font-semibold text-[#07131d] shadow-[0_10px_26px_rgba(80,192,240,0.28)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <span>{t("processing")}</span>
              ) : (
                <>
                  <span>{t("payWithStripe")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </button>

            {/* OR divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 bg-[var(--hg-border)]" style={{ height: "0.5px" }} />
              <span
                className="text-[var(--hg-muted)]"
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {t("orDivider")}
              </span>
              <div className="flex-1 bg-[var(--hg-border)]" style={{ height: "0.5px" }} />
            </div>

            {/* Promo code section */}
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--hg-muted)]">
                {tPromo("inputLabel")}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError(null);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") void handleApplyPromo(); }}
                  placeholder={tPromo("inputPlaceholder")}
                  disabled={promoApplying}
                  className="flex-1 min-w-0 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--hg-muted)] focus:border-[var(--hg-accent)]/60 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => void handleApplyPromo()}
                  disabled={promoApplying || !promoCode.trim()}
                  className="shrink-0 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--hg-text)] transition hover:border-[var(--hg-accent)]/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {promoApplying ? tPromo("applyingButton") : tPromo("applyButton")}
                </button>
              </div>
              {promoError && (
                <p className="mt-1.5 text-xs text-red-400">{promoError}</p>
              )}
            </div>

            {/* Secure note */}
            <p className="mt-6 text-center text-[11px] text-[var(--hg-muted)]/60">
              {t("secureNote")}
            </p>
          </div>
        </div>
      </div>

      </div>{/* end two-column body */}
    </div>
  );
};

const Checkout = () => (
  <Suspense
    fallback={
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--hg-bg)] text-white"
        style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}
      >
        <div className="flex items-center gap-3 text-sm text-[var(--hg-muted)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--hg-accent)] border-t-transparent" />
          Loading checkout…
        </div>
      </div>
    }
  >
    <CheckoutContent />
  </Suspense>
);

export default Checkout;
