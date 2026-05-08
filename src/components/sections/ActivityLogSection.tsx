"use client";

import React from "react";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";

export const ActivityLogSection: React.FC = () => {
  return (
    <SectionShell sectionId="activity-log">
      <ComingSoonNote
        variant="soon"
        title="A simple, beginner-friendly history"
        description="See what SN Motion did and when — no terminal, no logs to read. Generation status, export status, and saved settings will appear here."
        bullets={[
          "Last few exports with download links",
          "Successful and failed generations",
          "Settings save / load events",
          "Friendly, plain-English status messages",
        ]}
      />
    </SectionShell>
  );
};
