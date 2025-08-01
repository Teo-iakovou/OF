"use client";

import { useState, useRef, useEffect } from "react";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";

import UserPlanCard from "@/app/components/dashboard/overview/UserPlanCard";
import QuickStartPanel from "@/app/components/dashboard/overview/QuickStartPanel";
import TipsCard from "@/app/components/dashboard/overview/TipsCard";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <div ref={menuRef} className="relative inline-block md:hidden">
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <ProjectNavDropdownMenu
              overlayMode
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Section 1: User Plan Info */}
      <UserPlanCard />

      {/* Section 2: Quick Actions */}
      <QuickStartPanel />


      {/* Section 3: Tips */}
      <TipsCard />
    </div>
  );
}
