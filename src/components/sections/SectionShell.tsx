"use client";

import React from "react";
import { findSection, SectionId } from "./sectionDefs";

type Props = {
  sectionId: SectionId;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export const SectionShell: React.FC<Props> = ({
  sectionId,
  children,
  actions,
}) => {
  const section = findSection(sectionId);
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              {section.label}
            </h1>
            <StatusBadge status={section.status} />
          </div>
          <p className="text-soft text-sm md:text-base mt-1 md:max-w-2xl">
            {section.helper}
          </p>
        </div>
        {actions ? (
          <div className="flex items-center gap-3 flex-wrap">{actions}</div>
        ) : null}
      </header>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ReturnType<typeof findSection>["status"] }> = ({
  status,
}) => {
  if (status === "active") {
    return null;
  }
  if (status === "advanced") {
    return <span className="sn-pill sn-pill-rendering">Advanced</span>;
  }
  return <span className="sn-pill sn-pill-soon">Coming soon</span>;
};
