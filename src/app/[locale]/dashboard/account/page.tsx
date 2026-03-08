"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useUser } from "@/app/hooks/useUser";
import { useCart } from "@/app/components/cart/CartContext";
import { Skeleton } from "@/app/components/ui/Skeleton";

import { usePlanInfo } from "@/app/dashboard/PlanContext";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import { logoutClient } from "@/app/utils/authClient";
import Reveal from "@/app/components/common/Reveal";
import { formatRemaining } from "@/app/utils/quotaDisplay";

type UserPkg = {
  name: string;
  uploadsRemaining: number | null;
  expiresAt?: string;
} | null;

export default function AccountAndBillingPage() {
  const { user, loading: userLoading } = useUser({ required: true, redirectTo: "/" });
  const { setCartItems } = useCart();
  const { data: planData, loading: planLoading } = usePlanInfo();
  const userPackage: UserPkg =
    planData?.hasAccess
      ? {
          name: planData.package ?? "Unknown",
          uploadsRemaining: planData.uploadsRemaining ?? null,
          expiresAt: planData.expiresAt,
        }
      : null;

  

  const router = useRouter();

  const loading = planLoading;

  

  const handleLogout = async () => {
    await logoutClient();
    try {
      setCartItems([]);
    } catch {}
    router.replace("/login");
  };

  return (
    // Natural page scroll; sidebar is fixed in layout
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="shrink-0 px-4 pt-3 md:px-12 md:pt-20 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm hg-muted">Manage your profile and security.</p>
        </div>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Content */}
      <main>
        <div className="px-4 md:px-12 lg:px-20 max-w-5xl mx-auto w-full pb-10">
          {loading ? (
            <div className="py-10 grid place-items-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Reveal
                  as="section"
                  className="rounded-2xl hg-surface p-4 md:p-5 space-y-3 text-white"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide hg-muted-2">Profile</p>
                    <h2 className="text-lg font-semibold">Profile</h2>
                  </div>
                  <div className="border-t border-[var(--hg-border-2)]" />
                  {userLoading ? (
                    <>
                      <Skeleton className="h-5 w-56 bg-[rgba(255,255,255,0.08)]" />
                      <Skeleton className="h-4 w-40 bg-[rgba(255,255,255,0.08)]" />
                    </>
                  ) : user?.email ? (
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  ) : (
                    <p className="hg-muted">Not signed in.</p>
                  )}
                </Reveal>

                <Reveal
                  as="section"
                  className="rounded-2xl hg-surface p-4 md:p-5 space-y-3 text-white"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide hg-muted-2">Security</p>
                    <h2 className="text-lg font-semibold">Security</h2>
                  </div>
                  <div className="border-t border-[var(--hg-border-2)]" />
                  {userLoading ? (
                    <Skeleton className="h-9 w-32 bg-[rgba(255,255,255,0.08)]" />
                  ) : user?.email ? (
                    <div className="space-y-2">
                      <p className="text-sm hg-muted">
                        Signing out will return you to the login screen.
                      </p>
                      <button
                        className="inline-flex items-center justify-center rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-rose-200 font-medium transition hover:bg-rose-500/20"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <p className="hg-muted">No security actions available.</p>
                  )}
                </Reveal>
              </div>

              <Reveal
                as="section"
                className="lg:col-span-1 rounded-2xl hg-surface p-4 md:p-5 space-y-3 text-white"
              >
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide hg-muted-2">Plan</p>
                  <h2 className="text-lg font-semibold">Plan Status</h2>
                </div>
                <div className="border-t border-[var(--hg-border-2)]" />
                {userPackage ? (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      <p>
                        <strong>Current Plan:</strong> {userPackage.name}
                      </p>
                      <p>
                        <strong>Uploads Remaining:</strong>{" "}
                        {formatRemaining(userPackage.uploadsRemaining)}
                      </p>
                      {userPackage.expiresAt && (
                        <p>
                          <strong>Expires:</strong>{" "}
                          {new Date(userPackage.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="pt-1">
                      <Link
                        href="/#packages"
                        className="text-sm font-medium hg-muted hover:text-[#50C0F0] transition"
                      >
                        Manage billing →
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-rose-300">No active plan found.</p>
                    <div className="pt-1">
                      <Link
                        href="/#packages"
                        className="text-sm font-medium hg-muted hover:text-[#50C0F0] transition"
                      >
                        Manage billing →
                      </Link>
                    </div>
                  </>
                )}
              </Reveal>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
