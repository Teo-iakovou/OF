// DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/upload", label: "Upload Content" },
  { href: "/dashboard/history", label: "Upload History" },
  { href: "/dashboard/billing", label: "Plan & Billing" },
  { href: "/dashboard/account", label: "Account Info" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 bg-gray-900 border-r border-gray-800 p-6 h-screen sticky top-0">
      <h2 className="text-2xl font-bold text-white mb-8">Your Dashboard</h2>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`block px-4 py-2 rounded-lg cursor-pointer font-medium transition ${
                pathname === item.href
                  ? "bg-pink-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
