"use client";

import React, { forwardRef, useMemo } from "react";
import {
  MotionAspectRatio,
  MotionBackgroundType,
  MotionSettings,
  MotionType,
  StyleDirection,
  blurPx,
  frameRateLabel,
  getDisplayText,
  glowMultiplier,
  hexToRgba,
  motionSettingsDefaults,
  motionTypeLabel,
  overlayAlpha,
  resolutionLabel,
  safeHex,
  styleDirectionLabel,
} from "@/lib/motionSettings";

type Props = {
  settings: MotionSettings;
  version: number;
};

const aspectStyle = (ar: MotionAspectRatio): React.CSSProperties => {
  switch (ar) {
    case "16:9":
      return { aspectRatio: "16 / 9" };
    case "9:16":
      return { aspectRatio: "9 / 16", maxWidth: 320 };
    case "1:1":
      return { aspectRatio: "1 / 1", maxWidth: 480 };
  }
};

type StyleTokens = {
  surface: string;
  textColor: string;
  mutedColor: string;
  accentBorder: string;
  shadow: string;
};

const styleTokens = (
  style: StyleDirection,
  primary: string,
  secondary: string,
): StyleTokens => {
  switch (style) {
    case "neon-dark":
      return {
        surface: "rgba(20,18,30,0.85)",
        textColor: "#FDFDFE",
        mutedColor: "rgba(255,255,255,0.65)",
        accentBorder: `${primary}88`,
        shadow: `0 0 0 1px ${primary}55, 0 18px 48px ${primary}33`,
      };
    case "clean-minimal":
      return {
        surface: "rgba(255,255,255,0.92)",
        textColor: "#1F1B2A",
        mutedColor: "rgba(31,27,42,0.55)",
        accentBorder: "rgba(31,27,42,0.12)",
        shadow: "0 12px 32px rgba(31,27,42,0.08)",
      };
    case "bold-creator":
      return {
        surface: `linear-gradient(135deg, ${primary}, ${secondary})`,
        textColor: "#FFFFFF",
        mutedColor: "rgba(255,255,255,0.78)",
        accentBorder: "rgba(255,255,255,0.5)",
        shadow: `0 24px 60px ${primary}55`,
      };
    case "modern-gradient":
      return {
        surface: `linear-gradient(135deg, ${primary}, ${secondary})`,
        textColor: "#FFFFFF",
        mutedColor: "rgba(255,255,255,0.75)",
        accentBorder: "rgba(255,255,255,0.4)",
        shadow: `0 20px 56px ${secondary}44`,
      };
    case "soft-pastel-glass":
    default:
      return {
        surface: "rgba(255,255,255,0.65)",
        textColor: "#2F2B3A",
        mutedColor: "rgba(47,43,58,0.6)",
        accentBorder: "rgba(155,124,246,0.35)",
        shadow: "0 24px 70px rgba(142,113,161,0.18)",
      };
  }
};

const backgroundCss = (
  bg: MotionBackgroundType,
  bgStart: string,
  bgEnd: string,
  style: StyleDirection,
): React.CSSProperties => {
  if (style === "neon-dark") {
    if (bg === "solid-color") return { background: "#0E0B1A" };
    if (bg === "abstract-shapes")
      return {
        background: `radial-gradient(circle at 20% 30%, ${bgStart}55, transparent 45%), radial-gradient(circle at 80% 75%, ${bgEnd}55, transparent 45%), #0E0B1A`,
      };
    return {
      background: `linear-gradient(135deg, #0E0B1A 0%, ${bgStart}66 50%, ${bgEnd}66 100%)`,
    };
  }
  switch (bg) {
    case "solid-color":
      return { background: bgStart };
    case "abstract-shapes":
      return {
        background: `radial-gradient(circle at 18% 22%, ${bgStart}88, transparent 38%), radial-gradient(circle at 82% 78%, ${bgEnd}88, transparent 38%), radial-gradient(circle at 50% 50%, #ffffff66, transparent 55%), linear-gradient(135deg, #fffdf8, #f8f4ec)`,
      };
    case "image-upload":
    case "animated-gradient":
    default:
      return {
        background: `linear-gradient(135deg, ${bgStart}, ${bgEnd})`,
      };
  }
};

const fallbackText = {
  channelName: "Your channel",
  titleText: "Your title",
  subtitleText: "Your subtitle",
  finalText: "Let's go",
};

type AdvancedColors = {
  text: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
  number: string;
  overlay: string;
  glow: string;
  blurLevel: number;
  glowSteps: number;
  overlayOpacity: number;
};

