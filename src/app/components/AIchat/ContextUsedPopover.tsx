"use client";
import { useRef, useState } from "react";
import { getUserResultById } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

type RichItem = {
  _id: string;
  platform?: string;
  niche?: string;
  caption?: string;
  daysAgo?: number;
  warmth?: "warm" | "neutral" | "cool";
};

function moodDotClass(warmth?: "warm" | "neutral" | "cool") {
  if (warmth === "warm") return "bg-amber-400";
  if (warmth === "cool") return "bg-blue-400";
  return "bg-gray-500";
}

function daysAgoLabel(daysAgo?: number) {
  if (daysAgo === undefined) return "";
  if (daysAgo === 0) return "today";
  return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
}

function toRichItem(r: ResultDoc): RichItem {
  const plat = r.promotion?.recommendedPlatforms?.[0];
  const rawCaption = plat?.caption ?? "";
  const caption = rawCaption
    ? rawCaption.slice(0, 60).replace(/\n/g, " ") + (rawCaption.length > 60 ? "…" : "")
    : undefined;
  const daysAgo = r.createdAt
    ? Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (24 * 3600e3))
    : undefined;
  return {
    _id: r._id,
    platform: plat?.platform,
    niche: r.niche,
    caption,
    daysAgo,
    warmth: r.meta?.colorMood?.warmth,
  };
}

export function ContextUsedPopover({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<(RichItem | null)[]>([]);
  const cache = useRef<Map<string, RichItem | null>>(new Map());

  const count = ids?.length ?? 0;
  if (!count) return null;

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (!next) return;

    const uncached = ids.filter((id) => !cache.current.has(id));
    if (uncached.length === 0) {
      setItems(ids.map((id) => cache.current.get(id) ?? null));
      return;
    }

    setLoading(true);
    await Promise.all(
      uncached.map(async (id) => {
        try {
          const doc = await getUserResultById({ id });
          cache.current.set(id, toRichItem(doc));
        } catch {
          cache.current.set(id, null);
        }
      })
    );
    setItems(ids.map((id) => cache.current.get(id) ?? null));
    setLoading(false);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        className="text-[11px] px-2 py-0.5 rounded border border-gray-700/60 bg-[#1a1f2b] text-gray-500 hover:text-gray-400 hover:border-gray-600 transition"
      >
        Context used · {count}
      </button>

      {open && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-80 rounded-xl border border-gray-700/60 bg-[#12151e] shadow-xl p-3">
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
            Uploads referenced by Sage
          </div>

          {loading ? (
            <ul className="space-y-2">
              {ids.map((id) => (
                <li key={id} className="animate-pulse flex flex-col gap-1.5 rounded-lg border border-gray-700/40 bg-[#1a1f2b] px-2.5 py-2">
                  <div className="h-3 w-2/5 rounded bg-gray-700/60" />
                  <div className="h-2.5 w-full rounded bg-gray-700/40" />
                  <div className="h-2 w-1/4 rounded bg-gray-700/30" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              {items.map((it, i) =>
                it === null ? (
                  <li
                    key={ids[i]}
                    className="text-[11px] text-gray-600 italic px-2.5 py-2 rounded-lg border border-gray-700/30 bg-[#1a1f2b]"
                  >
                    Upload {ids[i].slice(-6)}
                  </li>
                ) : (
                  <li
                    key={it._id}
                    className="rounded-lg border border-gray-700/40 bg-[#1a1f2b] px-2.5 py-2 flex flex-col gap-0.5"
                  >
                    <div className="text-[11px] font-semibold text-gray-300 truncate">
                      {[it.platform, it.niche].filter(Boolean).join(" · ") || "Upload"}
                    </div>
                    {it.caption && (
                      <div className="text-[11px] text-gray-500 truncate">{it.caption}</div>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${moodDotClass(it.warmth)}`}
                        title={it.warmth ?? "neutral"}
                      />
                      <span className="text-[10px] text-gray-600">{daysAgoLabel(it.daysAgo)}</span>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
