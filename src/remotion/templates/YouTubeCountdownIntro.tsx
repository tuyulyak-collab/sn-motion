import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import {
  CountdownIntroProps,
  FPS,
} from "../schemas/countdownSchema";

type ThemePalette = {
  bgFrom: string;
  bgVia: string;
  bgTo: string;
  glass: string;
  border: string;
  textMain: string;
  textMuted: string;
  accent: string;
  shadow: string;
};

const themePalette = (
  themeStyle: CountdownIntroProps["themeStyle"],
  primary: string,
  secondary: string,
): ThemePalette => {
  switch (themeStyle) {
    case "soft-pastel-glass":
      return {
        bgFrom: "#FFFDF8",
        bgVia: "#F8F4EC",
        bgTo: "#F8F4EC",
        glass: "rgba(255, 255, 255, 0.68)",
        border: "rgba(255, 255, 255, 0.75)",
        textMain: "#2F2B3A",
        textMuted: "#8A8396",
        accent: primary,
        shadow: "0 30px 80px rgba(142, 113, 161, 0.22)",
      };
    case "modern-gradient":
      return {
        bgFrom: secondary,
        bgVia: primary,
        bgTo: "#F7E68C",
        glass: "rgba(255, 255, 255, 0.32)",
        border: "rgba(255, 255, 255, 0.55)",
        textMain: "#1f1b2a",
        textMuted: "rgba(31, 27, 42, 0.7)",
        accent: "#FFFFFF",
        shadow: "0 30px 90px rgba(40, 22, 80, 0.28)",
      };
    case "neon-dark":
      return {
        bgFrom: "#0d0a1f",
        bgVia: "#1a0f3a",
        bgTo: "#0d0a1f",
        glass: "rgba(255, 255, 255, 0.06)",
        border: "rgba(255, 255, 255, 0.18)",
        textMain: "#F8F4EC",
        textMuted: "rgba(248, 244, 236, 0.6)",
        accent: primary,
        shadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
      };
    case "clean-minimal":
      return {
        bgFrom: "#FFFFFF",
        bgVia: "#FAFAFA",
        bgTo: "#F2F2F2",
        glass: "rgba(255, 255, 255, 0.85)",
        border: "rgba(0, 0, 0, 0.06)",
        textMain: "#181820",
        textMuted: "#6b6878",
        accent: primary,
        shadow: "0 24px 60px rgba(0, 0, 0, 0.10)",
      };
    case "bold-creator-style":
      return {
        bgFrom: primary,
        bgVia: "#000000",
        bgTo: secondary,
        glass: "rgba(0, 0, 0, 0.35)",
        border: "rgba(255, 255, 255, 0.35)",
        textMain: "#FFFFFF",
        textMuted: "rgba(255, 255, 255, 0.78)",
        accent: "#FFFFFF",
        shadow: "0 30px 90px rgba(0, 0, 0, 0.45)",
      };
  }
};

