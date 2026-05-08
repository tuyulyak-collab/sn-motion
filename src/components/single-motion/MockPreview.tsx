"use client";

import React, { forwardRef, useMemo } from "react";
import {
  MotionAspectRatio,
  MotionBackgroundType,
  MotionSettings,
  MotionType,
  StyleDirection,
  frameRateLabel,
  getDisplayText,
  motionTypeLabel,
  resolutionLabel,
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
  primary: string,
  secondary: string,
  style: StyleDirection,
): React.CSSProperties => {
  if (style === "neon-dark") {
    if (bg === "solid-color") return { background: "#0E0B1A" };
    if (bg === "abstract-shapes")
      return {
        background: `radial-gradient(circle at 20% 30%, ${primary}55, transparent 45%), radial-gradient(circle at 80% 75%, ${secondary}55, transparent 45%), #0E0B1A`,
      };
    return {
      background: `linear-gradient(135deg, #0E0B1A 0%, ${primary}66 50%, ${secondary}66 100%)`,
    };
  }
  switch (bg) {
    case "solid-color":
      return { background: primary };
    case "abstract-shapes":
      return {
        background: `radial-gradient(circle at 18% 22%, ${primary}88, transparent 38%), radial-gradient(circle at 82% 78%, ${secondary}88, transparent 38%), radial-gradient(circle at 50% 50%, #ffffff66, transparent 55%), linear-gradient(135deg, #fffdf8, #f8f4ec)`,
      };
    case "image-upload":
    case "animated-gradient":
    default:
      return {
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
      };
  }
};

const fallbackText = {
  channelName: "Your channel",
  titleText: "Your title",
  subtitleText: "Your subtitle",
  finalText: "Let's go",
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

  const bgStyle = useMemo(
    () =>
      backgroundCss(
        settings.backgroundType,
        settings.primaryColor,
        settings.secondaryColor,
        settings.styleDirection,
      ),
    [
      settings.backgroundType,
      settings.primaryColor,
      settings.secondaryColor,
      settings.styleDirection,
    ],
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
          <p className="text-xs text-mute">
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
            style={{
              ...aspectStyle(settings.aspectRatio),
              ...bgStyle,
              boxShadow: tokens.shadow,
              border: `1px solid ${tokens.accentBorder}`,
              margin: "0 auto",
              color: tokens.textColor,
            }}
          >
            <MockContent
              motionType={settings.motionType}
              tokens={tokens}
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
  tokens: StyleTokens;
  channel: string;
  title: string;
  subtitle: string;
  finalText: string;
  primary: string;
  secondary: string;
};

const MockContent: React.FC<MockContentProps> = ({
  motionType,
  tokens,
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
          tokens={tokens}
          title={title}
          subtitle={subtitle}
          channel={channel}
          primary={primary}
          secondary={secondary}
        />
      );
    case "lower-third":
      return (
        <LowerThirdContent
          tokens={tokens}
          title={title}
          subtitle={subtitle}
          primary={primary}
          secondary={secondary}
        />
      );
    case "subscribe":
      return (
        <SubscribeContent
          tokens={tokens}
          channel={channel}
          finalText={finalText}
          primary={primary}
          secondary={secondary}
        />
      );
    case "abstract-motion":
      return <AbstractContent primary={primary} secondary={secondary} />;
    case "reveal":
    case "slide":
    case "fade":
    case "loop":
    default:
      return (
        <TitleCardContent
          tokens={tokens}
          channel={channel}
          title={title}
          subtitle={subtitle}
          motionType={motionType}
        />
      );
  }
};

const CountdownContent: React.FC<{
  tokens: StyleTokens;
  title: string;
  subtitle: string;
  channel: string;
  primary: string;
  secondary: string;
}> = ({ tokens, title, subtitle, channel, primary, secondary }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
    <div
      className="text-[11px] uppercase tracking-[0.25em] mb-3"
      style={{ color: tokens.mutedColor }}
    >
      {channel}
    </div>
    <div
      className="font-extrabold leading-none"
      style={{
        fontSize: "clamp(64px, 16vw, 144px)",
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      10
    </div>
    <div
      className="mt-4 font-bold leading-tight max-w-[80%]"
      style={{ fontSize: "clamp(14px, 2.4vw, 22px)", color: tokens.textColor }}
    >
      {title}
    </div>
    <div
      className="mt-1 text-xs sm:text-sm"
      style={{ color: tokens.mutedColor }}
    >
      {subtitle}
    </div>
  </div>
);

const LowerThirdContent: React.FC<{
  tokens: StyleTokens;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
}> = ({ tokens, title, subtitle, primary, secondary }) => (
  <>
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full opacity-50"
        style={{
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        }}
      />
    </div>
    <div
      className="absolute left-4 right-4 bottom-4 sm:left-8 sm:right-auto sm:max-w-[60%] rounded-2xl px-4 py-3"
      style={{
        background: `linear-gradient(135deg, ${primary}EE, ${secondary}EE)`,
        boxShadow: tokens.shadow,
      }}
    >
      <div className="text-white font-bold text-sm sm:text-base leading-tight">
        {title}
      </div>
      <div className="text-white/85 text-xs sm:text-sm">{subtitle}</div>
    </div>
  </>
);

const SubscribeContent: React.FC<{
  tokens: StyleTokens;
  channel: string;
  finalText: string;
  primary: string;
  secondary: string;
}> = ({ tokens, channel, finalText, primary, secondary }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-4">
    <div
      className="text-xs uppercase tracking-[0.25em]"
      style={{ color: tokens.mutedColor }}
    >
      {channel}
    </div>
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      className="rounded-full px-6 py-3 font-bold text-white shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        boxShadow: `0 18px 36px ${primary}55`,
      }}
    >
      ▶ Subscribe
    </button>
    <div
      className="font-semibold text-sm sm:text-base"
      style={{ color: tokens.textColor }}
    >
      {finalText}
    </div>
  </div>
);

const AbstractContent: React.FC<{
  primary: string;
  secondary: string;
}> = ({ primary, secondary }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-70 blur-2xl"
      style={{ background: primary }}
    />
    <div
      className="absolute -bottom-12 -right-8 w-48 h-48 rounded-full opacity-60 blur-2xl"
      style={{ background: secondary }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl opacity-80 rotate-12"
      style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
    />
    <div
      className="absolute top-6 right-6 w-12 h-12 rounded-full opacity-90"
      style={{ background: `linear-gradient(135deg, ${secondary}, ${primary})` }}
    />
  </div>
);

const TitleCardContent: React.FC<{
  tokens: StyleTokens;
  channel: string;
  title: string;
  subtitle: string;
  motionType: MotionType;
}> = ({ tokens, channel, title, subtitle, motionType }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
    <div
      className="text-[11px] uppercase tracking-[0.25em] mb-3"
      style={{ color: tokens.mutedColor }}
    >
      {channel}
    </div>
    <div
      className="font-extrabold leading-tight max-w-[80%]"
      style={{
        fontSize: "clamp(20px, 5vw, 38px)",
        color: tokens.textColor,
      }}
    >
      {title}
    </div>
    <div
      className="mt-2 text-xs sm:text-sm max-w-[70%]"
      style={{ color: tokens.mutedColor }}
    >
      {subtitle}
    </div>
    <div
      className="mt-4 text-[10px] uppercase tracking-[0.3em] font-semibold opacity-70"
      style={{ color: tokens.mutedColor }}
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
