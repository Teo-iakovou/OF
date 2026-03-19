import React from "react";

import { PACKAGES_URL } from "@/app/utils/urls";

export function UpgradeCta({ href = PACKAGES_URL }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex flex-col gap-0.5 rounded-xl border border-[var(--hg-accent)]/30 bg-[var(--hg-accent)]/10 px-3 py-2 text-xs hover:bg-[var(--hg-accent)]/20 transition"
    >
      <span className="font-semibold text-[var(--hg-accent)]">
        ⚡ You&apos;ve used all your AI Chat tokens this month
      </span>
      <span className="text-[var(--hg-muted)]">
        Upgrade to Pro for 3× more tokens, priority responses, and full upload history context
      </span>
    </a>
  );
}
