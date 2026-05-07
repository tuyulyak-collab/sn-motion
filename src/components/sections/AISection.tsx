"use client";

import React from "react";
import { SectionShell } from "./SectionShell";
import { ComingSoonNote } from "./ComingSoonNote";
import { SectionId } from "./sectionDefs";

type Props = {
  onNavigate: (id: SectionId) => void;
};

export const AISection: React.FC<Props> = ({ onNavigate }) => {
  return (
    <SectionShell sectionId="ai-motion-generator">
      <section className="glass-card p-6 md:p-8">
        <div className="flex items-start gap-4 flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink mb-1">
              Describe your intro in plain English
            </h2>
            <p className="text-sm text-mute md:max-w-xl">
              The full AI-powered generator is on the way. For now, the
              built-in description tool inside Templates already maps simple
              phrases like &quot;10 seconds, pink and lavender, square&quot;
              into supported settings — without any external service.
            </p>
          </div>
          <button
            type="button"
            className="sn-button-primary"
            onClick={() => onNavigate("templates")}
          >
            Open description tool
          </button>
        </div>
      </section>
      <ComingSoonNote
        variant="advanced"
        title="What the full AI Motion Generator will do"
        description="A guided assistant for non-technical creators. SN Motion will keep it safe by only writing into supported template fields — never arbitrary code."
        bullets={[
          "Suggest a template from a short brief",
          "Auto-fill colors, theme, length, and copy",
          "Stay strictly within supported template settings",
          "Preview the result in the Preview section",
        ]}
      />
    </SectionShell>
  );
};
