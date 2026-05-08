"use client";

import React, { useMemo } from "react";
import { MotionSettings } from "@/lib/motionSettings";
import {
  RISK_CATEGORY_LABEL,
  STOCK_SAFETY_CHECKLIST_ITEMS,
  computeStockSafetyStatus,
  scanMotionSettings,
  stockSafetyChecklistFromSettings,
  type FieldScan,
  type StockSafetyChecklistKey,
} from "@/lib/stockSafety";
import { SafetyBadge } from "./SafetyBadge";

type Props = {
  settings: MotionSettings;
  onChange: <K extends keyof MotionSettings>(
    key: K,
    next: MotionSettings[K],
  ) => void;
};

const STATUS_HEADLINE = {
  safe: "Stock-safe so far — keep it that way through export.",
  "needs-review": "Almost there — finish the checklist or revise flagged text.",
  risky: "Some content looks risky for microstock — please revise before export.",
} as const;

export const StockSafetyPanel: React.FC<Props> = ({ settings, onChange }) => {
  const scanReport = useMemo(() => scanMotionSettings(settings), [settings]);
  const checklist = useMemo(
    () => stockSafetyChecklistFromSettings(settings),
    [settings],
  );
  const status = useMemo(
    () => computeStockSafetyStatus(scanReport, checklist),
    [scanReport, checklist],
  );

  const setChecklist = (key: StockSafetyChecklistKey, next: boolean) => {
    onChange(key, next);
  };

  return (
    <section
      className="glass-card p-6 md:p-7 flex flex-col gap-5"
      aria-label="Global stock safety"
      data-testid="stock-safety-panel"
      data-status={status.status}
      data-scanner-risk={status.scannerRisk}
      data-checklist-complete={String(status.checklistComplete)}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink">Stock safety</h2>
            <span className="sn-pill sn-pill-rendering">Global</span>
          </div>
          <p className="text-xs text-soft mt-1 max-w-prose">
            SN Motion is built for microstock submissions, so these checks run
            on every motion automatically — there is no separate stock preset
            or stock mode. This is guidance only and not a legal guarantee;
            final responsibility for compliant content is yours.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <SafetyBadge level={status.status} testId="stock-safety-overall-badge" />
          <p className="text-[11px] text-mute max-w-[260px] sm:text-right">
            {STATUS_HEADLINE[status.status]}
          </p>
        </div>
      </header>

      <ScannerSection scanReport={scanReport} />

      <ChecklistSection
        checklist={checklist}
        onToggle={setChecklist}
      />

      <PlaceholderRemindersSection />

      <FooterSection />
    </section>
  );
};

// ---------------------------------------------------------------------------
// Scanner result section
// ---------------------------------------------------------------------------

const ScannerSection: React.FC<{
  scanReport: ReturnType<typeof scanMotionSettings>;
}> = ({ scanReport }) => {
  return (
    <div
      className="glass-card-soft p-4 flex flex-col gap-3"
      data-testid="stock-safety-scanner"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink text-sm">Text scanner</h3>
          <p className="text-[11px] text-soft">
            Scans Motion Concept, Channel name, Title, Subtitle, and Final text
            for risky terms. Warning-only — does not block generation.
          </p>
        </div>
        <SafetyBadge
          level={scanReport.overallRisk}
          testId="stock-safety-scanner-badge"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {scanReport.fields.map((field) => (
          <ScannerFieldRow key={field.field} field={field} />
        ))}
      </ul>
    </div>
  );
};

