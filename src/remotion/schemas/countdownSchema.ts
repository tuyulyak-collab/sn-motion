import { z } from "zod";

export const aspectRatioSchema = z.enum(["16:9", "9:16", "1:1"]);
export type AspectRatio = z.infer<typeof aspectRatioSchema>;

export const themeStyleSchema = z.enum([
  "soft-pastel-glass",
  "modern-gradient",
  "neon-dark",
  "clean-minimal",
  "bold-creator-style",
]);
export type ThemeStyle = z.infer<typeof themeStyleSchema>;

export const backgroundTypeSchema = z.enum([
  "animated-gradient",
  "abstract-shapes",
  "uploaded-image",
  "solid-color",
]);
export type BackgroundType = z.infer<typeof backgroundTypeSchema>;

export const countdownStyleSchema = z.enum([
  "big-center-number",
  "circular-timer",
  "split-layout",
  "minimal-corner-timer",
]);
export type CountdownStyle = z.infer<typeof countdownStyleSchema>;

export const musicSchema = z.enum(["off", "built-in-sample", "uploaded-audio"]);
export type Music = z.infer<typeof musicSchema>;

export const countdownSecondsSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(30),
]);
export type CountdownSeconds = z.infer<typeof countdownSecondsSchema>;

export const countdownIntroSchema = z.object({
  channelName: z.string().default("Siska Channel"),
  mainTitle: z.string().default("New Video Starts Soon"),
  subtitle: z.string().default("Don't forget to subscribe"),
  countdownSeconds: countdownSecondsSchema.default(10),
  aspectRatio: aspectRatioSchema.default("16:9"),
  themeStyle: themeStyleSchema.default("soft-pastel-glass"),
  primaryColor: z.string().default("#F6A7C1"),
  secondaryColor: z.string().default("#B9A7FF"),
  backgroundType: backgroundTypeSchema.default("animated-gradient"),
  countdownStyle: countdownStyleSchema.default("big-center-number"),
  music: musicSchema.default("off"),
  tickSound: z.boolean().default(true),
  finalText: z.string().default("Let's Start"),
});

export type CountdownIntroProps = z.infer<typeof countdownIntroSchema>;

export const countdownIntroDefaults: CountdownIntroProps = {
  channelName: "Siska Channel",
  mainTitle: "New Video Starts Soon",
  subtitle: "Don't forget to subscribe",
  countdownSeconds: 10,
  aspectRatio: "16:9",
  themeStyle: "soft-pastel-glass",
  primaryColor: "#F6A7C1",
  secondaryColor: "#B9A7FF",
  backgroundType: "animated-gradient",
  countdownStyle: "big-center-number",
  music: "off",
  tickSound: true,
  finalText: "Let's Start",
};

export const settingsFileSchema = countdownIntroSchema.extend({
  template: z.literal("youtube-countdown-intro").default("youtube-countdown-intro"),
});

export type SettingsFile = z.infer<typeof settingsFileSchema>;

export const aspectRatioToDimensions = (ar: AspectRatio): { width: number; height: number } => {
  switch (ar) {
    case "16:9":
      return { width: 1920, height: 1080 };
    case "9:16":
      return { width: 1080, height: 1920 };
    case "1:1":
      return { width: 1080, height: 1080 };
  }
};

export const FPS = 30;
export const ENDING_HOLD_SECONDS = 2;

export const totalDurationInFrames = (countdownSeconds: number): number =>
  (countdownSeconds + ENDING_HOLD_SECONDS) * FPS;

export const compositionIdForAspectRatio = (ar: AspectRatio): string => {
  switch (ar) {
    case "16:9":
      return "youtube-countdown-intro-16x9";
    case "9:16":
      return "youtube-countdown-intro-9x16";
    case "1:1":
      return "youtube-countdown-intro-1x1";
  }
};
