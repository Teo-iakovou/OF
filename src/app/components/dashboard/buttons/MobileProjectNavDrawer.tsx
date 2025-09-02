"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { navItems } from "./ProjectNavDropdown";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileProjectNavDrawer({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2147483648]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className="absolute left-0 top-0 h-full w-[84vw] max-w-[320px] bg-[#0f1520] border-r border-[#232B36] shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#232B36] text-gray-200">
          <span className="font-medium">Project Navigation</span>
          <button
            aria-label="Close navigation"
            className="p-1 rounded hover:bg-[#1f2732]"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-5 py-3 text-gray-100 hover:text-cyan-400 hover:bg-gray-800 transition"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-gray-700 mt-2 pt-2">
              <Link
                href="/"
                className="block px-5 py-3 text-red-400 hover:text-red-500 hover:bg-gray-800 transition font-semibold"
                onClick={onClose}
              >
                Exit Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
