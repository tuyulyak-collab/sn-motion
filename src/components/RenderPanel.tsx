"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";
import { generateExportFilename } from "@/lib/filename";

type Props = {
  props: CountdownIntroProps;
};

type Status =
  | { state: "idle" }
  | { state: "preparing" }
  | { state: "rendering"; progress: number }
  | { state: "completed"; downloadUrl: string; filename: string }
  | { state: "failed"; error: string };

export const RenderPanel: React.FC<Props> = ({ props }) => {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Defer filename generation to the client only. Generating it during SSR
  // produces a different string on the server and the client (random + date),
  // which causes a hydration mismatch warning.
  const [filename, setFilename] = useState<string>("");

  useEffect(() => {
    setFilename(generateExportFilename());
  }, []);

  useEffect(() => {
    if (status.state === "idle") {
      // refresh once a minute so the date always reflects today
      const t = setInterval(() => setFilename(generateExportFilename()), 60000);
      return () => clearInterval(t);
    }
  }, [status.state]);

  const startExport = async () => {
    const fname = generateExportFilename();
    setFilename(fname);
    setStatus({ state: "preparing" });
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ props, filename: fname }),
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.error ?? `Render failed (${res.status})`);
      }
      const reader = res.body?.getReader();
      if (!reader) {
        const data = await res.json();
        if (data.ok) {
          setStatus({
            state: "completed",
            downloadUrl: data.downloadUrl,
            filename: data.filename,
          });
        } else {
          throw new Error(data.error || "Unknown render error");
        }
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";
      // server streams JSON lines: {progress|done|error}
      // eslint-disable-next-line no-constant-condition
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
      const message = e instanceof Error ? e.message : "Render failed.";
      setStatus({ state: "failed", error: message });
    }
  };

  const totalSeconds = props.countdownSeconds + 2;
  const dimensions = useMemo(() => {
    const dim =
      props.aspectRatio === "16:9"
        ? "1920 × 1080"
        : props.aspectRatio === "9:16"
        ? "1080 × 1920"
        : "1080 × 1080";
    return dim;
  }, [props.aspectRatio]);

  return (
    <section className="glass-card p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink">Export video</h2>
          <p className="text-sm text-mute">
            Render your intro as an MP4 file.
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Video size" value={`${props.aspectRatio} · ${dimensions}`} />
        <Stat label="Length" value={`${totalSeconds}s`} />
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 mb-4">
        <div className="text-xs text-mute uppercase tracking-wider mb-1">
          Filename
        </div>
        <div className="text-sm font-mono text-ink break-all min-h-[1.25rem]">
          {status.state === "completed"
            ? status.filename
            : filename || "Generating filename…"}
        </div>
      </div>

      {status.state === "rendering" && (
        <div className="mb-4">
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

      {status.state === "failed" && (
        <div
          className="rounded-2xl px-4 py-3 mb-4 text-sm"
          style={{
            background: "rgba(246,167,193,0.25)",
            color: "#8a3057",
            border: "1px solid rgba(246,167,193,0.55)",
          }}
        >
          {status.error}
        </div>
      )}

      {status.state === "completed" && (
        <div
          className="rounded-2xl px-4 py-3 mb-4 text-sm"
          style={{
            background: "rgba(191,234,216,0.4)",
            color: "#2c6c5a",
            border: "1px solid rgba(191,234,216,0.7)",
          }}
        >
          Render complete. Your video is ready below.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={startExport}
          className="sn-button-primary"
          disabled={status.state === "preparing" || status.state === "rendering"}
        >
          {status.state === "rendering" || status.state === "preparing"
            ? "Rendering…"
            : "Export MP4"}
        </button>
        {status.state === "completed" && (
          <a
            href={status.downloadUrl}
            download={status.filename}
            className="sn-button-secondary"
          >
            Download video
          </a>
        )}
      </div>
    </section>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3"
  >
    <div className="text-[11px] text-mute uppercase tracking-wider mb-1">
      {label}
    </div>
    <div className="text-sm font-semibold text-ink">{value}</div>
  </div>
);

const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  switch (status.state) {
    case "idle":
      return <span className="sn-pill sn-pill-idle">Idle</span>;
    case "preparing":
      return <span className="sn-pill sn-pill-rendering">Preparing</span>;
    case "rendering":
      return <span className="sn-pill sn-pill-rendering">Rendering</span>;
    case "completed":
      return <span className="sn-pill sn-pill-completed">Completed</span>;
    case "failed":
      return <span className="sn-pill sn-pill-failed">Failed</span>;
  }
};

type RenderEvent =
  | { type: "progress"; progress: number }
  | { type: "done"; downloadUrl: string; filename: string }
  | { type: "error"; error: string };

const handleEvent = (
  evt: RenderEvent,
  filename: string,
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
) => {
  if (evt.type === "progress") {
    setStatus({ state: "rendering", progress: evt.progress });
  } else if (evt.type === "done") {
    setStatus({
      state: "completed",
      downloadUrl: evt.downloadUrl,
      filename: evt.filename || filename,
    });
  } else if (evt.type === "error") {
    setStatus({ state: "failed", error: evt.error });
  }
};

const safeJson = async (res: Response): Promise<{ error?: string } | null> => {
  try {
    return (await res.json()) as { error?: string };
  } catch {
    return null;
  }
};
