"use client";

import type { ResultDoc } from "@/app/types/analysis";
import CinematicResults from "@/app/components/upload/CinematicResults";

type UploadResultsShellProps = {
  result: ResultDoc | null;
  requestId?: string | null;
  onViewHistoryHref: string;
};

export default function UploadResultsShell({
  result,
  requestId,
  onViewHistoryHref,
}: UploadResultsShellProps) {
  if (!result) {
    return (
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-500">Report</p>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">Your report will appear here</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload an image to generate recommendations.
        </p>
      </section>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Report</h2>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("upload-panel");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="text-xs text-cyan-200 underline underline-offset-2"
        >
          Upload another
        </button>
      </div>
      <CinematicResults
        result={result}
        requestId={requestId || undefined}
        onViewHistoryHref={onViewHistoryHref}
      />
    </div>
  );
}
