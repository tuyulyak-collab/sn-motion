"use client";

import React, { useEffect, useRef, useState } from "react";
import { MotionSettings } from "@/lib/motionSettings";
import {
  PRESETS_EXPORT_FILENAME,
  PRESET_NAME_MAX_LENGTH,
  Preset,
  buildPresetsExport,
  ensureUniqueName,
  loadPresetsFromStorage,
  newPresetId,
  parsePresetsImport,
  savePresetsToStorage,
} from "@/lib/presets";

type Props = {
  motionSettings: MotionSettings;
  onApply: (next: MotionSettings) => void;
};

type Feedback = { kind: "ok" | "err"; message: string };

const HELPER_COPY =
  "Presets save your own motion settings so you can reuse them later.";

const EMPTY_COPY =
  "No presets yet. Save your current motion settings as a preset to reuse them later.";

export const PresetsPanel: React.FC<Props> = ({ motionSettings, onApply }) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate presets from localStorage on mount.
  useEffect(() => {
    setPresets(loadPresetsFromStorage());
    setHydrated(true);
  }, []);

  // Persist presets to localStorage whenever they change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    savePresetsToStorage(presets);
  }, [presets, hydrated]);

  // Clean up the feedback timer if the panel unmounts mid-flash.
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const flash = (next: Feedback, ms = 3000) => {
    setFeedback(next);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), ms);
  };

  const handleSavePreset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalName = ensureUniqueName(draftName, presets);
    const renamed = finalName !== draftName.trim();
    const now = Date.now();
    const next: Preset = {
      id: newPresetId(),
      name: finalName,
      settings: motionSettings,
      createdAt: now,
      updatedAt: now,
    };
    setPresets((prev) => [next, ...prev]);
    setDraftName("");
    flash({
      kind: "ok",
      message: renamed
        ? `Saved as “${finalName}” (name was already taken).`
        : `Saved “${finalName}”.`,
    });
  };

  const handleApply = (preset: Preset) => {
    onApply(preset.settings);
    flash({ kind: "ok", message: `Applied “${preset.name}”.` });
  };

  const handleStartRename = (preset: Preset) => {
    setEditingId(preset.id);
    setEditingName(preset.name);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleConfirmRename = (preset: Preset) => {
    const finalName = ensureUniqueName(editingName, presets, preset.id);
    setPresets((prev) =>
      prev.map((p) =>
        p.id === preset.id
          ? { ...p, name: finalName, updatedAt: Date.now() }
          : p,
      ),
    );
    setEditingId(null);
    setEditingName("");
    flash({ kind: "ok", message: `Renamed to “${finalName}”.` });
  };

  const handleDelete = (preset: Preset) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`Delete preset “${preset.name}”?`);
      if (!ok) return;
    }
    setPresets((prev) => prev.filter((p) => p.id !== preset.id));
    if (editingId === preset.id) {
      setEditingId(null);
      setEditingName("");
    }
    flash({ kind: "ok", message: `Deleted “${preset.name}”.` });
  };

  const handleExportJson = () => {
    if (typeof window === "undefined") return;
    if (presets.length === 0) {
      flash({ kind: "err", message: "No presets to export yet." });
      return;
    }
    try {
      const payload = buildPresetsExport(presets);
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = PRESETS_EXPORT_FILENAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      flash({ kind: "ok", message: "Presets file downloaded." });
    } catch {
      flash({ kind: "err", message: "Could not export presets." });
    }
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const result = parsePresetsImport(text);
      if (!result.ok) {
        flash({ kind: "err", message: result.error });
        return;
      }
      if (result.presets.length === 0) {
        flash({ kind: "err", message: "That file had no valid presets." });
        return;
      }
      // Merge: append imported presets with unique names + fresh IDs so we
      // never collide with what's already in the list.
      setPresets((prev) => {
        let working = [...prev];
        for (const incoming of result.presets) {
          const finalName = ensureUniqueName(incoming.name, working);
          working = [
            {
              ...incoming,
              id: newPresetId(),
              name: finalName,
              updatedAt: Date.now(),
            },
            ...working,
          ];
        }
        return working;
      });
      flash({
        kind: "ok",
        message: `Imported ${result.presets.length} preset${result.presets.length === 1 ? "" : "s"}.`,
      });
    } catch {
      flash({ kind: "err", message: "Could not read that file." });
    }
  };

  return (
    <section
      className="glass-card p-6 md:p-7 flex flex-col gap-5"
      data-testid="presets-panel"
      aria-label="Presets"
    >
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-ink">Presets</h2>
          <span className="sn-pill sn-pill-rendering">In Settings</span>
        </div>
        <p className="text-sm text-soft max-w-prose">{HELPER_COPY}</p>
        <p className="text-[11px] text-mute max-w-prose">
          Saved on this device only. Presets do not include any AI providers,
          uploaded assets, or audio files.
        </p>
      </header>

      <form
        onSubmit={handleSavePreset}
        className="glass-card-soft p-4 flex flex-col gap-3"
        data-testid="presets-save-form"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="preset-name" className="sn-label">
            Save current settings as preset
          </label>
          <input
            id="preset-name"
            type="text"
            className="sn-input"
            placeholder="e.g. My countdown intro"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            maxLength={PRESET_NAME_MAX_LENGTH}
            data-testid="preset-name-input"
          />
          <p className="text-[11px] text-mute">
            Names you’ve used before will get a number added so nothing gets
            overwritten.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="sn-button-primary"
            data-testid="preset-save-button"
          >
            Save preset
          </button>
        </div>
      </form>

      <div
        className="glass-card-soft p-4 flex flex-col gap-3"
        data-testid="presets-list"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-semibold text-ink text-sm">Your saved presets</h3>
          <span className="text-[11px] text-mute" data-testid="preset-count">
            {presets.length} saved
          </span>
        </div>

        {presets.length === 0 ? (
          <p
            className="text-sm text-soft"
            data-testid="presets-empty"
          >
            {EMPTY_COPY}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {presets.map((preset) => {
              const isEditing = editingId === preset.id;
              return (
                <li
                  key={preset.id}
                  className="rounded-2xl border border-white/70 bg-white/65 px-3 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  data-testid={`preset-row-${preset.id}`}
                >
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        className="sn-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        maxLength={PRESET_NAME_MAX_LENGTH}
                        autoFocus
                        data-testid={`preset-rename-input-${preset.id}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleConfirmRename(preset);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            handleCancelRename();
                          }
                        }}
                      />
                    ) : (
                      <>
                        <div
                          className="text-sm font-semibold text-ink truncate"
                          data-testid={`preset-name-${preset.id}`}
                        >
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-mute">
                          {preset.settings.aspectRatio} ·{" "}
                          {preset.settings.durationSeconds}s ·{" "}
                          {preset.settings.motionType}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="sn-button-primary"
                          onClick={() => handleConfirmRename(preset)}
                          data-testid={`preset-rename-save-${preset.id}`}
                        >
                          Save name
                        </button>
                        <button
                          type="button"
                          className="sn-button-secondary"
                          onClick={handleCancelRename}
                          data-testid={`preset-rename-cancel-${preset.id}`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="sn-button-primary"
                          onClick={() => handleApply(preset)}
                          data-testid={`preset-apply-${preset.id}`}
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          className="sn-button-secondary"
                          onClick={() => handleStartRename(preset)}
                          data-testid={`preset-rename-${preset.id}`}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="sn-button-secondary"
                          onClick={() => handleDelete(preset)}
                          data-testid={`preset-delete-${preset.id}`}
                          style={{ color: "#8a3057" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        className="glass-card-soft p-4 flex flex-col gap-3"
        data-testid="presets-import-export"
      >
        <div>
          <h3 className="font-semibold text-ink text-sm">
            Import &amp; export presets
          </h3>
          <p className="text-[11px] text-soft">
            Move your presets between devices as a JSON file. Invalid entries
            in an imported file are skipped, never applied.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="sn-button-secondary"
            onClick={handleExportJson}
            data-testid="presets-export-button"
          >
            Export presets as JSON
          </button>
          <button
            type="button"
            className="sn-button-secondary"
            onClick={handleImportClick}
            data-testid="presets-import-button"
          >
            Import presets from JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
            data-testid="presets-import-input"
          />
        </div>
      </div>

      {feedback && (
        <div
          className="text-xs px-3 py-2 rounded-xl"
          role="status"
          data-testid="presets-feedback"
          data-kind={feedback.kind}
          style={
            feedback.kind === "ok"
              ? {
                  background: "rgba(191,234,216,0.55)",
                  color: "#2c6c5a",
                  border: "1px solid rgba(191,234,216,0.7)",
                }
              : {
                  background: "rgba(246,167,193,0.3)",
                  color: "#8a3057",
                  border: "1px solid rgba(246,167,193,0.6)",
                }
          }
        >
          {feedback.message}
        </div>
      )}
    </section>
  );
};
