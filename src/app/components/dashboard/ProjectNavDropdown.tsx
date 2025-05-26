"use client";
import { useState, useRef, useEffect } from "react";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

export default function ProjectNavDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="md:hidden w-full flex flex-col gap-2  " ref={dropdownRef}>
      <button
        className="flex items-center px-4 py-2 rounded-lg bg-[#181F28] text-white text-base font-medium shadow border border-[#232B36] focus:outline-none transition-all w-max"
        onClick={() => setOpen((v) => !v)}
      >
        Project navigation
        <span
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="mt-2 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-72 min-w-[220px]">
          <DashboardSidebar isDropdown onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
