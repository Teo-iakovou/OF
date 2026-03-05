"use client";

import { Link } from "@/i18n/navigation";
import { useConsent } from "@/app/components/consent/ConsentContext";

export default function LandingFooter() {
  const { open } = useConsent();

  return (
    <footer className="border-t border-[var(--hg-border)] bg-[var(--hg-surface)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="space-y-3 md:col-span-1">
          <h3 className="text-base font-semibold text-[var(--hg-text)]">Echofy AI</h3>
          <p className="text-sm text-[var(--hg-muted)]">
            AI content platform for creators: strategy, captions, reports, chat, and talking-head generation.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Product</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--hg-text)]">
            <a href="#features" className="hover:text-[var(--hg-accent)]">Features</a>
            <a href="#pricing" className="hover:text-[var(--hg-accent)]">Pricing</a>
            <a href="#faq" className="hover:text-[var(--hg-accent)]">FAQ</a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--hg-text)]">
            <a href="#" className="hover:text-[var(--hg-accent)]">Help Center</a>
            <a href="#" className="hover:text-[var(--hg-accent)]">Contact</a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wide text-[var(--hg-muted)]">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--hg-text)]">
            <Link href="/privacy" className="hover:text-[var(--hg-accent)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--hg-accent)]">Terms</Link>
            <Link href="/cookies" className="hover:text-[var(--hg-accent)]">Cookie Policy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--hg-border)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-[var(--hg-muted)] md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Echofy AI. All rights reserved.</p>
          <button
            type="button"
            onClick={open}
            className="text-left text-[var(--hg-text)] underline underline-offset-4 hover:text-[var(--hg-accent)] md:text-right"
          >
            Cookie preferences
          </button>
        </div>
      </div>
    </footer>
  );
}
