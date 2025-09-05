"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import { BASE_URL } from "@/app/utils/fetcher";
import { Skeleton } from "@/app/components/ui/Skeleton";
 
import { checkUserPackage } from "@/app/utils/api";
import Spinner from "@/app/components/dashboard/loading spinner/page";

type UserPkg = {
  name: string;
  uploadsRemaining: number;
  expiresAt?: string;
} | null;

export default function AccountAndBillingPage() {
  const { user, loading: userLoading } = useUser({ required: false });
  const [userPackage, setUserPackage] = useState<UserPkg>(null);
  const [loading, setLoading] = useState(true);

  

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await checkUserPackage();
        if (res?.hasAccess) {
          setUserPackage({
            name: res.package ?? "Unknown",
            uploadsRemaining: res.uploadsRemaining ?? 0,
            expiresAt: res.expiresAt,
          });
        } else {
          setUserPackage(null);
        }
      } catch (err) {
        console.error("Error loading user package:", err);
        setUserPackage(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    router.replace("/login");
  };

  return (
    // Natural page scroll; sidebar is fixed in layout
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Account &amp; Billing
          </h1>
        </div>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Content */}
      <main className="px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto pb-8">
          {loading ? (
            <div className="py-10 grid place-items-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account card */}
              <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
                <h2 className="text-xl font-semibold">Account</h2>
                {userLoading ? (
                  <>
                    <Skeleton className="h-5 w-56" />
                    <div className="pt-2">
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </>
                ) : user?.email ? (
                  <>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <div className="pt-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Not signed in.</p>
                )}
              </section>

              {/* Plan card */}
              <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
                <h2 className="text-xl font-semibold">Plan</h2>
                {userPackage ? (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      <p>
                        <strong>Current Plan:</strong> {userPackage.name}
                      </p>
                      <p>
                        <strong>Uploads Remaining:</strong> {userPackage.uploadsRemaining}
                      </p>
                      {userPackage.expiresAt && (
                        <p>
                          <strong>Expires:</strong>{" "}
                          {new Date(userPackage.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => router.push("/#packages")}
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition text-white font-medium"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-red-400">No active plan found.</p>
                    <button
                      onClick={() => router.push("/#packages")}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition text-white font-medium"
                    >
                      View Plans
                    </button>
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
