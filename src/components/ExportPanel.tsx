"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  MotionSettings,
  frameRateLabel,
  motionTypeLabel,
  resolutionLabel,
} from "@/lib/motionSettings";
import { generateExportFilename } from "@/lib/filename";
import {
  motionSettingsToDynamicProps,
  dynamicMotionDimensions,
} from "@/remotion/dynamic/dynamicMotionConfig";
import {
  RISK_LEVEL_LABEL,
  computeStockSafetyStatus,
  scanMotionSettings,
  stockSafetyChecklistFromSettings,
  type RiskLevel,
} from "@/lib/stockSafety";
import { SafetyBadge } from "@/components/single-motion/SafetyBadge";

type Props = {
  settings: MotionSettings;
};

type Status =
  | { state: "idle" }
  | { state: "preparing" }
  | { state: "rendering"; progress: number }
  | {
      state: "completed";
      downloadUrl: string;
      filename: string;
      width: number;
      height: number;
      fps: number;
      durationInFrames: number;
    }
  | { state: "failed"; error: string; code?: string };

type RenderEvent =
  | { type: "progress"; progress: number; stage?: "preparing" | "rendering" }
  | {
      type: "done";
      downloadUrl: string;
      filename: string;
      width: number;
      height: number;
      fps: number;
      durationInFrames: number;
    }
  | { type: "error"; error: string; code?: string };

// Friendly copy mapped from the stable error codes the render API emits
// (see src/app/api/render/route.ts → RenderErrorCode). The raw `error`
// string is intentionally NOT shown to the user — it can include stack
// traces or filesystem paths.
const FRIENDLY_ERROR_BY_CODE: Record<string, string> = {
  invalid_props:
    "Those export settings aren’t supported. Please pick an allowed motion type, aspect ratio, resolution, frame rate, and duration, then try again.",
  bundle_failed:
    "We couldn’t prepare the Remotion composition for export. Please try again — if it keeps failing, restart the server.",
  composition_missing:
    "The dynamic-motion-preview composition wasn’t found. Please refresh the page and try the export again.",
  render_failed:
    "Rendering the MP4 didn’t finish. Any partial file was cleaned up. Please try again.",
  write_failed:
    "We couldn’t write the MP4 to disk. Make sure public/renders/ is writable, then try again.",
};

const FRIENDLY_FALLBACK =
  "Something went wrong while exporting. Please try again — if it keeps failing, take a look at the server logs.";

const friendlyExportError = (code: string | undefined): string => {
  if (code && FRIENDLY_ERROR_BY_CODE[code]) return FRIENDLY_ERROR_BY_CODE[code];
  return FRIENDLY_FALLBACK;
};

const SAFETY_HELPER_COPY =
  "Please review stock-safety warnings before submitting to microstock platforms.";

const SAFETY_BANNER: Record<RiskLevel, { title: string; body: string }> = {
  safe: {
    title: "Stock-safe so far",
    body: "Scanner reports no flagged terms and your checklist is complete. You can export and submit with confidence.",
  },
  "needs-review": {
    title: "Reminder before export",
    body: "Some text fields or checklist items still need review. Export will continue, but please double-check before submitting to microstock.",
  },
  risky: {
    title: "Strong warning before export",
    body: "Scanner flagged content that microstock platforms typically reject (brands, public figures, copyrighted media, etc.). Export is allowed, but please revise the flagged text before submitting.",
  },
};

