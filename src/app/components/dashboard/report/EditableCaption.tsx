"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, RotateCcw, Loader2, Check, X } from "lucide-react";

interface Props {
  text: string;
  originalText?: string | null;
  angle: string;
  onSave: (newText: string) => Promise<void>;
  onReset: () => Promise<void>;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  resetLabel?: string;
}

export function EditableCaption({
  text,
  originalText,
  onSave,
  onReset,
  className = "",
  placeholder,
  ariaLabel,
  resetLabel = "Reset to AI",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) setDraft(text);
  }, [text, editing]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      const ta = textareaRef.current;
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [editing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === text.trim()) {
      setDraft(text);
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(trimmed);
      setEditing(false);
    } catch {
      setDraft(text);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(text);
    setEditing(false);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await onReset();
    } finally {
      setResetting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      handleDiscard();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      void handleSave();
    }
  };

  const wasEdited = Boolean(originalText && originalText !== text);

  if (editing) {
    return (
      <div className={`relative ${className}`}>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full resize-none rounded-md border border-[var(--hg-accent)] bg-[var(--hg-surface)] px-3 py-2 text-sm text-[var(--hg-text)] leading-relaxed placeholder:text-[var(--hg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)] disabled:opacity-70"
          rows={2}
          disabled={saving}
        />
        <div className="mt-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--hg-accent)] px-3 py-1 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--hg-border)] px-3 py-1 text-xs text-[var(--hg-muted)] transition hover:border-[var(--hg-text)] hover:text-[var(--hg-text)] disabled:opacity-50"
          >
            <X className="h-3 w-3" />
            Discard
          </button>
          <span className="ml-auto text-[10px] text-[var(--hg-muted)]">
            ⌘↵ save · Esc discard
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      <p
        onClick={() => setEditing(true)}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || "Click to edit caption"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setEditing(true);
          }
        }}
        className="cursor-text rounded-md -mx-1 px-1 py-0.5 text-sm leading-relaxed text-[var(--hg-text)] transition hover:bg-[var(--hg-surface-2)]/40"
      >
        {text}
        <Pencil className="ml-1 inline h-3 w-3 align-middle opacity-0 transition group-hover:opacity-40" />
      </p>
      {wasEdited && (
        <button
          type="button"
          onClick={() => void handleReset()}
          disabled={resetting}
          className="mt-1 inline-flex items-center gap-1 rounded-md border border-[var(--hg-border)] px-2 py-0.5 text-[10px] text-[var(--hg-muted)] transition hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:opacity-50"
          title="Restore the AI's original caption"
        >
          {resetting ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          ) : (
            <RotateCcw className="h-2.5 w-2.5" />
          )}
          {resetLabel}
        </button>
      )}
    </div>
  );
}
