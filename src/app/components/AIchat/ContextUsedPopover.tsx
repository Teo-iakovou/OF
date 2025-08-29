"use client";
import { useEffect, useState } from "react";
import { getAnalysisById } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

type Item = {
  _id: string;
  niche?: string;
  csl?: number;
  createdAt?: string;
};

export function ContextUsedPopover({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!open || !ids?.length) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async (id): Promise<ResultDoc | null> => {
            try {
              const doc = await getAnalysisById(id);
              return doc as ResultDoc;
            } catch {
              return null;
            }
          })
        );

        if (!ignore) {
          const mapped: Item[] = results
            .filter((r): r is ResultDoc => r !== null)
            .map((r) => ({
              _id: r._id,
              niche: r.niche,
              csl: r.csl,
              createdAt: r.createdAt,
            }));
          setItems(mapped);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [open, ids]);

  const count = ids?.length ?? 0;
  if (!count) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        Context used • {count}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg p-3">
          <div className="text-xs text-gray-500 mb-2">Recent uploads referenced</div>

          {loading ? (
            <div className="text-xs text-gray-500">Loading…</div>
          ) : items.length ? (
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it._id} className="text-xs flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="font-medium text-gray-800 truncate">{it.niche || "general"}</div>
                    <div className="text-gray-500">
                      {it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <span
                    className="shrink-0 inline-flex items-center justify-center px-2 h-5 rounded-full text-[10px]
                    border border-gray-300 text-gray-700"
                    title="Content Safety Level (0–3)"
                  >
                    CSL {it.csl ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-gray-500">No details available.</div>
          )}
        </div>
      )}
    </div>
  );
}