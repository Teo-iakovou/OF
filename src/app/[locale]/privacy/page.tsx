"use client";

import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <article className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">Last updated: 2026-02-26</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Information we collect</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              We collect account details you provide (such as email), service usage data, and content you upload to
              deliver analysis, reports, and generation features.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--hg-muted)]">
              <li>Account profile and authentication details.</li>
              <li>Upload metadata and generated result history.</li>
              <li>Technical logs for reliability, abuse prevention, and support.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">How we use information</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[var(--hg-muted)]">
              <li>Operate core product functionality and plan entitlements.</li>
              <li>Improve recommendations, safety checks, and performance.</li>
              <li>Provide customer support and troubleshoot issues.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Data retention and security</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              We retain data only as long as needed for product operation, legal obligations, and fraud prevention.
              We use technical and organizational controls to protect your information.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p className="text-sm text-[var(--hg-muted)]">
              You can update account details, manage cookie preferences, and contact support for data-related requests.
            </p>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}

