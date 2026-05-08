// SN Motion — User-saved Presets (PR #13)
//
// Presets are user-saved MotionSettings configurations, NOT stock template
// packs and NOT pre-made themes. Each preset stores the full MotionSettings
// object so applying a preset restores exactly what the user had at save
// time.
//
// What lives here:
//   - Preset type + storage key
//   - Strict-but-forgiving coercion from unknown JSON → valid MotionSettings
//   - localStorage load / save helpers (safe on SSR)
//   - Duplicate-name resolution
//   - JSON import / export helpers
//
// IMPORTANT: This module is intentionally defensive. A broken / partial /
// hand-edited preset payload should never crash the app — we always fall
// back to defaults rather than throwing.

import {
  type BackgroundBlur,
  type DurationSeconds,
  type FrameRate,
  type GlowIntensity,
  type MotionAspectRatio,
  type MotionBackgroundType,
  type MotionIntensity,
  type MotionSettings,
  type MotionType,
  type OverlayOpacity,
  type Resolution,
  type StyleDirection,
  isHexColor,
  motionSettingsDefaults,
  safeHex,
  sanitizeMotionSettings,
} from "./motionSettings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Preset = {
  id: string;
  name: string;
  settings: MotionSettings;
  createdAt: number;
  updatedAt: number;
};

export const PRESETS_STORAGE_KEY = "sn-motion:presets:v1";

export const PRESET_NAME_MAX_LENGTH = 60;
export const UNTITLED_PRESET_NAME = "Untitled preset";

// ---------------------------------------------------------------------------
// Allowed enum values (kept here so validation is local to this module)
// ---------------------------------------------------------------------------

const MOTION_TYPES: ReadonlyArray<MotionType> = [
  "countdown",
  "reveal",
  "slide",
  "fade",
  "loop",
  "subscribe",
  "lower-third",
  "abstract-motion",
];

const BACKGROUND_TYPES: ReadonlyArray<MotionBackgroundType> = [
  "animated-gradient",
  "abstract-shapes",
  "solid-color",
  "image-upload",
];

const STYLE_DIRECTIONS: ReadonlyArray<StyleDirection> = [
  "soft-pastel-glass",
  "modern-gradient",
  "neon-dark",
  "clean-minimal",
  "bold-creator",
];

const MOTION_INTENSITIES: ReadonlyArray<MotionIntensity> = [
  "subtle",
  "normal",
  "energetic",
];

const DURATIONS: ReadonlyArray<DurationSeconds> = [5, 10, 15, 30];

const ASPECT_RATIOS: ReadonlyArray<MotionAspectRatio> = ["16:9", "9:16", "1:1"];

const RESOLUTIONS: ReadonlyArray<Resolution> = ["720p", "1080p", "4k"];

const FRAME_RATES: ReadonlyArray<FrameRate> = [24, 30, 60];

const BACKGROUND_BLURS: ReadonlyArray<BackgroundBlur> = [
  "low",
  "medium",
  "high",
];

const GLOW_INTENSITIES: ReadonlyArray<GlowIntensity> = [
  "off",
  "soft",
  "medium",
  "strong",
];

const OVERLAY_OPACITIES: ReadonlyArray<OverlayOpacity> = [0, 25, 50, 75];

// ---------------------------------------------------------------------------
// Generic validators
// ---------------------------------------------------------------------------

const isOneOf = <T extends string | number>(
  value: unknown,
  list: ReadonlyArray<T>,
): value is T => list.some((entry) => entry === value);

const stringOr = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback;

const numberOr = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const boolOr = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const hexOr = (value: unknown, fallback: string): string =>
  isHexColor(value) ? safeHex(value, fallback) : fallback;

// ---------------------------------------------------------------------------
// Coerce unknown → MotionSettings
// ---------------------------------------------------------------------------

