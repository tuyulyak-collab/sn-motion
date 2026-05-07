"use client";

import React from "react";
import { PreviewPanel } from "@/components/PreviewPanel";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";

type Props = {
  props: CountdownIntroProps;
};

export const PreviewSection: React.FC<Props> = ({ props }) => {
  return (
    <SectionShell sectionId="preview">
      <PreviewPanel props={props} />
    </SectionShell>
  );
};
