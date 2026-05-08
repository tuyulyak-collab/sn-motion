"use client";

import React, { useEffect, useRef, useState } from "react";
import { AppShell, isSectionId } from "@/components/AppShell";
import { DashboardSection } from "@/components/sections/DashboardSection";
import { SingleMotionSection } from "@/components/sections/SingleMotionSection";
import { PreviewSection } from "@/components/sections/PreviewSection";
import { ExportSection } from "@/components/sections/ExportSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { BatchSection } from "@/components/sections/BatchSection";
import { AssetsSection } from "@/components/sections/AssetsSection";
import { ActivityLogSection } from "@/components/sections/ActivityLogSection";
import { DEFAULT_SECTION, SectionId } from "@/components/sections/sectionDefs";
import {
  countdownIntroDefaults,
  CountdownIntroProps,
} from "@/remotion/schemas/countdownSchema";
import {
  MotionSettings,
  motionSettingsDefaults,
} from "@/lib/motionSettings";
import { parseSettingsJson } from "@/lib/settingsStorage";

const STORAGE_KEY = "sn-motion:settings:v1";
const SECTION_KEY = "sn-motion:section:v1";

export default function HomePage() {
  const [props, setProps] = useState<CountdownIntroProps>(countdownIntroDefaults);
  const [motionSettings, setMotionSettings] = useState<MotionSettings>(
    motionSettingsDefaults,
  );
  const [active, setActive] = useState<SectionId>(DEFAULT_SECTION);
  const [hydrated, setHydrated] = useState(false);
  const loadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const result = parseSettingsJson(raw);
        if (result.ok) setProps(result.props);
      }
      const savedSection = window.localStorage.getItem(SECTION_KEY);
      if (isSectionId(savedSection)) {
        setActive(savedSection);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
    } catch {
      // ignore
    }
  }, [props, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SECTION_KEY, active);
    } catch {
      // ignore
    }
  }, [active, hydrated]);

  const onHiddenFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const text = await f.text();
    const result = parseSettingsJson(text);
    if (result.ok) {
      setProps(result.props);
    }
  };

  return (
    <AppShell active={active} onSelect={setActive}>
      {active === "dashboard" && (
        <DashboardSection props={props} onNavigate={setActive} />
      )}
      {active === "single-motion" && (
        <SingleMotionSection
          settings={motionSettings}
          onSettingsChange={setMotionSettings}
          onSelect={setActive}
        />
      )}
      {active === "batch-motion" && <BatchSection />}
      {active === "preview" && <PreviewSection props={props} />}
      {active === "export" && <ExportSection props={props} />}
      {active === "assets" && <AssetsSection />}
      {active === "settings" && (
        <SettingsSection value={props} onChange={setProps} />
      )}
      {active === "activity-log" && <ActivityLogSection />}

      <input
        ref={loadRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onHiddenFile}
      />
    </AppShell>
  );
}
