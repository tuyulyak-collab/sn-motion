"use client";

import React, { useState } from "react";
import { parsePrompt } from "@/lib/promptParser";
import { CountdownIntroProps } from "@/remotion/schemas/countdownSchema";

type Props = {
  current: CountdownIntroProps;
  onApply: (next: CountdownIntroProps) => void;
};

export const PromptBox: React.FC<Props> = ({ current, onApply }) => {
  const [text, setText] = useState("");
  const [lastApplied, setLastApplied] = useState<string[]>([]);

  const apply = () => {
    if (!text.trim()) return;
    const parsed = parsePrompt(text);
    if (Object.keys(parsed).length === 0) {
      setLastApplied(["No matching fields found — try mentioning seconds, theme, or text."]);
      return;
    }
    onApply({ ...current, ...parsed });
    const labels = Object.keys(parsed).map((k) => labelFor(k));
    setLastApplied(labels);
  };

  return (
    <section className="glass-card p-6">
      <div className="mb-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-ink">Describe your intro</h2>
          <span className="sn-pill sn-pill-rendering">Prompt mode</span>
        </div>
        <p className="text-sm text-mute">
          Type a description in plain English. We&apos;ll fill in the matching settings.
        </p>
      </div>
      <textarea
        className="sn-input min-h-[88px] resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "I want a soft pastel YouTube countdown intro for 10 seconds with the channel Siska Channel and Subscribe."'
      />
      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={apply}
          className="sn-button-primary"
          disabled={!text.trim()}
        >
          Apply description
        </button>
        {lastApplied.length > 0 && (
          <div className="text-xs text-mute flex flex-wrap gap-1.5">
            <span className="text-ink/70 font-semibold">Updated:</span>
            {lastApplied.map((l, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-ink/80"
                style={{ background: "rgba(191, 234, 216, 0.65)" }}
              >
                {l}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const labelFor = (key: string): string => {
  switch (key) {
    case "channelName":
      return "Channel name";
    case "mainTitle":
      return "Main title";
    case "subtitle":
      return "Subtitle";
    case "countdownSeconds":
      return "Countdown length";
    case "aspectRatio":
      return "Video size";
    case "themeStyle":
      return "Theme";
    case "primaryColor":
      return "Primary color";
    case "secondaryColor":
      return "Secondary color";
    case "backgroundType":
      return "Background";
    case "countdownStyle":
      return "Countdown style";
    case "music":
      return "Music";
    case "tickSound":
      return "Tick sound";
    case "finalText":
      return "Final text";
    default:
      return key;
  }
};