const ScannerFieldRow: React.FC<{ field: FieldScan }> = ({ field }) => {
  const trimmed = field.text.trim();
  const isEmpty = trimmed.length === 0;

  return (
    <li
      className="rounded-2xl border border-white/70 bg-white/65 px-3 py-2"
      data-testid={`scanner-field-${field.field}`}
      data-risk-level={field.risk}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink">{field.fieldLabel}</span>
        <SafetyBadge
          level={isEmpty ? "safe" : field.risk}
          label={isEmpty ? "Empty" : undefined}
          size="xs"
        />
      </div>
      {isEmpty ? (
        <p className="mt-1 text-[11px] text-mute">No text yet.</p>
      ) : field.matches.length === 0 ? (
        <p className="mt-1 text-[11px] text-soft">
          No risky terms detected. Keep wording generic for the safest result.
        </p>
      ) : (
        <ul className="mt-1 space-y-1">
          {field.matches.map((m) => (
            <li
              key={`${field.field}-${m.term}`}
              className="text-[11px] text-soft leading-snug"
            >
              <span className="font-semibold text-ink">“{m.term}”</span>{" "}
              <span className="sn-pill sn-pill-soon" style={{ marginLeft: 4 }}>
                {RISK_CATEGORY_LABEL[m.category]}
              </span>
              <div>{m.explanation}</div>
              <div className="text-mute">{m.saferDirection}</div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------
// Checklist section
// ---------------------------------------------------------------------------

const ChecklistSection: React.FC<{
  checklist: ReturnType<typeof stockSafetyChecklistFromSettings>;
  onToggle: (key: StockSafetyChecklistKey, next: boolean) => void;
}> = ({ checklist, onToggle }) => {
  return (
    <div
      className="glass-card-soft p-4 flex flex-col gap-3"
      data-testid="stock-safety-checklist"
    >
      <div>
        <h3 className="font-semibold text-ink text-sm">
          License &amp; disclosure checklist
        </h3>
        <p className="text-[11px] text-soft">
          Confirm the rights for everything that lives outside the text fields.
          These items reset to unchecked whenever you reset settings.
        </p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {STOCK_SAFETY_CHECKLIST_ITEMS.map((item) => {
          const checked = checklist[item.key];
          return (
            <li key={item.key}>
              <label
                className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/65 px-3 py-2 cursor-pointer hover:bg-white/85 transition"
                data-testid={`checklist-${item.key}`}
                data-checked={String(checked)}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[#9b7cf6]"
                  checked={checked}
                  onChange={(e) => onToggle(item.key, e.target.checked)}
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="block text-[11px] text-soft mt-0.5">
                    {item.helper}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-mute mt-2">
        Beginner-friendly reminders
      </h4>
      <ul className="text-[11px] text-soft list-disc pl-5 space-y-1">
        <li>Use generic wording instead of brand names.</li>
        <li>Avoid logos, public figures, and copyrighted characters.</li>
        <li>
          Only use fonts, icons, audio, and assets you have rights to use
          commercially.
        </li>
        <li>
          If generated with AI, remember to mark it correctly when submitting
          to stock platforms.
        </li>
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Placeholder reminders for future asset / audio / export flows
// ---------------------------------------------------------------------------

const PlaceholderRemindersSection: React.FC = () => {
  return (
    <div
      className="glass-card-soft p-4 flex flex-col gap-2"
      data-testid="stock-safety-placeholder-reminders"
    >
      <h3 className="font-semibold text-ink text-sm">
        When asset / audio / export land
      </h3>
      <p className="text-[11px] text-soft">
        These flows are not built yet, but the same global rules will apply
        when they land — there will not be a separate stock-safe mode.
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
        <li
          className="rounded-2xl border border-white/70 bg-white/65 px-3 py-2 text-[11px] text-soft"
          data-testid="reminder-assets"
        >
          <span className="block font-semibold text-ink">Assets</span>
          Images, footage, and 3D you import must already be cleared for
          commercial / stock redistribution.
        </li>
        <li
          className="rounded-2xl border border-white/70 bg-white/65 px-3 py-2 text-[11px] text-soft"
          data-testid="reminder-audio"
        >
          <span className="block font-semibold text-ink">Audio</span>
          Music and SFX must be royalty-free or properly licensed for resale.
        </li>
        <li
          className="rounded-2xl border border-white/70 bg-white/65 px-3 py-2 text-[11px] text-soft"
          data-testid="reminder-export"
        >
          <span className="block font-semibold text-ink">Export</span>
          MP4 export is not yet implemented. When it lands, the same scanner
          and checklist will run before render.
        </li>
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Footer disclaimer
// ---------------------------------------------------------------------------

const FooterSection: React.FC = () => (
  <p
    className="text-[11px] text-mute"
    data-testid="stock-safety-disclaimer"
  >
    This is guidance only, not a legal guarantee. SN Motion does not perform
    visual logo / image / audio scanning, automatic metadata validation, or
    submission integration in v0.
  </p>
);
