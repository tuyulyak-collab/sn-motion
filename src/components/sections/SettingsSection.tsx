"use client";

import React from "react";
import { PresetsPanel } from "@/components/PresetsPanel";
import { SaveLoadSettings } from "@/components/SaveLoadSettings";
import { MotionSettings } from "@/lib/motionSettings";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";

type Props = {
  value: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
  motionSettings: MotionSettings;
  onMotionSettingsChange: (next: MotionSettings) => void;
};

export const SettingsSection: React.FC<Props> = ({
  value,
  onChange,
  motionSettings,
  onMotionSettingsChange,
}) => {
  return (
    <SectionShell sectionId="settings">
      <SaveLoadSettings value={value} onChange={onChange} />
      <PresetsPanel
        motionSettings={motionSettings}
        onApply={onMotionSettingsChange}
      />
      <ComingSoonNote
        variant="advanced"
        title="Provider settings"
        description="When the assisted description tool grows beyond rule-based parsing, provider preferences and defaults will live here. Nothing is stored or sent today."
        bullets={[
          "AI provider preference (OpenAI, Gemini, …)",
          "Default length and video size",
          "Default theme and palette",
          "Optional sound and watermark defaults",
        ]}
      />
    </SectionShell>
  );
};
