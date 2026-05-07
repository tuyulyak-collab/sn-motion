"use client";

import React from "react";
import { TemplateGallery } from "@/components/TemplateGallery";
import { CustomizePanel } from "@/components/CustomizePanel";
import { PromptBox } from "@/components/PromptBox";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";

type Props = {
  props: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
};

export const TemplatesSection: React.FC<Props> = ({ props, onChange }) => {
  return (
    <SectionShell sectionId="templates">
      <TemplateGallery selectedId="youtube-countdown-intro" onSelect={() => {}} />
      <CustomizePanel value={props} onChange={onChange} />
      <PromptBox current={props} onApply={onChange} />
    </SectionShell>
  );
};
