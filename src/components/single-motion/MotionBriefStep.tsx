"use client";

import React from "react";
import {
  MOTION_TYPE_OPTIONS,
  MotionSettings,
  MotionType,
} from "@/lib/motionSettings";

type Props = {
  value: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
};

export const MotionBriefStep: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <div>
        <label className="sn-label" htmlFor="motion-concept">
          Motion concept (optional)
        </label>
        <textarea
          id="motion-concept"
          className="sn-input min-h-[110px] resize-y leading-relaxed"
          value={value.motionConcept}
          onChange={(e) => onChange("motionConcept", e.target.value)}
          placeholder="Describe the motion you have in mind. Example: a soft pastel countdown that introduces my cooking video, friendly and slow."
        />
        <p className="text-xs text-soft mt-2">
          Free-form notes for now. SN Motion does not call any AI in this step;
          your description is saved with the motion and will guide future
          assistive features.
        </p>
      </div>

      <div>
        <label className="sn-label">Motion type</label>
        <p className="text-xs text-soft mb-3">
          Pick an animation backbone — not a fixed template. You can still edit
          every scene, color, and timing field below.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {MOTION_TYPE_OPTIONS.map((opt) => (
            <MotionTypeButton
              key={opt.value}
              option={opt}
              active={value.motionType === opt.value}
              onSelect={() => onChange("motionType", opt.value)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const MotionTypeButton: React.FC<{
  option: (typeof MOTION_TYPE_OPTIONS)[number];
  active: boolean;
  onSelect: () => void;
}> = ({ option, active, onSelect }) => {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`text-left rounded-2xl p-3 border transition ${
        active ? "shadow-glass" : "hover:bg-white/80"
      }`}
      style={{
        background: active
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.55)",
        borderColor: active
          ? "rgba(155,124,246,0.55)"
          : "rgba(255,255,255,0.7)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden className="text-base">
          {option.emoji}
        </span>
        <span className="font-semibold text-ink text-sm leading-tight">
          {option.label}
        </span>
      </div>
      <p className="text-[11px] text-soft leading-snug">{option.helper}</p>
    </button>
  );
};

export type MotionTypeChange = (next: MotionType) => void;