export const coerceToMotionSettings = (raw: unknown): MotionSettings => {
  const obj =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const d = motionSettingsDefaults;
  const settings: MotionSettings = {
    motionConcept: stringOr(obj.motionConcept, d.motionConcept),
    motionType: isOneOf(obj.motionType, MOTION_TYPES)
      ? obj.motionType
      : d.motionType,
    channelName: stringOr(obj.channelName, d.channelName),
    titleText: stringOr(obj.titleText, d.titleText),
    subtitleText: stringOr(obj.subtitleText, d.subtitleText),
    finalText: stringOr(obj.finalText, d.finalText),
    backgroundType: isOneOf(obj.backgroundType, BACKGROUND_TYPES)
      ? obj.backgroundType
      : d.backgroundType,
    styleDirection: isOneOf(obj.styleDirection, STYLE_DIRECTIONS)
      ? obj.styleDirection
      : d.styleDirection,
    primaryColor: hexOr(obj.primaryColor, d.primaryColor),
    secondaryColor: hexOr(obj.secondaryColor, d.secondaryColor),
    motionIntensity: isOneOf(obj.motionIntensity, MOTION_INTENSITIES)
      ? obj.motionIntensity
      : d.motionIntensity,
    durationSeconds: isOneOf(obj.durationSeconds, DURATIONS)
      ? obj.durationSeconds
      : d.durationSeconds,
    aspectRatio: isOneOf(obj.aspectRatio, ASPECT_RATIOS)
      ? obj.aspectRatio
      : d.aspectRatio,
    resolution: isOneOf(obj.resolution, RESOLUTIONS)
      ? obj.resolution
      : d.resolution,
    frameRate: isOneOf(obj.frameRate, FRAME_RATES)
      ? obj.frameRate
      : d.frameRate,
    introLength: numberOr(obj.introLength, d.introLength),
    holdLength: numberOr(obj.holdLength, d.holdLength),
    outroLength: numberOr(obj.outroLength, d.outroLength),
    textColor: hexOr(obj.textColor, d.textColor),
    backgroundStartColor: hexOr(
      obj.backgroundStartColor,
      d.backgroundStartColor,
    ),
    backgroundEndColor: hexOr(obj.backgroundEndColor, d.backgroundEndColor),
    accentColor: hexOr(obj.accentColor, d.accentColor),
    countdownNumberColor: hexOr(
      obj.countdownNumberColor,
      d.countdownNumberColor,
    ),
    overlayColor: hexOr(obj.overlayColor, d.overlayColor),
    borderGlowColor: hexOr(obj.borderGlowColor, d.borderGlowColor),
    backgroundBlur: isOneOf(obj.backgroundBlur, BACKGROUND_BLURS)
      ? obj.backgroundBlur
      : d.backgroundBlur,
    glowIntensity: isOneOf(obj.glowIntensity, GLOW_INTENSITIES)
      ? obj.glowIntensity
      : d.glowIntensity,
    overlayOpacity: isOneOf(obj.overlayOpacity, OVERLAY_OPACITIES)
      ? obj.overlayOpacity
      : d.overlayOpacity,
    fontLicenseConfirmed: boolOr(
      obj.fontLicenseConfirmed,
      d.fontLicenseConfirmed,
    ),
    iconLicenseConfirmed: boolOr(
      obj.iconLicenseConfirmed,
      d.iconLicenseConfirmed,
    ),
    audioLicenseConfirmed: boolOr(
      obj.audioLicenseConfirmed,
      d.audioLicenseConfirmed,
    ),
    assetLicenseConfirmed: boolOr(
      obj.assetLicenseConfirmed,
      d.assetLicenseConfirmed,
    ),
    aiDisclosureAcknowledged: boolOr(
      obj.aiDisclosureAcknowledged,
      d.aiDisclosureAcknowledged,
    ),
  };
  return sanitizeMotionSettings(settings);
};

// ---------------------------------------------------------------------------
// Preset coercion (from arbitrary unknown payload)
// ---------------------------------------------------------------------------

