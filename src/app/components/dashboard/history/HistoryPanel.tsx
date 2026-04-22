"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HistoryTable from "@/app/components/dashboard/history/HistoryTable";
import { deleteAnalysisResult, getUserResults } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { toast } from "sonner";
import { PACKAGES_URL } from "@/app/utils/urls";
import ReportDrawer from "@/app/components/dashboard/report/ReportDrawer";
import { Play, Video } from "lucide-react";

type VideoHistoryItem = {
  jobId: string;
  videoUrl: string;
  createdAt?: string;
  options?: { thumbnailUrl?: string } | null;
};

type HistoryPanelProps = {
  embedded?: boolean;
};

export default function HistoryPanel({ embedded = false }: HistoryPanelProps) {
  const [history, setHistory] = useState<ResultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportResultId, setReportResultId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"uploads" | "videos">("uploads");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoHistoryItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const { data: planData } = usePlanInfo();
  const packageInstanceId = planData?.packageInstanceId || null;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handleGenerateNew = useCallback(() => {
    try {
      window.dispatchEvent(new Event("dashboard:close-settings"));
    } catch {}
    router.push("/dashboard/talking-head");
  }, [router]);

  const loadHistory = useCallback(
    async (page = 1) => {
      if (!packageInstanceId) {
        setHistory([]);
        setErrorMessage(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorMessage(null);
      try {
        const { results } = await getUserResults({
          page,
          limit: 20,
          packageInstanceId,
        });
        setHistory(results as unknown as ResultDoc[]);
      } catch (err) {
        const errCode =
          err && typeof err === "object" && "code" in err
            ? (err as { code?: string }).code
            : null;
        setHistory([]);
        const requestId =
          err && typeof err === "object" && "requestId" in err
            ? (err as { requestId?: string }).requestId
            : null;
        const message = err instanceof Error ? err.message : "Failed to load history.";
        if (errCode === "ACTIVE_INSTANCE_REQUIRED") {
          setErrorMessage("You need an active package to view your history.");
        } else {
          setErrorMessage(message);
          toast.error(message, {
            description: requestId ? `Request ID: ${requestId}` : undefined,
            action: requestId
              ? {
                  label: "Copy request ID",
                  onClick: () => navigator.clipboard.writeText(requestId),
                }
              : undefined,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [packageInstanceId],
  );

  const loadVideos = useCallback(async () => {
    setVideosLoading(true);
    try {
      const res = await fetch("/api/sadtalker/history", { method: "GET", cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load videos (${res.status})`);
      const data = await res.json();
      setVideos(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.warn("[history-panel] video history error", err);
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  useEffect(() => {
    if (activeTab === "videos") loadVideos();
  }, [activeTab, loadVideos]);

  useEffect(() => {
    const onLocalStorage = (e: StorageEvent) => {
      if (e.key === "analysis:changed") loadHistory(1);
    };
    const onCustom = () => loadHistory(1);
    const onAuthChanged = () => loadHistory(1);
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadHistory(1);
    };

    window.addEventListener("storage", onLocalStorage);
    window.addEventListener("analysis:changed", onCustom as EventListener);
    window.addEventListener("ai-auth-changed", onAuthChanged as EventListener);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onLocalStorage);
      window.removeEventListener("analysis:changed", onCustom as EventListener);
      window.removeEventListener("ai-auth-changed", onAuthChanged as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loadHistory]);

  useEffect(() => {
    if (embedded) return;
    const openId = searchParams.get("open");
    if (!openId) return;
    if (reportOpen && reportResultId === openId) return;
    setReportResultId(openId);
    setReportOpen(true);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("open");
    const qs = nextParams.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [embedded, searchParams, reportOpen, reportResultId, pathname, router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisResult(id);
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setHistory((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const handleOpen = (id: string) => {
    setReportResultId(id);
    setReportOpen(true);
  };

  return (
    <div className={embedded ? "w-full" : "min-h-screen flex flex-col text-white"}>
      {!embedded ? (
        <header className="shrink-0 px-4 pt-3 md:px-12 md:pt-20 lg:px-20 max-w-6xl mx-auto w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Upload History</h1>
              <p className="text-sm hg-muted">
                Review past analyses, refine insights, and keep your strategy sharp.
              </p>
            </div>
          </div>
        </header>
      ) : null}

      <main>
        <div className={embedded ? "w-full" : "px-4 md:px-12 lg:px-20 w-full"}>
          <div className={embedded ? "w-full" : "max-w-6xl mx-auto w-full pb-10 space-y-6"}>
            <section className={embedded ? "min-h-[280px]" : "p-2 sm:p-4 md:p-6 min-h-[280px]"}>
              <div className="mb-5 inline-flex flex-wrap rounded-xl border border-[var(--hg-border)] bg-[rgba(255,255,255,0.03)] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("uploads")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    activeTab === "uploads"
                      ? "bg-[rgba(80,192,240,0.18)] text-[#50C0F0]"
                      : "hg-muted hover:text-white"
                  }`}
                >
                  Photo Uploads
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("videos")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    activeTab === "videos"
                      ? "bg-[rgba(80,192,240,0.18)] text-[#50C0F0]"
                      : "hg-muted hover:text-white"
                  }`}
                >
                  Avatar Video
                </button>
              </div>

              {activeTab === "uploads" ? (
                !packageInstanceId ? (
                  <div className="mx-auto w-full max-w-2xl rounded-2xl hg-surface p-5">
                    <h3 className="text-xl font-semibold text-white">Select a package</h3>
                    <p className="mt-2 text-sm hg-muted">
                      Choose an active package to view insights for that plan.
                    </p>
                    <Link
                      href={PACKAGES_URL}
                      className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#07131d] hover:opacity-90"
                    >
                      View packages
                    </Link>
                  </div>
                ) : loading ? (
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
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <tr key={`history-skeleton-${idx}`} className="border-b border-[var(--hg-border-2)]">
                            <td className="px-5 py-3">
                              <Skeleton className="h-7 w-11 rounded-md bg-[rgba(255,255,255,0.08)]" />
                            </td>
                            <td className="px-5 py-3">
                              <Skeleton className="h-4 w-28 bg-[rgba(255,255,255,0.08)]" />
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="ml-auto flex justify-end">
                                <Skeleton className="h-7 w-14 rounded-md bg-[rgba(255,255,255,0.08)]" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : errorMessage ? (
                  <div className="mx-auto w-full max-w-2xl rounded-2xl hg-surface p-5">
                    <h3 className="text-xl font-semibold text-white">No access</h3>
                    <p className="mt-2 text-sm hg-muted">{errorMessage}</p>
                    <Link
                      href={PACKAGES_URL}
                      className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#07131d] hover:opacity-90"
                    >
                      View packages
                    </Link>
                  </div>
                ) : history.length === 0 ? (
                  <div className="mx-auto w-full max-w-2xl rounded-2xl hg-surface p-5">
                    <h3 className="text-xl font-semibold text-white">No insights yet</h3>
                    <p className="mt-2 text-sm hg-muted">
                      Upload your first image to generate your first strategy.
                    </p>
                    <Link
                      href="/dashboard/upload"
                      className="mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#07131d] hover:opacity-90"
                    >
                      Upload content
                    </Link>
                  </div>
                ) : (
                  <HistoryTable history={history} onDeleteClick={handleDelete} onOpenClick={handleOpen} />
                )
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Talking Head history</h3>
                    <button
                      type="button"
                      onClick={handleGenerateNew}
                      className="inline-flex rounded-xl bg-[#50C0F0] px-3 py-2 text-xs font-medium text-[#07131d] hover:opacity-90"
                    >
                      Generate new
                    </button>
                  </div>

                  {videosLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="rounded-2xl overflow-hidden">
                          <Skeleton className="h-32 w-full bg-[rgba(255,255,255,0.08)]" />
                          <div className="p-2 space-y-1.5">
                            <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.08)]" />
                            <Skeleton className="h-7 w-14 rounded-lg bg-[rgba(255,255,255,0.08)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : videos.length === 0 ? (
                    <div className="rounded-2xl hg-surface p-5">
                      <p className="text-sm hg-muted">Your generated videos will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {videos.map((item) => {
                        const dateLabel = item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";
                        return (
                          <div
                            key={item.jobId}
                            className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] overflow-hidden"
                          >
                            <div className="relative h-32 bg-black/30">
                              {item.options?.thumbnailUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.options.thumbnailUrl}
                                  alt="Video thumbnail"
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Video className="h-8 w-8 text-[var(--hg-muted-2)]" />
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 space-y-2">
                              <p className="text-xs text-[var(--hg-muted)]">{dateLabel}</p>
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--hg-accent)] px-2.5 py-1.5 text-xs font-semibold text-[#04131d] hover:opacity-90"
                              >
                                <Play className="h-3 w-3" />
                                Play
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <ReportDrawer
        open={reportOpen}
        onOpenChange={setReportOpen}
        resultId={reportResultId}
      />
    </div>
  );
}
