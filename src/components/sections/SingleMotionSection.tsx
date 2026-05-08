"use client";

import React, { useCallback, useRef, useState } from "react";
import { MockPreview } from "@/components/single-motion/MockPreview";
import { MotionBriefStep } from "@/components/single-motion/MotionBriefStep";
import { SceneStyleStep } from "@/components/single-motion/SceneStyleStep";
import { StepCard } from "@/components/single-motion/StepCard";
import { VideoSettingsStep } from "@/components/single-motion/VideoSettingsStep";
import {
  MotionSettings,
  motionSettingsDefaults,
  sanitizeMotionSettings,
} from "@/lib/motionSettings";
import { SectionShell } from "./SectionShell";
import { SectionId } from "./sectionDefs";

type Props = {
  settings: MotionSettings;
  onSettingsChange: (next: MotionSettings) => void;
  onSelect: (id: SectionId) => void;
};

const STEP_TITLES = [
  {
    title: "Motion brief",
    helper: "Describe the motion idea and pick its animation backbone.",
  },
  {
    title: "Scene & style",
    helper: "Set the words, mood, and palette for the motion.",
  },
  {
    title: "Video settings",
    helper:
      "Choose the technical output — duration, aspect ratio, resolution, and stage timing.",
  },
] as const;

export const SingleMotionSection: React.FC<Props> = ({
  settings,
  onSettingsChange,
  onSelect,
}) => {
  const step1Ref = useRef<HTMLElement>(null);
  const step2Ref = useRef<HTMLElement>(null);
  const step3Ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewVersion, setPreviewVersion] = useState(0);

  const setField = useCallback(
    <K extends keyof MotionSettings>(key: K, next: MotionSettings[K]) => {
      onSettingsChange({ ...settings, [key]: next });
    },
    [onSettingsChange, settings],
  );

  const scrollToRef = useCallback((ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleGeneratePreview = useCallback(() => {
    const cleaned = sanitizeMotionSettings(settings);
    if (
      cleaned.introLength !== settings.introLength ||
      cleaned.holdLength !== settings.holdLength ||
      cleaned.outroLength !== settings.outroLength
    ) {
      onSettingsChange(cleaned);
    }
    setPreviewVersion((v) => v + 1);
    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [settings, onSettingsChange]);

  const handleReset = useCallback(() => {
    onSettingsChange(motionSettingsDefaults);
    setPreviewVersion((v) => v + 1);
  }, [onSettingsChange]);

  const handleGoToPreview = useCallback(() => {
    onSelect("preview");
  }, [onSelect]);

  return (
    <SectionShell sectionId="single-motion">
      <StepCard
        ref={step1Ref}
        number={1}
        title={STEP_TITLES[0].title}
        helper={STEP_TITLES[0].helper}
        footer={
          <div className="ml-auto">
            <button
              type="button"
              className="sn-button-primary"
              onClick={() => scrollToRef(step2Ref)}
            >
              Next: Scene &amp; style →
            </button>
          </div>
        }
      >
        <MotionBriefStep value={settings} onChange={setField} />
      </StepCard>

      <StepCard
        ref={step2Ref}
        number={2}
        title={STEP_TITLES[1].title}
        helper={STEP_TITLES[1].helper}
        footer={
          <>
            <button
              type="button"
              className="sn-button-secondary"
              onClick={() => scrollToRef(step1Ref)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="sn-button-primary ml-auto"
              onClick={() => scrollToRef(step3Ref)}
            >
              Next: Video settings →
            </button>
          </>
        }
      >
        <SceneStyleStep value={settings} onChange={setField} />
      </StepCard>

      <StepCard
        ref={step3Ref}
        number={3}
        title={STEP_TITLES[2].title}
        helper={STEP_TITLES[2].helper}
        footer={
          <>
            <button
              type="button"
              className="sn-button-secondary"
              onClick={() => scrollToRef(step2Ref)}
            >
              ← Back
            </button>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                className="sn-button-secondary"
                onClick={handleReset}
              >
                Reset settings
              </button>
              <button
                type="button"
                className="sn-button-primary"
                onClick={handleGeneratePreview}
              >
                Generate preview
              </button>
              <button
                type="button"
                className="sn-button-secondary"
                onClick={handleGoToPreview}
              >
                Go to Preview →
              </button>
            </div>
          </>
        }
      >
        <VideoSettingsStep value={settings} onChange={setField} />
      </StepCard>

      <MockPreview
        ref={previewRef}
        settings={settings}
        version={previewVersion}
      />
    </SectionShell>
  );
};
