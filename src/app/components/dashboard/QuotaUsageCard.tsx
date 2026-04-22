"use client";

type QuotaUsageCardProps = {
  uploadsUsed?: number | null;
  uploadLimit?: number | null;
  uploadsUnlimited?: boolean;
  chatUsed?: number | null;
  chatLimit?: number | null;
  chatUnlimited?: boolean;
  videoUsed?: number | null;
  videoLimit?: number | null;
  videoUnlimited?: boolean;
};

type QuotaRowProps = {
  label: string;
  used?: number | null;
  limit?: number | null;
  unlimited?: boolean;
  hideBar?: boolean;
};

const isUnlimited = (limit?: number | null, unlimited?: boolean) =>
  typeof unlimited === "boolean" ? unlimited : limit === 0;

const formatCompact = (value: number) => {
  if (value < 1000) return String(Math.round(value));
  if (value < 1_000_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
};

const formatQuota = (used?: number | null, limit?: number | null, unlimited?: boolean) => {
  if (isUnlimited(limit, unlimited)) return "Unlimited";
  if (typeof limit !== "number") return "—";
  const safeUsed = typeof used === "number" ? Math.max(0, used) : 0;
  return `${formatCompact(safeUsed)} / ${formatCompact(limit)}`;
};

const percentUsed = (used?: number | null, limit?: number | null, unlimited?: boolean) => {
  if (isUnlimited(limit, unlimited)) return 0;
  if (typeof limit !== "number" || limit <= 0) return 0;
  const safeUsed = typeof used === "number" ? Math.max(0, used) : 0;
  return Math.min(100, Math.round((safeUsed / limit) * 100));
};

const isLowRemaining = (used?: number | null, limit?: number | null, unlimited?: boolean) => {
  if (isUnlimited(limit, unlimited)) return false;
  if (typeof limit !== "number" || limit <= 0) return false;
  const safeUsed = typeof used === "number" ? Math.max(0, used) : 0;
  return safeUsed / limit >= 0.8;
};

const QuotaRow = ({ label, used, limit, unlimited, hideBar = false }: QuotaRowProps) => {
  const pct = percentUsed(used, limit, unlimited);
  const low = isLowRemaining(used, limit, unlimited);
  const barColor = low ? "bg-amber-400" : "bg-[var(--hg-accent)]";
  const textColor = low ? "text-amber-200" : "text-[var(--hg-text)]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--hg-text)]">{label}</span>
        <span className={`font-medium ${textColor}`}>{formatQuota(used, limit, unlimited)}</span>
      </div>
      {hideBar ? null : (
        <div className="h-2 rounded-full bg-white/10">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
};

export default function QuotaUsageCard({
  uploadsUsed,
  uploadLimit,
  uploadsUnlimited,
  chatUsed,
  chatLimit,
  chatUnlimited,
  videoUsed,
  videoLimit,
  videoUnlimited,
}: QuotaUsageCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide hg-muted">Quota usage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Usage overview</h3>
          <p className="mt-1 text-xs text-[var(--hg-muted)]">
            AI Tokens are monthly package usage. Context Tokens are tracked per conversation in AI
            Chat.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <QuotaRow label="Uploads" used={uploadsUsed} limit={uploadLimit} unlimited={uploadsUnlimited} />
        <QuotaRow
          label="AI Tokens"
          used={chatUsed}
          limit={chatLimit}
          unlimited={chatUnlimited}
          hideBar={chatUnlimited}
        />
        <QuotaRow label="Videos" used={videoUsed} limit={videoLimit} unlimited={videoUnlimited} />
      </div>
    </div>
  );
}
