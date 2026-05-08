// SN Motion — Global Microstock Safety Guardrails (v0)
//
// This module is intentionally global. It is NOT a "stock preset" or a
// "stock mode" — every motion produced by SN Motion is meant for microstock
// submission, so these checks apply across all motion types and all output.
//
// What lives here:
//   - Pure types + a small expandable risky-terms list
//   - A pure text scanner (no React, no IO) used by the safety panel + hints
//   - Risk-level + combined-status helpers (scanner + checklist)
//
// IMPORTANT: this is guidance only and is NOT a legal guarantee. The scanner
// will produce warnings, but it deliberately does NOT hard-block any user
// action in v0. Final responsibility for compliant content stays with the
// human submitter.
//
// Out of scope here:
//   - Visual logo / image / audio / video file scanning
//   - Automated metadata validation against a specific stock platform
//   - Adobe Stock / Shutterstock / Pond5 submission integration

import type { MotionSettings } from "./motionSettings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskLevel = "safe" | "needs-review" | "risky";

export type RiskCategory =
  | "brand"
  | "logo"
  | "public-figure"
  | "fictional-character"
  | "copyrighted-media"
  | "misleading-claim";

export const RISK_CATEGORY_LABEL: Record<RiskCategory, string> = {
  brand: "Brand / trademark",
  logo: "Logo / trademark mark",
  "public-figure": "Public figure",
  "fictional-character": "Fictional character or franchise",
  "copyrighted-media": "Copyrighted film / show / game / book",
  "misleading-claim": "Misleading claim",
};

export const RISK_CATEGORY_DEFAULT_EXPLANATION: Record<RiskCategory, string> = {
  brand:
    "Looks like a brand or trademarked product name. Microstock platforms usually reject motions that reference real brands.",
  logo:
    "Looks like a reference to a real logo. Stock platforms reject motions that depict or describe real-world logos.",
  "public-figure":
    "Looks like a real public figure. Most stock platforms reject motions tied to identifiable real people without releases.",
  "fictional-character":
    "Looks like a copyrighted fictional character or franchise. Stock platforms reject motions that reference these.",
  "copyrighted-media":
    "Looks like a copyrighted film / show / game / book reference. Stock platforms reject motions tied to these.",
  "misleading-claim":
    "Sounds like an unverifiable certified / official / guaranteed claim. Stock platforms often reject these as misleading.",
};

export const RISK_CATEGORY_GENERIC_DIRECTION: Record<RiskCategory, string> = {
  brand: "Use a generic descriptor (e.g. \"sneakers\", \"smartphone\", \"coffee shop\") instead of the brand name.",
  logo: "Describe the visual idea generically — avoid naming or showing real logos.",
  "public-figure": "Use a generic role (e.g. \"a creator\", \"an athlete\") instead of naming a real person.",
  "fictional-character": "Use a generic descriptor (e.g. \"a wizard\", \"a superhero\") instead of the character or franchise name.",
  "copyrighted-media": "Use a generic theme (e.g. \"sci-fi\", \"crime drama\") instead of the title.",
  "misleading-claim": "Soften the wording (e.g. \"may help\" instead of \"guaranteed\").",
};

export type ScanMatch = {
  term: string;
  category: RiskCategory;
  explanation: string;
  saferDirection: string;
};

export type FieldId =
  | "motionConcept"
  | "channelName"
  | "titleText"
  | "subtitleText"
  | "finalText";

export type FieldScan = {
  field: FieldId;
  fieldLabel: string;
  text: string;
  risk: RiskLevel;
  matches: ScanMatch[];
};

export type ScanReport = {
  fields: FieldScan[];
  overallRisk: RiskLevel;
  totalMatches: number;
};

export type StockSafetyChecklistKey =
  | "fontLicenseConfirmed"
  | "iconLicenseConfirmed"
  | "audioLicenseConfirmed"
  | "assetLicenseConfirmed"
  | "aiDisclosureAcknowledged";

export type StockSafetyChecklist = Pick<MotionSettings, StockSafetyChecklistKey>;

export type StockSafetyStatus = {
  scannerRisk: RiskLevel;
  checklistComplete: boolean;
  status: RiskLevel;
};

