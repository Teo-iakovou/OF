"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchActivePackageInstances,
  selectPackageInstance,
  type PackageInstanceSummary,
} from "@/app/utils/api";

type SelectActiveInstanceProps = {
  onSelected?: () => void | Promise<void>;
};

const formatPlanLabel = (value: string | null) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function SelectActiveInstance({ onSelected }: SelectActiveInstanceProps) {
  const [instances, setInstances] = useState<PackageInstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileLabelById = useMemo(() => {
    const grouped = new Map<string, PackageInstanceSummary[]>();
    instances.forEach((instance) => {
      const key = instance.planKey || "unknown";
      const list = grouped.get(key) || [];
      list.push(instance);
      grouped.set(key, list);
    });

    const labelMap = new Map<string, string | null>();
    grouped.forEach((list) => {
      const showProfiles = list.length > 1;
      list.forEach((instance, index) => {
        labelMap.set(
          instance.id,
          showProfiles ? `Profile ${String.fromCharCode(65 + index)}` : null
        );
      });
    });
    return labelMap;
  }, [instances]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchActivePackageInstances()
      .then((list) => {
        if (!cancelled) setInstances(list);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load packages";
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = async (instanceId: string) => {
    if (isSelecting) return;
    setIsSelecting(true);
    setSelectingId(instanceId);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        (window as unknown as { __AI_SELECTING_INSTANCE__?: string }).__AI_SELECTING_INSTANCE__ =
          "1";
      }
      await selectPackageInstance(instanceId);
      await onSelected?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to select package";
      setError(message);
    } finally {
      if (typeof window !== "undefined") {
        (window as unknown as { __AI_SELECTING_INSTANCE__?: string }).__AI_SELECTING_INSTANCE__ =
          "";
      }
      setSelectingId(null);
      setIsSelecting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-white">Select an active package</h3>
        <p className="text-sm text-gray-400">
          Choose which package instance to use for quotas and history.
        </p>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-gray-400">Loading packages…</p>
      ) : instances.length === 0 ? (
        <p className="text-sm text-gray-400">No active package instances found.</p>
      ) : (
        <div className="space-y-2">
          {instances.map((instance) => {
            const profileLabel = profileLabelById.get(instance.id) || null;
            const planLabel = formatPlanLabel(instance.planKey || null);
            const headerLabel = profileLabel ? `${planLabel} — ${profileLabel}` : planLabel;
            return (
            <button
              key={instance.id}
              type="button"
              onClick={() => handleSelect(instance.id)}
              disabled={isSelecting || selectingId === instance.id}
              className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-white/20 disabled:opacity-60"
            >
              <div className="text-sm text-gray-200 uppercase tracking-wide">
                {headerLabel}
              </div>
            </button>
          );
          })}
        </div>
      )}
    </section>
  );
}
