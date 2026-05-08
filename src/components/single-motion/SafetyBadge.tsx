"use client";

import React from "react";
import { RISK_LEVEL_LABEL, type RiskLevel } from "@/lib/stockSafety";

type Props = {
  level: RiskLevel;
  label?: string;
  size?: "xs" | "sm";
  className?: string;
  testId?: string;
};

const PILL_CLASS: Record<RiskLevel, string> = {
  safe: "sn-pill sn-pill-active",
  "needs-review": "sn-pill sn-pill-idle",
  risky: "sn-pill sn-pill-failed",
};

export const SafetyBadge: React.FC<Props> = ({
  level,
  label,
  size = "sm",
  className = "",
  testId,
}) => {
  const text = label ?? RISK_LEVEL_LABEL[level];
  const sizeClass = size === "xs" ? "text-[10px] py-[2px] px-[8px]" : "";
  return (
    <span
      className={`${PILL_CLASS[level]} ${sizeClass} ${className}`.trim()}
      data-testid={testId}
      data-risk-level={level}
    >
      {text}
    </span>
  );
};
