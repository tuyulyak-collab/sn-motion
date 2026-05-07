"use client";

import React from "react";
import { CustomizePanel } from "@/components/CustomizePanel";
import { PromptBox } from "@/components/PromptBox";
import {
  CountdownIntroProps,
  countdownIntroDefaults,
} from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";

type Props = {
  props: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
};

type QuickStart = {
  id: string;
  name: string;
  blurb: string;
  status: "available" | "soon";
  gradient: string;
  emoji: string;
};

const QUICK_STARTS: QuickStart[] = [
  {
    id: "youtube-countdown-intro",
    name: "YouTube Countdown Intro",
    blurb: "Pastel countdown intro for any video — Shorts, Reels or YouTube.",
    status: "available",
    gradient: "linear-gradient(135deg, #F6A7C1, #B9A7FF)",
    emoji: "⏱",
  },
  {
    id: "starting-soon",
    name: "Starting Soon Screen",
    blurb: "Soft animated starting soon screen for live streams.",
    status: "soon",
    gradient: "linear-gradient(135deg, #BFEAD8, #A8E6E2)",
    emoji: "🎬",
  },
  {
    id: "subscribe-anim",
    name: "Subscribe Animation",
    blurb: "Eye-catching subscribe button reveal with confetti accents.",
    status: "soon",
    gradient: "linear-gradient(135deg, #F7E68C, #F7C8A6)",
    emoji: "🔔",
  },
];

export const SingleMotionSection: React.FC<Props> = ({ props, onChange }) => {
  const handleQuickStart = (id: string) => {
    if (id === "youtube-countdown-intro") {
      onChange(countdownIntroDefaults);
    }
  };

  return (
    <SectionShell sectionId="single-motion">
      <Step number={1} title="Describe your motion idea (optional)">
        <PromptBox current={props} onApply={onChange} />
      </Step>

      <Step
        number={2}
        title="Quick start motion type (optional)"
        helper="Skip this if you already described the motion you want above."
      >
        <div className="glass-card p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_STARTS.map((q) => (
              <QuickStartCard
                key={q.id}
                quick={q}
                onSelect={() => handleQuickStart(q.id)}
              />
            ))}
          </div>
        </div>
      </Step>

      <Step
        number={3}
        title="Adjust video settings"
        helper="Channel name, length, video size, theme, colors and final text."
      >
        <CustomizePanel value={props} onChange={onChange} />
      </Step>

      <p className="text-sm text-mute">
        Next: open <span className="font-semibold text-ink">Preview</span> to
        watch your motion play, then{" "}
        <span className="font-semibold text-ink">Export</span> to render the
        MP4.
      </p>
    </SectionShell>
  );
};

const Step: React.FC<{
  number: number;
  title: string;
  helper?: string;
  children: React.ReactNode;
}> = ({ number, title, helper, children }) => (
  <section className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-glass"
        style={{
          background: "linear-gradient(135deg, #F6A7C1, #B9A7FF)",
          color: "white",
        }}
        aria-hidden
      >
        {number}
      </span>
      <div>
        <div className="font-bold text-ink">{title}</div>
        {helper ? (
          <div className="text-xs text-mute">{helper}</div>
        ) : null}
      </div>
    </div>
    {children}
  </section>
);

const QuickStartCard: React.FC<{
  quick: QuickStart;
  onSelect: () => void;
}> = ({ quick, onSelect }) => {
  const isAvailable = quick.status === "available";
  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={onSelect}
      className={`text-left rounded-3xl p-4 transition-all border ${
        isAvailable
          ? "hover:-translate-y-[2px] hover:shadow-glass cursor-pointer"
          : "cursor-not-allowed opacity-70"
      }`}
      style={{
        background: "rgba(255,255,255,0.78)",
        borderColor: "rgba(255,255,255,0.85)",
      }}
    >
      <div
        className="w-full h-20 rounded-2xl mb-3 flex items-center justify-center text-2xl"
        style={{ background: quick.gradient, color: "white" }}
      >
        <span aria-hidden>{quick.emoji}</span>
      </div>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-semibold text-ink text-sm leading-tight">
          {quick.name}
        </div>
        <span
          className={`sn-pill shrink-0 ${
            isAvailable ? "sn-pill-active" : "sn-pill-soon"
          }`}
        >
          {isAvailable ? "Use" : "Coming soon"}
        </span>
      </div>
      <p className="text-xs text-mute leading-snug">{quick.blurb}</p>
    </button>
  );
};
