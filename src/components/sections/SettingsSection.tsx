"use client";

import React from "react";
import { SaveLoadSettings } from "@/components/SaveLoadSettings";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";

type Props = {
  value: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
};

export const SettingsSection: React.FC<Props> = ({ value, onChange }) => {
  return (
    <SectionShell sectionId="settings">
      <SaveLoadSettings value={value} onChange={onChange} />
      <ComingSoonNote
        variant="advanced"
        title="Presets"
        description="Save your favourite motion configs as named presets and reuse them across motions. Lives inside Settings — no extra sidebar item."
        bullets={[
          "Name and save the current motion settings",
          "Pick a preset as your default for new motions",
          "Apply a preset to a motion in one click",
          "Export and import presets as JSON",
        ]}
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