export const newPresetId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      return crypto.randomUUID();
    } catch {
      // fall through
    }
  }
  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const trimName = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return UNTITLED_PRESET_NAME;
  if (trimmed.length > PRESET_NAME_MAX_LENGTH) {
    return trimmed.slice(0, PRESET_NAME_MAX_LENGTH);
  }
  return trimmed;
};

export const coercePreset = (raw: unknown): Preset | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const settings = coerceToMotionSettings(r.settings);
  const name =
    typeof r.name === "string" ? trimName(r.name) : UNTITLED_PRESET_NAME;
  const id =
    typeof r.id === "string" && r.id.trim().length > 0 ? r.id : newPresetId();
  const now = Date.now();
  const createdAt =
    typeof r.createdAt === "number" && Number.isFinite(r.createdAt)
      ? r.createdAt
      : now;
  const updatedAt =
    typeof r.updatedAt === "number" && Number.isFinite(r.updatedAt)
      ? r.updatedAt
      : createdAt;
  return { id, name, settings, createdAt, updatedAt };
};

export const coercePresetList = (raw: unknown): Preset[] => {
  if (!Array.isArray(raw)) return [];
  const out: Preset[] = [];
  const seenIds = new Set<string>();
  for (const item of raw) {
    const preset = coercePreset(item);
    if (!preset) continue;
    // De-dupe IDs so a corrupted file with collisions still loads.
    if (seenIds.has(preset.id)) {
      preset.id = newPresetId();
    }
    seenIds.add(preset.id);
    out.push(preset);
  }
  return out;
};

// ---------------------------------------------------------------------------
// Duplicate-name resolution
// ---------------------------------------------------------------------------

export const ensureUniqueName = (
  desired: string,
  existing: ReadonlyArray<{ id: string; name: string }>,
  excludeId?: string,
): string => {
  const base = trimName(desired);
  const isTaken = (candidate: string): boolean =>
    existing.some(
      (entry) =>
        entry.id !== excludeId &&
        entry.name.trim().toLowerCase() === candidate.trim().toLowerCase(),
    );
  if (!isTaken(base)) return base;
  for (let i = 2; i < 1000; i += 1) {
    const candidate = trimName(`${base} (${i})`);
    if (!isTaken(candidate)) return candidate;
  }
  return trimName(`${base} (${Date.now()})`);
};

// ---------------------------------------------------------------------------
// localStorage (safe on SSR — caller guards too, but be defensive)
// ---------------------------------------------------------------------------

export const loadPresetsFromStorage = (): Preset[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return coercePresetList(parsed);
  } catch {
    return [];
  }
};

export const savePresetsToStorage = (presets: Preset[]): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // localStorage can be full or disabled — silently skip rather than crash.
  }
};

// ---------------------------------------------------------------------------
// JSON import / export of the full preset list
// ---------------------------------------------------------------------------

export const PRESETS_EXPORT_FILENAME = "sn_motion_presets.json";

export type PresetsExportFile = {
  app: "sn-motion";
  kind: "presets";
  version: 1;
  exportedAt: number;
  presets: Preset[];
};

export const buildPresetsExport = (presets: Preset[]): PresetsExportFile => ({
  app: "sn-motion",
  kind: "presets",
  version: 1,
  exportedAt: Date.now(),
  presets,
});

export type PresetsImportResult =
  | { ok: true; presets: Preset[] }
  | { ok: false; error: string };

export const parsePresetsImport = (raw: string): PresetsImportResult => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "That file isn’t valid JSON." };
  }
  if (Array.isArray(parsed)) {
    return { ok: true, presets: coercePresetList(parsed) };
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.presets)) {
      return { ok: true, presets: coercePresetList(obj.presets) };
    }
  }
  return {
    ok: false,
    error: "That file doesn’t look like an SN Motion presets export.",
  };
};