// ---------------------------------------------------------------------------
// Risky terms (expandable). Each entry is `[term, category]` where `term` is
// already lowercased. Categories drive the default explanation + suggestion.
//
// Coverage is deliberately partial — we err on the side of false positives
// being acceptable (this is warning-only) rather than aggressively expanding
// the list. Add more entries as needed.
// ---------------------------------------------------------------------------

type RiskyTermEntry = readonly [term: string, category: RiskCategory];

const BRANDS: ReadonlyArray<RiskyTermEntry> = [
  ["nike", "brand"],
  ["adidas", "brand"],
  ["puma", "brand"],
  ["gucci", "brand"],
  ["louis vuitton", "brand"],
  ["chanel", "brand"],
  ["rolex", "brand"],
  ["apple", "brand"],
  ["iphone", "brand"],
  ["ipad", "brand"],
  ["macbook", "brand"],
  ["airpods", "brand"],
  ["google", "brand"],
  ["gmail", "brand"],
  ["android", "brand"],
  ["microsoft", "brand"],
  ["windows", "brand"],
  ["xbox", "brand"],
  ["amazon", "brand"],
  ["alexa", "brand"],
  ["kindle", "brand"],
  ["meta", "brand"],
  ["facebook", "brand"],
  ["instagram", "brand"],
  ["whatsapp", "brand"],
  ["tiktok", "brand"],
  ["youtube", "brand"],
  ["twitter", "brand"],
  ["linkedin", "brand"],
  ["snapchat", "brand"],
  ["pinterest", "brand"],
  ["netflix", "brand"],
  ["spotify", "brand"],
  ["hulu", "brand"],
  ["disney plus", "brand"],
  ["disney+", "brand"],
  ["disney", "brand"],
  ["pixar", "brand"],
  ["warner bros", "brand"],
  ["lego", "brand"],
  ["pepsi", "brand"],
  ["coca-cola", "brand"],
  ["coca cola", "brand"],
  ["sprite", "brand"],
  ["mcdonald's", "brand"],
  ["mcdonalds", "brand"],
  ["burger king", "brand"],
  ["kfc", "brand"],
  ["starbucks", "brand"],
  ["subway", "brand"],
  ["bmw", "brand"],
  ["mercedes", "brand"],
  ["audi", "brand"],
  ["ferrari", "brand"],
  ["porsche", "brand"],
  ["toyota", "brand"],
  ["tesla", "brand"],
  ["samsung", "brand"],
  ["sony", "brand"],
  ["huawei", "brand"],
  ["xiaomi", "brand"],
];

const LOGOS: ReadonlyArray<RiskyTermEntry> = [
  ["official logo", "logo"],
  ["brand logo", "logo"],
  ["company logo", "logo"],
  ["trademarked logo", "logo"],
  ["registered trademark", "logo"],
];

const PUBLIC_FIGURES: ReadonlyArray<RiskyTermEntry> = [
  ["donald trump", "public-figure"],
  ["joe biden", "public-figure"],
  ["barack obama", "public-figure"],
  ["elon musk", "public-figure"],
  ["mark zuckerberg", "public-figure"],
  ["jeff bezos", "public-figure"],
  ["bill gates", "public-figure"],
  ["taylor swift", "public-figure"],
  ["beyonce", "public-figure"],
  ["rihanna", "public-figure"],
  ["drake", "public-figure"],
  ["kanye west", "public-figure"],
  ["jay-z", "public-figure"],
  ["kim kardashian", "public-figure"],
  ["cristiano ronaldo", "public-figure"],
  ["lionel messi", "public-figure"],
  ["lebron james", "public-figure"],
  ["michael jordan", "public-figure"],
  ["mrbeast", "public-figure"],
  ["pewdiepie", "public-figure"],
];

