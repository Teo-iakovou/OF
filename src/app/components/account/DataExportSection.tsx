"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DataExportSection() {
  const t = useTranslations("dashboard.settings.dataExport");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleExport() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/user/data-export", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          const retryAfter = typeof data?.retryAfter === "number" ? data.retryAfter : 3600;
          const minutes = Math.ceil(retryAfter / 60);
          setErr(t("errors.cooldown", { minutes }));
        } else {
          setErr(t("errors.generic"));
        }
        setBusy(false);
        return;
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      const disposition = res.headers.get("content-disposition");
      const match = disposition?.match(/filename="?([^"]+)"?/);
      a.download = match?.[1] || "echofy-data-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setErr(t("errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="text-sm font-semibold text-white">{t("title")}</h3>
      <p className="mt-1 text-xs text-white/45">{t("description")}</p>
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className="mt-3 h-10 rounded-xl border border-white/20 bg-transparent px-4 text-sm text-white/90 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? t("preparing") : t("downloadButton")}
      </button>
      <p className="mt-3 text-xs text-white/30">{t("rateNote")}</p>
    </section>
  );
}
