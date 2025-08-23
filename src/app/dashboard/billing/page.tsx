"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import { checkUserPackage } from "@/app/utils/api";
import Spinner from "@/app/components/dashboard/loading spinner/page";

export default function BillingPage() {
  const [userPackage, setUserPackage] = useState<null | {
    name: string;
    uploadsRemaining: number;
    expiresAt?: string;
  }>(null);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setLoading(false);
      return;
    }
    (async () => {
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
        setUserPackage(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close mobile Project Nav on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    // Fill dashboard layout; header fixed height, content scrolls
    <div className="h-full flex flex-col overflow-hidden text-white ">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Plan &amp; Billing
          </h1>
        </div>

        {/* Mobile Project Nav under the title */}
        <div className="mt-3 md:hidden" ref={menuRef}>
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <div className="relative z-40">
              <ProjectNavDropdownMenu overlayMode onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 min-h-0 overflow-y-auto px-6 md:px-12 lg:px-20 grid place-items-center">
        <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-6">
          {loading ? (
            <div className="py-10">
              <Spinner />
            </div>
          ) : userPackage ? (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
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
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md">
              <p className="text-red-400 text-lg">No active plan found.</p>
              <button
                onClick={() => router.push("/#packages")}
                className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition text-white font-medium"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}