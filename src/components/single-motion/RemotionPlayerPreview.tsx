"use client";

import React, { forwardRef, useMemo } from "react";
import { Player } from "@remotion/player";
import { DynamicMotionComposition } from "@/remotion/dynamic/DynamicMotionComposition";
import {
  dynamicMotionDimensions,
  dynamicMotionDurationInFrames,
  motionSettingsToDynamicProps,
  safeFrameRate,
} from "@/remotion/dynamic/dynamicMotionConfig";
import {
  MotionSettings,
  frameRateLabel,
  motionTypeLabel,
  resolutionLabel,
} from "@/lib/motionSettings";

type Props = {
  settings: MotionSettings;
};

const containerMaxWidth = (aspectRatio: MotionSettings["aspectRatio"]): number => {
  switch (aspectRatio) {
    case "9:16":
      return 360;
    case "1:1":
      return 520;
    case "16:9":
    default:
      return 720;
  }
};

export const RemotionPlayerPreview = forwardRef<HTMLDivElement, Props>(
  function RemotionPlayerPreview({ settings }, ref) {
    const playerProps = useMemo(
      () => motionSettingsToDynamicProps(settings),
      [settings],
    );

    const fps = useMemo(
      () => safeFrameRate(playerProps.frameRate),
      [playerProps.frameRate],
    );

    const dim = useMemo(
      () =>
        dynamicMotionDimensions(playerProps.aspectRatio, playerProps.resolution),
      [playerProps.aspectRatio, playerProps.resolution],
    );

    const durationInFrames = useMemo(
      () => dynamicMotionDurationInFrames(playerProps.durationSeconds, fps),
      [playerProps.durationSeconds, fps],
    );

    const maxWidth = containerMaxWidth(playerProps.aspectRatio);

    // Force a remount when composition geometry changes so the Player picks
    // up the new dimensions / fps / durationInFrames cleanly.
    const playerKey = `${dim.width}x${dim.height}-${fps}-${durationInFrames}`;

    return (
      <section
        ref={ref}
        className="glass-card p-6 md:p-7 flex flex-col gap-4"
        aria-label="Live Remotion preview"
        data-testid="remotion-player-section"
      >
        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Live preview</h2>
            <p className="text-xs text-soft">
              Real Remotion playback driven by your settings. Press play or scrub
              the timeline.
            </p>
          </div>
          <span
            className="sn-pill sn-pill-rendering self-start sm:self-auto"
            data-testid="remotion-player-chip"
          >
            {motionTypeLabel(playerProps.motionType)} · {playerProps.aspectRatio}
            {" · "}
            {resolutionLabel(playerProps.resolution)} ·{" "}
            {frameRateLabel(playerProps.frameRate)}
          </span>
        </header>

        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(0,0,0,0.04)", padding: 16 }}
        >
          <div
            className="mx-auto"
            data-testid="remotion-player-frame"
            data-aspect={playerProps.aspectRatio}
            data-width={dim.width}
            data-height={dim.height}
            data-fps={fps}
            data-duration-in-frames={durationInFrames}
            style={{ width: "100%", maxWidth }}
          >
            <Player
              key={playerKey}
              component={DynamicMotionComposition}
              inputProps={playerProps}
              compositionWidth={dim.width}
              compositionHeight={dim.height}
              fps={fps}
              durationInFrames={durationInFrames}
              controls
              loop
              autoPlay={false}
              style={{
                width: "100%",
                aspectRatio: `${dim.width} / ${dim.height}`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            />
          </div>
        </div>
      </section>
    );
  },
);
