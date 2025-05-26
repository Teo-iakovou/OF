"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserPackage } from "@/app/utils/api";
import ProjectNavDropdown from "@/app/components/dashboard/ProjectNavDropdown";

export default function BillingPage() {
  const [userPackage, setUserPackage] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);

  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const fetchPackage = async () => {
      try {
        const res = await checkUserPackage(email);
        if (res?.hasAccess) {
          setUserPackage({
            name: res.package ?? "Unknown",
            uploadsRemaining: res.uploadsRemaining ?? 0,
          });
        } else {
          setUserPackage(null);
        }
      } catch (err) {
        console.error("Error loading user package:", err);
      }
    };

    fetchPackage();
  }, []);

  return (
    <div className="pt-14 px-4 sm:px-6 md:px-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Plan & Billing
      </h1>
      <ProjectNavDropdown />

      {userPackage ? (
        <div className="bg-gray-800 rounded-xl p-6 shadow-button text-white space-y-4">
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

          <button onClick={() => router.push("/#packages")} className="mt-4">
            Upgrade Plan
          </button>
        </div>
      ) : (
        <div className="text-red-400 text-lg">No active plan found.</div>
      )}
    </div>
  );
}