export const ExportPanel: React.FC<Props> = ({ settings }) => {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [filename, setFilename] = useState<string>(() =>
    generateExportFilename(settings.motionType),
  );
  const isExporting =
    status.state === "preparing" || status.state === "rendering";

  // Keep filename roughly fresh while idle so the date stays accurate even
  // when the panel sits open across midnight; we also refresh it for every
  // export trigger so the random5 suffix is unique.
  useEffect(() => {
    if (status.state !== "idle") return;
    setFilename(generateExportFilename(settings.motionType));
  }, [settings.motionType, status.state]);

  useEffect(() => {
    if (status.state !== "idle") return;
    const t = setInterval(() => {
      setFilename(generateExportFilename(settings.motionType));
    }, 60_000);
    return () => clearInterval(t);
  }, [settings.motionType, status.state]);

  const dynamicProps = useMemo(
    () => motionSettingsToDynamicProps(settings),
    [settings],
  );
  const dim = useMemo(
    () => dynamicMotionDimensions(dynamicProps.aspectRatio, dynamicProps.resolution),
    [dynamicProps.aspectRatio, dynamicProps.resolution],
  );
  const safetyStatus = useMemo(() => {
    const scan = scanMotionSettings(settings);
    const checklist = stockSafetyChecklistFromSettings(settings);
    return computeStockSafetyStatus(scan, checklist);
  }, [settings]);

  const heavySettings = useMemo(
    () => describeHeavyExport(dynamicProps),
    [dynamicProps],
  );

  const abortRef = useRef<AbortController | null>(null);
  // Synchronous in-flight guard so a fast double-click (or any second call
  // that lands before the React state update flushes) cannot start a second
  // /api/render request.
  const inFlightRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const startExport = async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const fname = generateExportFilename(settings.motionType);
    setFilename(fname);
    setStatus({ state: "preparing" });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ props: dynamicProps, filename: fname }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await safeJson(res);
        setStatus({
          state: "failed",
          code: err?.code,
          error: err?.error ?? `Render failed (${res.status})`,
        });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setStatus({
          state: "failed",
          code: "render_failed",
          error: "No response body from render API.",
        });
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const evt = JSON.parse(trimmed) as RenderEvent;
            handleEvent(evt, fname, setStatus);
          } catch {
            // ignore malformed line
          }
        }
      }
      if (buffer.trim()) {
        try {
          const evt = JSON.parse(buffer.trim()) as RenderEvent;
          handleEvent(evt, fname, setStatus);
        } catch {
          // ignore
        }
      }
    } catch (e) {
      if ((e as { name?: string })?.name === "AbortError") return;
      const message = e instanceof Error ? e.message : "Render failed.";
      setStatus({ state: "failed", error: message });
    } finally {
      abortRef.current = null;
      inFlightRef.current = false;
    }
  };

  const totalSeconds = dynamicProps.durationSeconds;
  const motionLabel = motionTypeLabel(dynamicProps.motionType);
  const aspect = dynamicProps.aspectRatio;
  const resolutionDescriptor = `${dim.width} × ${dim.height}`;
  const filenameDisplay =
    status.state === "completed" ? status.filename : filename;

  return (
    <section
      className="glass-card p-6 md:p-7 flex flex-col gap-5"
      data-testid="export-panel"
      aria-label="Export MP4"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Export MP4</h2>
          <p className="text-xs text-soft mt-1 max-w-prose">
            Renders your current Single Motion using the live{" "}
            <span className="font-semibold text-ink">dynamic-motion-preview</span>{" "}
            composition. The MP4 is generated locally and saved to{" "}
            <span className="font-mono text-ink">public/renders/</span>.
          </p>
        </div>
        <StatusPill status={status} />
      </header>

      <SafetyBanner status={safetyStatus.status} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Stat label="Motion type" value={motionLabel} />
        <Stat label="Duration" value={`${totalSeconds}s`} />
        <Stat label="Aspect ratio" value={aspect} />
        <Stat
          label="Resolution"
          value={`${resolutionLabel(dynamicProps.resolution)} · ${resolutionDescriptor}`}
        />
        <Stat label="Frame rate" value={frameRateLabel(dynamicProps.frameRate)} />
        <Stat
          label="Safety status"
          value={RISK_LEVEL_LABEL[safetyStatus.status]}
        />
      </div>

      {heavySettings.isHeavy && (
        <p
          className="text-[11px] text-mute"
          data-testid="export-heavier-note"
        >
          Heavier exports may take longer—you picked {heavySettings.reasons}.
        </p>
      )}

      <div
        className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3"
        data-testid="export-filename"
      >
        <div className="text-[11px] text-mute uppercase tracking-wider mb-1">
          Filename
        </div>
        <div className="text-sm font-mono text-ink break-all">
          {filenameDisplay}
        </div>
      </div>

      {status.state === "rendering" && (
        <div data-testid="export-progress">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(185,167,255,0.18)" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.round(status.progress * 100)}%`,
                background: "linear-gradient(135deg,#F6A7C1,#B9A7FF)",
              }}
            />
          </div>
          <div className="text-xs text-mute mt-1">
            Rendering · {Math.round(status.progress * 100)}%
          </div>
        </div>
      )}

      {status.state === "preparing" && (
        <div className="text-xs text-mute" data-testid="export-preparing-note">
          Preparing the Remotion bundle and selecting the composition…
        </div>
      )}

      {status.state === "failed" && (
        <div
          className="rounded-2xl px-4 py-3 text-sm"
          style={{
            background: "rgba(246,167,193,0.25)",
            color: "#8a3057",
            border: "1px solid rgba(246,167,193,0.55)",
          }}
          data-testid="export-error"
          data-error-code={status.code ?? "unknown"}
          role="alert"
        >
          <div className="font-semibold mb-1">Export failed</div>
          <div
            className="text-[12px] leading-snug"
            data-testid="export-error-message"
          >
            {friendlyExportError(status.code)}
          </div>
        </div>
      )}

      {status.state === "completed" && (
        <div
          className="rounded-2xl px-4 py-3 text-sm"
          style={{
            background: "rgba(191,234,216,0.4)",
            color: "#2c6c5a",
            border: "1px solid rgba(191,234,216,0.7)",
          }}
          data-testid="export-success"
        >
          <div className="font-semibold mb-1">Export complete</div>
          <div className="text-[12px] leading-snug">
            Saved as{" "}
            <span
              className="font-mono"
              data-testid="export-success-filename"
            >
              {status.filename}
            </span>{" "}
            · {status.width} × {status.height} · {status.fps} fps ·{" "}
            {Math.round(status.durationInFrames / status.fps)}s
          </div>
        </div>
      )}

      <p className="text-[11px] text-mute" data-testid="export-safety-helper">
        {SAFETY_HELPER_COPY}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={startExport}
          className="sn-button-primary"
          disabled={isExporting}
          aria-busy={isExporting}
          data-testid="export-button"
        >
          {primaryButtonLabel(status, isExporting)}
        </button>
        {status.state === "completed" && (
          <a
            href={status.downloadUrl}
            download={status.filename}
            className="sn-button-secondary"
            data-testid="download-button"
          >
            Download video
          </a>
        )}
      </div>
    </section>
  );
};

