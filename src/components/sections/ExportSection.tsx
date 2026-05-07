"use client";

import React from "react";
import { RenderPanel } from "@/components/RenderPanel";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";

type Props = {
  props: CountdownIntroProps;
};

export const ExportSection: React.FC<Props> = ({ props }) => {
  return (
    <SectionShell sectionId="export">
      <RenderPanel props={props} />
    </SectionShell>
  );
};
