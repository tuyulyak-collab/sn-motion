"use client";

import React from "react";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";

export const BatchSection: React.FC = () => {
  return (
    <SectionShell sectionId="batch-motion">
      <ComingSoonNote
        variant="soon"
        title="Generate many intros at once"
        description="Drop a small text or CSV file with one intro per line. SN Motion will create a video for each row using your active template."
        bullets={[
          "Plain text or CSV input",
          "One row = one intro",
          "Reuses your current template settings",
          "Per-row override for channel name and final text",
        ]}
      />
    </SectionShell>
  );
};
