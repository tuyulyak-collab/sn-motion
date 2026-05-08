"use client";

import React from "react";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { SectionShell } from "./SectionShell";
import { SectionId } from "./sectionDefs";

type Props = {
  props: CountdownIntroProps;
  onNavigate: (id: SectionId) => void;
};

export const DashboardSection: React.FC<Props> = ({ props, onNavigate }) => {
  const dimensions =
    props.aspectRatio === "16:9"
      ? "1920 × 1080"
      : props.aspectRatio === "9:16"
      ? "1080 × 1920"
      : "1080 × 1080";

  const totalSeconds = props.countdownSeconds + 2;

  return (
    <SectionShell sectionId="dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Current motion"
          value="Untitled motion"
          accent="linear-gradient(135deg, #F6A7C1, #B9A7FF)"
        />
        <SummaryCard
          label="Video size"
          value={`${props.aspectRatio} · ${dimensions}`}
          accent="linear-gradient(135deg, #BFEAD8, #A8E6E2)"
        />
        <SummaryCard
          label="Length"
          value={`${totalSeconds}s`}
          accent="linear-gradient(135deg, #F7E68C, #F7C8A6)"
        />
      </div>

      <section className="glass-card p-6 md:p-8">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-lg font-bold text-ink">Quick start</h2>
          <p className="text-sm text-mute">
            Pick where you want to go next. Everything stays inside one app —
            no timelines, no code editor.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            title="Create a single motion"
            description="Describe a motion idea and adjust video settings."
            cta="Open Single Motion"
            onClick={() => onNavigate("single-motion")}
            tone="lavender"
          />
          <ActionCard
            title="Live preview"
            description="Watch your motion play before you export."
            cta="Open Preview"
            onClick={() => onNavigate("preview")}
            tone="mint"
          />
          <ActionCard
            title="Export video"
            description="Render your motion as an MP4 file."
            cta="Open Export"
            onClick={() => onNavigate("export")}
            tone="pink"
          />
        </div>
      </section>

      <section className="glass-card p-6 md:p-8">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-lg font-bold text-ink">What&apos;s next</h2>
          <p className="text-sm text-mute">
            SN Motion is in early access. Batch generation is on the way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Highlight
            title="Batch Motion"
            description="Prepare multiple motion videos from a simple text file in one go."
            badge="Coming soon"
            badgeClass="sn-pill-soon"
            onClick={() => onNavigate("batch-motion")}
          />
          <Highlight
            title="Assets"
            description="Manage images, audio, and backgrounds in one place across motions."
            badge="Coming soon"
            badgeClass="sn-pill-soon"
            onClick={() => onNavigate("assets")}
          />
        </div>
      </section>
    </SectionShell>
  );
};

const SummaryCard: React.FC<{
  label: string;
  value: string;
  accent: string;
}> = ({ label, value, accent }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-2xl shadow-glass shrink-0"
      style={{ background: accent }}
      aria-hidden
    />
    <div className="min-w-0">
      <div className="text-[11px] text-mute uppercase tracking-wider">
        {label}
      </div>
      <div className="text-base font-semibold text-ink truncate">{value}</div>
    </div>
  </div>
);

const ActionCard: React.FC<{
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  tone: "lavender" | "mint" | "pink";
}> = ({ title, description, cta, onClick, tone }) => {
  const accent =
    tone === "lavender"
      ? "linear-gradient(135deg, rgba(185,167,255,0.35), rgba(168,230,226,0.35))"
      : tone === "mint"
      ? "linear-gradient(135deg, rgba(191,234,216,0.5), rgba(168,230,226,0.4))"
      : "linear-gradient(135deg, rgba(246,167,193,0.45), rgba(247,200,166,0.4))";
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-3xl p-5 transition-all border border-white/70 hover:-translate-y-[2px] hover:shadow-glass"
      style={{ background: accent }}
    >
      <div className="font-bold text-ink mb-1">{title}</div>
      <p className="text-sm text-mute mb-3">{description}</p>
      <span className="text-sm font-semibold text-[#6e57d6]">{cta} →</span>
    </button>
  );
};

const Highlight: React.FC<{
  title: string;
  description: string;
  badge: string;
  badgeClass: string;
  onClick: () => void;
}> = ({ title, description, badge, badgeClass, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-left rounded-3xl p-5 transition-all border border-white/70 bg-white/65 hover:-translate-y-[2px] hover:shadow-glass"
  >
    <div className="flex items-center gap-2 mb-1">
      <div className="font-bold text-ink">{title}</div>
      <span className={`sn-pill ${badgeClass}`}>{badge}</span>
    </div>
    <p className="text-sm text-mute">{description}</p>
  </button>
);
