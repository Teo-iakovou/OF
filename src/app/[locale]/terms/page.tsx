"use client";

import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <article className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">Last updated: 2026-02-26</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Using the service</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              By using the platform, you agree to use it lawfully and in a way that does not disrupt availability,
              security, or other users.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Accounts and access</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--hg-muted)]">
              <li>You are responsible for safeguarding your login credentials.</li>
              <li>Plan access, quotas, and features are controlled by your active subscription.</li>
              <li>We may suspend access in cases of misuse or policy violations.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Billing basics</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              Paid plans and add-ons are billed according to the checkout terms shown at purchase time. Renewal,
              cancellation, and billing updates are managed through your account.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Content and acceptable use</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              You are responsible for the content you upload and publish. Do not upload content you do not have rights
              to use, or content that violates law or platform policies.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Disclaimers</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              The service is provided on an as-available basis. To the maximum extent permitted by law, liability is
              limited for indirect or consequential damages.
            </p>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}

