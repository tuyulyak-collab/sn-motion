/**
 * Generates a default export filename in the format
 *   SN_motion_countdown_{random5}_{ddmmyyyy}.mp4
 */
export const generateExportFilename = (date: Date = new Date()): string => {
  const random5 = generateRandom5();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `SN_motion_countdown_${random5}_${dd}${mm}${yyyy}.mp4`;
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
