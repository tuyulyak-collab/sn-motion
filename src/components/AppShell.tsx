"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  children: React.ReactNode;
};

const SIDEBAR_COLLAPSED_KEY = "sn-motion:sidebar-collapsed:v1";

const isSectionId = (value: string | null): value is SectionId =>
  !!value && SECTIONS.some((s) => s.id === value);

export const AppShell: React.FC<Props> = ({
  active,
  onSelect,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedHydrated, setCollapsedHydrated] = useState(false);
  const section = findSection(active);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (raw === "true") setCollapsed(true);
    } catch {
      // ignore
    } finally {
      setCollapsedHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!collapsedHydrated) return;
    try {
      window.localStorage.setItem(
        SIDEBAR_COLLAPSED_KEY,
        collapsed ? "true" : "false",
      );
    } catch {
      // ignore
    }
  }, [collapsed, collapsedHydrated]);

  const onToggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  // Tailwind needs full class strings present statically so JIT picks them up.
  const gridColsClass = collapsed
    ? "lg:grid-cols-[80px_minmax(0,1fr)]"
    : "lg:grid-cols-[280px_minmax(0,1fr)]";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div
          className={`grid grid-cols-1 ${gridColsClass} gap-6 transition-[grid-template-columns] duration-200 ease-out`}
          data-sidebar-collapsed={collapsed ? "true" : "false"}
        >
          <div className="hidden lg:block" data-testid="sidebar-rail-slot">
            <Sidebar
              active={active}
              onSelect={onSelect}
              variant="rail"
              collapsed={collapsed}
              onToggleCollapsed={onToggleCollapsed}
            />
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <TopBar
              sectionLabel={section.label}
              onOpenMenu={() => setDrawerOpen(true)}
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
}> = ({ sectionLabel, onOpenMenu }) => {
  return (
    <div className="glass-card px-4 sm:px-5 py-3 flex items-center gap-3">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="lg:hidden rounded-2xl p-2 text-soft hover:text-ink hover:bg-white/70 transition"
      >
        <SectionIcon name="menu" className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-xs text-soft uppercase tracking-wider hidden sm:inline">
          SN Motion
        </span>
        <span className="text-soft hidden sm:inline" aria-hidden>
          /
        </span>
        <span className="font-semibold text-ink truncate">{sectionLabel}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Save settings is coming soon"
          className="sn-button-secondary inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
        >
          <span>Save settings</span>
          <span className="sn-pill sn-pill-soon" aria-hidden>
            Soon
          </span>
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Export video is coming soon"
          className="sn-button-primary inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
        >
          <span>Export video</span>
          <span
            className="sn-pill sn-pill-soon"
            aria-hidden
            style={{ background: "rgba(255,255,255,0.85)", color: "#8a4a2a" }}
          >
            Soon
          </span>
        </button>
      </div>
    </div>
  );
};
