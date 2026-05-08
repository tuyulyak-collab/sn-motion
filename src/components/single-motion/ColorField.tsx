"use client";

import React from "react";
import { safeHex } from "@/lib/motionSettings";

type Props = {
  value: string;
  onChange: (next: string) => void;
  ariaLabel: string;
  inputId?: string;
};

export const ColorField: React.FC<Props> = ({
  value,
  onChange,
  ariaLabel,
  inputId,
}) => {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-3 py-2"
      style={{
        background: "rgba(255,255,255,0.78)",
        borderColor: "rgba(185,167,255,0.28)",
      }}
    >
      <input
        type="color"
        value={safeHex(value, "#000000")}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-9 h-9 rounded-full border-0 bg-transparent cursor-pointer"
        aria-label={ariaLabel}
      />
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm font-mono text-ink"
        spellCheck={false}
      />
    </div>
  );
};
