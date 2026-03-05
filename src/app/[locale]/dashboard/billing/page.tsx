"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/app/components/common/Reveal";
import { clearApiCaches, verifyAddonSession } from "@/app/utils/api";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import BillingPanel from "@/app/components/dashboard/billing/BillingPanel";
import { useRouter } from "@/i18n/navigation";

type Notice = { status: "success" | "cancel"; kind?: string | null };

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh: refreshPlan } = usePlanInfo();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [addonVerifyStatus, setAddonVerifyStatus] = useState<"applied" | "pending" | "error" | null>(null);
  const [addonVerifyInfo, setAddonVerifyInfo] = useState<{
    sessionId?: string | null;
    requestId?: string | null;
  } | null>(null);
  const [panelRefreshToken, setPanelRefreshToken] = useState(0);

  useEffect(() => {
    const status = searchParams.get("status");
    const kind = searchParams.get("kind");
    const sessionId = searchParams.get("session_id");
    if (status === "success" || status === "cancel") {
      setNotice({ status, kind });
      (async () => {
        clearApiCaches();
        setPanelRefreshToken((prev) => prev + 1);
        refreshPlan(true);
        if (status === "success" && kind === "addon" && sessionId) {
          const backoff = [2000, 3000, 5000, 5000, 5000];
          let lastRes: { applied: boolean; paymentStatus?: string; sessionId?: string; requestId?: string | null } | null =
            null;
          try {
            for (let i = 0; i < backoff.length; i += 1) {
              const res = await verifyAddonSession(sessionId);
              lastRes = res;
              setAddonVerifyInfo({ sessionId: res.sessionId, requestId: res.requestId ?? null });
              if (res.applied) {
                setAddonVerifyStatus("applied");
                refreshPlan(true);
                setPanelRefreshToken((prev) => prev + 1);
                break;
              }
              if (res.paymentStatus !== "paid") {
                setAddonVerifyStatus("pending");
                break;
              }
              setAddonVerifyStatus("pending");
              await new Promise((r) => setTimeout(r, backoff[i]));
            }
            if (lastRes && lastRes.paymentStatus === "paid" && !lastRes.applied) {
              setAddonVerifyStatus("pending");
            }
          } catch {
            setAddonVerifyStatus("error");
          }
        } else {
          setAddonVerifyStatus(null);
          setAddonVerifyInfo(null);
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ai-auth-changed"));
        }
        router.replace("/dashboard/billing");
      })();
    }
  }, [searchParams, router, refreshPlan]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <header className="shrink-0 pt-12 md:pt-20 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Plan &amp; Billing</h1>
            <p className="text-sm text-gray-400">Manage add-ons and package profiles.</p>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-6xl mx-auto w-full px-4 md:px-12 lg:px-20 pb-10 space-y-6">
          {notice ? (
            <Reveal as="section" className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-200">
                {notice.status === "success"
                  ? "Add-on purchase completed. Your quotas are refreshing."
                  : "Add-on purchase canceled."}
              </p>
              {notice.status === "success" && notice.kind === "addon" ? (
                <p className="mt-2 text-xs text-gray-300">
                  {addonVerifyStatus === "applied"
                    ? "Applied ✓"
                    : addonVerifyStatus === "pending"
                      ? "Pending (refreshing)"
                      : addonVerifyStatus === "error"
                        ? "Could not verify add-on yet. Please refresh."
                        : null}
                </p>
              ) : null}
              {notice.status === "success" && notice.kind === "addon" && addonVerifyStatus === "pending" ? (
                <div className="mt-2 text-xs text-gray-300 space-y-1">
                  <div>Payment received, add-on still processing.</div>
                  <div>
                    Session: {addonVerifyInfo?.sessionId || "—"}
                    {addonVerifyInfo?.requestId ? ` · Request ID: ${addonVerifyInfo.requestId}` : ""}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        refreshPlan(true);
                        setPanelRefreshToken((prev) => prev + 1);
                      }}
                      className="rounded-md border border-white/20 px-2 py-1 text-[11px] text-white/80 hover:border-white/40"
                    >
                      Refresh
                    </button>
                    <a
                      href="mailto:support@yourapp.com"
                      className="rounded-md border border-white/20 px-2 py-1 text-[11px] text-white/80 hover:border-white/40"
                    >
                      Contact support
                    </a>
                  </div>
                </div>
              ) : null}
            </Reveal>
          ) : null}

          <BillingPanel refreshToken={panelRefreshToken} />
        </div>
      </main>
    </div>
  );
}
