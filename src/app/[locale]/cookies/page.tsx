"use client";

import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";
import { useConsent } from "@/app/components/consent/ConsentContext";

export default function CookiesPage() {
  const { open } = useConsent();

  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <article className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Cookie Policy</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">Last updated: 2026-02-26</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">How we use cookies</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              Cookies help maintain sessions, remember preferences, and improve product reliability. Some categories
              are optional and can be adjusted in preferences.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Cookie categories</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--hg-muted)]">
              <li>
                <span className="font-medium text-white">Essential:</span> Required for authentication, security, and
                core app behavior.
              </li>
              <li>
                <span className="font-medium text-white">Analytics:</span> Helps us understand product usage and
                improve experience.
              </li>
              <li>
                <span className="font-medium text-white">Marketing:</span> Used for campaign performance and relevant
                messaging where enabled.
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Managing preferences</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              You can change your consent choices at any time. Essential cookies remain enabled because they are
              required for core functionality.
            </p>
            <button
              type="button"
              onClick={open}
              className="inline-flex h-10 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm font-medium text-white hover:border-[var(--hg-accent)]/45"
            >
              Open cookie preferences
            </button>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}