const resolveAdvancedColors = (settings: MotionSettings): AdvancedColors => ({
  text: safeHex(settings.textColor, motionSettingsDefaults.textColor),
  bgStart: safeHex(
    settings.backgroundStartColor,
    motionSettingsDefaults.backgroundStartColor,
  ),
  bgEnd: safeHex(
    settings.backgroundEndColor,
    motionSettingsDefaults.backgroundEndColor,
  ),
  accent: safeHex(settings.accentColor, motionSettingsDefaults.accentColor),
  number: safeHex(
    settings.countdownNumberColor,
    motionSettingsDefaults.countdownNumberColor,
  ),
  overlay: safeHex(
    settings.overlayColor,
    motionSettingsDefaults.overlayColor,
  ),
  glow: safeHex(
    settings.borderGlowColor,
    motionSettingsDefaults.borderGlowColor,
  ),
  blurLevel: blurPx(settings.backgroundBlur ?? "medium"),
  glowSteps: glowMultiplier(settings.glowIntensity ?? "soft"),
  overlayOpacity: overlayAlpha(
    typeof settings.overlayOpacity === "number"
      ? settings.overlayOpacity
      : motionSettingsDefaults.overlayOpacity,
  ),
});

const buildFrameShadow = (
  baseShadow: string,
  glow: string,
  steps: number,
): string => {
  if (steps <= 0) return baseShadow;
  const inner = `0 0 0 ${steps}px ${hexToRgba(glow, 0.18)}`;
  const halo = `0 0 ${12 + steps * 14}px ${steps * 4}px ${hexToRgba(
    glow,
    0.18 + steps * 0.12,
  )}`;
  return `${inner}, ${halo}, ${baseShadow}`;
};

export const MockPreview = forwardRef<HTMLDivElement, Props>(function MockPreview(
  { settings, version },
  ref,
) {
  const tokens = useMemo(
    () =>
      styleTokens(
        settings.styleDirection,
        settings.primaryColor,
        settings.secondaryColor,
      ),
    [settings.styleDirection, settings.primaryColor, settings.secondaryColor],
  );

  const advanced = useMemo(() => resolveAdvancedColors(settings), [settings]);

  const bgStyle = useMemo(
    () =>
      backgroundCss(
        settings.backgroundType,
        advanced.bgStart,
        advanced.bgEnd,
        settings.styleDirection,
      ),
    [
      settings.backgroundType,
      advanced.bgStart,
      advanced.bgEnd,
      settings.styleDirection,
    ],
  );

  const frameShadow = useMemo(
    () => buildFrameShadow(tokens.shadow, advanced.glow, advanced.glowSteps),
    [tokens.shadow, advanced.glow, advanced.glowSteps],
  );

  const channel = getDisplayText(
    settings.channelName,
    fallbackText.channelName,
  );
  const title = getDisplayText(settings.titleText, fallbackText.titleText);
  const subtitle = getDisplayText(
    settings.subtitleText,
    fallbackText.subtitleText,
  );
  const finalText = getDisplayText(settings.finalText, fallbackText.finalText);

  return (
    <section
      ref={ref}
      className="glass-card p-6 md:p-7 flex flex-col gap-4"
      aria-label="Mock preview"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Mock preview</h2>
          <p className="text-xs text-soft">
            Static visual sketch from your settings. Real animation lands in a
            future PR.
          </p>
        </div>
        <span className="sn-pill sn-pill-rendering self-start sm:self-auto">
          {motionTypeLabel(settings.motionType)}
        </span>
      </header>

      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(0,0,0,0.04)",
          padding: 16,
        }}
      >
        <div className="mx-auto" style={{ width: "100%", maxWidth: 720 }}>
          <div
            key={version}
            className="relative rounded-2xl overflow-hidden mock-preview-frame"
            data-testid="mock-preview-frame"
            data-aspect={settings.aspectRatio}
            data-blur={settings.backgroundBlur}
            data-glow={settings.glowIntensity}
            data-overlay-opacity={settings.overlayOpacity}
            style={{
              ...aspectStyle(settings.aspectRatio),
              ...bgStyle,
              boxShadow: frameShadow,
              border: `1px solid ${hexToRgba(advanced.glow, 0.35)}`,
              margin: "0 auto",
              color: advanced.text,
            }}
          >
            <MockContent
              motionType={settings.motionType}
              advanced={advanced}
              channel={channel}
              title={title}
              subtitle={subtitle}
              finalText={finalText}
              primary={settings.primaryColor}
              secondary={settings.secondaryColor}
            />
            <Overlay settings={settings} tokens={tokens} />
          </div>
        </div>
      </div>

      <SettingsSummary settings={settings} />
    </section>
  );
});

type MockContentProps = {
  motionType: MotionType;
  advanced: AdvancedColors;
  channel: string;
  title: string;
  subtitle: string;
  finalText: string;
  primary: string;
  secondary: string;
};

