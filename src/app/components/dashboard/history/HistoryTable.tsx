"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/app/components/common/ConfirmModal";
import type { ResultDoc } from "@/app/types/analysis";
import { getUserResultImageUrl } from "@/app/utils/api";

type Props = {
  history: ResultDoc[];
  onDeleteClick: (id: string) => void;
  onOpenClick: (id: string) => void;
};

const extractThumbnailUrl = (item: ResultDoc) => {
  const meta = (item as unknown as { meta?: Record<string, unknown> }).meta;
  if (!meta || typeof meta !== "object") return null;
  const candidates = [
    meta.imageUrl,
    meta.assetUrl,
    meta.thumbnailUrl,
    (meta.upload as { url?: unknown } | undefined)?.url,
    (meta.image as { url?: unknown } | undefined)?.url,
    (meta.r2 as { publicUrl?: unknown } | undefined)?.publicUrl,
    meta.r2Url,
    meta.fileUrl,
  ];
  const found = candidates.find(
    (value) => typeof value === "string" && value.startsWith("http")
  );
  return typeof found === "string" ? found : null;
};

const extractImageKey = (item: ResultDoc) => {
  const meta = (item as unknown as { meta?: Record<string, unknown> }).meta;
  if (!meta || typeof meta !== "object") return null;
  const value = meta.imageKey;
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const HistoryTable = ({ history, onDeleteClick, onOpenClick }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});
  const [resolvedThumbs, setResolvedThumbs] = useState<Record<string, string>>({});
  const [failedResolve, setFailedResolve] = useState<Record<string, boolean>>({});

  const openConfirmModal = (id: string) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    onDeleteClick(pendingDeleteId);
    setModalOpen(false);
    setPendingDeleteId(null);
  };

  useEffect(() => {
    const pending = history.filter((item) => {
      if (extractThumbnailUrl(item)) return false;
      const imageKey = extractImageKey(item);
      if (!imageKey) return false;
      if (resolvedThumbs[item._id]) return false;
      if (failedResolve[item._id]) return false;
      return true;
    });
    if (pending.length === 0) return;

    let cancelled = false;
    Promise.all(
      pending.map(async (item) => {
        try {
          const payload = await getUserResultImageUrl({ id: item._id });
          return { id: item._id, url: payload.url, failed: false };
        } catch {
          return { id: item._id, url: null as string | null, failed: true };
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const nextResolved: Record<string, string> = {};
      const nextFailed: Record<string, boolean> = {};
      for (const result of results) {
        if (result.url) nextResolved[result.id] = result.url;
        if (result.failed && !result.url) nextFailed[result.id] = true;
      }
      if (Object.keys(nextResolved).length > 0) {
        setResolvedThumbs((prev) => ({ ...prev, ...nextResolved }));
      }
      if (Object.keys(nextFailed).length > 0) {
        setFailedResolve((prev) => ({ ...prev, ...nextFailed }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [history, resolvedThumbs, failedResolve]);

  return (
    <>
      <div className="overflow-x-auto rounded-2xl hg-surface">
        <table className="min-w-[420px] w-full text-left">
          <thead className="border-b border-[var(--hg-border-2)] bg-[var(--hg-surface-2)]">
            <tr className="text-xs uppercase tracking-wide hg-muted-2">
              <th className="px-5 py-3 font-medium">Preview</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const thumbnailUrl = extractThumbnailUrl(item) || resolvedThumbs[item._id] || null;
              const created = item.createdAt
                ? new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                    .format(new Date(item.createdAt))
                    .replace(",", " •")
                : "—";

              return (
                <tr
                  key={item._id}
                  onClick={() => onOpenClick(item._id)}
                  className="border-b border-[var(--hg-border-2)] hover:bg-[var(--hg-surface-2)] cursor-pointer transition"
                >
                  <td className="px-5 py-4">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md border border-[var(--hg-border)] bg-[var(--hg-surface-2)]">
                      {thumbnailUrl && !failedThumbs[item._id] ? (
                        <img
                          src={thumbnailUrl}
                          alt="preview"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedThumbs((prev) => ({
                              ...prev,
                              [item._id]: true,
                            }))
                          }
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center hg-muted-2 text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm hg-muted">{created}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          openConfirmModal(item._id);
                        }}
                        className="rounded-lg border border-rose-400/30 hg-surface-soft px-2.5 py-1.5 text-xs font-medium text-rose-200 hover:bg-[var(--hg-surface-2)]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
        onCancel={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default HistoryTable;
