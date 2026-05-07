"use client";

import React from "react";

type Props = {
  onStart: () => void;
  onLoad: () => void;
};

export const EmptyState: React.FC<Props> = ({ onStart, onLoad }) => {
  return (
    <section className="glass-card p-10 mb-6 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 12% 12%, rgba(246,167,193,0.35), transparent 38%), radial-gradient(circle at 90% 18%, rgba(185,167,255,0.32), transparent 32%), radial-gradient(circle at 60% 90%, rgba(191,234,216,0.36), transparent 36%)",
        }}
      />
      <div className="max-w-2xl">
        <div className="sn-pill sn-pill-active mb-3">Welcome</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">
          Create motion intros in minutes.
        </h2>
        <p className="text-mute mt-3 md:text-lg">
          Choose a template, customize the details, preview the animation, and export your video.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <button type="button" onClick={onStart} className="sn-button-primary">
            Start with YouTube Countdown Intro
          </button>
          <button type="button" onClick={onLoad} className="sn-button-secondary">
            Load saved settings
          </button>
        </div>
      </div>
    </section>
  );
};
