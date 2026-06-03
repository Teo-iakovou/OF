"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { clearApiCaches, verifyAddonSession } from "@/app/utils/api";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import BillingPanel from "@/app/components/dashboard/billing/BillingPanel";
import { useRouter } from "@/i18n/navigation";

type AddonParam = "uploads" | "chat" | "videos";

const VALID_ADDON_PARAMS = new Set<string>(["uploads", "chat", "videos"]);

function parseAddonParam(value: string | null): AddonParam | undefined {
  if (value && VALID_ADDON_PARAMS.has(value)) return value as AddonParam;
  return undefined;
}

export default function BillingPage() {
  const t = useTranslations("dashboard.billingPage");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { refresh: refreshPlan } = usePlanInfo();
  const [panelRefreshToken, setPanelRefreshToken] = useState(0);

  const initialAddon = parseAddonParam(searchParams.get("addon"));
  const handledRef = useRef(false);

  const runAddonVerify = useCallback(
    async (sessionId: string) => {
      const verifyingToastId = toast.custom(
        () => (
          <div className="flex w-[320px] items-center gap-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 py-3 shadow-xl">
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            <p className="text-sm text-[var(--hg-text)]">{t("toasts.verifyingPurchase")}</p>
          </div>
        ),
        { duration: Infinity }
      );

      const backoff = [2000, 3000, 5000, 5000, 5000];
      let applied = false;

      for (const delay of backoff) {
        await new Promise<void>((r) => setTimeout(r, delay));
        try {
          const res = await verifyAddonSession(sessionId);
          if (res?.applied) {
            applied = true;
            break;
          }
        } catch {
          // swallow; fall through to pending path
        }
      }

      toast.dismiss(verifyingToastId);

      if (applied) {
        clearApiCaches();
        await refreshPlan(true);
        setPanelRefreshToken((prev) => prev + 1);
        toast.success(t("toasts.creditsAdded"));
        setTimeout(() => router.replace(`/${locale}/dashboard` as "/"), 150);
        return;
      }

      // Poll exhausted — webhook still in flight server-side
      toast(t("toasts.creditsPending"), {
        description: t("toasts.creditsPendingDesc"),
        duration: 10000,
        action: {
          label: t("toasts.checkAgain"),
          onClick: () => void runAddonVerify(sessionId),
        },
      });
      // Stay on billing — do not redirect on non-applied path
    },
    [locale, refreshPlan, router, t]
  );

  useEffect(() => {
    if (handledRef.current) return;

    const sp = new URLSearchParams(window.location.search);
    const status = sp.get("status");
    const kind = sp.get("kind");
    const sessionId = sp.get("session_id");

    if (!status) return;

    handledRef.current = true;

    // Strip params immediately so a refresh doesn't re-trigger
    router.replace(`/${locale}/dashboard/billing` as "/", { scroll: false });

    if (status === "cancel") {
      toast.info(t("toasts.checkoutCancelled"));
      return;
    }

    if (status === "success" && kind === "plan") {
      toast.success(t("toasts.planActivated"));
      setTimeout(() => router.replace(`/${locale}/dashboard` as "/"), 150);
      return;
    }

    if (status === "success" && kind === "addon" && sessionId) {
      void runAddonVerify(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <header className="shrink-0 px-4 pt-3 md:px-12 md:pt-20 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("heading")}</h1>
            <p className="text-sm text-gray-400">{t("subtitle")}</p>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-6xl mx-auto w-full px-4 md:px-12 lg:px-20 pb-10 space-y-6">
          <BillingPanel refreshToken={panelRefreshToken} initialAddon={initialAddon} />
        </div>
      </main>
    </div>
  );
}
