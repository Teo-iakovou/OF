import React from "react";

export function UpgradeCta({ href = "/dashboard/billing" }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
    >
      Upgrade to continue
    </a>
  );
}