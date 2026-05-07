"use client";

import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { TemplateGallery } from "@/components/TemplateGallery";
import { CustomizePanel } from "@/components/CustomizePanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { RenderPanel } from "@/components/RenderPanel";
import { PromptBox } from "@/components/PromptBox";
import { SaveLoadSettings } from "@/components/SaveLoadSettings";
import { EmptyState } from "@/components/EmptyState";
import {
  countdownIntroDefaults,
  CountdownIntroProps,
} from "@/remotion/schemas/countdownSchema";
import { parseSettingsJson } from "@/lib/settingsStorage";

const STORAGE_KEY = "sn-motion:settings:v1";
const HAS_STARTED_KEY = "sn-motion:has-started:v1";

export default function HomePage() {
  const [props, setProps] = useState<CountdownIntroProps>(countdownIntroDefaults);
  const [hasStarted, setHasStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const result = parseSettingsJson(raw);
        if (result.ok) setProps(result.props);
      }
      const started = window.localStorage.getItem(HAS_STARTED_KEY);
      setHasStarted(started === "1");
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

  const handleStart = () => {
    setHasStarted(true);
    try {
      window.localStorage.setItem(HAS_STARTED_KEY, "1");
    } catch {
      // ignore
    }
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleLoadFromIntro = () => {
    setHasStarted(true);
    try {
      window.localStorage.setItem(HAS_STARTED_KEY, "1");
    } catch {
      // ignore
    }
    setTimeout(() => loadRef.current?.click(), 50);
  };

  const handleHeaderExport = () => {
    setHasStarted(true);
    setTimeout(() => {
      exportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

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
    <main className="min-h-screen w-full">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Header
          onSave={() => {
            const evt = new CustomEvent("sn-motion:save");
            window.dispatchEvent(evt);
          }}
          onExport={handleHeaderExport}
        />

        {!hasStarted && (
          <EmptyState onStart={handleStart} onLoad={handleLoadFromIntro} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-6">
          <div className="flex flex-col gap-6">
            <TemplateGallery
              selectedId="youtube-countdown-intro"
              onSelect={() => {
                /* only one template active */
              }}
            />
            <CustomizePanel value={props} onChange={setProps} />
            <PromptBox current={props} onApply={setProps} />
          </div>
          <div className="flex flex-col gap-6">
            <div ref={previewRef} className="scroll-mt-6">
              <PreviewPanel props={props} />
            </div>
            <div ref={exportRef} className="scroll-mt-6">
              <RenderPanel props={props} />
            </div>
            <SaveLoadSettings value={props} onChange={setProps} />
          </div>
        </div>

        <input
          ref={loadRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onHiddenFile}
        />

        <footer className="mt-10 text-center text-xs text-mute">
          SN Motion · soft pastel motion templates · made with care
        </footer>
      </div>
    </main>
  );
}
