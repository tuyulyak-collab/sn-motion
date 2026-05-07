"use client";

import React from "react";
import {
  SECTIONS,
  SectionId,
  SectionStatus,
} from "@/components/sections/sectionDefs";
import { SectionIcon } from "@/components/sections/SectionIcon";

type Props = {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  variant?: "rail" | "drawer";
  onClose?: () => void;
};

export const Sidebar: React.FC<Props> = ({
  active,
  onSelect,
  variant = "rail",
  onClose,
}) => {
  return (
    <aside
      className={`glass-card flex flex-col gap-2 p-4 ${
        variant === "rail"
          ? "h-full sticky top-6"
          : "h-full w-[280px] rounded-r-3xl rounded-l-none"
      }`}
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <div
          className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-extrabold text-sm shadow-glass"
          aria-hidden
        >
          SN
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink leading-tight">SN Motion</div>
          <div className="text-[11px] text-mute uppercase tracking-wider">
            Soft pastel motion
          </div>
        </div>
        {variant === "drawer" && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 text-mute hover:text-ink hover:bg-white/70 transition"
          >
            <SectionIcon name="close" className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 mt-1" aria-label="Primary">
        {SECTIONS.map((section) => {
          const isActive = section.id === active;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                onSelect(section.id);
                onClose?.();
              }}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all border ${
                isActive
                  ? "border-[rgba(155,124,246,0.45)] shadow-[0_10px_28px_rgba(155,124,246,0.18)]"
                  : "border-transparent hover:border-white/70"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(246,167,193,0.35), rgba(185,167,255,0.35))"
                  : "rgba(255,255,255,0.5)",
                color: isActive ? "#3a2d6e" : "var(--sn-text-main)",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                  isActive
                    ? "bg-white/80 text-[#6e57d6]"
                    : "bg-white/65 text-[var(--sn-text-muted)] group-hover:text-[#6e57d6]"
                }`}
                aria-hidden
              >
                <SectionIcon name={section.icon} className="w-4 h-4" />
              </span>
              <span className="flex-1 text-left truncate">{section.label}</span>
              <StatusDot status={section.status} />
            </button>
          );
        })}
      </nav>

      <div
        className="mt-auto rounded-2xl p-3 text-xs text-mute"
        style={{
          background:
            "linear-gradient(135deg, rgba(247,230,140,0.35), rgba(191,234,216,0.4))",
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      >
        Beginner-friendly motion intros — no timeline, no code.
      </div>
    </aside>
  );
};

const StatusDot: React.FC<{ status: SectionStatus }> = ({ status }) => {
  if (status === "active") return null;
  const label = status === "advanced" ? "Advanced" : "Coming soon";
  const cls =
    status === "advanced" ? "sn-pill sn-pill-rendering" : "sn-pill sn-pill-soon";
  return (
    <span className={`${cls} hidden lg:inline-flex`} aria-label={label}>
      {status === "advanced" ? "Adv" : "Soon"}
    </span>
  );
};
