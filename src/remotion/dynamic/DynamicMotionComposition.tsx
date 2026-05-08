import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  blurPx,
  glowMultiplier,
  hexToRgba,
  overlayAlpha,
  safeHex,
  motionTypeLabel,
} from "../../lib/motionSettings";

import { motionIntensityMultiplier } from "./dynamicMotionConfig";
import {
  dynamicMotionDefaults,
  type DynamicMotionProps,
} from "./dynamicMotionSchema";

const safeProps = (props: DynamicMotionProps): DynamicMotionProps => ({
  ...dynamicMotionDefaults,
  ...props,
  primaryColor: safeHex(props.primaryColor, dynamicMotionDefaults.primaryColor),
  secondaryColor: safeHex(
    props.secondaryColor,
    dynamicMotionDefaults.secondaryColor,
  ),
  textColor: safeHex(props.textColor, dynamicMotionDefaults.textColor),
  backgroundStartColor: safeHex(
    props.backgroundStartColor,
    dynamicMotionDefaults.backgroundStartColor,
  ),
  backgroundEndColor: safeHex(
    props.backgroundEndColor,
    dynamicMotionDefaults.backgroundEndColor,
  ),
  accentColor: safeHex(props.accentColor, dynamicMotionDefaults.accentColor),
  countdownNumberColor: safeHex(
    props.countdownNumberColor,
    dynamicMotionDefaults.countdownNumberColor,
  ),
  overlayColor: safeHex(
    props.overlayColor,
    dynamicMotionDefaults.overlayColor,
  ),
  borderGlowColor: safeHex(
    props.borderGlowColor,
    dynamicMotionDefaults.borderGlowColor,
  ),
});

const displayText = (value: string, fallback: string): string => {
  const trimmed = value?.trim?.();
  return trimmed && trimmed.length > 0 ? value : fallback;
};

type Frame = { width: number; height: number; min: number };

const useFrameSize = (): Frame => {
  const { width, height } = useVideoConfig();
  return { width, height, min: Math.min(width, height) };
};

const Background: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const intensity = motionIntensityMultiplier(props.motionIntensity);

  const start = props.backgroundStartColor;
  const end = props.backgroundEndColor;

  if (props.backgroundType === "solid-color") {
    return <AbsoluteFill style={{ background: start }} />;
  }

  if (props.backgroundType === "abstract-shapes") {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${start}, ${end})`,
          overflow: "hidden",
        }}
      >
        <AbstractShapesBg props={props} t={t} intensity={intensity} />
      </AbsoluteFill>
    );
  }

  // animated-gradient (default + image-upload fallback for now)
  const angle = (t * 18 * intensity) % 360;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${start}, ${end})`,
      }}
    >
      <FloatingBlobs props={props} t={t} intensity={intensity} />
    </AbsoluteFill>
  );
};

