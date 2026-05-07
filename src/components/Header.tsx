"use client";

import React from "react";

type Props = {
  onExport: () => void;
  onSave: () => void;
  exportDisabled?: boolean;
};

export const Header: React.FC<Props> = ({ onExport, onSave, exportDisabled }) => {
  return (
    <header className="glass-card mb-6 px-7 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-extrabold text-lg shadow-glass"
          aria-hidden
        >
          SN
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              SN Motion
            </h1>
            <span className="sn-pill sn-pill-active">Soft pastel</span>
          </div>
          <p className="text-mute text-sm md:max-w-[520px]">
            Create reusable motion videos without complex timelines.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="sn-button-secondary" onClick={onSave} type="button">
          Save settings
        </button>
        <button
          className="sn-button-primary"
          onClick={onExport}
          disabled={exportDisabled}
          type="button"
        >
          Export video
        </button>
      </div>
    </header>
  );
};
