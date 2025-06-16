"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectNavDropdownButton from "@/app/components/dashboard/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/ProjectNavDropdown";
import { checkUserPackage } from "@/app/utils/api";

export default function BillingPage() {
  const [userPackage, setUserPackage] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);

  const [open, setOpen] = useState(false);
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
            expiresAt: res.expiresAt,
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

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(".project-nav-dropdown"))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Plan & Billing
        </h1>
        <div className="relative inline-block md:hidden project-nav-dropdown">
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <ProjectNavDropdownMenu
              overlayMode
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </div>
      {userPackage ? (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-md space-y-4">
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
