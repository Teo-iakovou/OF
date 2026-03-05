"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  UploadCloud,
  MessageCircle,
  PanelRight,
  Video,
  GemIcon,
} from "lucide-react";
import Image from "next/image";
import ProfileMenuButton from "@/app/components/dashboard/sidebar/ProfileMenuButton";
import PackagesModal from "@/app/components/dashboard/sidebar/PackagesModal";
import { Link as I18nLink, usePathname } from "@/i18n/navigation";

// ✅ Now AI Chat is a normal route link (no floating chat action)
const navItems = [
  { href: "/dashboard", labelKey: "overview", icon: Home },
  { href: "/dashboard/upload", labelKey: "upload", icon: UploadCloud },
  { href: "/dashboard/ai-chat", labelKey: "aiChat", icon: MessageCircle },
  { href: "/dashboard/talking-head", labelKey: "talkingHead", icon: Video },
];

export default function DashboardSidebar({
  expanded,
  setExpanded,
  onOpenCookiePreferences,
}: {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  onOpenCookiePreferences?: () => void;
}) {
  const t = useTranslations("dashboardNav");
  const pathname = usePathname();
  const [packagesOpen, setPackagesOpen] = useState(false);
  const packagesIconSize = 22;

  useEffect(() => {
    const onOpenPackages = () => setPackagesOpen(true);
    window.addEventListener("dashboard:open-packages", onOpenPackages);
    return () => window.removeEventListener("dashboard:open-packages", onOpenPackages);
  }, []);

  // Helper: exact match for root (/dashboard), prefix match for subpages
  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`
        hg-surface rounded-2xl flex flex-col justify-between items-center overflow-visible
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
      {/* Top Section */}
      <div className="flex flex-col items-center gap-2 pt-1">
        {/* Toggle: PanelRightOpen icon */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-[#50C0F0] transition cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
          }}
        >
          <PanelRight
            size={22}
            className={`${expanded ? "" : "rotate-180 transition-transform duration-300"}`}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2 px-1 pt-1">
          <I18nLink href="/dashboard" className="flex flex-col items-center group transition">
            <Image
              src="/echofy-removebg-preview.png"
              alt="Platform Logo"
              width={56}
              height={56}
              className="rounded-full object-cover border border-[var(--hg-border)] group-hover:scale-105 transition"
            />
          </I18nLink>
        </div>

        <div className="mt-2 h-px w-full bg-[var(--hg-border)]" />

        {/* Nav Items */}
        <ul className="flex flex-col items-center gap-2 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href || undefined);
            const label = t(item.labelKey);

            const base =
              "group relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer font-medium text-base transition-colors duration-150 w-full bg-transparent";
            const labelCls = active ? "text-[#50C0F0]" : "text-slate-300 group-hover:text-[#50C0F0]";
            const iconCls = active ? "text-[#50C0F0]" : "text-slate-400 group-hover:text-[#50C0F0]";

            return (
              <li key={item.labelKey} className="relative group w-full">
                {active ? (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#50C0F0]" />
                ) : null}
                {item.href ? (
                  <I18nLink href={item.href}>
                    <span className={base}>
                      <Icon size={22} className={iconCls} />
                      {expanded && (
                        <span className={`whitespace-nowrap ${labelCls}`}>{label}</span>
                      )}
                    </span>
                  </I18nLink>
                ) : (
                  <span className={base}>
                    <Icon size={22} className={iconCls} />
                    {expanded && <span className={`whitespace-nowrap ${labelCls}`}>{label}</span>}
                  </span>
                )}

                {!expanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-[var(--hg-surface-2)] border border-[var(--hg-border)] text-white px-3 py-1 rounded shadow-lg text-xs font-semibold z-50 transition whitespace-nowrap">
                    {label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex w-full flex-col items-center gap-2 px-1 pb-1">
        <button
          type="button"
          onClick={() => setPackagesOpen(true)}
          className="group relative flex w-full items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-left font-medium text-base transition-colors duration-150"
          title="Packages"
        >
          {packagesOpen ? (
            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#50C0F0]" />
          ) : null}
          <GemIcon
            size={packagesIconSize}
            className={`${
              packagesOpen
                ? "text-[#50C0F0] block shrink-0"
                : "text-slate-400 group-hover:text-[#50C0F0] block shrink-0"
            }`}
          />
          {expanded ? (
            <span className={packagesOpen ? "text-[#50C0F0]" : "text-slate-300 group-hover:text-[#50C0F0]"}>
              Packages
            </span>
          ) : null}
          {!expanded ? (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-[var(--hg-surface-2)] border border-[var(--hg-border)] text-white px-3 py-1 rounded shadow-lg text-xs font-semibold z-50 transition whitespace-nowrap">
              Packages
            </div>
          ) : null}
        </button>
        <ProfileMenuButton
          expanded={expanded}
          onOpenCookiePreferences={onOpenCookiePreferences}
        />
      </div>
      <PackagesModal open={packagesOpen} onOpenChange={setPackagesOpen} />
    </nav>
  );
}
