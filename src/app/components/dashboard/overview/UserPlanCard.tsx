"use client";
import { useEffect, useState } from "react";
import { checkUserPackage } from "@/app/utils/api";

export default function UserPlanCard() {
  const [plan, setPlan] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    checkUserPackage(email).then((res) => {
      if (res?.hasAccess) {
        setPlan({
          name: res.package ?? "Unknown",
          uploadsRemaining: res.uploadsRemaining ?? 0,
          expiresAt: res.expiresAt,
        });
      }
    });
  }, []);

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
