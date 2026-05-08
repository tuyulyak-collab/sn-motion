"use client";

import React from "react";

type Option<T> = {
  value: T;
  label: string;
  helper?: string;
  disabled?: boolean;
};

type Props<T> = {
  label?: string;
  helper?: string;
  options: Array<Option<T>>;
  value: T;
  onChange: (next: T) => void;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md";
};

export function SegmentedField<T extends string | number>({
  label,
  helper,
  options,
  value,
  onChange,
  columns = 3,
  size = "md",
}: Props<T>) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";

  const padding = size === "sm" ? "px-3 py-2" : "px-3 py-2.5";

  return (
    <div>
      {label ? <label className="sn-label">{label}</label> : null}
      <div className={`grid ${colClass} gap-2`}>
        {options.map((opt) => {
          const active = value === opt.value;
          const disabled = !!opt.disabled;
          return (
            <button
              type="button"
              key={String(opt.value)}
              disabled={disabled}
              aria-pressed={active}
              onClick={() => !disabled && onChange(opt.value)}
              className={`rounded-2xl ${padding} text-left border transition text-sm font-semibold ${
                active ? "text-ink shadow-glass" : "text-ink/70"
              } ${disabled ? "opacity-55 cursor-not-allowed" : "hover:bg-white/80"}`}
              style={{
                background: active
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.55)",
                borderColor: active
                  ? "rgba(155,124,246,0.55)"
                  : "rgba(255,255,255,0.7)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="leading-tight">{opt.label}</span>
                {disabled ? (
                  <span className="ml-auto sn-pill sn-pill-soon !text-[10px] !py-[2px] !px-2">
                    Soon
                  </span>
                ) : null}
              </div>
              {opt.helper ? (
                <div className="text-[11px] text-soft font-normal mt-0.5">
                  {opt.helper}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
      {helper ? (
        <p className="text-xs text-soft mt-2">{helper}</p>
      ) : null}
    </div>
  );
}
