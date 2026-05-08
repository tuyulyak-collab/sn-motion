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
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export const Sidebar: React.FC<Props> = ({
  active,
  onSelect,
  variant = "rail",
  onClose,
  collapsed = false,
  onToggleCollapsed,
}) => {
  const isRail = variant === "rail";
  const isCollapsed = isRail && collapsed;

  return (
    <aside
      className={`glass-card flex flex-col gap-2 ${
        isCollapsed ? "p-2" : "p-4"
      } ${
        isRail
          ? "h-full sticky top-6"
          : "h-full w-[280px] rounded-r-3xl rounded-l-none"
      }`}
      data-collapsed={isCollapsed ? "true" : "false"}
      data-testid="sidebar"
      aria-label={
        isCollapsed ? "Primary navigation (collapsed)" : "Primary navigation"
      }
    >
      <div
        className={`flex items-center gap-3 ${
          isCollapsed ? "px-0 py-2 justify-center" : "px-2 py-2"
        }`}
      >
        <div
          className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-extrabold text-sm shadow-glass shrink-0"
          aria-hidden
        >
          SN
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-bold text-ink leading-tight">SN Motion</div>
            <div className="text-[11px] text-mute uppercase tracking-wider">
              Soft pastel motion
            </div>
          </div>
        )}
        {variant === "drawer" && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 text-mute hover:text-ink hover:bg-white/70 transition shrink-0"
          >
            <SectionIcon name="close" className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav
        className={`flex flex-col gap-1 mt-1 ${
          isCollapsed ? "items-center" : ""
        }`}
        aria-label="Primary"
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === active;
          return (
            <button
              key={section.id}
              type="button"
              data-testid={`nav-${section.id}`}
              onClick={() => {
                onSelect(section.id);
                onClose?.();
              }}
              title={isCollapsed ? section.label : undefined}
              aria-label={isCollapsed ? section.label : undefined}
              className={`group/navbtn relative flex items-center transition-all border ${
                isCollapsed
                  ? "justify-center w-12 h-12 rounded-2xl"
                  : "gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium"
              } ${
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
                  isActive
                    ? "bg-white/80 text-[#6e57d6]"
                    : "bg-white/65 text-[var(--sn-text-muted)] group-hover/navbtn:text-[#6e57d6]"
                }`}
                aria-hidden
              >
                <SectionIcon name={section.icon} className="w-4 h-4" />
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">
                    {section.label}
                  </span>
                  <StatusDot status={section.status} />
                </>
              )}
              {isCollapsed && (
                <span
                  role="tooltip"
                  data-testid={`nav-tooltip-${section.id}`}
                  className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 glass-card-soft px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--sn-text-main)] shadow-glass opacity-0 -translate-x-1 group-hover/navbtn:opacity-100 group-hover/navbtn:translate-x-0 group-focus-visible/navbtn:opacity-100 group-focus-visible/navbtn:translate-x-0 transition-all duration-150 z-30"
                >
                  {section.label}
                  {section.status !== "active" && (
                    <span
                      className={`ml-2 ${
                        section.status === "advanced"
                          ? "sn-pill sn-pill-rendering"
                          : "sn-pill sn-pill-soon"
                      }`}
                      aria-hidden
                    >
                      {section.status === "advanced" ? "Adv" : "Soon"}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
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
      )}

      {isRail && onToggleCollapsed && (
        <div
          className={`${
            isCollapsed ? "mt-auto pt-2" : "pt-2"
          } flex ${isCollapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            type="button"
            onClick={onToggleCollapsed}
            data-testid="sidebar-collapse-toggle"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-full p-2 text-mute hover:text-ink hover:bg-white/70 transition border border-white/60"
          >
            <SectionIcon
              name="chevron"
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      )}
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
