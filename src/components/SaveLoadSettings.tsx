"use client";

import React, { useRef, useState } from "react";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import {
  defaultSettings,
  downloadSettingsJson,
  parseSettingsJson,
} from "@/lib/settingsStorage";

type Props = {
  value: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
};

export const SaveLoadSettings: React.FC<Props> = ({ value, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; message: string } | null>(null);

  const triggerLoad = () => fileRef.current?.click();

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const result = parseSettingsJson(text);
      if (result.ok) {
        onChange(result.props);
        setFeedback({ kind: "ok", message: "Settings loaded." });
      } else {
        setFeedback({ kind: "err", message: result.error });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read file.";
      setFeedback({ kind: "err", message });
    } finally {
      e.target.value = "";
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const onSave = () => {
    downloadSettingsJson(value);
    setFeedback({ kind: "ok", message: "Settings file downloaded." });
    setTimeout(() => setFeedback(null), 3000);
  };

  const onReset = () => {
    onChange(defaultSettings());
    setFeedback({ kind: "ok", message: "Reset to defaults." });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <section className="glass-card p-6">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-ink">Save & load</h2>
        <p className="text-sm text-mute">
          Keep settings as a small JSON file you can re-use later.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onSave} className="sn-button-primary">
          Save settings
        </button>
        <button type="button" onClick={triggerLoad} className="sn-button-secondary">
          Load settings
        </button>
        <button type="button" onClick={onReset} className="sn-button-secondary">
          Reset
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
      {feedback && (
        <div
          className="mt-3 text-xs px-3 py-2 rounded-xl"
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
