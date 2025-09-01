"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  History,
  User,
  MessageCircle,
  PanelRightOpen,
} from "lucide-react";
import Image from "next/image";

// ✅ Now AI Chat is a normal route link (no floating chat action)
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Content", icon: Upload },
  { href: "/dashboard/history", label: "Upload History", icon: History },
  { href: "/dashboard/ai-chat", label: "AI Chat", icon: MessageCircle },
  { href: "/dashboard/account", label: "Account & Billing", icon: User },
];

export default function DashboardSidebar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}) {
  const pathname = usePathname();

  // Helper: exact match for root (/dashboard), prefix match for subpages
  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`
        bg-[#171d29] rounded-2xl shadow-2xl flex flex-col justify-between items-center
        transition-all duration-200 fixed top-6 left-4
        ${expanded ? "w-64" : "w-16"}
        py-4 px-2 z-30
      `}
      style={{
        minWidth: expanded ? 256 : 64,
        maxWidth: expanded ? 256 : 64,
        height: "calc(100vh - 3rem)",
      }}
    >
      {/* Top Section: Toggle + Nav */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {/* Toggle: PanelRightOpen icon */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-blue-300 hover:text-white transition cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
          }}
        >
          <PanelRightOpen
            size={22}
            className={expanded ? "" : "rotate-180 transition-transform duration-300"}
          />
        </div>

        {/* Nav Items */}
        <ul className="flex flex-col items-center gap-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            const base =
              "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer font-medium text-base transition-colors duration-150 w-full";
            const idle = "text-blue-300 hover:bg-[#232B36]";
            const activeCls = "bg-blue-600 text-white";

            return (
              <li key={item.label} className="relative group">
                {item.href ? (
                  <Link href={item.href}>
                    <span className={`${base} ${active ? activeCls : idle}`}>
                      <Icon size={22} />
                      {expanded && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                    </span>
                  </Link>
                ) : (
                  <span className={`${base} ${idle}`}>
                    <Icon size={22} />
                    {expanded && <span className="whitespace-nowrap">{item.label}</span>}
                  </span>
                )}

                {!expanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-black text-white px-3 py-1 rounded shadow-lg text-xs font-semibold z-50 transition whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom: Profile */}
      <div className="flex flex-col items-center text-white">
        <Link href="/" className="flex flex-col items-center group transition">
          <Image
            src="/5805591578897663447.jpg"
            alt="Platform Logo"
            width={56}
            height={56}
            className="rounded-full object-cover border border-gray-700 group-hover:scale-105 transition"
          />
        </Link>
      </div>
    </nav>
  );
}