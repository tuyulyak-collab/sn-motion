"use client";

import React from "react";
import {
  AspectRatio,
  BackgroundType,
  CountdownIntroProps,
  CountdownSeconds,
  CountdownStyle,
  Music,
  ThemeStyle,
} from "@/remotion/schemas/countdownSchema";

type Props = {
  value: CountdownIntroProps;
  onChange: (next: CountdownIntroProps) => void;
};

const SEC_OPTIONS: CountdownSeconds[] = [5, 10, 15, 30];

const ASPECT_OPTIONS: Array<{ value: AspectRatio; label: string; helper: string }> = [
  { value: "16:9", label: "16:9", helper: "YouTube" },
  { value: "9:16", label: "9:16", helper: "Shorts · TikTok · Reels" },
  { value: "1:1", label: "1:1", helper: "Square" },
];

const THEME_OPTIONS: Array<{ value: ThemeStyle; label: string }> = [
  { value: "soft-pastel-glass", label: "Soft Pastel Glass" },
  { value: "modern-gradient", label: "Modern Gradient" },
  { value: "neon-dark", label: "Neon Dark" },
  { value: "clean-minimal", label: "Clean Minimal" },
  { value: "bold-creator-style", label: "Bold Creator" },
];

const BG_OPTIONS: Array<{ value: BackgroundType; label: string }> = [
  { value: "animated-gradient", label: "Animated gradient" },
  { value: "abstract-shapes", label: "Abstract shapes" },
  { value: "uploaded-image", label: "Uploaded image" },
  { value: "solid-color", label: "Solid color" },
];

const COUNTDOWN_STYLE_OPTIONS: Array<{ value: CountdownStyle; label: string }> = [
  { value: "big-center-number", label: "Big center number" },
  { value: "circular-timer", label: "Circular timer" },
  { value: "split-layout", label: "Split layout" },
  { value: "minimal-corner-timer", label: "Minimal corner timer" },
];

const MUSIC_OPTIONS: Array<{ value: Music; label: string }> = [
  { value: "off", label: "Off" },
  { value: "built-in-sample", label: "Built-in sample" },
  { value: "uploaded-audio", label: "Uploaded audio" },
];

const FINAL_TEXT_PRESETS = ["Let's Start", "Welcome", "Subscribe"];

