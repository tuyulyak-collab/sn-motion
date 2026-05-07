import {
  CountdownIntroProps,
  CountdownSeconds,
  ThemeStyle,
  CountdownStyle,
  BackgroundType,
  AspectRatio,
} from "@/remotion/schemas/countdownSchema";

export type ParsedFields = Partial<CountdownIntroProps>;

const themeKeywords: Array<{ k: RegExp; v: ThemeStyle }> = [
  { k: /soft\s*pastel|pastel\s*glass|glassmorphism|pastel/i, v: "soft-pastel-glass" },
  { k: /modern\s*gradient|gradient/i, v: "modern-gradient" },
  { k: /neon|cyber|dark\s*neon/i, v: "neon-dark" },
  { k: /minimal|clean/i, v: "clean-minimal" },
  { k: /bold|creator|youtuber/i, v: "bold-creator-style" },
];

const countdownStyleKeywords: Array<{ k: RegExp; v: CountdownStyle }> = [
  { k: /circular|ring|circle\s*timer/i, v: "circular-timer" },
  { k: /split|side\s*by\s*side/i, v: "split-layout" },
  { k: /corner|minimal\s*timer|small\s*timer/i, v: "minimal-corner-timer" },
  { k: /big|center\s*number|large\s*number/i, v: "big-center-number" },
];

const backgroundKeywords: Array<{ k: RegExp; v: BackgroundType }> = [
  { k: /solid\s*color|plain\s*background|flat/i, v: "solid-color" },
  { k: /shapes|abstract|blobs|particles/i, v: "abstract-shapes" },
  { k: /image|photo|picture/i, v: "uploaded-image" },
  { k: /gradient|animated\s*background/i, v: "animated-gradient" },
];

const aspectKeywords: Array<{ k: RegExp; v: AspectRatio }> = [
  { k: /\b9:16\b|shorts|tiktok|reels|vertical|portrait/i, v: "9:16" },
  { k: /\b1:1\b|square|instagram\s*square/i, v: "1:1" },
  { k: /\b16:9\b|youtube|landscape|widescreen|horizontal/i, v: "16:9" },
];

const finalTextKeywords: Array<{ k: RegExp; v: string }> = [
  { k: /\bsubscribe\b/i, v: "Subscribe" },
  { k: /\bwelcome\b/i, v: "Welcome" },
  { k: /let'?s?\s*start|let\s*us\s*start|start/i, v: "Let's Start" },
];

const colorWords: Record<string, string> = {
  pink: "#F6A7C1",
  peach: "#F7C8A6",
  yellow: "#F7E68C",
  lavender: "#B9A7FF",
  purple: "#9B7CF6",
  mint: "#BFEAD8",
  teal: "#A8E6E2",
  blue: "#A8C8F7",
  red: "#F08585",
  orange: "#F7B26A",
  green: "#9BD8A0",
  white: "#FFFFFF",
  black: "#1A1726",
};

const matchFirst = <T,>(text: string, table: Array<{ k: RegExp; v: T }>): T | undefined => {
  for (const row of table) {
    if (row.k.test(text)) return row.v;
  }
  return undefined;
};

const extractCountdownSeconds = (text: string): CountdownSeconds | undefined => {
  const m = text.match(/(\d{1,3})\s*(?:s|sec|secs|second|seconds)\b/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n <= 7) return 5;
    if (n <= 12) return 10;
    if (n <= 22) return 15;
    return 30;
  }
  return undefined;
};

const extractQuoted = (text: string): string[] => {
  const matches: string[] = [];
  const dq = text.match(/"([^"]+)"/g);
  if (dq) for (const m of dq) matches.push(m.slice(1, -1));
  const sq = text.match(/'([^']+)'/g);
  if (sq) for (const m of sq) matches.push(m.slice(1, -1));
  // Curly quotes
  const cq = text.match(/[“”]([^“”]+)[“”]/g);
  if (cq) for (const m of cq) matches.push(m.slice(1, -1));
  return matches;
};

const extractColors = (text: string): { primary?: string; secondary?: string } => {
  const found: string[] = [];
  // hex codes first
  const hexMatches = text.match(/#[0-9a-fA-F]{6}\b/g);
  if (hexMatches) {
    for (const h of hexMatches) found.push(h.toUpperCase());
  }
  // word colors
  for (const word in colorWords) {
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(text)) found.push(colorWords[word]);
  }
  const unique = Array.from(new Set(found));
  return { primary: unique[0], secondary: unique[1] };
};

const extractChannelName = (text: string): string | undefined => {
  const channelMatch = text.match(
    /(?:channel\s+(?:name|called)?|for\s+the\s+channel|on\s+(?:my|the)\s+channel)\s*[:\-]?\s*([A-Z][\w\s&'.-]{1,40})/i,
  );
  if (channelMatch) {
    return channelMatch[1].trim().replace(/[.,]+$/, "");
  }
  const textMatch = text.match(
    /(?:with\s+(?:the\s+)?text|saying|that\s+says|titled)\s+([A-Z][\w\s&'.-]{1,40})(?:\s+and|,|\.|$)/i,
  );
  if (textMatch) {
    return textMatch[1].trim().replace(/[.,]+$/, "");
  }
  return undefined;
};

/**
 * Rule-based prompt parser. Maps a free-form description into supported
 * countdown intro fields only — never produces arbitrary code/extra fields.
 */
export const parsePrompt = (rawPrompt: string): ParsedFields => {
  const text = rawPrompt.trim();
  if (!text) return {};
  const out: ParsedFields = {};

  const seconds = extractCountdownSeconds(text);
  if (seconds) out.countdownSeconds = seconds;

  const theme = matchFirst<ThemeStyle>(text, themeKeywords);
  if (theme) out.themeStyle = theme;

  const cstyle = matchFirst<CountdownStyle>(text, countdownStyleKeywords);
  if (cstyle) out.countdownStyle = cstyle;

  const bg = matchFirst<BackgroundType>(text, backgroundKeywords);
  if (bg) out.backgroundType = bg;

  const ar = matchFirst<AspectRatio>(text, aspectKeywords);
  if (ar) out.aspectRatio = ar;

  const finalText = matchFirst<string>(text, finalTextKeywords);
  if (finalText) out.finalText = finalText;

  const colors = extractColors(text);
  if (colors.primary) out.primaryColor = colors.primary;
  if (colors.secondary) out.secondaryColor = colors.secondary;

  const quoted = extractQuoted(text);
  if (quoted[0]) out.channelName = quoted[0];
  if (quoted[1]) out.mainTitle = quoted[1];
  if (quoted[2]) out.subtitle = quoted[2];

  if (!out.channelName) {
    const ch = extractChannelName(text);
    if (ch) out.channelName = ch;
  }

  if (/\btick\b|\btick\s*sound\b/i.test(text)) {
    out.tickSound = !/\bno\s*tick|without\s*tick|tick\s*off|ticking\s*off/i.test(text);
  }

  if (/\bmusic\s*off|no\s*music|without\s*music\b/i.test(text)) {
    out.music = "off";
  } else if (/\bbuilt[-\s]*in\s*music|sample\s*music|with\s*music\b/i.test(text)) {
    out.music = "built-in-sample";
  }

  return out;
};
