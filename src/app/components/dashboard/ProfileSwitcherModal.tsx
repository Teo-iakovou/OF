"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PackageInstanceSummary } from "@/app/utils/api";

type ProfileSwitcherModalProps = {
  open: boolean;
  instances: PackageInstanceSummary[];
  loading: boolean;
  activeInstanceId?: string | null;
  selectingId?: string | null;
  onClose: () => void;
  onSelect: (instanceId: string) => Promise<void> | void;
};

const formatPlanLabel = (value: string | null) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const shortId = (value: string) => {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
};

const formatStatus = (value?: string | null) => {
  if (!value) return "Active";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const profileNameKey = (id: string) => `profileName:${id}`;

const getProfileName = (id: string) => {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(profileNameKey(id)) || "";
  } catch {
    return "";
  }
};

const setProfileName = (id: string, name: string) => {
  if (typeof window === "undefined") return;
  try {
    if (name) {
      localStorage.setItem(profileNameKey(id), name);
    } else {
      localStorage.removeItem(profileNameKey(id));
    }
  } catch {}
};

export default function ProfileSwitcherModal({
  open,
  instances,
  loading,
  activeInstanceId,
  selectingId,
  onClose,
  onSelect,
}: ProfileSwitcherModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [profileNames, setProfileNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    instances.forEach((instance) => {
      const name = getProfileName(instance.id);
      if (name) next[instance.id] = name;
    });
    setProfileNames(next);
  }, [instances, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        aria-label="Close profile switcher"
      />
      <div
        className="relative w-full max-w-[560px] max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Switch profile</h2>
            <p className="mt-1 text-sm text-gray-500">Choose which profile is active.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-gray-300"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(80vh-140px)] overflow-y-auto px-6 py-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading profiles…</p>
          ) : instances.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">No active package instances found.</p>
              <Link
                href="/#packages"
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-300"
              >
                Go to packages
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {instances.map((instance, index) => {
                const isActive = instance.id === activeInstanceId;
                const createdAt = instance.createdAt
                  ? new Date(instance.createdAt).toLocaleDateString()
                  : "—";
                const profileLabel = `Profile ${String.fromCharCode(65 + index)}`;
                const customName = profileNames[instance.id] || "";
                const displayName = customName || profileLabel;
                const showEditor = editingId === instance.id;
                const statusLabel = isActive ? "Active" : "Inactive";
                return (
                  <div
                    key={instance.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm opacity-0 translate-y-1 transition-all duration-200"
                    style={{
                      transitionDelay: `${index * 60}ms`,
                      opacity: 1,
                      transform: "translateY(0)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{displayName}</div>
                        <div className="text-xs text-gray-500">
                          {formatPlanLabel(instance.planKey || null)} · {profileLabel}
                        </div>
                        <div className="text-xs text-gray-500">Created {createdAt}</div>
                        <div className="text-xs text-gray-500">ID {shortId(instance.id)}</div>
                        {showEditor ? (
                          <input
                            value={draftName}
                            onChange={(event) => setDraftName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                const next = draftName.trim();
                                setProfileName(instance.id, next);
                                setProfileNames((prev) => ({ ...prev, [instance.id]: next }));
                                setEditingId(null);
                              }
                              if (event.key === "Escape") {
                                setEditingId(null);
                                setDraftName("");
                              }
                            }}
                            onBlur={() => {
                              const next = draftName.trim();
                              setProfileName(instance.id, next);
                              setProfileNames((prev) => ({ ...prev, [instance.id]: next }));
                              setEditingId(null);
                            }}
                            className="mt-2 w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
                            placeholder="Rename profile"
                            autoFocus
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDraftName(displayName);
                              setEditingId(instance.id);
                            }}
                            className="mt-2 inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:border-gray-300"
                          >
                            Rename
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabel}
                        </span>
                        <button
                          type="button"
                          disabled={isActive || selectingId === instance.id}
                          onClick={() => onSelect(instance.id)}
                          className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-300 disabled:opacity-60"
                        >
                          {isActive ? "Active" : "Set active"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
