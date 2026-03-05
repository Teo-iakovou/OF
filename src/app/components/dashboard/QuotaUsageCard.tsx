"use client";

type QuotaUsageCardProps = {
  uploadsUsed?: number | null;
  uploadLimit?: number | null;
  chatUsed?: number | null;
  chatLimit?: number | null;
  videoUsed?: number | null;
  videoLimit?: number | null;
};

type QuotaRowProps = {
  label: string;
  used?: number | null;
  limit?: number | null;
  hideBar?: boolean;
};

const isUnlimited = (limit?: number | null) => limit === 0;

const formatQuota = (used?: number | null, limit?: number | null) => {
  if (isUnlimited(limit)) return "Unlimited";
  if (typeof used !== "number" || typeof limit !== "number") return "—";
  return `${used} / ${limit}`;
};

const percentUsed = (used?: number | null, limit?: number | null) => {
  if (typeof used !== "number" || typeof limit !== "number" || limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
};

const isLowRemaining = (used?: number | null, limit?: number | null) => {
  if (typeof used !== "number" || typeof limit !== "number" || limit <= 0) return false;
  return used / limit >= 0.8;
};

const QuotaRow = ({ label, used, limit, hideBar = false }: QuotaRowProps) => {
  const pct = percentUsed(used, limit);
  const low = isLowRemaining(used, limit);
  const barColor = low ? "bg-amber-400" : "bg-[var(--hg-accent)]";
  const textColor = low ? "text-amber-200" : "text-[var(--hg-text)]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--hg-text)]">{label}</span>
        <span className={`font-medium ${textColor}`}>{formatQuota(used, limit)}</span>
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
  chatUsed,
  chatLimit,
  videoUsed,
  videoLimit,
}: QuotaUsageCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide hg-muted">Quota usage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Usage overview</h3>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <QuotaRow label="Uploads" used={uploadsUsed} limit={uploadLimit} />
        <QuotaRow
          label="AI Chat"
          used={chatUsed}
          limit={chatLimit}
          hideBar={chatLimit === 0}
        />
        <QuotaRow label="Videos" used={videoUsed} limit={videoLimit} />
      </div>
    </div>
  );
}
