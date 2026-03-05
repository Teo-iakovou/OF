"use client";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { formatRemaining } from "@/app/utils/quotaDisplay";

export default function UserPlanCard() {
  const { user, loading: userLoading } = useUser({ required: false });
  const { data: planData, loading, hasActiveInstance, isMissingActiveInstance } = usePlanInfo();

  if (loading || userLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-56 mb-3" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (isMissingActiveInstance || !hasActiveInstance || !planData?.hasAccess) return null;
  const uploadsRemaining = planData.uploadsRemaining ?? null;
  const uploadsRemainingLabel = formatRemaining(uploadsRemaining);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-white mb-2">Your Plan</h2>
      <p className="text-gray-300">
        Plan: <span className="text-cyan-400">{planData.package ?? "—"}</span>
      </p>
      <p className="text-gray-300">
        Uploads Remaining:{" "}
        <span className="text-pink-400">{uploadsRemainingLabel}</span>
      </p>
      {planData.expiresAt && (
        <p className="text-gray-300">
          Expires:{" "}
          <span className="text-yellow-300">
            {new Date(planData.expiresAt).toLocaleDateString()}
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