const Background: React.FC<{
  props: CountdownIntroProps;
  palette: ThemePalette;
}> = ({ props, palette }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  if (props.backgroundType === "solid-color") {
    return <AbsoluteFill style={{ background: props.primaryColor }} />;
  }

  if (props.backgroundType === "abstract-shapes") {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${palette.bgFrom}, ${palette.bgVia} 60%, ${palette.bgTo})`,
        }}
      >
        <AbstractShapes
          primary={props.primaryColor}
          secondary={props.secondaryColor}
        />
      </AbsoluteFill>
    );
  }

  // animated-gradient (default)
  const angle = (t * 20) % 360;
  return (
    <AbsoluteFill
      style={{
        background:
          props.themeStyle === "neon-dark"
            ? `linear-gradient(${angle}deg, ${palette.bgFrom}, ${palette.bgVia}, ${palette.bgTo})`
            : `linear-gradient(${angle}deg, ${props.primaryColor}33, ${props.secondaryColor}44, ${palette.bgFrom})`,
      }}
    >
      <FloatingBlobs
        primary={props.primaryColor}
        secondary={props.secondaryColor}
        accent={palette.accent}
      />
    </AbsoluteFill>
  );
};

const FloatingBlobs: React.FC<{
  primary: string;
  secondary: string;
  accent: string;
}> = ({ primary, secondary, accent }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const blobs = [
    { color: primary, size: 720, x: 0.18, y: 0.18, speed: 0.6 },
    { color: secondary, size: 680, x: 0.82, y: 0.22, speed: 0.45 },
    { color: accent, size: 600, x: 0.5, y: 0.9, speed: 0.5 },
  ];

  return (
    <AbsoluteFill>
      {blobs.map((blob, i) => {
        const dx = Math.sin(t * blob.speed + i) * 80;
        const dy = Math.cos(t * blob.speed * 0.8 + i * 1.3) * 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${blob.x * 100}% - ${blob.size / 2}px + ${dx}px)`,
              top: `calc(${blob.y * 100}% - ${blob.size / 2}px + ${dy}px)`,
              width: blob.size,
              height: blob.size,
              borderRadius: "50%",
              background: blob.color,
              filter: "blur(120px)",
              opacity: 0.5,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const AbstractShapes: React.FC<{ primary: string; secondary: string }> = ({
  primary,
  secondary,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const shapes = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 1.7;
    const x = (Math.sin(seed * 1.3) * 0.4 + 0.5) * 100;
    const y = (Math.cos(seed * 0.9) * 0.4 + 0.5) * 100;
    const size = 80 + ((i * 37) % 120);
    const rot = t * (10 + (i % 5) * 3) + i * 30;
    const dy = Math.sin(t * 0.6 + i) * 18;
    return { x, y, size, rot, dy, color: i % 2 === 0 ? primary : secondary, kind: i % 3 };
  });

  return (
    <AbsoluteFill>
      {shapes.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `calc(${s.y}% + ${s.dy}px)`,
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: 0.32,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            borderRadius: s.kind === 0 ? "50%" : s.kind === 1 ? "28%" : "12%",
            filter: "blur(2px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const TextEntrance: React.FC<{
  delayFrames: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delayFrames, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(progress, [0, 1], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const BigCenterNumber: React.FC<{
  current: number;
  changeFrame: number;
  palette: ThemePalette;
}> = ({ current, changeFrame, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sinceChange = frame - changeFrame;
  const pulse = spring({
    frame: sinceChange,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 380,
          fontWeight: 800,
          lineHeight: 1,
          color: palette.textMain,
          transform: `scale(${scale})`,
          letterSpacing: "-0.02em",
          textShadow:
            palette.textMain === "#FFFFFF"
              ? "0 8px 30px rgba(0,0,0,0.35)"
              : "0 6px 24px rgba(155, 124, 246, 0.22)",
        }}
      >
        {current}
      </div>
    </div>
  );
};

const CircularTimer: React.FC<{
  current: number;
  changeFrame: number;
  countdownSeconds: number;
  elapsedSeconds: number;
  palette: ThemePalette;
}> = ({ current, changeFrame, countdownSeconds, elapsedSeconds, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sinceChange = frame - changeFrame;
  const pulse = spring({
    frame: sinceChange,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.12, 1]);

  const radius = 220;
  const stroke = 18;
  const c = 2 * Math.PI * radius;
  const remaining = Math.max(0, 1 - elapsedSeconds / countdownSeconds);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: radius * 2 + stroke,
          height: radius * 2 + stroke,
        }}
      >
        <svg
          width={radius * 2 + stroke}
          height={radius * 2 + stroke}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={radius}
            stroke={palette.border}
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={radius}
            stroke={palette.accent}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - remaining)}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${scale})`,
          }}
        >
          <div
            style={{
              fontSize: 220,
              fontWeight: 800,
              color: palette.textMain,
              lineHeight: 1,
            }}
          >
            {current}
          </div>
        </div>
      </div>
    </div>
  );
};

const SplitLayout: React.FC<{
  current: number;
  changeFrame: number;
  channelName: string;
  mainTitle: string;
  subtitle: string;
  palette: ThemePalette;
}> = ({ current, changeFrame, channelName, mainTitle, subtitle, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sinceChange = frame - changeFrame;
  const pulse = spring({
    frame: sinceChange,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.12, 1]);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "0 80px",
      }}
    >
      <div style={{ flex: 1, textAlign: "right" }}>
        <TextEntrance delayFrames={6}>
          <div
            style={{
              fontSize: 36,
              color: palette.textMuted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {channelName}
          </div>
        </TextEntrance>
        <TextEntrance delayFrames={14}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: palette.textMain,
              lineHeight: 1.05,
              marginBottom: 18,
            }}
          >
            {mainTitle}
          </div>
        </TextEntrance>
        <TextEntrance delayFrames={20}>
          <div style={{ fontSize: 32, color: palette.textMuted }}>{subtitle}</div>
        </TextEntrance>
      </div>
      <div
        style={{
          width: 4,
          height: 320,
          background: palette.accent,
          borderRadius: 4,
          opacity: 0.85,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 320,
            fontWeight: 800,
            color: palette.textMain,
            lineHeight: 1,
            transform: `scale(${scale})`,
          }}
        >
          {current}
        </div>
      </div>
    </div>
  );
};

const MinimalCornerTimer: React.FC<{
  current: number;
  changeFrame: number;
  channelName: string;
  mainTitle: string;
  subtitle: string;
  palette: ThemePalette;
}> = ({ current, changeFrame, channelName, mainTitle, subtitle, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sinceChange = frame - changeFrame;
  const pulse = spring({
    frame: sinceChange,
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.18, 1]);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        padding: 80,
      }}
    >
      <TextEntrance delayFrames={6}>
        <div
          style={{
            fontSize: 36,
            color: palette.textMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {channelName}
        </div>
      </TextEntrance>
      <TextEntrance delayFrames={14}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: palette.textMain,
            textAlign: "center",
            lineHeight: 1.05,
            marginBottom: 18,
          }}
        >
          {mainTitle}
        </div>
      </TextEntrance>
      <TextEntrance delayFrames={20}>
        <div
          style={{
            fontSize: 36,
            color: palette.textMuted,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      </TextEntrance>
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          background: palette.glass,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${palette.border}`,
          borderRadius: 28,
          padding: "20px 36px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: palette.shadow,
        }}
      >
        <div style={{ fontSize: 22, color: palette.textMuted }}>Starts in</div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: palette.textMain,
            lineHeight: 1,
            transform: `scale(${scale})`,
          }}
        >
          {current}
        </div>
      </div>
    </div>
  );
};

