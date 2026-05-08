"use client";

import React from "react";
import {
  ASPECT_RATIO_OPTIONS,
  DURATION_OPTIONS,
  FRAME_RATE_OPTIONS,
  MotionSettings,
  RESOLUTION_OPTIONS,
} from "@/lib/motionSettings";
import { SegmentedField } from "./SegmentedField";

type Props = {
  value: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
};

export const VideoSettingsStep: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <div>
        <label className="sn-label">Total duration</label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((s) => {
            const active = value.durationSeconds === s;
            return (
              <button
                type="button"
                key={s}
                aria-pressed={active}
                onClick={() => onChange("durationSeconds", s)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  active
                    ? "text-white border-transparent shadow-glass"
                    : "border-white/70 text-ink/70 hover:bg-white/80"
                }`}
                style={{
                  background: active
                    ? "linear-gradient(135deg,#F6A7C1,#B9A7FF)"
                    : "rgba(255,255,255,0.65)",
                }}
              >
                {s}s
              </button>
            );
          })}
        </div>
      </div>

      <SegmentedField
        label="Aspect ratio"
        options={ASPECT_RATIO_OPTIONS}
        value={value.aspectRatio}
        onChange={(next) => onChange("aspectRatio", next)}
        columns={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SegmentedField
          label="Resolution"
          options={RESOLUTION_OPTIONS}
          value={value.resolution}
          onChange={(next) => onChange("resolution", next)}
          columns={3}
        />
        <SegmentedField
          label="Frame rate"
          options={FRAME_RATE_OPTIONS}
          value={value.frameRate}
          onChange={(next) => onChange("frameRate", next)}
          columns={3}
        />
      </div>

      <div>
        <label className="sn-label">Stage timing (seconds)</label>
        <p className="text-xs text-soft mb-3">
          Optional planning hints. The mock preview keeps these visible so you
          can see how the motion flows before real rendering lands.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SecondsField
            id="intro-length"
            label="Intro"
            value={value.introLength}
            onChange={(v) => onChange("introLength", v)}
          />
          <SecondsField
            id="hold-length"
            label="Hold"
            value={value.holdLength}
            onChange={(v) => onChange("holdLength", v)}
          />
          <SecondsField
            id="outro-length"
            label="Outro"
            value={value.outroLength}
            onChange={(v) => onChange("outroLength", v)}
          />
        </div>
      </div>
    </>
  );
};

const SecondsField: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
}> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <label className="sn-label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={0}
          step={0.5}
          className="sn-input pr-12"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            onChange(Number.isFinite(parsed) ? parsed : 0);
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mute font-semibold">
          s
        </span>
      </div>
    </div>
  );
};
