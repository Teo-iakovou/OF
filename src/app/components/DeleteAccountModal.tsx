"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { deleteAccount } from "@/app/utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteAccountModal({ open, onClose, onSuccess }: Props) {
  const t = useTranslations("dashboard.settings.deleteAccount");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const canConfirm = input === "DELETE" && !busy;

  async function handleConfirm() {
    if (!canConfirm) return;
    setBusy(true);
    setErr(null);
    try {
      await deleteAccount();
      onSuccess();
    } catch {
      setErr(t("errorGeneric"));
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
        <p className="mt-3 text-sm text-zinc-300">{t("warning")}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400">
          <li>{t("bulletPhotos")}</li>
          <li>{t("bulletConversations")}</li>
          <li>{t("bulletAvatars")}</li>
          <li>{t("bulletIrreversible")}</li>
        </ul>
        <p className="mt-4 text-sm text-zinc-300">{t("typeToConfirm")}</p>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); }}
          placeholder="DELETE"
          className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:text-white disabled:opacity-60"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
          >
            {busy ? t("deleting") : t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
}
