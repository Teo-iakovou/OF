"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkUserPackage } from "@/app/utils/api";
import Spinner from "@/app/components/dashboard/loading spinner/page";
import Reveal from "@/app/components/common/Reveal";

export default function BillingPage() {
  const [userPackage, setUserPackage] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);

  
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  

  return (
    // Natural page scroll; sidebar is fixed in layout
    <div className="min-h-screen flex flex-col text-white ">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Plan &amp; Billing
          </h1>
        </div>

        {/* Mobile Project Nav moved to global drawer in layout */}
      </header>

      {/* Scrollable content */}
      <main className="px-6 md:px-12 lg:px-20 grid place-items-center">
        <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-6">
          {loading ? (
            <div className="py-10">
              <Spinner />
            </div>
          ) : userPackage ? (
            <Reveal as="div" className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
              <p>
                <strong>Current Plan:</strong> {userPackage.name}
              </p>
              <p>
                <strong>Uploads Remaining:</strong> {userPackage.uploadsRemaining}
              </p>
              {userPackage.expiresAt && (
                <p>
                  <strong>Expires At:</strong>{" "}
                  {new Date(userPackage.expiresAt).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => router.push("/#packages")}
                className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition text-white font-medium"
              >
                Upgrade Plan
              </button>
            </Reveal>
          ) : (
            <Reveal as="div" className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md">
              <p className="text-red-400 text-lg">No active plan found.</p>
              <button
                onClick={() => router.push("/#packages")}
                className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition text-white font-medium"
              >
                View Plans
              </button>
            </Reveal>
          )}
        </div>
      </main>
    </div>
  );
}