export const CustomizePanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof CountdownIntroProps>(
    key: K,
    v: CountdownIntroProps[K],
  ) => {
    onChange({ ...value, [key]: v });
  };

  return (
    <section className="glass-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-ink">Customize</h2>
        <p className="text-sm text-mute">Edit the look and the words.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="sn-label">Channel name</label>
          <input
            className="sn-input"
            value={value.channelName}
            onChange={(e) => set("channelName", e.target.value)}
            placeholder="Your channel"
          />
        </div>
        <div>
          <label className="sn-label">Subtitle</label>
          <input
            className="sn-input"
            value={value.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="Short helper text"
          />
        </div>
        <div className="md:col-span-2">
          <label className="sn-label">Main title</label>
          <input
            className="sn-input"
            value={value.mainTitle}
            onChange={(e) => set("mainTitle", e.target.value)}
            placeholder="What's starting"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Countdown length</label>
        <div className="flex flex-wrap gap-2">
          {SEC_OPTIONS.map((s) => {
            const active = value.countdownSeconds === s;
            return (
              <button
                type="button"
                key={s}
                onClick={() => set("countdownSeconds", s)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  active
                    ? "text-white border-transparent shadow-glass"
                    : "border-white/70 text-ink/70 hover:bg-white/80"
                }`}
                style={{
                  background: active
                    ? "linear-gradient(135deg,#F6A7C1,#B9A7FF)"
                    : "rgba(255,255,255,0.65)",
                }}
              >
                {s}s
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Video size</label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_OPTIONS.map((opt) => {
            const active = value.aspectRatio === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => set("aspectRatio", opt.value)}
                className={`rounded-2xl px-3 py-3 text-left border transition ${
                  active
                    ? "shadow-glass"
                    : "shadow-[0_4px_12px_rgba(142,113,161,0.08)]"
                }`}
                style={{
                  background: active
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(255,255,255,0.55)",
                  borderColor: active
                    ? "rgba(155,124,246,0.55)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                <div className="font-semibold text-ink text-sm">{opt.label}</div>
                <div className="text-[11px] text-mute">{opt.helper}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Theme</label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_OPTIONS.map((opt) => {
            const active = value.themeStyle === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => set("themeStyle", opt.value)}
                className={`rounded-2xl px-3 py-2.5 text-sm font-semibold text-left border transition ${
                  active ? "text-ink shadow-glass" : "text-ink/70"
                }`}
                style={{
                  background: active
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.55)",
                  borderColor: active
                    ? "rgba(155,124,246,0.55)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <label className="sn-label">Primary color</label>
          <ColorField
            value={value.primaryColor}
            onChange={(v) => set("primaryColor", v)}
          />
        </div>
        <div>
          <label className="sn-label">Secondary color</label>
          <ColorField
            value={value.secondaryColor}
            onChange={(v) => set("secondaryColor", v)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Background</label>
        <div className="grid grid-cols-2 gap-2">
          {BG_OPTIONS.map((opt) => {
            const active = value.backgroundType === opt.value;
            const disabled = opt.value === "uploaded-image";
            return (
              <button
                type="button"
                key={opt.value}
                disabled={disabled}
                onClick={() => !disabled && set("backgroundType", opt.value)}
                className={`rounded-2xl px-3 py-2.5 text-sm font-semibold text-left border transition ${
                  active ? "text-ink shadow-glass" : "text-ink/70"
                } ${disabled ? "opacity-55 cursor-not-allowed" : ""}`}
                style={{
                  background: active
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.55)",
                  borderColor: active
                    ? "rgba(155,124,246,0.55)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                {opt.label}
                {disabled && (
                  <span className="ml-2 sn-pill sn-pill-soon !text-[10px] !py-[2px] !px-2">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Countdown style</label>
        <div className="grid grid-cols-2 gap-2">
          {COUNTDOWN_STYLE_OPTIONS.map((opt) => {
            const active = value.countdownStyle === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => set("countdownStyle", opt.value)}
                className={`rounded-2xl px-3 py-2.5 text-sm font-semibold text-left border transition ${
                  active ? "text-ink shadow-glass" : "text-ink/70"
                }`}
                style={{
                  background: active
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.55)",
                  borderColor: active
                    ? "rgba(155,124,246,0.55)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <label className="sn-label">Music</label>
          <select
            className="sn-input"
            value={value.music}
            onChange={(e) => set("music", e.target.value as Music)}
          >
            {MUSIC_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="sn-label">Tick sound</label>
          <div className="flex gap-2">
            {[
              { v: true, label: "On" },
              { v: false, label: "Off" },
            ].map((o) => {
              const active = value.tickSound === o.v;
              return (
                <button
                  key={String(o.v)}
                  type="button"
                  onClick={() => set("tickSound", o.v)}
                  className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold border transition ${
                    active ? "text-white border-transparent" : "text-ink/70"
                  }`}
                  style={{
                    background: active
                      ? "linear-gradient(135deg,#F6A7C1,#B9A7FF)"
                      : "rgba(255,255,255,0.65)",
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="sn-label">Final text</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {FINAL_TEXT_PRESETS.map((p) => {
            const active = value.finalText === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => set("finalText", p)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  active ? "text-white border-transparent" : "text-ink/70"
                }`}
                style={{
                  background: active
                    ? "linear-gradient(135deg,#F6A7C1,#B9A7FF)"
                    : "rgba(255,255,255,0.65)",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
        <input
          className="sn-input"
          value={value.finalText}
          onChange={(e) => set("finalText", e.target.value)}
          placeholder="Custom text (e.g. Let's Go!)"
        />
      </div>
    </section>
  );
};

const ColorField: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
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
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-9 h-9 rounded-full border-0 bg-transparent cursor-pointer"
        aria-label="Pick color"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm font-mono text-ink"
      />
    </div>
  );
};
