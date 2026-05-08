"use client";

import React from "react";
import {
  BACKGROUND_TYPE_OPTIONS,
  MOTION_INTENSITY_OPTIONS,
  MotionSettings,
  STYLE_DIRECTION_OPTIONS,
} from "@/lib/motionSettings";
import { SegmentedField } from "./SegmentedField";

type Props = {
  value: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
};

export const SceneStyleStep: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="sn-label" htmlFor="channel-name">
            Channel name
          </label>
          <input
            id="channel-name"
            className="sn-input"
            value={value.channelName}
            onChange={(e) => onChange("channelName", e.target.value)}
            placeholder="Your channel"
          />
        </div>
        <div>
          <label className="sn-label" htmlFor="title-text">
            Title
          </label>
          <input
            id="title-text"
            className="sn-input"
            value={value.titleText}
            onChange={(e) => onChange("titleText", e.target.value)}
            placeholder="Main title"
          />
        </div>
        <div>
          <label className="sn-label" htmlFor="subtitle-text">
            Subtitle
          </label>
          <input
            id="subtitle-text"
            className="sn-input"
            value={value.subtitleText}
            onChange={(e) => onChange("subtitleText", e.target.value)}
            placeholder="Short helper line"
          />
        </div>
        <div>
          <label className="sn-label" htmlFor="final-text">
            Final text
          </label>
          <input
            id="final-text"
            className="sn-input"
            value={value.finalText}
            onChange={(e) => onChange("finalText", e.target.value)}
            placeholder="Closing call to action"
          />
        </div>
      </div>

      <SegmentedField
        label="Background"
        options={BACKGROUND_TYPE_OPTIONS}
        value={value.backgroundType}
        onChange={(next) => onChange("backgroundType", next)}
        columns={4}
      />

      <SegmentedField
        label="Style direction"
        options={STYLE_DIRECTION_OPTIONS}
        value={value.styleDirection}
        onChange={(next) => onChange("styleDirection", next)}
        columns={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="sn-label">Primary color</label>
          <ColorField
            value={value.primaryColor}
            onChange={(v) => onChange("primaryColor", v)}
            ariaLabel="Pick primary color"
          />
        </div>
        <div>
          <label className="sn-label">Secondary color</label>
          <ColorField
            value={value.secondaryColor}
            onChange={(v) => onChange("secondaryColor", v)}
            ariaLabel="Pick secondary color"
          />
        </div>
      </div>

      <SegmentedField
        label="Motion intensity"
        options={MOTION_INTENSITY_OPTIONS}
        value={value.motionIntensity}
        onChange={(next) => onChange("motionIntensity", next)}
        columns={3}
      />
    </>
  );
};

const ColorField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}> = ({ value, onChange, ariaLabel }) => {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-3 py-2"
      style={{
        background: "rgba(255,255,255,0.78)",
        borderColor: "rgba(185,167,255,0.28)",
      }}
    >
      <input
        type="color"
        value={normalizeHex(value)}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-9 h-9 rounded-full border-0 bg-transparent cursor-pointer"
        aria-label={ariaLabel}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm font-mono text-ink"
        spellCheck={false}
      />
    </div>
  );
};

const normalizeHex = (raw: string): string => {
  const trimmed = (raw ?? "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed.charAt(1);
    const g = trimmed.charAt(2);
    const b = trimmed.charAt(3);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
};