const FinalReveal: React.FC<{
  finalText: string;
  palette: ThemePalette;
  startFrame: number;
}> = ({ finalText, palette, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.7 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.7, 1], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(progress, [0, 1], [40, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 220,
          fontWeight: 800,
          color: palette.textMain,
          letterSpacing: "-0.02em",
          transform: `translateY(${ty}px) scale(${scale})`,
          textAlign: "center",
          padding: "0 60px",
          textShadow:
            palette.textMain === "#FFFFFF"
              ? "0 12px 40px rgba(0,0,0,0.4)"
              : "0 12px 40px rgba(155, 124, 246, 0.28)",
        }}
      >
        {finalText}
      </div>
    </div>
  );
};

export const YouTubeCountdownIntro: React.FC<CountdownIntroProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const palette = themePalette(
    props.themeStyle,
    props.primaryColor,
    props.secondaryColor,
  );

  const countdownFrames = props.countdownSeconds * fps;
  const elapsedSeconds = frame / fps;
  const inCountdown = frame < countdownFrames;
  const currentNumberFloat = Math.max(
    0,
    props.countdownSeconds - elapsedSeconds,
  );
  const currentNumber = inCountdown
    ? Math.max(1, Math.ceil(currentNumberFloat))
    : 0;
  const changeFrame = inCountdown
    ? countdownFrames - Math.ceil(currentNumberFloat) * fps
    : countdownFrames;

  const finalRevealFrame = countdownFrames;

  // Final fade-out at the very end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.6, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) },
  );

  const showCountdown = inCountdown;

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: fadeOut }}>
      <Background props={props} palette={palette} />

      {/* Header text (channel + title + subtitle) — for layouts that use it at top */}
      {(props.countdownStyle === "big-center-number" ||
        props.countdownStyle === "circular-timer") && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 96,
            gap: 18,
          }}
        >
          <TextEntrance delayFrames={6}>
            <div
              style={{
                fontSize: 32,
                color: palette.textMuted,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {props.channelName}
            </div>
          </TextEntrance>
          <TextEntrance delayFrames={14}>
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                color: palette.textMain,
                textAlign: "center",
                lineHeight: 1.05,
              }}
            >
              {props.mainTitle}
            </div>
          </TextEntrance>
          <TextEntrance delayFrames={20}>
            <div
              style={{
                fontSize: 28,
                color: palette.textMuted,
                textAlign: "center",
              }}
            >
              {props.subtitle}
            </div>
          </TextEntrance>
        </AbsoluteFill>
      )}

      {/* Countdown body */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showCountdown && props.countdownStyle === "big-center-number" && (
          <BigCenterNumber
            current={currentNumber}
            changeFrame={changeFrame}
            palette={palette}
          />
        )}
        {showCountdown && props.countdownStyle === "circular-timer" && (
          <CircularTimer
            current={currentNumber}
            changeFrame={changeFrame}
            countdownSeconds={props.countdownSeconds}
            elapsedSeconds={elapsedSeconds}
            palette={palette}
          />
        )}
        {showCountdown && props.countdownStyle === "split-layout" && (
          <SplitLayout
            current={currentNumber}
            changeFrame={changeFrame}
            channelName={props.channelName}
            mainTitle={props.mainTitle}
            subtitle={props.subtitle}
            palette={palette}
          />
        )}
        {showCountdown && props.countdownStyle === "minimal-corner-timer" && (
          <MinimalCornerTimer
            current={currentNumber}
            changeFrame={changeFrame}
            channelName={props.channelName}
            mainTitle={props.mainTitle}
            subtitle={props.subtitle}
            palette={palette}
          />
        )}
      </AbsoluteFill>

      {!inCountdown && (
        <FinalReveal
          finalText={props.finalText}
          palette={palette}
          startFrame={finalRevealFrame}
        />
      )}

      {/* Bottom watermark */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 36,
          textAlign: "center",
          fontSize: 18,
          color: palette.textMuted,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        SN Motion
      </div>
    </AbsoluteFill>
  );
};
