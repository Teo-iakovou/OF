"use client";
import { useConsent } from "./ConsentContext";
import { useEffect, useState } from "react";

export default function ConsentModal() {
  const { isOpen, close, save } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // reset toggles when opened
    setAnalytics(false);
    setMarketing(false);
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#232B36] bg-[#0f1520] p-5 text-gray-100 shadow-2xl">
        <div className="text-lg font-semibold">Cookie Preferences</div>
        <div className="mt-1 text-sm text-gray-300">Adjust what we can use. Necessary cookies are always on.</div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#121A24] opacity-70">
            <div>
              <div className="font-medium">Strictly necessary</div>
              <div className="text-xs text-gray-400">Required for basic site functions.</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1b2431] border border-[#2a3443]">On</span>
          </div>

          <label className="flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#0f1623]">
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-xs text-gray-400">Helps us understand usage.</div>
            </div>
            <input type="checkbox" className="h-5 w-5" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>

          <label className="flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#0f1623]">
            <div>
              <div className="font-medium">Marketing</div>
              <div className="text-xs text-gray-400">Personalized ads & pixels.</div>
            </div>
            <input type="checkbox" className="h-5 w-5" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-[#2a3443] bg-transparent hover:bg-[#141b26]" onClick={close}>Cancel</button>
          <button
            className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-semibold shadow hover:brightness-110"
            onClick={() => save({ analytics, marketing })}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