const FICTIONAL_CHARACTERS: ReadonlyArray<RiskyTermEntry> = [
  ["harry potter", "fictional-character"],
  ["hogwarts", "fictional-character"],
  ["marvel", "fictional-character"],
  ["avengers", "fictional-character"],
  ["iron man", "fictional-character"],
  ["spider-man", "fictional-character"],
  ["spiderman", "fictional-character"],
  ["thor", "fictional-character"],
  ["hulk", "fictional-character"],
  ["captain america", "fictional-character"],
  ["batman", "fictional-character"],
  ["superman", "fictional-character"],
  ["wonder woman", "fictional-character"],
  ["mickey mouse", "fictional-character"],
  ["donald duck", "fictional-character"],
  ["star wars", "fictional-character"],
  ["jedi", "fictional-character"],
  ["yoda", "fictional-character"],
  ["star trek", "fictional-character"],
  ["pokemon", "fictional-character"],
  ["pokémon", "fictional-character"],
  ["pikachu", "fictional-character"],
  ["super mario", "fictional-character"],
  ["luigi", "fictional-character"],
  ["zelda", "fictional-character"],
  ["sonic the hedgehog", "fictional-character"],
  ["naruto", "fictional-character"],
  ["dragon ball", "fictional-character"],
  ["one piece", "fictional-character"],
  ["attack on titan", "fictional-character"],
  ["demon slayer", "fictional-character"],
];

const COPYRIGHTED_MEDIA: ReadonlyArray<RiskyTermEntry> = [
  ["the matrix", "copyrighted-media"],
  ["breaking bad", "copyrighted-media"],
  ["stranger things", "copyrighted-media"],
  ["game of thrones", "copyrighted-media"],
  ["the witcher", "copyrighted-media"],
  ["lord of the rings", "copyrighted-media"],
  ["fortnite", "copyrighted-media"],
  ["minecraft", "copyrighted-media"],
  ["roblox", "copyrighted-media"],
  ["call of duty", "copyrighted-media"],
  ["grand theft auto", "copyrighted-media"],
];

const MISLEADING_CLAIMS: ReadonlyArray<RiskyTermEntry> = [
  ["fda approved", "misleading-claim"],
  ["government approved", "misleading-claim"],
  ["officially certified", "misleading-claim"],
  ["doctor recommended", "misleading-claim"],
  ["dentist approved", "misleading-claim"],
  ["clinically proven", "misleading-claim"],
  ["scientifically proven", "misleading-claim"],
  ["miracle cure", "misleading-claim"],
  ["guaranteed cure", "misleading-claim"],
  ["100% effective", "misleading-claim"],
  ["100% guaranteed", "misleading-claim"],
  ["proven results", "misleading-claim"],
  ["fastest in the world", "misleading-claim"],
];

export const RISKY_TERMS: ReadonlyArray<RiskyTermEntry> = [
  ...BRANDS,
  ...LOGOS,
  ...PUBLIC_FIGURES,
  ...FICTIONAL_CHARACTERS,
  ...COPYRIGHTED_MEDIA,
  ...MISLEADING_CLAIMS,
];

// ---------------------------------------------------------------------------
// Field metadata
// ---------------------------------------------------------------------------

