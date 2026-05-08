"use client";

import React, { useState } from "react";
import {
  BACKGROUND_BLUR_OPTIONS,
  GLOW_INTENSITY_OPTIONS,
  MotionSettings,
  OVERLAY_OPACITY_OPTIONS,
} from "@/lib/motionSettings";
import { ColorField } from "./ColorField";
import { SegmentedField } from "./SegmentedField";

type Props = {
  value: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
  onResetColors: () => void;
};

const COLOR_FIELDS: Array<{
  key:
    | "textColor"
    | "backgroundStartColor"
    | "backgroundEndColor"
    | "accentColor"
    | "countdownNumberColor"
    | "overlayColor"
    | "borderGlowColor";
  label: string;
  inputId: string;
  ariaLabel: string;
}> = [
  {
    key: "textColor",
    label: "Text color",
    inputId: "advanced-text-color",
    ariaLabel: "Pick text color",
  },
  {
    key: "backgroundStartColor",
    label: "Background start",
    inputId: "advanced-bg-start",
    ariaLabel: "Pick background start color",
  },
  {
    key: "backgroundEndColor",
    label: "Background end",
    inputId: "advanced-bg-end",
    ariaLabel: "Pick background end color",
  },
  {
    key: "accentColor",
    label: "Accent color",
    inputId: "advanced-accent",
    ariaLabel: "Pick accent color",
  },
  {
    key: "countdownNumberColor",
    label: "Number color",
    inputId: "advanced-number-color",
    ariaLabel: "Pick countdown number color",
  },
  {
    key: "overlayColor",
    label: "Overlay color",
    inputId: "advanced-overlay-color",
    ariaLabel: "Pick overlay color",
  },
  {
    key: "borderGlowColor",
    label: "Glow color",
    inputId: "advanced-glow-color",
    ariaLabel: "Pick border / glow color",
  },
];

export const AdvancedColors: React.FC<Props> = ({
  value,
  onChange,
  onResetColors,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="rounded-2xl border border-white/70 bg-white/55 overflow-hidden"
      aria-label="Advanced colors"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="advanced-colors-panel"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-ink">Advanced colors</span>
          <span className="text-xs text-soft">
            Beginner-friendly fine-tuning for text, background, accent, glow,
            and overlay.
          </span>
        </div>
        <span
          aria-hidden
          className="text-soft text-lg transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          id="advanced-colors-panel"
          className="px-4 pb-4 pt-1 flex flex-col gap-4 border-t border-white/70"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COLOR_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="sn-label" htmlFor={field.inputId}>
                  {field.label}
                </label>
                <ColorField
                  inputId={field.inputId}
                  value={value[field.key]}
                  onChange={(v) => onChange(field.key, v)}
                  ariaLabel={field.ariaLabel}
                />
              </div>
            ))}
          </div>

          <SegmentedField
            label="Background blur"
            options={BACKGROUND_BLUR_OPTIONS}
            value={value.backgroundBlur}
            onChange={(next) => onChange("backgroundBlur", next)}
            columns={3}
          />

          <SegmentedField
            label="Glow strength"
            options={GLOW_INTENSITY_OPTIONS}
            value={value.glowIntensity}
            onChange={(next) => onChange("glowIntensity", next)}
            columns={4}
          />

          <SegmentedField
            label="Overlay opacity"
            options={OVERLAY_OPACITY_OPTIONS}
            value={value.overlayOpacity}
            onChange={(next) => onChange("overlayOpacity", next)}
            columns={4}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="sn-button-secondary"
              onClick={onResetColors}
            >
              Reset colors only
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};
