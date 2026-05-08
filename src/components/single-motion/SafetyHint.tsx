"use client";

import React, { useMemo } from "react";
import { scanText, fieldRiskFromMatches } from "@/lib/stockSafety";
import { SafetyBadge } from "./SafetyBadge";

type Props = {
  fieldLabel: string;
  text: string;
  reminder?: string;
  className?: string;
};

const DEFAULT_REMINDER =
  "Stock-safe tip: avoid brand names, logos, public figures, copyrighted characters, and \"official / certified / guaranteed\" claims here.";

export const SafetyHint: React.FC<Props> = ({
  fieldLabel,
  text,
  reminder,
  className = "",
}) => {
  const matches = useMemo(() => scanText(text), [text]);
  const risk = fieldRiskFromMatches(matches);

  return (
    <div
      className={`mt-2 rounded-2xl border border-white/70 bg-white/55 px-3 py-2 text-[11px] leading-snug text-soft ${className}`}
      data-testid="safety-hint"
      data-field={fieldLabel}
      data-risk-level={risk}
    >
      <div className="flex items-center gap-2">
        <SafetyBadge level={risk} size="xs" />
        <span className="font-semibold text-mute">{fieldLabel}</span>
      </div>
      {matches.length === 0 ? (
        <p className="mt-1.5">{reminder ?? DEFAULT_REMINDER}</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {matches.map((m) => (
            <li key={`${fieldLabel}-${m.term}`}>
              <span className="font-semibold text-ink">“{m.term}”</span>{" "}
              <span>{m.explanation}</span>{" "}
              <span className="text-mute">{m.saferDirection}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
