import {
  motionSettingsDefaults,
  safeHex,
  type FrameRate,
  type MotionAspectRatio,
  type MotionSettings,
  type Resolution,
} from "@/lib/motionSettings";

import {
  dynamicMotionDefaults,
  type DynamicMotionProps,
} from "./dynamicMotionSchema";

export const DYNAMIC_MOTION_COMPOSITION_ID = "dynamic-motion-preview";

const ASPECT_BASE: Record<MotionAspectRatio, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

// Resolution scale relative to "1080p". 4K stays at 1x for now (UI marks it
// as disabled / placeholder) so we never produce an unsupported size here.
const RESOLUTION_SCALE: Record<Resolution, number> = {
  "720p": 2 / 3,
  "1080p": 1,
  "4k": 1,
};

const ALLOWED_FRAME_RATES: FrameRate[] = [24, 30, 60];

const ensureEvenInt = (value: number): number => {
  const rounded = Math.round(value);
  return rounded % 2 === 0 ? rounded : rounded + 1;
};

export const dynamicMotionDimensions = (
  aspectRatio: MotionAspectRatio,
  resolution: Resolution,
): { width: number; height: number } => {
  const base = ASPECT_BASE[aspectRatio] ?? ASPECT_BASE["16:9"];
  const scale = RESOLUTION_SCALE[resolution] ?? 1;
  return {
    width: ensureEvenInt(base.width * scale),
    height: ensureEvenInt(base.height * scale),
  };
};

export const safeFrameRate = (value: unknown): FrameRate => {
  if (typeof value === "number" && ALLOWED_FRAME_RATES.includes(value as FrameRate)) {
    return value as FrameRate;
  }
  return motionSettingsDefaults.frameRate;
};

export const safeDurationSeconds = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return motionSettingsDefaults.durationSeconds;
  }
  if (value <= 0) return motionSettingsDefaults.durationSeconds;
  if (value > 600) return 600;
  return value;
};

export const dynamicMotionDurationInFrames = (
  durationSeconds: number,
  frameRate: FrameRate,
): number => {
  const seconds = safeDurationSeconds(durationSeconds);
  const fps = safeFrameRate(frameRate);
  const frames = Math.round(seconds * fps);
  // Remotion compositions must have at least 1 frame.
  return Math.max(1, frames);
};

const safeText = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") return fallback;
  return value;
};

const safeNonNegative = (value: unknown, fallback: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (value < 0) return 0;
  return value;
};

const passthroughEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T => {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
};

export const motionSettingsToDynamicProps = (
  settings: MotionSettings,
): DynamicMotionProps => ({
  motionConcept: safeText(settings.motionConcept, dynamicMotionDefaults.motionConcept),
  motionType: passthroughEnum(
    settings.motionType,
    [
      "countdown",
      "reveal",
      "slide",
      "fade",
      "loop",
      "subscribe",
      "lower-third",
      "abstract-motion",
    ] as const,
    dynamicMotionDefaults.motionType,
  ),
  channelName: safeText(settings.channelName, dynamicMotionDefaults.channelName),
  titleText: safeText(settings.titleText, dynamicMotionDefaults.titleText),
  subtitleText: safeText(settings.subtitleText, dynamicMotionDefaults.subtitleText),
  finalText: safeText(settings.finalText, dynamicMotionDefaults.finalText),
  backgroundType: passthroughEnum(
    settings.backgroundType,
    ["animated-gradient", "abstract-shapes", "solid-color", "image-upload"] as const,
    dynamicMotionDefaults.backgroundType,
  ),
  styleDirection: passthroughEnum(
    settings.styleDirection,
    [
      "soft-pastel-glass",
      "modern-gradient",
      "neon-dark",
      "clean-minimal",
      "bold-creator",
    ] as const,
    dynamicMotionDefaults.styleDirection,
  ),
  primaryColor: safeHex(settings.primaryColor, dynamicMotionDefaults.primaryColor),
  secondaryColor: safeHex(
    settings.secondaryColor,
    dynamicMotionDefaults.secondaryColor,
  ),
  textColor: safeHex(settings.textColor, dynamicMotionDefaults.textColor),
  backgroundStartColor: safeHex(
    settings.backgroundStartColor,
    dynamicMotionDefaults.backgroundStartColor,
  ),
  backgroundEndColor: safeHex(
    settings.backgroundEndColor,
    dynamicMotionDefaults.backgroundEndColor,
  ),
  accentColor: safeHex(settings.accentColor, dynamicMotionDefaults.accentColor),
  countdownNumberColor: safeHex(
    settings.countdownNumberColor,
    dynamicMotionDefaults.countdownNumberColor,
  ),
  overlayColor: safeHex(
    settings.overlayColor,
    dynamicMotionDefaults.overlayColor,
  ),
  borderGlowColor: safeHex(
    settings.borderGlowColor,
    dynamicMotionDefaults.borderGlowColor,
  ),
  backgroundBlur: passthroughEnum(
    settings.backgroundBlur,
    ["low", "medium", "high"] as const,
    dynamicMotionDefaults.backgroundBlur,
  ),
  glowIntensity: passthroughEnum(
    settings.glowIntensity,
    ["off", "soft", "medium", "strong"] as const,
    dynamicMotionDefaults.glowIntensity,
  ),
  overlayOpacity: ((): DynamicMotionProps["overlayOpacity"] => {
    const v = settings.overlayOpacity;
    if (v === 0 || v === 25 || v === 50 || v === 75) return v;
    return dynamicMotionDefaults.overlayOpacity;
  })(),
  motionIntensity: passthroughEnum(
    settings.motionIntensity,
    ["subtle", "normal", "energetic"] as const,
    dynamicMotionDefaults.motionIntensity,
  ),
  durationSeconds: ((): DynamicMotionProps["durationSeconds"] => {
    const v = settings.durationSeconds;
    if (v === 5 || v === 10 || v === 15 || v === 30) return v;
    return dynamicMotionDefaults.durationSeconds;
  })(),
  aspectRatio: passthroughEnum(
    settings.aspectRatio,
    ["16:9", "9:16", "1:1"] as const,
    dynamicMotionDefaults.aspectRatio,
  ),
  resolution: passthroughEnum(
    settings.resolution,
    ["720p", "1080p", "4k"] as const,
    dynamicMotionDefaults.resolution,
  ),
  frameRate: safeFrameRate(settings.frameRate),
  introLength: safeNonNegative(
    settings.introLength,
    dynamicMotionDefaults.introLength,
  ),
  holdLength: safeNonNegative(
    settings.holdLength,
    dynamicMotionDefaults.holdLength,
  ),
  outroLength: safeNonNegative(
    settings.outroLength,
    dynamicMotionDefaults.outroLength,
  ),
});

export const motionIntensityMultiplier = (
  intensity: DynamicMotionProps["motionIntensity"],
): number => {
  switch (intensity) {
    case "subtle":
      return 0.6;
    case "energetic":
      return 1.5;
    case "normal":
    default:
      return 1;
  }
};
