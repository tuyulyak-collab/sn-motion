"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SectionIcon } from "@/components/sections/SectionIcon";
import {
  DEFAULT_SECTION,
  findSection,
  SectionId,
  SECTIONS,
} from "@/components/sections/sectionDefs";

type Props = {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  onSave: () => void;
  onExport: () => void;
  children: React.ReactNode;
};

const isSectionId = (value: string | null): value is SectionId =>
  !!value && SECTIONS.some((s) => s.id === value);

export const AppShell: React.FC<Props> = ({
  active,
  onSelect,
  onSave,
  onExport,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const section = findSection(active);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <div className="hidden lg:block">
            <Sidebar active={active} onSelect={onSelect} variant="rail" />
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <TopBar
              sectionLabel={section.label}
              onOpenMenu={() => setDrawerOpen(true)}
              onSave={onSave}
              onExport={onExport}
            />
            <main className="min-w-0">{children}</main>
            <footer className="mt-6 text-center text-xs text-mute">
              SN Motion · soft pastel motion templates · made with care
            </footer>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[rgba(47,43,58,0.35)] backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] p-3">
            <Sidebar
              active={active}
              onSelect={(id) => {
                onSelect(id);
                setDrawerOpen(false);
              }}
              variant="drawer"
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { isSectionId, DEFAULT_SECTION };

const TopBar: React.FC<{
  sectionLabel: string;
  onOpenMenu: () => void;
  onSave: () => void;
  onExport: () => void;
}> = ({ sectionLabel, onOpenMenu, onSave, onExport }) => {
  return (
    <div className="glass-card px-4 sm:px-5 py-3 flex items-center gap-3">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="lg:hidden rounded-2xl p-2 text-mute hover:text-ink hover:bg-white/70 transition"
      >
        <SectionIcon name="menu" className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-xs text-mute uppercase tracking-wider hidden sm:inline">
          SN Motion
        </span>
        <span className="text-mute hidden sm:inline" aria-hidden>
          /
        </span>
        <span className="font-semibold text-ink truncate">{sectionLabel}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onSave}
          className="sn-button-secondary"
        >
          Save settings
        </button>
        <button
          type="button"
          onClick={onExport}
          className="sn-button-primary"
        >
          Export video
        </button>
      </div>
    </div>
  );
};
