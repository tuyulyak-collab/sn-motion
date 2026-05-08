"use client";

import React, { forwardRef } from "react";

type Props = {
  number: number;
  title: string;
  helper?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const StepCard = forwardRef<HTMLElement, Props>(function StepCard(
  { number, title, helper, children, footer },
  ref,
) {
  return (
    <section ref={ref} className="glass-card p-6 md:p-7 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-glass shrink-0"
          style={{
            background: "linear-gradient(135deg, #F6A7C1, #B9A7FF)",
            color: "white",
          }}
          aria-hidden
        >
          {number}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-ink leading-tight">
            {title}
          </h2>
          {helper ? (
            <p className="text-xs md:text-sm text-mute mt-1">{helper}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
      {footer ? (
        <div className="flex flex-wrap items-center gap-3 pt-1">{footer}</div>
      ) : null}
    </section>
  );
});
