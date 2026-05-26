import { ImagePlus, Video, MessageSquare, CheckCircle2, Loader2, ChevronRight } from "lucide-react";

type AddonState = "default" | "bestValue" | "included" | "busy";

type AddonRow = {
  qty: string;
  label: string;
  state: AddonState;
};

type Category = {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  addons: AddonRow[];
};

const CATEGORIES: Category[] = [
  {
    name: "Uploads",
    Icon: ImagePlus,
    accentClass: "text-violet-400",
    addons: [
      { qty: "5",   label: "Upload credits", state: "default"   },
      { qty: "20",  label: "Upload credits", state: "bestValue" },
    ],
  },
  {
    name: "Chat Tokens",
    Icon: MessageSquare,
    accentClass: "text-[var(--hg-accent)]",
    addons: [
      { qty: "100k", label: "Chat tokens", state: "included" },
    ],
  },
  {
    name: "Videos",
    Icon: Video,
    accentClass: "text-emerald-400",
    addons: [
      { qty: "5",  label: "Avatar videos", state: "default"   },
      { qty: "15", label: "Avatar videos", state: "busy"      },
      { qty: "30", label: "Avatar videos", state: "bestValue" },
    ],
  },
];

function AddonListRow({ addon }: { addon: AddonRow }) {
  const { qty, label, state } = addon;
  const isBestValue = state === "bestValue";
  const isIncluded  = state === "included";
  const isBusy      = state === "busy";

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl py-2.5 pr-3 transition-all",
        isBestValue
          ? "border-l-2 border-[var(--hg-accent)] bg-[rgba(80,192,240,0.06)] pl-3"
          : "border-l-2 border-transparent pl-3 hover:bg-white/[0.03]",
        isIncluded ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Quantity hero */}
      <div className="w-14 flex-shrink-0 text-right">
        <span
          className={[
            "text-xl font-bold tabular-nums leading-none",
            isBestValue ? "text-[var(--hg-accent)]" : "text-white",
          ].join(" ")}
        >
          +{qty}
        </span>
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--hg-text)]">{label}</p>
      </div>

      {/* State badge */}
      <div className="flex-shrink-0">
        {isBestValue && (
          <span className="rounded-full bg-[var(--hg-accent-soft)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--hg-accent)]">
            Best value
          </span>
        )}
        {isIncluded && (
          <span className="flex items-center gap-1 text-xs text-[var(--hg-muted)]">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            Included
          </span>
        )}
      </div>

      {/* CTA */}
      {!isIncluded && (
        <div className="flex-shrink-0">
          <button
            type="button"
            disabled={isBusy}
            className={[
              "flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
              isBestValue
                ? "border-[rgba(80,192,240,0.40)] bg-[var(--hg-accent-soft)] text-[var(--hg-accent)] hover:bg-[rgba(80,192,240,0.24)]"
                : "border-[var(--hg-border)] bg-white/5 text-white hover:border-white/30 hover:bg-white/8",
              isBusy ? "cursor-not-allowed opacity-75" : "",
            ].join(" ")}
          >
            {isBusy ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                Buy
                <ChevronRight className="h-3 w-3 opacity-50" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function VariantBPage() {
  return (
    <div className="min-h-screen bg-[var(--hg-bg)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Page label */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">
            Design Mockup
          </p>
          <h1 className="text-2xl font-semibold text-white">Variant B — Quantity-Hero Category Rows</h1>
        </div>

        {/* Plan card shell (context) */}
        <section className="space-y-5 rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5">
          {/* Simulated plan header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">Pro Plan</p>
              <h2 className="text-lg font-semibold text-white">Active</h2>
              <p className="text-xs text-[var(--hg-muted-2)]">Created Jun 1, 2025</p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Selected
            </span>
          </div>

          {/* Add-ons section */}
          <div className="border-t border-[var(--hg-border)] pt-5">
            <p className="mb-4 text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">
              Buy Add-ons
            </p>

            <div className="space-y-5">
              {CATEGORIES.map((cat, catIdx) => {
                const { Icon, accentClass } = cat;
                return (
                  <div key={cat.name}>
                    {/* Category header */}
                    <div className="mb-1.5 flex items-center gap-2 px-3">
                      <Icon className={`h-3.5 w-3.5 ${accentClass}`} />
                      <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">
                        {cat.name}
                      </p>
                    </div>

                    {/* Rows */}
                    <div className="space-y-0.5">
                      {cat.addons.map((addon) => (
                        <AddonListRow key={`${addon.qty}-${addon.label}`} addon={addon} />
                      ))}
                    </div>

                    {catIdx < CATEGORIES.length - 1 && (
                      <div className="mt-5 border-t border-[var(--hg-border-2)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Design rationale */}
        <section className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--hg-muted-2)]">
            Design rationale
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--hg-muted)]">
            <li>• Quantity is the hero — "+5", "+20", "+100k" communicate value instantly without prices</li>
            <li>• Category groupings let users scan within a type (uploads vs. videos vs. chat) before choosing quantity</li>
            <li>• Left accent bar on best-value rows draws the eye through contrast, not color saturation</li>
            <li>• Compact rows fit all 6 options simultaneously even at 360px — no scrolling required</li>
            <li>• Category accent colors (violet / cyan / emerald) reinforce grouping without relying on icons alone</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
