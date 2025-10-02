"use client";
import { useEffect, useState } from "react";
import { checkUserPackage } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useUser } from "@/app/hooks/useUser";

export default function UserPlanCard() {
  const [plan, setPlan] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser({ required: false });

  useEffect(() => {
    let cancelled = false;
    // Wait until auth state is resolved; skip if unauthenticated
    if (userLoading) return;
    if (!user) {
      setPlan(null);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await checkUserPackage();
        if (cancelled) return;
        if (res?.hasAccess) {
          setPlan({
            name: res.package ?? "Unknown",
            uploadsRemaining: res.uploadsRemaining ?? 0,
            expiresAt: res.expiresAt,
          });
        } else {
          setPlan(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, userLoading]);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-56 mb-3" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-white mb-2">Your Plan</h2>
      <p className="text-gray-300">
        Plan: <span className="text-cyan-400">{plan.name}</span>
      </p>
      <p className="text-gray-300">
        Uploads Remaining:{" "}
        <span className="text-pink-400">{plan.uploadsRemaining}</span>
      </p>
      {plan.expiresAt && (
        <p className="text-gray-300">
          Expires:{" "}
          <span className="text-yellow-300">
            {new Date(plan.expiresAt).toLocaleDateString()}
          </span>
        </p>
      )}
      <button
        onClick={() => (window.location.href = "/#packages")}
        className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
