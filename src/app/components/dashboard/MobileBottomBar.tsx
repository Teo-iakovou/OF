"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Home, UploadCloud, Video, LayoutGrid, Clock, CreditCard, Settings, Gem } from "lucide-react";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: Home,        href: "/dashboard",              exact: true  },
  { key: "upload",   label: "Upload",   icon: UploadCloud, href: "/dashboard/upload",       exact: false },
  { key: "avatar",   label: "AI Video", icon: Video,       href: "/dashboard/talking-head", exact: false },
];

const MORE_ROUTES = ["/dashboard/history", "/dashboard/billing"];

type Props = {
  onOpenSettings: () => void;
  onOpenPackages: () => void;
};

export default function MobileBottomBar({ onOpenSettings, onOpenPackages }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    return exact ? pathname === href : pathname.startsWith(href);
  };

  const moreIsActive = moreOpen || MORE_ROUTES.some((r) => pathname?.startsWith(r));

  // Close sheet on navigation
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Backdrop */}
      {moreOpen ? (
        <div
          aria-hidden
          className="fixed inset-0 z-[38] bg-black/20"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}

      {/* More bottom sheet */}
      <div
        className={`fixed left-0 right-0 bottom-16 z-[39] rounded-t-2xl border-t border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-xl transition-transform duration-200 ease-out md:hidden ${
          moreOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="px-4 pt-4 pb-4">
          <div className="grid grid-cols-2 gap-3">

            {/* History */}
            <button
              type="button"
              onClick={() => { setMoreOpen(false); router.push("/dashboard/history"); }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 text-sm font-medium transition ${
                pathname?.startsWith("/dashboard/history")
                  ? "bg-[#50C0F0]/10 text-[#50C0F0]"
                  : "bg-[var(--hg-surface-2)] text-[var(--hg-muted)] hover:text-white"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>History</span>
            </button>

            {/* Billing */}
            <button
              type="button"
              onClick={() => { setMoreOpen(false); router.push("/dashboard/billing"); }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 text-sm font-medium transition ${
                pathname?.startsWith("/dashboard/billing")
                  ? "bg-[#50C0F0]/10 text-[#50C0F0]"
                  : "bg-[var(--hg-surface-2)] text-[var(--hg-muted)] hover:text-white"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Billing</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => { setMoreOpen(false); onOpenSettings(); }}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[var(--hg-surface-2)] py-4 text-sm font-medium text-[var(--hg-muted)] transition hover:text-white"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>

            {/* Packages */}
            <button
              type="button"
              onClick={() => { setMoreOpen(false); onOpenPackages(); }}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[var(--hg-surface-2)] py-4 text-sm font-medium text-[var(--hg-muted)] transition hover:text-white"
            >
              <Gem className="w-5 h-5" />
              <span>Get Credits</span>
            </button>

          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <nav
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[var(--hg-surface)] border-t border-[var(--hg-border)] items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ key, label, icon: Icon, href, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={key}
              href={href as Parameters<typeof Link>[0]["href"]}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                active
                  ? "text-[#63c9f5]"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}

        {/* More tab */}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            moreIsActive
              ? "text-[#63c9f5]"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-200"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </nav>
    </>
  );
}
