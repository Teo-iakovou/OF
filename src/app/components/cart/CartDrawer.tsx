"use client";

import { packages } from "@/app/components/packages/Packages";
import Image from "next/image";
import { useState, useEffect, useSyncExternalStore, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ArrowRight, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "./CartContext";
import { useUser } from "@/app/hooks/useUser";
import { buildLoginHref } from "@/app/utils/authRedirect";
import {
  startCheckout,
  subscribeCheckoutInFlight,
  getCheckoutInFlightSnapshot,
  getCheckoutInFlightServerSnapshot,
} from "@/app/utils/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const { cartItems, removeFromCart, changeQty } = useCart();
  const { user, loading: userLoading } = useUser({ required: false });
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const checkoutInFlight = useSyncExternalStore(
    subscribeCheckoutInFlight,
    getCheckoutInFlightSnapshot,
    getCheckoutInFlightServerSnapshot
  );
  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const pkg = packages.find((p) => p.id === item.id);
    if (!pkg) return sum;
    const priceNum = Number(pkg.price.replace(/[^0-9.-]+/g, ""));
    return sum + priceNum * item.quantity;
  }, 0);

  const handleStripePayment = async () => {
    if (!cartItems.length || isCheckingOut || checkoutInFlight || userLoading) return;
    if (!user) {
      router.push(buildLoginHref(pathname, currentPath, "checkout"));
      return;
    }
    setIsCheckingOut(true);
    try {
      await startCheckout(cartItems[0].id, null, locale);
    } catch (error) {
      console.error("Stripe checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  const busy = isCheckingOut || Boolean(checkoutInFlight);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-[var(--hg-border)] bg-[var(--hg-bg)] shadow-[−20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_80%,transparent)] px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] overflow-hidden">
              <Image src="/echofy-removebg-preview.png" alt="Echofy" width={28} height={28} className="rounded-full" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Your cart</h2>
              <p className="text-xs text-[var(--hg-muted)]">
                {itemCount === 0
                  ? "No items"
                  : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)]/40 hover:text-[var(--hg-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] overflow-hidden">
                <Image src="/echofy-removebg-preview.png" alt="Echofy" width={44} height={44} className="rounded-full opacity-40" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--hg-text)]">Your cart is empty</p>
                <p className="mt-1 text-xs text-[var(--hg-muted)]">Add a plan to get started</p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => {
              const pkg = packages.find((p) => p.id === item.id);
              if (!pkg) return null;
              const lineTotal = Number(pkg.price.replace(/[^0-9.-]+/g, "")) * item.quantity;
              return (
                <div
                  key={item.id}
                  className="group relative flex gap-4 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4 transition hover:border-[var(--hg-accent)]/30"
                >
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] overflow-hidden">
                    <Image
                      src="/echofy-removebg-preview.png"
                      alt="Echofy"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">{pkg.title}</p>
                        <p className="text-xs text-[var(--hg-muted)]">{pkg.period}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeFromCart(item.id)}
                        className="shrink-0 rounded-lg p-1 text-[var(--hg-muted)] opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity === 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)]/40 hover:text-[var(--hg-text)] disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)]/40 hover:text-[var(--hg-text)]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line price */}
                      <span className="text-sm font-semibold text-[var(--hg-accent)]">
                        ${lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_70%,transparent)] px-5 py-5 backdrop-blur-md">
          {cartItems.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3">
              <span className="text-sm text-[var(--hg-muted)]">Subtotal</span>
              <span className="text-lg font-bold text-white">${subtotal}</span>
            </div>
          )}
          <button
            type="button"
            disabled={cartItems.length === 0 || busy}
            onClick={handleStripePayment}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--hg-accent)] text-sm font-semibold text-[#07131d] shadow-[0_10px_26px_rgba(80,192,240,0.28)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <span>Processing…</span>
            ) : (
              <>
                <span>
                  {cartItems.length === 0 ? "Cart is empty" : `Checkout · $${subtotal}`}
                </span>
                {cartItems.length > 0 && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-[var(--hg-muted)]">
            Secure checkout via Stripe · One-time payment
          </p>
        </div>
      </div>
    </>
  );
}
