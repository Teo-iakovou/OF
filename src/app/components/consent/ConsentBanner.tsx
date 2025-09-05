"use client";
import { useConsent } from "./ConsentContext";

export default function ConsentBanner() {
  const { isOpen, save, open } = useConsent();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] px-4 pb-4">
      <div className="max-w-4xl mx-auto rounded-2xl border border-[#232B36] bg-[#0f1520] p-4 text-gray-200 shadow-2xl">
        <div className="text-sm">
          We use cookies to provide essential site functionality and to improve your experience. You can accept all, reject non‑essential, or manage preferences.
        </div>
        <div className="mt-3 flex flex-wrap gap-2 justify-end">
          <button
            className="px-3 py-1.5 rounded-lg border border-[#2a3443] bg-transparent hover:bg-[#141b26]"
            onClick={() => save({ analytics: false, marketing: false })}
          >
            Reject all
          </button>
          <button
            className="px-3 py-1.5 rounded-lg border border-[#2a3443] bg-[#141b26] hover:bg-[#182030]"
            onClick={() => open()}
          >
            Manage
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-semibold shadow hover:brightness-110"
            onClick={() => save({ analytics: true, marketing: true })}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

