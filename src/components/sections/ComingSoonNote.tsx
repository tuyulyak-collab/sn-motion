"use client";

import React from "react";

type Props = {
  title: string;
  description: string;
  bullets?: string[];
  variant?: "advanced" | "soon";
};

export const ComingSoonNote: React.FC<Props> = ({
  title,
  description,
  bullets,
  variant = "soon",
}) => {
  const tone =
    variant === "advanced"
      ? {
          background:
            "linear-gradient(135deg, rgba(185,167,255,0.18), rgba(168,230,226,0.18))",
          border: "1px solid rgba(185,167,255,0.45)",
          accent: "#6e57d6",
        }
      : {
          background:
            "linear-gradient(135deg, rgba(247,200,166,0.22), rgba(247,230,140,0.22))",
          border: "1px solid rgba(247,200,166,0.55)",
          accent: "#8a4a2a",
        };

  return (
    <section
      className="glass-card p-8 md:p-10"
      style={{ background: tone.background, border: tone.border }}
    >
      <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-glass"
          style={{
            background: "rgba(255,255,255,0.7)",
            color: tone.accent,
          }}
          aria-hidden
        >
          {variant === "advanced" ? "✦" : "⏳"}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            <span
              className={`sn-pill ${
                variant === "advanced" ? "sn-pill-rendering" : "sn-pill-soon"
              }`}
            >
              {variant === "advanced" ? "Advanced preview" : "Coming soon"}
            </span>
          </div>
          <p className="text-mute mt-2 md:max-w-xl">{description}</p>
        </div>
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li
              key={b}
              className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-ink"
            >
              <span className="text-mute mr-2">·</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
