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

export default function DashboardSidebar({
  isDropdown = false,
  onClose,
}: {
  isDropdown?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={
        isDropdown
          ? "bg-[#181F28] border border-[#232B36] rounded-2xl shadow-2xl py-2 w-72 min-w-[220px] z-50"
          : "w-64 bg-gray-900 border-r border-gray-800 p-6 h-screen sticky top-0"
      }
      style={isDropdown ? { minWidth: 220 } : {}}
    >
      {!isDropdown && (
        <h2 className="text-2xl font-bold text-white mb-8">Your Dashboard</h2>
      )}
      <ul className="py-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <span
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer font-medium transition text-base
                  ${
                    pathname === item.href
                      ? "bg-pink-600 text-white"
                      : "text-gray-200 hover:bg-[#232B36] hover:text-white"
                  }
                `}
              >
                {/* Colored dot for the selected menu item */}
                <span
                  className={`inline-block w-2 h-2 rounded-full
                    ${pathname === item.href ? "bg-teal-400" : "bg-transparent"}
                  `}
                ></span>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
