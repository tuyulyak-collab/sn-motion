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

export type BackgroundBlur = "low" | "medium" | "high";

export type GlowIntensity = "off" | "soft" | "medium" | "strong";

export type OverlayOpacity = 0 | 25 | 50 | 75;

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
  textColor: string;
  backgroundStartColor: string;
  backgroundEndColor: string;
  accentColor: string;
  countdownNumberColor: string;
  overlayColor: string;
  borderGlowColor: string;
  backgroundBlur: BackgroundBlur;
  glowIntensity: GlowIntensity;
  overlayOpacity: OverlayOpacity;
  // Global microstock safety checklist (PR #10). These are user
  // acknowledgements and intentionally default to `false` so a fresh project
  // surfaces in the "Needs review" state until the human submitter confirms
  // they've handled licensing + AI disclosure. Stock safety is global to SN
  // Motion and is NOT a preset / template / mode.
  fontLicenseConfirmed: boolean;
  iconLicenseConfirmed: boolean;
  audioLicenseConfirmed: boolean;
  assetLicenseConfirmed: boolean;
  aiDisclosureAcknowledged: boolean;
};

export const ADVANCED_COLOR_KEYS = [
  "textColor",
  "backgroundStartColor",
  "backgroundEndColor",
  "accentColor",
  "countdownNumberColor",
  "overlayColor",
  "borderGlowColor",
  "backgroundBlur",
  "glowIntensity",
  "overlayOpacity",
] as const satisfies ReadonlyArray<keyof MotionSettings>;

export type AdvancedColorKey = (typeof ADVANCED_COLOR_KEYS)[number];

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
  textColor: "#2F2B3A",
  backgroundStartColor: "#F6A7C1",
  backgroundEndColor: "#B9A7FF",
  accentColor: "#9B7CF6",
  countdownNumberColor: "#6E57D6",
  overlayColor: "#FFFFFF",
  borderGlowColor: "#B9A7FF",
  backgroundBlur: "medium",
  glowIntensity: "soft",
  overlayOpacity: 50,
  fontLicenseConfirmed: false,
  iconLicenseConfirmed: false,
  audioLicenseConfirmed: false,
  assetLicenseConfirmed: false,
  aiDisclosureAcknowledged: false,
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

export const BACKGROUND_BLUR_OPTIONS: Array<{
  value: BackgroundBlur;
  label: string;
  helper: string;
}> = [
  { value: "low", label: "Low", helper: "Subtle softness." },
  { value: "medium", label: "Medium", helper: "Balanced glass blur." },
  { value: "high", label: "High", helper: "Heavy frosted glass." },
];

export const GLOW_INTENSITY_OPTIONS: Array<{
  value: GlowIntensity;
  label: string;
  helper: string;
}> = [
  { value: "off", label: "Off", helper: "No glow." },
  { value: "soft", label: "Soft", helper: "Gentle outer glow." },
  { value: "medium", label: "Medium", helper: "Stronger glow halo." },
  { value: "strong", label: "Strong", helper: "Punchy neon-style glow." },
];

export const OVERLAY_OPACITY_OPTIONS: Array<{
  value: OverlayOpacity;
  label: string;
}> = [
  { value: 0, label: "0%" },
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
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

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && HEX_RE.test(value.trim());

export const safeHex = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!HEX_RE.test(trimmed)) return fallback;
  if (trimmed.length === 4) {
    const r = trimmed.charAt(1);
    const g = trimmed.charAt(2);
    const b = trimmed.charAt(3);
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return trimmed.toUpperCase();
};

export const blurPx = (level: BackgroundBlur): number => {
  switch (level) {
    case "low":
      return 4;
    case "high":
      return 24;
    case "medium":
    default:
      return 12;
  }
};

export const glowMultiplier = (intensity: GlowIntensity): number => {
  switch (intensity) {
    case "off":
      return 0;
    case "soft":
      return 1;
    case "medium":
      return 2;
    case "strong":
      return 3;
    default:
      return 1;
  }
};

export const overlayAlpha = (opacity: OverlayOpacity): number => opacity / 100;

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
  textColor: safeHex(settings.textColor, motionSettingsDefaults.textColor),
  backgroundStartColor: safeHex(
    settings.backgroundStartColor,
    motionSettingsDefaults.backgroundStartColor,
  ),
  backgroundEndColor: safeHex(
    settings.backgroundEndColor,
    motionSettingsDefaults.backgroundEndColor,
  ),
  accentColor: safeHex(
    settings.accentColor,
    motionSettingsDefaults.accentColor,
  ),
  countdownNumberColor: safeHex(
    settings.countdownNumberColor,
    motionSettingsDefaults.countdownNumberColor,
  ),
  overlayColor: safeHex(
    settings.overlayColor,
    motionSettingsDefaults.overlayColor,
  ),
  borderGlowColor: safeHex(
    settings.borderGlowColor,
    motionSettingsDefaults.borderGlowColor,
  ),
});

export const advancedColorDefaults = (): Pick<
  MotionSettings,
  AdvancedColorKey
> => ({
  textColor: motionSettingsDefaults.textColor,
  backgroundStartColor: motionSettingsDefaults.backgroundStartColor,
  backgroundEndColor: motionSettingsDefaults.backgroundEndColor,
  accentColor: motionSettingsDefaults.accentColor,
  countdownNumberColor: motionSettingsDefaults.countdownNumberColor,
  overlayColor: motionSettingsDefaults.overlayColor,
  borderGlowColor: motionSettingsDefaults.borderGlowColor,
  backgroundBlur: motionSettingsDefaults.backgroundBlur,
  glowIntensity: motionSettingsDefaults.glowIntensity,
  overlayOpacity: motionSettingsDefaults.overlayOpacity,
});

export const resetAdvancedColors = (
  settings: MotionSettings,
): MotionSettings => ({
  ...settings,
  ...advancedColorDefaults(),
});

export const hexToRgba = (hex: string, alpha: number): string => {
  const safe = safeHex(hex, "#000000");
  const r = parseInt(safe.slice(1, 3), 16);
  const g = parseInt(safe.slice(3, 5), 16);
  const b = parseInt(safe.slice(5, 7), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const motionTypeLabel = (type: MotionType): string =>
  MOTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;

export const styleDirectionLabel = (style: StyleDirection): string =>
  STYLE_DIRECTION_OPTIONS.find((o) => o.value === style)?.label ?? style;

export const resolutionLabel = (r: Resolution): string =>
  RESOLUTION_OPTIONS.find((o) => o.value === r)?.label ?? r;

export const frameRateLabel = (f: FrameRate): string =>
  FRAME_RATE_OPTIONS.find((o) => o.value === f)?.label ?? `${f} fps`;
