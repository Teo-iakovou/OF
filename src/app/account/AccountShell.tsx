"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { useUser } from "@/app/hooks/useUser";
import { logoutClient } from "@/app/utils/authClient";

const TABS = [
  { label: "Plans", href: "/account/plans" },
  { label: "Profile", href: "/account/profile" },
] as const;

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasActiveInstance } = usePlanInfo();
  const { user } = useUser({ required: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarLetter = (user?.email?.trim()?.[0] || "U").toUpperCase();
  const logoHref = hasActiveInstance ? "/dashboard" : "/account/plans";

  const pathWithoutLocale = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (["en", "el", "es", "it"].includes(parts[0])) {
      return `/${parts.slice(1).join("/")}`;
    }
    return pathname;
  })();

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutClient();
      window.location.replace("/login");
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--hg-bg)] text-white">
      {/* Top bar */}
      <header className="shrink-0 border-b border-[var(--hg-border)] bg-[var(--hg-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2.5 group">
            <Image
              src="/echofy-removebg-preview.png"
              alt="Logo"
              width={34}
              height={34}
              className="rounded-full border border-[var(--hg-border)] object-cover group-hover:scale-105 transition"
            />
            <span className="text-sm font-semibold tracking-tight text-white/80 group-hover:text-white transition hidden sm:block">
              Echofy
            </span>
          </Link>

          {/* Avatar dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 text-sm transition hover:border-[var(--hg-border)] hover:bg-white/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hg-border)] bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-semibold text-white/80">
                {avatarLetter}
              </span>
              <span className="hidden text-slate-400 sm:block">{user?.email?.split("@")[0] ?? "Account"}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-1.5 min-w-[200px] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1.5 shadow-[0_12px_26px_rgba(0,0,0,0.26)]"
              >
                <Link
                  href="/account/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Account
                </Link>
                {hasActiveInstance ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    Dashboard
                  </Link>
                ) : null}
                <div className="my-1 h-px bg-white/8" />
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <nav className="flex gap-1 pb-px">
            {TABS.map((tab) => {
              const active = pathWithoutLocale.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                  {active ? (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#50C0F0]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
        {children}
      </div>
    </div>
  );
}
