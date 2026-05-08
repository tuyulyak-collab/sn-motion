import { z } from "zod";

import {
  motionSettingsDefaults,
  type FrameRate,
  type MotionAspectRatio,
  type MotionBackgroundType,
  type MotionIntensity,
  type MotionType,
  type Resolution,
  type StyleDirection,
} from "../../lib/motionSettings";

export const motionTypeSchema = z.enum([
  "countdown",
  "reveal",
  "slide",
  "fade",
  "loop",
  "subscribe",
  "lower-third",
  "abstract-motion",
]);

export const backgroundTypeSchema = z.enum([
  "animated-gradient",
  "abstract-shapes",
  "solid-color",
  "image-upload",
]);

export const styleDirectionSchema = z.enum([
  "soft-pastel-glass",
  "modern-gradient",
  "neon-dark",
  "clean-minimal",
  "bold-creator",
]);

export const aspectRatioSchema = z.enum(["16:9", "9:16", "1:1"]);

export const resolutionSchema = z.enum(["720p", "1080p", "4k"]);

export const frameRateSchema = z.union([
  z.literal(24),
  z.literal(30),
  z.literal(60),
]);

export const motionIntensitySchema = z.enum(["subtle", "normal", "energetic"]);

export const backgroundBlurSchema = z.enum(["low", "medium", "high"]);

export const glowIntensitySchema = z.enum(["off", "soft", "medium", "strong"]);

export const overlayOpacitySchema = z.union([
  z.literal(0),
  z.literal(25),
  z.literal(50),
  z.literal(75),
]);

export const durationSecondsSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(30),
]);

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

export const dynamicMotionPropsSchema = z.object({
  motionConcept: z.string().default(motionSettingsDefaults.motionConcept),
  motionType: motionTypeSchema.default(motionSettingsDefaults.motionType),
  channelName: z.string().default(motionSettingsDefaults.channelName),
  titleText: z.string().default(motionSettingsDefaults.titleText),
  subtitleText: z.string().default(motionSettingsDefaults.subtitleText),
  finalText: z.string().default(motionSettingsDefaults.finalText),
  backgroundType: backgroundTypeSchema.default(
    motionSettingsDefaults.backgroundType,
  ),
  styleDirection: styleDirectionSchema.default(
    motionSettingsDefaults.styleDirection,
  ),
  primaryColor: hexColorSchema.default(motionSettingsDefaults.primaryColor),
  secondaryColor: hexColorSchema.default(
    motionSettingsDefaults.secondaryColor,
  ),
  textColor: hexColorSchema.default(motionSettingsDefaults.textColor),
  backgroundStartColor: hexColorSchema.default(
    motionSettingsDefaults.backgroundStartColor,
  ),
  backgroundEndColor: hexColorSchema.default(
    motionSettingsDefaults.backgroundEndColor,
  ),
  accentColor: hexColorSchema.default(motionSettingsDefaults.accentColor),
  countdownNumberColor: hexColorSchema.default(
    motionSettingsDefaults.countdownNumberColor,
  ),
  overlayColor: hexColorSchema.default(motionSettingsDefaults.overlayColor),
  borderGlowColor: hexColorSchema.default(
    motionSettingsDefaults.borderGlowColor,
  ),
  backgroundBlur: backgroundBlurSchema.default(
    motionSettingsDefaults.backgroundBlur,
  ),
  glowIntensity: glowIntensitySchema.default(
    motionSettingsDefaults.glowIntensity,
  ),
  overlayOpacity: overlayOpacitySchema.default(
    motionSettingsDefaults.overlayOpacity,
  ),
  motionIntensity: motionIntensitySchema.default(
    motionSettingsDefaults.motionIntensity,
  ),
  durationSeconds: durationSecondsSchema.default(
    motionSettingsDefaults.durationSeconds,
  ),
  aspectRatio: aspectRatioSchema.default(motionSettingsDefaults.aspectRatio),
  resolution: resolutionSchema.default(motionSettingsDefaults.resolution),
  frameRate: frameRateSchema.default(motionSettingsDefaults.frameRate),
  introLength: z.number().min(0).max(60).default(motionSettingsDefaults.introLength),
  holdLength: z.number().min(0).max(60).default(motionSettingsDefaults.holdLength),
  outroLength: z.number().min(0).max(60).default(motionSettingsDefaults.outroLength),
});

export type DynamicMotionProps = z.infer<typeof dynamicMotionPropsSchema>;

export const dynamicMotionDefaults: DynamicMotionProps = {
  motionConcept: motionSettingsDefaults.motionConcept,
  motionType: motionSettingsDefaults.motionType,
  channelName: motionSettingsDefaults.channelName,
  titleText: motionSettingsDefaults.titleText,
  subtitleText: motionSettingsDefaults.subtitleText,
  finalText: motionSettingsDefaults.finalText,
  backgroundType: motionSettingsDefaults.backgroundType,
  styleDirection: motionSettingsDefaults.styleDirection,
  primaryColor: motionSettingsDefaults.primaryColor,
  secondaryColor: motionSettingsDefaults.secondaryColor,
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
  motionIntensity: motionSettingsDefaults.motionIntensity,
  durationSeconds: motionSettingsDefaults.durationSeconds,
  aspectRatio: motionSettingsDefaults.aspectRatio,
  resolution: motionSettingsDefaults.resolution,
  frameRate: motionSettingsDefaults.frameRate,
  introLength: motionSettingsDefaults.introLength,
  holdLength: motionSettingsDefaults.holdLength,
  outroLength: motionSettingsDefaults.outroLength,
};

export type {
  FrameRate,
  MotionAspectRatio,
  MotionBackgroundType,
  MotionIntensity,
  MotionType,
  Resolution,
  StyleDirection,
};
