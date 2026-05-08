"use client";

import React from "react";
import {
  BACKGROUND_TYPE_OPTIONS,
  MOTION_INTENSITY_OPTIONS,
  MotionSettings,
  STYLE_DIRECTION_OPTIONS,
} from "@/lib/motionSettings";
import { AdvancedColors } from "./AdvancedColors";
import { ColorField } from "./ColorField";
import { SafetyHint } from "./SafetyHint";
import { SegmentedField } from "./SegmentedField";

type Props = {
  value: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
  onResetColors: () => void;
};

export const SceneStyleStep: React.FC<Props> = ({
  value,
  onChange,
  onResetColors,
}) => {
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
          <SafetyHint
            fieldLabel="Channel name"
            text={value.channelName}
            reminder="Stock-safe tip: use a generic creator name. Avoid real channel names you do not own and any brand or trademark."
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
          <SafetyHint
            fieldLabel="Title"
            text={value.titleText}
            reminder="Stock-safe tip: keep the title generic. Avoid brand names, real people, fictional characters, and copyrighted titles."
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
          <SafetyHint
            fieldLabel="Subtitle"
            text={value.subtitleText}
            reminder={
              "Stock-safe tip: avoid \u201Cofficial / certified / guaranteed\u201D wording — soften unverifiable claims."
            }
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
          <SafetyHint
            fieldLabel="Final text"
            text={value.finalText}
            reminder="Stock-safe tip: a call-to-action that does not reference a specific platform or brand travels better across stock sites."
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
          <label className="sn-label" htmlFor="primary-color">
            Primary color
          </label>
          <ColorField
            inputId="primary-color"
            value={value.primaryColor}
            onChange={(v) => onChange("primaryColor", v)}
            ariaLabel="Pick primary color"
          />
        </div>
        <div>
          <label className="sn-label" htmlFor="secondary-color">
            Secondary color
          </label>
          <ColorField
            inputId="secondary-color"
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

      <AdvancedColors
        value={value}
        onChange={onChange}
        onResetColors={onResetColors}
      />
    </>
  );
};