export const SCANNED_FIELDS: ReadonlyArray<{
  id: FieldId;
  label: string;
}> = [
  { id: "motionConcept", label: "Motion concept" },
  { id: "channelName", label: "Channel name" },
  { id: "titleText", label: "Title" },
  { id: "subtitleText", label: "Subtitle" },
  { id: "finalText", label: "Final text" },
];

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsTerm = (haystack: string, needle: string): boolean => {
  if (needle.length === 0) return false;
  // For multi-token / hyphenated / dotted terms, plain substring is fine since
  // those terms already have their own delimiters. For single alphabetic
  // tokens we require word boundaries to avoid catching unrelated substrings
  // (e.g. `meta` matching `metaphor`).
  if (/[\s.\-+/']/.test(needle)) {
    return haystack.includes(needle);
  }
  const re = new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i");
  return re.test(haystack);
};

export const scanText = (text: string): ScanMatch[] => {
  if (typeof text !== "string" || text.trim().length === 0) return [];
  const lower = text.toLowerCase();
  const matches: ScanMatch[] = [];
  const seen = new Set<string>();
  for (const [term, category] of RISKY_TERMS) {
    if (seen.has(term)) continue;
    if (containsTerm(lower, term)) {
      seen.add(term);
      matches.push({
        term,
        category,
        explanation: RISK_CATEGORY_DEFAULT_EXPLANATION[category],
        saferDirection: RISK_CATEGORY_GENERIC_DIRECTION[category],
      });
    }
  }
  return matches;
};

const HIGH_SEVERITY: ReadonlySet<RiskCategory> = new Set<RiskCategory>([
  "brand",
  "logo",
  "public-figure",
  "fictional-character",
  "copyrighted-media",
]);

export const fieldRiskFromMatches = (matches: ScanMatch[]): RiskLevel => {
  if (matches.length === 0) return "safe";
  if (matches.some((m) => HIGH_SEVERITY.has(m.category))) return "risky";
  return "needs-review";
};

export const scanField = (field: FieldId, fieldLabel: string, text: string): FieldScan => {
  const matches = scanText(text);
  return { field, fieldLabel, text, risk: fieldRiskFromMatches(matches), matches };
};

export const scanMotionSettings = (settings: MotionSettings): ScanReport => {
  const fields: FieldScan[] = SCANNED_FIELDS.map(({ id, label }) =>
    scanField(id, label, settings[id] ?? ""),
  );
  const overallRisk = fields.reduce<RiskLevel>((acc, f) => maxRisk(acc, f.risk), "safe");
  const totalMatches = fields.reduce((sum, f) => sum + f.matches.length, 0);
  return { fields, overallRisk, totalMatches };
};

// ---------------------------------------------------------------------------
// Combined status (scanner + checklist)
// ---------------------------------------------------------------------------

const RISK_RANK: Record<RiskLevel, number> = {
  safe: 0,
  "needs-review": 1,
  risky: 2,
};

export const maxRisk = (a: RiskLevel, b: RiskLevel): RiskLevel =>
  RISK_RANK[a] >= RISK_RANK[b] ? a : b;

export const STOCK_SAFETY_CHECKLIST_ITEMS: ReadonlyArray<{
  key: StockSafetyChecklistKey;
  label: string;
  helper: string;
}> = [
  {
    key: "fontLicenseConfirmed",
    label: "Font license confirmed",
    helper: "Every font used has a commercial / stock-redistribution license.",
  },
  {
    key: "iconLicenseConfirmed",
    label: "Icon license confirmed",
    helper: "Every icon used has a commercial / stock-redistribution license.",
  },
  {
    key: "audioLicenseConfirmed",
    label: "Audio license confirmed",
    helper: "Music and SFX are royalty-free or properly licensed for resale.",
  },
  {
    key: "assetLicenseConfirmed",
    label: "Asset license confirmed",
    helper: "Images, footage, 3D, and any imported assets are licensed for stock.",
  },
  {
    key: "aiDisclosureAcknowledged",
    label: "AI-generated status acknowledged",
    helper: "I will mark AI-generated work correctly when submitting to stock platforms.",
  },
];

export const stockSafetyChecklistFromSettings = (
  settings: MotionSettings,
): StockSafetyChecklist => ({
  fontLicenseConfirmed: !!settings.fontLicenseConfirmed,
  iconLicenseConfirmed: !!settings.iconLicenseConfirmed,
  audioLicenseConfirmed: !!settings.audioLicenseConfirmed,
  assetLicenseConfirmed: !!settings.assetLicenseConfirmed,
  aiDisclosureAcknowledged: !!settings.aiDisclosureAcknowledged,
});

export const isChecklistComplete = (checklist: StockSafetyChecklist): boolean =>
  STOCK_SAFETY_CHECKLIST_ITEMS.every((item) => checklist[item.key] === true);

export const computeStockSafetyStatus = (
  scanReport: ScanReport,
  checklist: StockSafetyChecklist,
): StockSafetyStatus => {
  const checklistComplete = isChecklistComplete(checklist);
  let status: RiskLevel = scanReport.overallRisk;
  if (status === "safe" && !checklistComplete) {
    status = "needs-review";
  }
  return {
    scannerRisk: scanReport.overallRisk,
    checklistComplete,
    status,
  };
};

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  safe: "Safe",
  "needs-review": "Needs review",
  risky: "Risky",
};

export const STOCK_SAFETY_DEFAULTS: StockSafetyChecklist = {
  fontLicenseConfirmed: false,
  iconLicenseConfirmed: false,
  audioLicenseConfirmed: false,
  assetLicenseConfirmed: false,
  aiDisclosureAcknowledged: false,
};
