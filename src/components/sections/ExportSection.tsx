"use client";

import React from "react";
import { ExportPanel } from "@/components/ExportPanel";
import { MotionSettings } from "@/lib/motionSettings";
import { SectionShell } from "./SectionShell";

type Props = {
  settings: MotionSettings;
};

export const ExportSection: React.FC<Props> = ({ settings }) => {
  return (
    <SectionShell sectionId="export">
      <ExportPanel settings={settings} />
    </SectionShell>
  );
};
