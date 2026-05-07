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
        title="Provider settings"
        description="When the AI Motion Generator goes live, you will manage providers and defaults from here. Nothing is stored or sent today."
        bullets={[
          "AI provider preference (OpenAI, Gemini, …)",
          "Default countdown length and video size",
          "Default theme and palette",
          "Optional sound and watermark defaults",
        ]}
      />
    </SectionShell>
  );
};
