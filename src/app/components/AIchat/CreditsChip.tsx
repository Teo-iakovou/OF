import React from "react";

export function CreditsChip({ used, limit }: { used: number; limit: number }) {
  return (
    <span
      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
      title="Monthly chat credits"
    >
      Chat: {used}/{limit}
    </span>
  );
}