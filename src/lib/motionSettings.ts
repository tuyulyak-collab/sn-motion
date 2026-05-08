export type MotionType =
  | "countdown"
  | "reveal"
  | "slide"
  | "fade"
  | "loop"
  | "subscribe"
  | "lower-third"
  | "abstract-motion";

export type MotionBackgroundType =
  | "animated-gradient"
  | "abstract-shapes"
  | "solid-color"
  | "image-upload";

export type StyleDirection =
  | "soft-pastel-glass"
  | "modern-gradient"
  | "neon-dark"
  | "clean-minimal"
  | "bold-creator";

export type MotionIntensity = "subtle" | "normal" | "energetic";

export type DurationSeconds = 5 | 10 | 15 | 30;

export type MotionAspectRatio = "16:9" | "9:16" | "1:1";

export type Resolution = "720p" | "1080p" | "4k";

export type FrameRate = 24 | 30 | 60;

export type MotionSettings = {
  motionConcept: string;
  motionType: MotionType;
  channelName: string;
  titleText: string;
  subtitleText: string;
  finalText: string;
  backgroundType: MotionBackgroundType;
  styleDirection: StyleDirection;
  primaryColor: string;
  secondaryColor: string;
  motionIntensity: MotionIntensity;
  durationSeconds: DurationSeconds;
  aspectRatio: MotionAspectRatio;
  resolution: Resolution;
  frameRate: FrameRate;
  introLength: number;
  holdLength: number;
  outroLength: number;
};

export const motionSettingsDefaults: MotionSettings = {
  motionConcept: "",
  motionType: "countdown",
  channelName: "Siska Channel",
  titleText: "New Video Starts Soon",
  subtitleText: "Don't forget to subscribe",
  finalText: "Let's Start",
  backgroundType: "animated-gradient",
  styleDirection: "soft-pastel-glass",
  primaryColor: "#F6A7C1",
  secondaryColor: "#B9A7FF",
  motionIntensity: "normal",
  durationSeconds: 10,
  aspectRatio: "16:9",
  resolution: "1080p",
  frameRate: 30,
  introLength: 1,
  holdLength: 8,
  outroLength: 1,
};

export type MotionTypeOption = {
  value: MotionType;
  label: string;
  helper: string;
  emoji: string;
};

export const MOTION_TYPE_OPTIONS: MotionTypeOption[] = [
  {
    value: "countdown",
    label: "Countdown",
    helper: "Numbers count down to a launch.",
    emoji: "⏱",
  },
  {
    value: "reveal",
    label: "Reveal",
    helper: "Title fades or slides into focus.",
    emoji: "✨",
  },
  {
    value: "slide",
    label: "Slide",
    helper: "Text slides on-screen with motion accents.",
    emoji: "➡",
  },
  {
    value: "fade",
    label: "Fade",
    helper: "Soft fade in and fade out across scenes.",
    emoji: "🌫",
  },
  {
    value: "loop",
    label: "Loop",
    helper: "Looping ambient motion stinger.",
    emoji: "🔁",
  },
  {
    value: "subscribe",
    label: "Subscribe",
    helper: "Subscribe button reveal with accents.",
    emoji: "🔔",
  },
  {
    value: "lower-third",
    label: "Lower Third",
    helper: "Title bar near the bottom of the frame.",
    emoji: "▭",
  },
  {
    value: "abstract-motion",
    label: "Abstract Motion",
    helper: "Animated abstract shapes, no text focus.",
    emoji: "◇",
  },
];

export const BACKGROUND_TYPE_OPTIONS: Array<{
  value: MotionBackgroundType;
  label: string;
  disabled?: boolean;
}> = [
  { value: "animated-gradient", label: "Animated gradient" },
  { value: "abstract-shapes", label: "Abstract shapes" },
  { value: "solid-color", label: "Solid color" },
  { value: "image-upload", label: "Image upload", disabled: true },
];

export const STYLE_DIRECTION_OPTIONS: Array<{
  value: StyleDirection;
  label: string;
  helper: string;
}> = [
  {
    value: "soft-pastel-glass",
    label: "Soft Pastel Glass",
    helper: "Frosted soft-pink and lavender glass.",
  },
  {
    value: "modern-gradient",
    label: "Modern Gradient",
    helper: "Bright multi-stop gradient backdrop.",
  },
  {
    value: "neon-dark",
    label: "Neon Dark",
    helper: "Dark backdrop with neon accent glow.",
  },
  {
    value: "clean-minimal",
    label: "Clean Minimal",
    helper: "Off-white minimal layout, calm typography.",
  },
  {
    value: "bold-creator",
    label: "Bold Creator",
    helper: "Saturated bold colors and big type.",
  },
];

export const MOTION_INTENSITY_OPTIONS: Array<{
  value: MotionIntensity;
  label: string;
  helper: string;
}> = [
  { value: "subtle", label: "Subtle", helper: "Slow and gentle." },
  { value: "normal", label: "Normal", helper: "Balanced motion." },
  { value: "energetic", label: "Energetic", helper: "Fast and punchy." },
];

export const DURATION_OPTIONS: DurationSeconds[] = [5, 10, 15, 30];

export const ASPECT_RATIO_OPTIONS: Array<{
  value: MotionAspectRatio;
  label: string;
  helper: string;
}> = [
  { value: "16:9", label: "16:9", helper: "YouTube · Landscape" },
  { value: "9:16", label: "9:16", helper: "Shorts · TikTok · Reels" },
  { value: "1:1", label: "1:1", helper: "Square" },
];

export const RESOLUTION_OPTIONS: Array<{
  value: Resolution;
  label: string;
  disabled?: boolean;
}> = [
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "4k", label: "4K", disabled: true },
];

export const FRAME_RATE_OPTIONS: Array<{
  value: FrameRate;
  label: string;
  disabled?: boolean;
}> = [
  { value: 24, label: "24 fps" },
  { value: 30, label: "30 fps" },
  { value: 60, label: "60 fps", disabled: true },
];

const MIN_TIMING_SECONDS = 0;
const MAX_TIMING_SECONDS = 60;

export const clampTiming = (value: number, fallback: number): number => {
  if (!Number.isFinite(value)) return fallback;
  if (value < MIN_TIMING_SECONDS) return MIN_TIMING_SECONDS;
  if (value > MAX_TIMING_SECONDS) return MAX_TIMING_SECONDS;
  return value;
};

export const getDisplayText = (value: string, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed ? value : fallback;
};

export const sanitizeMotionSettings = (
  settings: MotionSettings,
): MotionSettings => ({
  ...settings,
  introLength: clampTiming(
    settings.introLength,
    motionSettingsDefaults.introLength,
  ),
  holdLength: clampTiming(
    settings.holdLength,
    motionSettingsDefaults.holdLength,
  ),
  outroLength: clampTiming(
    settings.outroLength,
    motionSettingsDefaults.outroLength,
  ),
});

export const motionTypeLabel = (type: MotionType): string =>
  MOTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;

export const styleDirectionLabel = (style: StyleDirection): string =>
  STYLE_DIRECTION_OPTIONS.find((o) => o.value === style)?.label ?? style;

export const resolutionLabel = (r: Resolution): string =>
  RESOLUTION_OPTIONS.find((o) => o.value === r)?.label ?? r;

export const frameRateLabel = (f: FrameRate): string =>
  FRAME_RATE_OPTIONS.find((o) => o.value === f)?.label ?? `${f} fps`;
