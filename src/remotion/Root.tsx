import React from "react";
import { Composition } from "remotion";
import { YouTubeCountdownIntro } from "./templates/YouTubeCountdownIntro";
import {
  countdownIntroDefaults,
  countdownIntroSchema,
  totalDurationInFrames,
  FPS,
  aspectRatioToDimensions,
} from "./schemas/countdownSchema";

export const RemotionRoot: React.FC = () => {
  const dur = totalDurationInFrames(countdownIntroDefaults.countdownSeconds);

  const dim16x9 = aspectRatioToDimensions("16:9");
  const dim9x16 = aspectRatioToDimensions("9:16");
  const dim1x1 = aspectRatioToDimensions("1:1");

  return (
    <>
      <Composition
        id="youtube-countdown-intro-16x9"
        component={YouTubeCountdownIntro}
        durationInFrames={dur}
        fps={FPS}
        width={dim16x9.width}
        height={dim16x9.height}
        defaultProps={{ ...countdownIntroDefaults, aspectRatio: "16:9" as const }}
        schema={countdownIntroSchema}
        calculateMetadata={({ props }) => {
          const dim = aspectRatioToDimensions("16:9");
          return {
            durationInFrames: totalDurationInFrames(props.countdownSeconds),
            width: dim.width,
            height: dim.height,
            props: { ...props, aspectRatio: "16:9" as const },
          };
        }}
      />
      <Composition
        id="youtube-countdown-intro-9x16"
        component={YouTubeCountdownIntro}
        durationInFrames={dur}
        fps={FPS}
        width={dim9x16.width}
        height={dim9x16.height}
        defaultProps={{ ...countdownIntroDefaults, aspectRatio: "9:16" as const }}
        schema={countdownIntroSchema}
        calculateMetadata={({ props }) => {
          const dim = aspectRatioToDimensions("9:16");
          return {
            durationInFrames: totalDurationInFrames(props.countdownSeconds),
            width: dim.width,
            height: dim.height,
            props: { ...props, aspectRatio: "9:16" as const },
          };
        }}
      />
      <Composition
        id="youtube-countdown-intro-1x1"
        component={YouTubeCountdownIntro}
        durationInFrames={dur}
        fps={FPS}
        width={dim1x1.width}
        height={dim1x1.height}
        defaultProps={{ ...countdownIntroDefaults, aspectRatio: "1:1" as const }}
        schema={countdownIntroSchema}
        calculateMetadata={({ props }) => {
          const dim = aspectRatioToDimensions("1:1");
          return {
            durationInFrames: totalDurationInFrames(props.countdownSeconds),
            width: dim.width,
            height: dim.height,
            props: { ...props, aspectRatio: "1:1" as const },
          };
        }}
      />
    </>
  );
};