const MockContent: React.FC<MockContentProps> = ({
  motionType,
  advanced,
  channel,
  title,
  subtitle,
  finalText,
  primary,
  secondary,
}) => {
  switch (motionType) {
    case "countdown":
      return (
        <CountdownContent
          advanced={advanced}
          title={title}
          subtitle={subtitle}
          channel={channel}
        />
      );
    case "lower-third":
      return (
        <LowerThirdContent
          advanced={advanced}
          title={title}
          subtitle={subtitle}
        />
      );
    case "subscribe":
      return (
        <SubscribeContent
          advanced={advanced}
          channel={channel}
          finalText={finalText}
        />
      );
    case "abstract-motion":
      return (
        <AbstractContent
          advanced={advanced}
          primary={primary}
          secondary={secondary}
        />
      );
    case "reveal":
    case "slide":
    case "fade":
    case "loop":
    default:
      return (
        <TitleCardContent
          advanced={advanced}
          channel={channel}
          title={title}
          subtitle={subtitle}
          motionType={motionType}
        />
      );
  }
};

const CountdownContent: React.FC<{
  advanced: AdvancedColors;
  title: string;
  subtitle: string;
  channel: string;
}> = ({ advanced, title, subtitle, channel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
    <div
      className="text-[11px] uppercase tracking-[0.25em] mb-3"
      style={{ color: hexToRgba(advanced.text, 0.6) }}
    >
      {channel}
    </div>
    <div
      data-testid="countdown-number"
      className="font-extrabold leading-none"
      style={{
        fontSize: "clamp(64px, 16vw, 144px)",
        color: advanced.number,
        textShadow:
          advanced.glowSteps > 0
            ? `0 0 ${8 + advanced.glowSteps * 6}px ${hexToRgba(
                advanced.glow,
                0.3 + advanced.glowSteps * 0.1,
              )}`
            : "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      10
    </div>
    <div
      className="mt-4 font-bold leading-tight max-w-[80%]"
      style={{ fontSize: "clamp(14px, 2.4vw, 22px)", color: advanced.text }}
    >
      {title}
    </div>
    <div
      className="mt-1 text-xs sm:text-sm"
      style={{ color: hexToRgba(advanced.text, 0.65) }}
    >
      {subtitle}
    </div>
  </div>
);

const LowerThirdContent: React.FC<{
  advanced: AdvancedColors;
  title: string;
  subtitle: string;
}> = ({ advanced, title, subtitle }) => {
  const overlayBg = hexToRgba(advanced.overlay, advanced.overlayOpacity);
  const overlayBorder = hexToRgba(advanced.glow, 0.45);
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full opacity-60"
          style={{ background: advanced.accent }}
        />
      </div>
      <div
        data-testid="lower-third-bar"
        className="absolute left-4 right-4 bottom-4 sm:left-8 sm:right-auto sm:max-w-[60%] rounded-2xl px-4 py-3"
        style={{
          background: overlayBg,
          backdropFilter: `blur(${advanced.blurLevel}px)`,
          WebkitBackdropFilter: `blur(${advanced.blurLevel}px)`,
          border: `1px solid ${overlayBorder}`,
          boxShadow:
            advanced.glowSteps > 0
              ? `0 0 ${10 + advanced.glowSteps * 6}px ${hexToRgba(
                  advanced.glow,
                  0.25 + advanced.glowSteps * 0.1,
                )}`
              : "0 12px 24px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="font-bold text-sm sm:text-base leading-tight"
          style={{ color: advanced.text }}
        >
          {title}
        </div>
        <div
          className="text-xs sm:text-sm"
          style={{ color: hexToRgba(advanced.text, 0.7) }}
        >
          {subtitle}
        </div>
        <div
          className="mt-2 h-[3px] rounded-full"
          style={{ background: advanced.accent, opacity: 0.85 }}
        />
      </div>
    </>
  );
};

const SubscribeContent: React.FC<{
  advanced: AdvancedColors;
  channel: string;
  finalText: string;
}> = ({ advanced, channel, finalText }) => {
  const cardBg = hexToRgba(advanced.overlay, advanced.overlayOpacity);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-4">
      <div
        className="text-xs uppercase tracking-[0.25em]"
        style={{ color: hexToRgba(advanced.text, 0.65) }}
      >
        {channel}
      </div>
      <div
        className="rounded-3xl px-5 py-4 flex flex-col items-center gap-3"
        style={{
          background: cardBg,
          backdropFilter: `blur(${advanced.blurLevel}px)`,
          WebkitBackdropFilter: `blur(${advanced.blurLevel}px)`,
          border: `1px solid ${hexToRgba(advanced.glow, 0.4)}`,
        }}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          data-testid="subscribe-button"
          className="rounded-full px-6 py-3 font-bold text-white"
          style={{
            background: advanced.accent,
            boxShadow:
              advanced.glowSteps > 0
                ? `0 0 ${10 + advanced.glowSteps * 6}px ${hexToRgba(
                    advanced.glow,
                    0.4 + advanced.glowSteps * 0.1,
                  )}, 0 18px 36px ${hexToRgba(advanced.accent, 0.35)}`
                : `0 18px 36px ${hexToRgba(advanced.accent, 0.35)}`,
          }}
        >
          ▶ Subscribe
        </button>
        <div
          className="font-semibold text-sm sm:text-base"
          style={{ color: advanced.text }}
        >
          {finalText}
        </div>
      </div>
    </div>
  );
};

const AbstractContent: React.FC<{
  advanced: AdvancedColors;
  primary: string;
  secondary: string;
}> = ({ advanced, primary, secondary }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-70 blur-2xl"
      style={{ background: advanced.accent }}
    />
    <div
      className="absolute -bottom-12 -right-8 w-48 h-48 rounded-full opacity-60 blur-2xl"
      style={{ background: secondary }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl opacity-80 rotate-12"
      style={{
        background: `linear-gradient(135deg, ${advanced.accent}, ${primary})`,
        boxShadow:
          advanced.glowSteps > 0
            ? `0 0 ${12 + advanced.glowSteps * 8}px ${hexToRgba(
                advanced.glow,
                0.3 + advanced.glowSteps * 0.12,
              )}`
            : "none",
      }}
    />
    <div
      className="absolute top-6 right-6 w-12 h-12 rounded-full opacity-90"
      style={{ background: advanced.accent }}
    />
  </div>
);

const TitleCardContent: React.FC<{
  advanced: AdvancedColors;
  channel: string;
  title: string;
  subtitle: string;
  motionType: MotionType;
}> = ({ advanced, channel, title, subtitle, motionType }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
    <div
      className="text-[11px] uppercase tracking-[0.25em] mb-3"
      style={{ color: hexToRgba(advanced.text, 0.6) }}
    >
      {channel}
    </div>
    <div
      className="font-extrabold leading-tight max-w-[80%]"
      style={{
        fontSize: "clamp(20px, 5vw, 38px)",
        color: advanced.text,
        textShadow:
          advanced.glowSteps > 0
            ? `0 0 ${6 + advanced.glowSteps * 4}px ${hexToRgba(
                advanced.glow,
                0.25 + advanced.glowSteps * 0.1,
              )}`
            : "none",
      }}
    >
      {title}
    </div>
    <div
      className="mt-2 text-xs sm:text-sm max-w-[70%]"
      style={{ color: hexToRgba(advanced.text, 0.65) }}
    >
      {subtitle}
    </div>
    <div
      className="mt-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold"
      style={{
        background: hexToRgba(advanced.accent, 0.18),
        color: advanced.accent,
      }}
    >
      {motionType}
    </div>
  </div>
);

const Overlay: React.FC<{ settings: MotionSettings; tokens: StyleTokens }> = ({
  settings,
  tokens,
}) => (
  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
    <Chip
      bg="rgba(0,0,0,0.45)"
      color="#FFFFFF"
      label={`${settings.aspectRatio} · ${resolutionLabel(settings.resolution)} · ${frameRateLabel(settings.frameRate)}`}
    />
    <Chip
      bg={tokens.surface.startsWith("linear") ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.85)"}
      color={tokens.surface.startsWith("linear") ? "#FFFFFF" : "#2F2B3A"}
      label={`${settings.durationSeconds}s`}
    />
  </div>
);

const Chip: React.FC<{ bg: string; color: string; label: string }> = ({
  bg,
  color,
  label,
}) => (
  <span
    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
    style={{ background: bg, color }}
  >
    {label}
  </span>
);

const SettingsSummary: React.FC<{ settings: MotionSettings }> = ({ settings }) => (
  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
    <SummaryItem label="Style" value={styleDirectionLabel(settings.styleDirection)} />
    <SummaryItem label="Intensity" value={capitalize(settings.motionIntensity)} />
    <SummaryItem
      label="Stages"
      value={`${formatSeconds(settings.introLength)} · ${formatSeconds(settings.holdLength)} · ${formatSeconds(settings.outroLength)}`}
    />
    <SummaryItem
      label="Total"
      value={`${settings.durationSeconds}s @ ${frameRateLabel(settings.frameRate)}`}
    />
  </dl>
);

const SummaryItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-white/70 bg-white/55 p-3">
    <dt className="text-[10px] uppercase tracking-[0.18em] text-mute font-semibold">
      {label}
    </dt>
    <dd className="text-ink font-semibold mt-0.5 truncate">{value}</dd>
  </div>
);

const formatSeconds = (n: number): string => {
  if (!Number.isFinite(n)) return "–";
  return `${Number(n.toFixed(2))}s`;
};

const capitalize = (s: string): string =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;