const primaryButtonLabel = (status: Status, isExporting: boolean): string => {
  if (isExporting) return "Rendering video…";
  if (status.state === "failed") return "Retry";
  if (status.state === "completed") return "Render again";
  return "Export MP4";
};

// We surface a short "heavier exports may take longer" hint for any of:
// - 1080p (4K is currently disabled in the UI)
// - durations >= 15s (the longer two of the four duration choices)
// - frame rates above 24 fps (60 fps is disabled but we still gate on it)
type HeavyExportInfo = { isHeavy: boolean; reasons: string };

const describeHeavyExport = (props: {
  resolution: string;
  durationSeconds: number;
  frameRate: number;
}): HeavyExportInfo => {
  const reasons: string[] = [];
  if (props.resolution === "1080p" || props.resolution === "4k") {
    reasons.push(props.resolution === "4k" ? "4K" : "1080p");
  }
  if (props.durationSeconds >= 15) {
    reasons.push(`${props.durationSeconds}s duration`);
  }
  if (props.frameRate > 24) {
    reasons.push(`${props.frameRate} fps`);
  }
  if (reasons.length === 0) return { isHeavy: false, reasons: "" };
  return {
    isHeavy: true,
    reasons: humanJoin(reasons),
  };
};

const humanJoin = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3">
    <div className="text-[11px] text-mute uppercase tracking-wider mb-1">
      {label}
    </div>
    <div className="text-sm font-semibold text-ink break-words">{value}</div>
  </div>
);

const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  switch (status.state) {
    case "idle":
      return (
        <span className="sn-pill sn-pill-idle" data-testid="status-pill">
          Idle
        </span>
      );
    case "preparing":
      return (
        <span className="sn-pill sn-pill-rendering" data-testid="status-pill">
          Preparing
        </span>
      );
    case "rendering":
      return (
        <span className="sn-pill sn-pill-rendering" data-testid="status-pill">
          Rendering
        </span>
      );
    case "completed":
      return (
        <span className="sn-pill sn-pill-completed" data-testid="status-pill">
          Completed
        </span>
      );
    case "failed":
      return (
        <span className="sn-pill sn-pill-failed" data-testid="status-pill">
          Failed
        </span>
      );
  }
};

const SafetyBanner: React.FC<{ status: RiskLevel }> = ({ status }) => {
  const { title, body } = SAFETY_BANNER[status];
  // We always show the banner so the safety status is part of the export UX
  // regardless of risk level. The styling escalates with risk but never hard
  // blocks: the Export MP4 button stays enabled.
  const tone =
    status === "safe"
      ? {
          background: "rgba(191,234,216,0.35)",
          border: "1px solid rgba(191,234,216,0.7)",
          color: "#2c6c5a",
        }
      : status === "needs-review"
        ? {
            background: "rgba(247,230,140,0.45)",
            border: "1px solid rgba(247,230,140,0.7)",
            color: "#7a5e10",
          }
        : {
            background: "rgba(246,167,193,0.3)",
            border: "1px solid rgba(246,167,193,0.6)",
            color: "#8a3057",
          };

  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-start gap-3"
      style={tone}
      data-testid="export-safety-banner"
      data-safety-status={status}
    >
      <SafetyBadge level={status} testId="export-safety-badge" />
      <div className="text-[12px] leading-snug">
        <div className="font-semibold mb-0.5">{title}</div>
        <div>{body}</div>
      </div>
    </div>
  );
};

const handleEvent = (
  evt: RenderEvent,
  filename: string,
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
) => {
  if (evt.type === "progress") {
    if (evt.stage === "preparing") {
      setStatus((current) =>
        current.state === "rendering"
          ? current
          : { state: "preparing" },
      );
      return;
    }
    setStatus({ state: "rendering", progress: evt.progress });
  } else if (evt.type === "done") {
    setStatus({
      state: "completed",
      downloadUrl: evt.downloadUrl,
      filename: evt.filename || filename,
      width: evt.width,
      height: evt.height,
      fps: evt.fps,
      durationInFrames: evt.durationInFrames,
    });
  } else if (evt.type === "error") {
    setStatus({ state: "failed", error: evt.error, code: evt.code });
  }
};

const safeJson = async (
  res: Response,
): Promise<{ error?: string; code?: string } | null> => {
  try {
    return (await res.json()) as { error?: string; code?: string };
  } catch {
    return null;
  }
};
