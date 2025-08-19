"use client";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/upload", label: "Upload Content" },
  { href: "/dashboard/history", label: "Upload History" },
  { href: "/dashboard/billing", label: "Plan & Billing" },
  { href: "/dashboard/ai-chat", label: "AI Chat" },
  { href: "/dashboard/account", label: "Account Info" },
];

interface ProjectNavDropdownMenuProps {
  overlayMode?: boolean;
  onClose?: () => void;
}

export default function ProjectNavDropdownMenu({
  overlayMode = false,
  onClose,
}: ProjectNavDropdownMenuProps) {
  return (
    <div
      className={
        overlayMode
          ? "absolute right-0 mt-2 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-72 min-w-[220px] z-50"
          : "w-full mt-2 mb-4 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 md:hidden"
      }
    >
      <ul className="py-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-5 py-2 text-gray-100 hover:text-cyan-400 hover:bg-gray-800 rounded transition"
              onClick={onClose}
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Exit Dashboard */}
        <li className="border-t border-gray-700 mt-2 pt-2">
          <Link
            href="/"
            className="block px-5 py-2 text-red-400 hover:text-red-500 hover:bg-gray-800 rounded transition font-semibold"
            onClick={onClose}
          >
            Exit Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}