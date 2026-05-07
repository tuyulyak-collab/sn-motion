"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CountdownIntroProps,
  FPS,
  aspectRatioToDimensions,
  totalDurationInFrames,
} from "@/remotion/schemas/countdownSchema";
import { YouTubeCountdownIntro } from "@/remotion/templates/YouTubeCountdownIntro";
import type { PlayerRef } from "@remotion/player";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false },
);

type Props = {
  props: CountdownIntroProps;
};

export const PreviewPanel: React.FC<Props> = ({ props }) => {
  const dim = useMemo(() => aspectRatioToDimensions(props.aspectRatio), [props.aspectRatio]);
  const totalFrames = useMemo(
    () => totalDurationInFrames(props.countdownSeconds),
    [props.countdownSeconds],
  );
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const ref = playerRef.current;
    if (!ref) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    ref.addEventListener("play", onPlay);
    ref.addEventListener("pause", onPause);
    return () => {
      ref.removeEventListener("play", onPlay);
      ref.removeEventListener("pause", onPause);
    };
  }, []);

  const handlePlayPause = () => {
    const ref = playerRef.current;
    if (!ref) return;
    if (ref.isPlaying()) {
      ref.pause();
    } else {
      ref.play();
    }
  };

  const handleRestart = () => {
    const ref = playerRef.current;
    if (!ref) return;
    ref.seekTo(0);
    ref.play();
  };

  const totalSeconds = props.countdownSeconds + 2;

  return (
    <section className="glass-card p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink">Preview</h2>
          <p className="text-sm text-mute">
            Live preview updates instantly when you change settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="sn-pill sn-pill-active">{props.aspectRatio}</span>
          <span
            className="sn-pill"
            style={{
              background: "rgba(185,167,255,0.25)",
              color: "#4a3aa1",
            }}
          >
            {totalSeconds}s
          </span>
        </div>
      </div>

      <div
        className="rounded-3xl overflow-hidden mx-auto"
        style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.7)",
          maxWidth: "100%",
        }}
      >
        <Player
          ref={playerRef}
          component={
            YouTubeCountdownIntro as unknown as React.ComponentType<
              Record<string, unknown>
            >
          }
          inputProps={props as unknown as Record<string, unknown>}
          durationInFrames={totalFrames}
          fps={FPS}
          compositionWidth={dim.width}
          compositionHeight={dim.height}
          style={{
            width: "100%",
            aspectRatio: `${dim.width} / ${dim.height}`,
          }}
          loop
          controls={false}
          acknowledgeRemotionLicense
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="sn-button-primary"
          >
            {isPlaying ? "Pause" : "Play preview"}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="sn-button-secondary"
          >
            Restart
          </button>
        </div>
        <div className="text-xs text-mute flex items-center gap-3">
          <span>
            Video size · <span className="text-ink/80 font-semibold">{props.aspectRatio}</span>
          </span>
          <span>
            Length ·{" "}
            <span className="text-ink/80 font-semibold">{totalSeconds}s</span>
          </span>
        </div>
      </div>
    </section>
  );
};
