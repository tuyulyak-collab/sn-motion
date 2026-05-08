/**
 * Generates a default export filename in the format
 *   SN_motion_{motionType}_{random5}_{ddmmyyyy}.mp4
 *
 * Example: SN_motion_countdown_A7K2Q_08052026.mp4
 *
 * `motionType` is sanitised so unexpected values can never produce a path
 * outside the expected pattern. The random5 token gives every export a fresh
 * suffix so concurrent or repeated renders don't collide on disk.
 */
export const generateExportFilename = (
  motionType: string = "countdown",
  date: Date = new Date(),
): string => {
  const safeType = sanitizeMotionTypeForFilename(motionType);
  const random5 = generateRandom5();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `SN_motion_${safeType}_${random5}_${dd}${mm}${yyyy}.mp4`;
};

const sanitizeMotionTypeForFilename = (raw: string): string => {
  const trimmed = (raw ?? "").toString().trim().toLowerCase();
  if (!trimmed) return "motion";
  const safe = trimmed.replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
  const stripped = safe.replace(/^-+|-+$/g, "");
  return stripped.length > 0 ? stripped : "motion";
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandom5 = (): string => {
  let out = "";
  const len = ALPHABET.length;

  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const buf = new Uint8Array(5);
    globalThis.crypto.getRandomValues(buf);
    for (let i = 0; i < 5; i++) {
      out += ALPHABET[buf[i] % len];
    }
    return out;
  }

  for (let i = 0; i < 5; i++) {
    out += ALPHABET[Math.floor(Math.random() * len)];
  }
  return out;
};
