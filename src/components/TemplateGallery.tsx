"use client";

import React from "react";

type Template = {
  id: string;
  name: string;
  description: string;
  status: "active" | "soon";
  gradient: string;
  emoji: string;
};

const TEMPLATES: Template[] = [
  {
    id: "youtube-countdown-intro",
    name: "YouTube Countdown Intro",
    description: "Pastel countdown intro for any video — Shorts, Reels or YouTube.",
    status: "active",
    gradient: "linear-gradient(135deg, #F6A7C1, #B9A7FF)",
    emoji: "⏱",
  },
  {
    id: "starting-soon",
    name: "Starting Soon Screen",
    description: "Soft animated starting soon screen for live streams.",
    status: "soon",
    gradient: "linear-gradient(135deg, #BFEAD8, #A8E6E2)",
    emoji: "🎬",
  },
  {
    id: "subscribe-anim",
    name: "Subscribe Animation",
    description: "Eye-catching subscribe button reveal with confetti accents.",
    status: "soon",
    gradient: "linear-gradient(135deg, #F7E68C, #F7C8A6)",
    emoji: "🔔",
  },
  {
    id: "channel-intro",
    name: "Channel Intro",
    description: "Quick branded opener that introduces your channel.",
    status: "soon",
    gradient: "linear-gradient(135deg, #B9A7FF, #F6A7C1)",
    emoji: "✨",
  },
  {
    id: "product-promo",
    name: "Product Promo Opener",
    description: "Soft promo opener for products and creator drops.",
    status: "soon",
    gradient: "linear-gradient(135deg, #F7C8A6, #F7E68C)",
    emoji: "🛍",
  },
  {
    id: "lower-third",
    name: "Lower Third Title",
    description: "Soft lower third title bar for podcasts or interviews.",
    status: "soon",
    gradient: "linear-gradient(135deg, #A8E6E2, #B9A7FF)",
    emoji: "🏷",
  },
];

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const TemplateGallery: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <section className="glass-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Template gallery</h2>
          <p className="text-sm text-mute">Pick a starting template.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((t) => {
          const isActive = t.status === "active";
          const isSelected = isActive && selectedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              disabled={!isActive}
              onClick={() => isActive && onSelect(t.id)}
              className={`text-left rounded-3xl p-5 transition-all border ${
                isSelected
                  ? "shadow-glass"
                  : "shadow-[0_8px_22px_rgba(142,113,161,0.10)]"
              } ${
                isActive
                  ? "hover:-translate-y-[2px] hover:shadow-glass cursor-pointer"
                  : "cursor-not-allowed opacity-70 hover:opacity-80"
              }`}
              style={{
                background: "rgba(255,255,255,0.78)",
                borderColor: isSelected
                  ? "rgba(155,124,246,0.55)"
                  : "rgba(255,255,255,0.85)",
                outline: isSelected ? "2px solid rgba(185,167,255,0.45)" : "none",
                outlineOffset: 2,
              }}
              aria-pressed={isSelected || undefined}
              aria-disabled={!isActive || undefined}
            >
              <div
                className="w-full h-24 rounded-2xl mb-4 flex items-center justify-center text-3xl"
                style={{ background: t.gradient, color: "white" }}
              >
                <span aria-hidden>{t.emoji}</span>
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-semibold text-ink text-sm leading-tight">
                  {t.name}
                </div>
                <span
                  className={`sn-pill shrink-0 ${
                    isActive ? "sn-pill-active" : "sn-pill-soon"
                  }`}
                >
                  {isActive ? "Active" : "Coming soon"}
                </span>
              </div>
              <p className="text-xs text-mute leading-snug">{t.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