const FloatingBlobs: React.FC<{
  props: DynamicMotionProps;
  t: number;
  intensity: number;
}> = ({ props, t, intensity }) => {
  const { min } = useFrameSize();
  const size = Math.round(min * 0.55);
  const blobs = [
    { color: props.primaryColor, x: 0.18, y: 0.2, speed: 0.6 },
    { color: props.secondaryColor, x: 0.82, y: 0.25, speed: 0.45 },
    { color: props.accentColor, x: 0.5, y: 0.85, speed: 0.5 },
  ];

  return (
    <AbsoluteFill>
      {blobs.map((blob, i) => {
        const dx = Math.sin(t * blob.speed * intensity + i) * (size * 0.12);
        const dy =
          Math.cos(t * blob.speed * 0.8 * intensity + i * 1.3) * (size * 0.1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${blob.x * 100}% - ${size / 2}px + ${dx}px)`,
              top: `calc(${blob.y * 100}% - ${size / 2}px + ${dy}px)`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${blurPx(props.backgroundBlur) * 6}px)`,
              opacity: 0.5,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const AbstractShapesBg: React.FC<{
  props: DynamicMotionProps;
  t: number;
  intensity: number;
}> = ({ props, t, intensity }) => {
  const { min } = useFrameSize();
  const shapes = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 1.7;
    const x = (Math.sin(seed * 1.3) * 0.4 + 0.5) * 100;
    const y = (Math.cos(seed * 0.9) * 0.4 + 0.5) * 100;
    const size = Math.round(min * (0.06 + ((i * 13) % 80) / 800));
    const rot = t * (10 + (i % 5) * 3) * intensity + i * 30;
    const dy = Math.sin(t * 0.6 * intensity + i) * (min * 0.02);
    return {
      x,
      y,
      size,
      rot,
      dy,
      color: i % 2 === 0 ? props.primaryColor : props.secondaryColor,
      kind: i % 3,
    };
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
            opacity: 0.3,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            borderRadius: s.kind === 0 ? "50%" : s.kind === 1 ? "28%" : "12%",
            filter: "blur(2px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const FrameGlow: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const steps = glowMultiplier(props.glowIntensity);
  if (steps <= 0) return null;
  const glow = props.borderGlowColor;
  return (
    <AbsoluteFill
      style={{
        boxShadow: `inset 0 0 ${40 + steps * 30}px ${steps * 8}px ${hexToRgba(
          glow,
          0.18 + steps * 0.08,
        )}`,
        pointerEvents: "none",
      }}
    />
  );
};

const HeaderOverlay: React.FC<{
  props: DynamicMotionProps;
}> = ({ props }) => {
  const { min } = useFrameSize();
  const fontSize = Math.round(min * 0.022);
  return (
    <div
      style={{
        position: "absolute",
        top: Math.round(min * 0.04),
        left: Math.round(min * 0.04),
        right: Math.round(min * 0.04),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: hexToRgba(props.textColor, 0.85),
        }}
      >
        {displayText(props.channelName, "Your channel")}
      </div>
      <div
        style={{
          fontSize: Math.round(fontSize * 0.85),
          fontWeight: 700,
          padding: `${Math.round(min * 0.008)}px ${Math.round(min * 0.018)}px`,
          borderRadius: 999,
          background: hexToRgba(props.overlayColor, 0.6),
          color: props.textColor,
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
        }}
      >
        {motionTypeLabel(props.motionType)} · {props.aspectRatio}
      </div>
    </div>
  );
};

const Footer: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const { min } = useFrameSize();
  return (
    <div
      style={{
        position: "absolute",
        bottom: Math.round(min * 0.04),
        left: 0,
        right: 0,
        textAlign: "center",
        color: hexToRgba(props.textColor, 0.7),
        fontSize: Math.round(min * 0.018),
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      {displayText(props.subtitleText, "Your subtitle")}
    </div>
  );
};

const useEntrance = (delaySeconds: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delaySeconds * fps);
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(progress, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, translateY: ty };
};

const TextEntrance: React.FC<{
  delaySeconds: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delaySeconds, children, style }) => {
  const { opacity, translateY } = useEntrance(delaySeconds);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const CountdownScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalSeconds = Math.max(1, durationInFrames / fps);
  const intro = Math.min(props.introLength, totalSeconds);
  const outro = Math.min(props.outroLength, Math.max(0, totalSeconds - intro));
  const countdownLength = Math.max(1, totalSeconds - intro - outro);
  const elapsed = Math.max(0, Math.min(countdownLength, frame / fps - intro));

  // Whole second remaining, ticking from the user's holdLength baseline.
  const baseStart = Math.max(1, Math.round(countdownLength));
  const remaining = Math.max(1, baseStart - Math.floor(elapsed));

  const sinceTickFrame =
    frame - Math.round((intro + Math.floor(elapsed)) * fps);
  const pulse = spring({
    frame: sinceTickFrame,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const introOpacity = interpolate(
    frame,
    [0, Math.round(intro * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const outroOpacity = interpolate(
    frame,
    [
      Math.round((intro + countdownLength) * fps),
      Math.round((intro + countdownLength + outro) * fps),
    ],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(introOpacity, outroOpacity);

  const { min } = useFrameSize();
  const numberFontSize = Math.round(min * 0.55);
  const titleFontSize = Math.round(min * 0.06);
  const subtitleFontSize = Math.round(min * 0.032);

  const showFinal = frame >= Math.round((intro + countdownLength) * fps);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.round(min * 0.02),
        textAlign: "center",
        padding: Math.round(min * 0.08),
      }}
    >
      <div
        data-testid="countdown-number"
        style={{
          fontSize: numberFontSize,
          fontWeight: 800,
          color: props.countdownNumberColor,
          lineHeight: 1,
          transform: `scale(${scale})`,
          textShadow:
            glowMultiplier(props.glowIntensity) > 0
              ? `0 0 ${20 + glowMultiplier(props.glowIntensity) * 12}px ${hexToRgba(
                  props.borderGlowColor,
                  0.35 + glowMultiplier(props.glowIntensity) * 0.1,
                )}`
              : "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        {showFinal
          ? displayText(props.finalText, "Let's go")
          : remaining}
      </div>
      <TextEntrance delaySeconds={intro}>
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            color: props.textColor,
            lineHeight: 1.1,
          }}
        >
          {displayText(props.titleText, "Your title")}
        </div>
      </TextEntrance>
      <TextEntrance delaySeconds={intro + 0.2}>
        <div
          style={{
            fontSize: subtitleFontSize,
            color: hexToRgba(props.textColor, 0.7),
          }}
        >
          {displayText(props.subtitleText, "Your subtitle")}
        </div>
      </TextEntrance>
    </AbsoluteFill>
  );
};

const LowerThirdScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const { min, width, height } = useFrameSize();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalSeconds = durationInFrames / fps;
  const intro = Math.min(props.introLength, totalSeconds);
  const outro = Math.min(props.outroLength, Math.max(0, totalSeconds - intro));
  const slideIn = spring({
    frame: frame - Math.round(intro * fps),
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const slideOut = spring({
    frame:
      frame - Math.round((totalSeconds - outro) * fps),
    fps,
    config: { damping: 20, stiffness: 90, mass: 0.7 },
  });
  const x = interpolate(slideIn, [0, 1], [-width * 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xOut = interpolate(slideOut, [0, 1], [0, -width * 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const overlayBg = hexToRgba(
    props.overlayColor,
    overlayAlpha(props.overlayOpacity),
  );
  const overlayBorder = hexToRgba(props.borderGlowColor, 0.45);
  const barWidth = Math.round(width * 0.5);
  const barHeight = Math.round(height * 0.18);
  const barLeft = Math.round(width * 0.06);
  const barBottom = Math.round(height * 0.1);

  return (
    <AbsoluteFill>
      <div
        data-testid="lower-third-bar"
        style={{
          position: "absolute",
          left: barLeft,
          bottom: barBottom,
          width: barWidth,
          height: barHeight,
          padding: Math.round(min * 0.025),
          borderRadius: Math.round(min * 0.025),
          background: overlayBg,
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          border: `1px solid ${overlayBorder}`,
          color: props.textColor,
          transform: `translateX(${x + xOut}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: Math.round(min * 0.01),
          boxShadow:
            glowMultiplier(props.glowIntensity) > 0
              ? `0 0 ${20 + glowMultiplier(props.glowIntensity) * 12}px ${hexToRgba(
                  props.borderGlowColor,
                  0.3 + glowMultiplier(props.glowIntensity) * 0.1,
                )}`
              : "0 18px 36px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            fontSize: Math.round(min * 0.045),
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {displayText(props.titleText, "Your title")}
        </div>
        <div
          style={{
            fontSize: Math.round(min * 0.028),
            color: hexToRgba(props.textColor, 0.7),
          }}
        >
          {displayText(props.subtitleText, "Your subtitle")}
        </div>
        <div
          style={{
            marginTop: Math.round(min * 0.012),
            height: Math.round(min * 0.006),
            borderRadius: 999,
            background: props.accentColor,
            opacity: 0.85,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SubscribeScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { min, width, height } = useFrameSize();
  const intensity = motionIntensityMultiplier(props.motionIntensity);
  const pop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });
  const scale = interpolate(pop, [0, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = Math.sin(frame * 0.15 * intensity) * 6;
  const cardBg = hexToRgba(
    props.overlayColor,
    overlayAlpha(props.overlayOpacity),
  );
  const cardBorder = hexToRgba(props.borderGlowColor, 0.45);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.round(min * 0.04),
        padding: Math.round(min * 0.06),
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: Math.round(width * 0.5),
          maxWidth: Math.round(height * 0.7),
          padding: Math.round(min * 0.04),
          borderRadius: Math.round(min * 0.04),
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          color: props.textColor,
          transform: `scale(${scale}) translateY(${wobble}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: Math.round(min * 0.025),
        }}
      >
        <div
          data-testid="subscribe-button"
          style={{
            padding: `${Math.round(min * 0.022)}px ${Math.round(min * 0.06)}px`,
            borderRadius: 999,
            background: props.accentColor,
            color: "#FFFFFF",
            fontSize: Math.round(min * 0.05),
            fontWeight: 800,
            letterSpacing: "0.04em",
            boxShadow:
              glowMultiplier(props.glowIntensity) > 0
                ? `0 0 ${24 + glowMultiplier(props.glowIntensity) * 16}px ${hexToRgba(
                    props.borderGlowColor,
                    0.35 + glowMultiplier(props.glowIntensity) * 0.1,
                  )}, 0 18px 40px ${hexToRgba(props.accentColor, 0.4)}`
                : `0 18px 40px ${hexToRgba(props.accentColor, 0.4)}`,
          }}
        >
          ▶ Subscribe
        </div>
        <div
          style={{
            fontSize: Math.round(min * 0.035),
            fontWeight: 700,
          }}
        >
          {displayText(props.finalText, "Let's go")}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AbstractMotionScene: React.FC<{ props: DynamicMotionProps }> = ({
  props,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { min, width, height } = useFrameSize();
  const t = frame / fps;
  const intensity = motionIntensityMultiplier(props.motionIntensity);

  const orbs = Array.from({ length: 6 }, (_, i) => {
    const seed = i * 1.4 + 0.3;
    const baseX = ((Math.sin(seed) * 0.5 + 0.5) * 0.8 + 0.1) * width;
    const baseY = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * 0.8 + 0.1) * height;
    const dx = Math.sin(t * 0.6 * intensity + i) * (min * 0.06);
    const dy = Math.cos(t * 0.5 * intensity + i * 1.7) * (min * 0.06);
    const size = Math.round(min * (0.18 + ((i * 11) % 60) / 600));
    const rot = (t * 30 * intensity + i * 45) % 360;
    return {
      x: baseX + dx,
      y: baseY + dy,
      size,
      rot,
      color: i % 2 === 0 ? props.accentColor : props.secondaryColor,
      kind: i % 3,
    };
  });

  return (
    <AbsoluteFill>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: o.color,
            opacity: 0.55,
            borderRadius: o.kind === 0 ? "50%" : o.kind === 1 ? "32%" : "16%",
            transform: `translate(-50%, -50%) rotate(${o.rot}deg)`,
            filter: "blur(2px)",
            boxShadow:
              glowMultiplier(props.glowIntensity) > 0
                ? `0 0 ${24 + glowMultiplier(props.glowIntensity) * 18}px ${hexToRgba(
                    props.borderGlowColor,
                    0.25 + glowMultiplier(props.glowIntensity) * 0.08,
                  )}`
                : "none",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { min } = useFrameSize();
  const intensity = motionIntensityMultiplier(props.motionIntensity);
  const reveal = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110 * intensity, mass: 0.7 },
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(reveal, [0, 1], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(reveal, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: Math.round(min * 0.08),
        gap: Math.round(min * 0.02),
        opacity,
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        color: props.textColor,
      }}
    >
      <div
        style={{
          fontSize: Math.round(min * 0.08),
          fontWeight: 800,
          lineHeight: 1.1,
          textShadow:
            glowMultiplier(props.glowIntensity) > 0
              ? `0 0 ${24 + glowMultiplier(props.glowIntensity) * 14}px ${hexToRgba(
                  props.borderGlowColor,
                  0.35 + glowMultiplier(props.glowIntensity) * 0.1,
                )}`
              : "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        {displayText(props.titleText, "Your title")}
      </div>
      <div
        style={{
          fontSize: Math.round(min * 0.035),
          color: hexToRgba(props.textColor, 0.7),
        }}
      >
        {displayText(props.subtitleText, "Your subtitle")}
      </div>
    </AbsoluteFill>
  );
};

const SlideScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { min, width } = useFrameSize();
  const intensity = motionIntensityMultiplier(props.motionIntensity);
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 * intensity, mass: 0.7 },
  });
  const slideOut = interpolate(
    frame,
    [durationInFrames - Math.round(0.6 * fps), durationInFrames],
    [0, -width * 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) },
  );
  const x =
    interpolate(slideIn, [0, 1], [width * 0.4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + slideOut;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        textAlign: "left",
        padding: Math.round(min * 0.1),
        gap: Math.round(min * 0.02),
        color: props.textColor,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          height: Math.round(min * 0.012),
          width: Math.round(min * 0.18),
          borderRadius: 999,
          background: props.accentColor,
        }}
      />
      <div
        style={{
          fontSize: Math.round(min * 0.085),
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        {displayText(props.titleText, "Your title")}
      </div>
      <div
        style={{
          fontSize: Math.round(min * 0.035),
          color: hexToRgba(props.textColor, 0.75),
        }}
      >
        {displayText(props.subtitleText, "Your subtitle")}
      </div>
    </AbsoluteFill>
  );
};

const FadeScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { min } = useFrameSize();
  const fadeIn = interpolate(frame, [0, Math.round(0.8 * fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - Math.round(0.8 * fps), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: Math.round(min * 0.08),
        gap: Math.round(min * 0.02),
        opacity,
        color: props.textColor,
      }}
    >
      <div
        style={{
          fontSize: Math.round(min * 0.075),
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        {displayText(props.titleText, "Your title")}
      </div>
      <div
        style={{
          fontSize: Math.round(min * 0.032),
          color: hexToRgba(props.textColor, 0.72),
        }}
      >
        {displayText(props.subtitleText, "Your subtitle")}
      </div>
    </AbsoluteFill>
  );
};

const LoopScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { min, width, height } = useFrameSize();
  const t = frame / fps;
  const intensity = motionIntensityMultiplier(props.motionIntensity);
  const ringCount = 4;
  const period = 2.4 / Math.max(0.4, intensity);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: ringCount }, (_, i) => {
        const phase = ((t / period) + i / ringCount) % 1;
        const size = phase * Math.min(width, height) * 0.9;
        const opacity = 1 - phase;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${Math.max(2, Math.round(min * 0.005))}px solid ${props.accentColor}`,
              opacity,
            }}
          />
        );
      })}
      <div
        style={{
          color: props.textColor,
          fontSize: Math.round(min * 0.05),
          fontWeight: 800,
          textAlign: "center",
          padding: `${Math.round(min * 0.02)}px ${Math.round(min * 0.06)}px`,
          borderRadius: 999,
          background: hexToRgba(
            props.overlayColor,
            overlayAlpha(props.overlayOpacity),
          ),
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
        }}
      >
        {displayText(props.titleText, "Your title")}
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  switch (props.motionType) {
    case "countdown":
      return <CountdownScene props={props} />;
    case "lower-third":
      return <LowerThirdScene props={props} />;
    case "subscribe":
      return <SubscribeScene props={props} />;
    case "abstract-motion":
      return <AbstractMotionScene props={props} />;
    case "reveal":
      return <RevealScene props={props} />;
    case "slide":
      return <SlideScene props={props} />;
    case "fade":
      return <FadeScene props={props} />;
    case "loop":
      return <LoopScene props={props} />;
    default:
      return <RevealScene props={props} />;
  }
};

export const DynamicMotionComposition: React.FC<DynamicMotionProps> = (raw) => {
  const props = safeProps(raw);
  return (
    <AbsoluteFill style={{ background: props.backgroundStartColor }}>
      <Background props={props} />
      <Scene props={props} />
      <FrameGlow props={props} />
      <HeaderOverlay props={props} />
      <Footer props={props} />
    </AbsoluteFill>
  );
};
