import { ImagePlus, Video, MessageSquare, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type AddonState = "default" | "bestValue" | "included" | "busy";

type AddonDef = {
  label: string;
  category: string;
  Icon: React.ComponentType<{ className?: string }>;
  state: AddonState;
};

const ADDONS: AddonDef[] = [
  { label: "5 Uploads",        category: "Uploads",      Icon: ImagePlus,    state: "default"   },
  { label: "20 Uploads",       category: "Uploads",      Icon: ImagePlus,    state: "bestValue" },
  { label: "100k Chat Tokens", category: "Chat",         Icon: MessageSquare, state: "included" },
  { label: "5 Videos",         category: "Videos",       Icon: Video,        state: "default"   },
  { label: "15 Videos",        category: "Videos",       Icon: Video,        state: "busy"      },
  { label: "30 Videos",        category: "Videos",       Icon: Video,        state: "bestValue" },
];

function AddonCard({ addon }: { addon: AddonDef }) {
  const { label, category, Icon, state } = addon;
  const isBestValue = state === "bestValue";
  const isIncluded  = state === "included";
  const isBusy      = state === "busy";

  return (
    <div
      className={[
        "relative flex flex-col gap-3 rounded-2xl border p-4 transition-all",
        isBestValue
          ? "border-[rgba(80,192,240,0.40)] bg-[rgba(80,192,240,0.05)] shadow-[0_0_24px_rgba(80,192,240,0.08)]"
          : "border-[var(--hg-border)] bg-[var(--hg-surface-2)]",
        isIncluded ? "opacity-55" : "",
      ].join(" ")}
    >
      {isBestValue && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--hg-accent-soft)] px-2 py-0.5">
          <Sparkles className="h-2.5 w-2.5 text-[var(--hg-accent)]" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--hg-accent)]">
            Best value
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className={[
            "rounded-xl p-2",
            isBestValue ? "bg-[var(--hg-accent-soft)]" : "bg-white/5",
          ].join(" ")}
        >
          <Icon
            className={[
              "h-4 w-4",
              isBestValue ? "text-[var(--hg-accent)]" : "text-[var(--hg-muted)]",
            ].join(" ")}
          />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--hg-muted-2)]">{category}</p>
      </div>

      <p
        className={[
          "text-sm font-semibold leading-tight",
          isBestValue ? "text-white" : "text-[var(--hg-text)]",
        ].join(" ")}
      >
        {label}
      </p>

      <div className="mt-auto">
        {isIncluded ? (
          <div className="flex items-center gap-1.5 text-xs text-[var(--hg-muted)]">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            Included
          </div>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            className={[
              "w-full rounded-xl py-2 text-xs font-semibold transition-all",
              isBestValue
                ? "bg-[var(--hg-accent)] text-[#07141d] hover:opacity-90"
                : "border border-[var(--hg-border)] bg-white/5 text-white hover:border-white/30 hover:bg-white/8",
              isBusy ? "cursor-not-allowed opacity-75" : "",
            ].join(" ")}
          >
            {isBusy ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Redirecting…
              </span>
            ) : (
              "Buy"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VariantAPage() {
  return (
    <div className="min-h-screen bg-[var(--hg-bg)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Page label */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">
            Design Mockup
          </p>
          <h1 className="text-2xl font-semibold text-white">Variant A — Icon-Led Card Grid</h1>
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ADDONS.map((addon) => (
                <AddonCard key={addon.label} addon={addon} />
              ))}
            </div>
          </div>
        </section>

        {/* Design rationale */}
        <section className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-4">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--hg-muted-2)]">
            Design rationale
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--hg-muted)]">
            <li>• Card grid replaces the pill row — each tile gets visual weight and breathing room</li>
            <li>• Category icon + label on every tile gives immediate context without requiring mental grouping</li>
            <li>• Best value tile uses a cyan border glow + filled CTA button to pull the eye without screaming</li>
            <li>• Included tiles use opacity-55 + a checkmark row — still scannable, clearly non-purchasable</li>
            <li>• 2-col mobile / 3-col desktop grid holds all 6 tiles above the fold on most screen sizes</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
