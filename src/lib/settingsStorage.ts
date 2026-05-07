import {
  CountdownIntroProps,
  countdownIntroDefaults,
  countdownIntroSchema,
  settingsFileSchema,
} from "@/remotion/schemas/countdownSchema";

export const downloadSettingsJson = (props: CountdownIntroProps): void => {
  const payload = settingsFileSchema.parse({
    ...props,
    template: "youtube-countdown-intro" as const,
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sn_motion_settings.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export type ParsedSettingsResult =
  | { ok: true; props: CountdownIntroProps }
  | { ok: false; error: string };

export const parseSettingsJson = (raw: string): ParsedSettingsResult => {
  try {
    const data = JSON.parse(raw);
    const merged = { ...countdownIntroDefaults, ...data };
    delete (merged as { template?: unknown }).template;
    const parsed = countdownIntroSchema.parse(merged);
    return { ok: true, props: parsed };
  } catch (err) {
    if (err instanceof Error) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "Could not read settings file." };
  }
};

export const defaultSettings = (): CountdownIntroProps => ({
  ...countdownIntroDefaults,
});
