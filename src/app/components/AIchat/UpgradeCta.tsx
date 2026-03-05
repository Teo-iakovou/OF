import React from "react";

import { PACKAGES_URL } from "@/app/utils/urls";

export function UpgradeCta({ href = PACKAGES_URL }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
    >
      Upgrade to continue
    </a>
  );
}
