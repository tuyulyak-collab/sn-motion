"use client";

import React from "react";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";

export const AssetsSection: React.FC = () => {
  return (
    <SectionShell sectionId="assets">
      <ComingSoonNote
        variant="soon"
        title="One place for images, audio, and backgrounds"
        description="Upload a logo, background image, or short audio clip and reuse it across templates. Files stay on your machine in this MVP."
        bullets={[
          "Logo and channel art",
          "Background images and videos",
          "Tick / chime / music clips",
          "Per-template default assets",
        ]}
      />
    </SectionShell>
  );
};
