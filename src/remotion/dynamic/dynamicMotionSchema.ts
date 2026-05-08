import {
  type FrameRate,
  type MotionAspectRatio,
  type MotionSettings,
  type Resolution,
  motionSettingsDefaults,
  safeHex,
} from "../../lib/motionSettings";

/**
 * NOTE: PR #7 ships the first real Remotion composition that consumes
 * MotionSettings. MP4 export and the render API are still NOT implemented.
 * The /api/render route remains unchanged.
 */

export type DynamicMotionProps = MotionSettings;

export const dynamicMotionDefaults: DynamicMotionProps = {
  ...motionSettingsDefaults,
};

const MIN_FRAMES = 1;
const MAX_FRAMES = 60 * 60 * 5; // 5 minutes ceiling, just a safety cap

export const dynamicMotionDurationInFrames = (
  durationSeconds: number,
  frameRate: number,
): number => {
  const seconds = Number.isFinite(durationSeconds)
    ? Math.max(1, durationSeconds)
    : motionSettingsDefaults.durationSeconds;
  const fps = Number.isFinite(frameRate)
    ? Math.max(1, frameRate)
    : motionSettingsDefaults.frameRate;
  const total = Math.round(seconds * fps);
  if (!Number.isFinite(total) || total < MIN_FRAMES) return MIN_FRAMES;
  if (total > MAX_FRAMES) return MAX_FRAMES;
  return total;
};

export const dynamicMotionFps = (frameRate: FrameRate): number => {
  // 4K + 60fps are kept disabled in the UI for now. If something slips through,
  // fall back to the default frame rate.
  if (frameRate === 60) return motionSettingsDefaults.frameRate;
  return frameRate;
};

const SAFE_RESOLUTION = (resolution: Resolution): "720p" | "1080p" =>
  resolution === "4k" ? "1080p" : resolution;

export const dynamicMotionDimensions = (
  aspectRatio: MotionAspectRatio,
  resolution: Resolution,
): { width: number; height: number } => {
  const safe = SAFE_RESOLUTION(resolution);
  const isHd = safe === "1080p";

  switch (aspectRatio) {
    case "16:9":
      return isHd ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
    case "9:16":
      return isHd ? { width: 1080, height: 1920 } : { width: 720, height: 1280 };
    case "1:1":
      return isHd ? { width: 1080, height: 1080 } : { width: 720, height: 720 };
    default:
      return { width: 1920, height: 1080 };
  }
};

export const dynamicMotionCompositionId = (
  aspectRatio: MotionAspectRatio,
): string => {
  switch (aspectRatio) {
    case "16:9":
      return "dynamic-motion-preview-16x9";
    case "9:16":
      return "dynamic-motion-preview-9x16";
    case "1:1":
      return "dynamic-motion-preview-1x1";
    default:
      return "dynamic-motion-preview-16x9";
  }
};

/**
 * Bridge between the UI MotionSettings state and the Remotion composition
 * props. Applies safe fallbacks for every advanced color field so the
 * composition can never be passed an invalid hex string.
 */
export const motionSettingsToDynamicProps = (
  settings: MotionSettings,
): DynamicMotionProps => ({
  ...settings,
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
  primaryColor: safeHex(
    settings.primaryColor,
    motionSettingsDefaults.primaryColor,
  ),
  secondaryColor: safeHex(
    settings.secondaryColor,
    motionSettingsDefaults.secondaryColor,
  ),
});
