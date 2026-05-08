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
  type MotionType,
  blurPx,
  glowMultiplier,
  hexToRgba,
  motionTypeLabel,
  overlayAlpha,
} from "../../lib/motionSettings";
import {
  type DynamicMotionProps,
  dynamicMotionDefaults,
} from "./dynamicMotionSchema";

/**
 * PR #7: Dynamic Remotion Composition (basic).
 *
 * This is the first real Remotion composition for SN Motion. It consumes a
 * MotionSettings object and renders a frame-based preview using Remotion
 * primitives (useCurrentFrame, useVideoConfig, interpolate, spring).
 *
 * NOT IMPLEMENTED IN THIS PR:
 *  - MP4 export
 *  - Render API wiring (the existing /api/render route is unchanged)
 *  - AI / provider / API key integrations
 *  - Asset upload, presets, batch processing
 */

const DEFAULTS = dynamicMotionDefaults;

const intensityScale = (intensity: DynamicMotionProps["motionIntensity"]) => {
  switch (intensity) {
    case "subtle":
      return 0.65;
    case "energetic":
      return 1.4;
    case "normal":
    default:
      return 1;
  }
};

const Background: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const angle = (t * 18 * intensityScale(props.motionIntensity)) % 360;

  if (props.backgroundType === "solid-color") {
    return <AbsoluteFill style={{ background: props.backgroundStartColor }} />;
  }

  const gradient = `linear-gradient(${angle}deg, ${props.backgroundStartColor}, ${props.backgroundEndColor})`;

  if (props.backgroundType === "abstract-shapes") {
    return (
      <AbsoluteFill style={{ background: gradient }}>
        <AbstractShapes props={props} />
      </AbsoluteFill>
    );
  }

  // animated-gradient (default) and image-upload (placeholder, no real upload)
  return (
    <AbsoluteFill style={{ background: gradient }}>
      <FloatingBlobs props={props} />
    </AbsoluteFill>
  );
};

const FloatingBlobs: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const blobs = [
    { color: props.primaryColor, x: 0.18, y: 0.2, speed: 0.6 },
    { color: props.secondaryColor, x: 0.82, y: 0.22, speed: 0.45 },
    { color: props.accentColor, x: 0.5, y: 0.85, speed: 0.5 },
  ];
  const baseSize = Math.min(width, height) * 0.55;

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
              left: `calc(${blob.x * 100}% - ${baseSize / 2}px + ${dx}px)`,
              top: `calc(${blob.y * 100}% - ${baseSize / 2}px + ${dy}px)`,
              width: baseSize,
              height: baseSize,
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${Math.round(baseSize * 0.18)}px)`,
              opacity: 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const AbstractShapes: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const minDim = Math.min(width, height);
  const shapes = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 1.7;
    const x = (Math.sin(seed * 1.3) * 0.4 + 0.5) * 100;
    const y = (Math.cos(seed * 0.9) * 0.4 + 0.5) * 100;
    const size = minDim * 0.06 + ((i * 37) % 120);
    const rot = t * (10 + (i % 5) * 3) * intensityScale(props.motionIntensity) + i * 30;
    const dy = Math.sin(t * 0.6 + i) * 18;
    const isAccent = i % 3 === 0;
    const color = isAccent
      ? props.accentColor
      : i % 2 === 0
        ? props.primaryColor
        : props.secondaryColor;
    return { x, y, size, rot, dy, color, kind: i % 3 };
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

const FrameGlow: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const mult = glowMultiplier(props.glowIntensity);
  if (mult === 0) return null;
  const blur = 24 + mult * 28;
  const spread = 4 + mult * 6;
  return (
    <AbsoluteFill
      style={{
        boxShadow: `inset 0 0 ${blur}px ${spread}px ${hexToRgba(
          props.borderGlowColor,
          0.55,
        )}`,
        pointerEvents: "none",
      }}
    />
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

const textGlow = (props: DynamicMotionProps) => {
  const mult = glowMultiplier(props.glowIntensity);
  if (mult === 0) return undefined;
  return `0 0 ${8 + mult * 6}px ${hexToRgba(props.borderGlowColor, 0.7)}`;
};

const motionTypePill = (props: DynamicMotionProps) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: hexToRgba(props.accentColor, 0.18),
      color: props.textColor,
      border: `1px solid ${hexToRgba(props.accentColor, 0.55)}`,
      borderRadius: 999,
      padding: "8px 18px",
      fontSize: 22,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontWeight: 600,
    }}
  >
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: props.accentColor }} />
    {motionTypeLabel(props.motionType)}
  </div>
);

const CountdownScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Outro uses the last `outroLength` seconds for "Let's Start". Countdown runs
  // for the remaining frames.
  const outroFrames = Math.max(0, Math.round(props.outroLength * fps));
  const countdownEndFrame = Math.max(1, durationInFrames - outroFrames);
  const showFinal = frame >= countdownEndFrame;
  const remainingFrames = Math.max(0, countdownEndFrame - frame);
  const totalSeconds = Math.max(1, Math.ceil(countdownEndFrame / fps));
  const currentNumber = Math.max(
    1,
    Math.min(totalSeconds, Math.ceil(remainingFrames / fps)),
  );
  const tickFrame = (currentNumber - 1) * fps;
  const sinceTick = frame - (countdownEndFrame - currentNumber * fps);
  const pulse = spring({
    frame: sinceTick,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });
  const scale = interpolate(pulse, [0, 1], [1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // suppress unused var lint by referencing tickFrame in a comment
  void tickFrame;

  const finalProgress = spring({
    frame: frame - countdownEndFrame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  const finalOpacity = interpolate(finalProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalScale = interpolate(finalProgress, [0, 1], [0.85, 1], {
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
        gap: 36,
        padding: 80,
        textAlign: "center",
      }}
    >
      <TextEntrance delayFrames={2}>
        <div
          style={{
            fontSize: 32,
            color: hexToRgba(props.textColor, 0.75),
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {props.channelName}
        </div>
      </TextEntrance>
      <TextEntrance delayFrames={6}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: props.textColor,
            lineHeight: 1.1,
            textShadow: textGlow(props),
            maxWidth: "85%",
          }}
        >
          {props.titleText}
        </div>
      </TextEntrance>
      {!showFinal ? (
        <div
          style={{
            fontSize: 380,
            fontWeight: 800,
            lineHeight: 1,
            color: props.countdownNumberColor,
            transform: `scale(${scale})`,
            letterSpacing: "-0.02em",
            textShadow: textGlow(props),
          }}
        >
          {currentNumber}
        </div>
      ) : (
        <div
          style={{
            fontSize: 220,
            fontWeight: 800,
            lineHeight: 1,
            color: props.textColor,
            opacity: finalOpacity,
            transform: `scale(${finalScale})`,
            letterSpacing: "-0.02em",
            textShadow: textGlow(props),
          }}
        >
          {props.finalText}
        </div>
      )}
      <TextEntrance delayFrames={10}>
        <div
          style={{
            fontSize: 32,
            color: hexToRgba(props.textColor, 0.78),
          }}
        >
          {props.subtitleText}
        </div>
      </TextEntrance>
    </AbsoluteFill>
  );
};

const LowerThirdScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const introFrames = Math.max(1, Math.round(props.introLength * fps));
  const outroFrames = Math.max(1, Math.round(props.outroLength * fps));
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.7 },
    durationInFrames: introFrames,
  });
  const exitProgress = interpolate(
    frame,
    [durationInFrames - outroFrames, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const tx = interpolate(slideIn, [0, 1], [-width, 0]) +
    interpolate(exitProgress, [0, 1], [0, -width / 2]);
  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div
        style={{
          margin: 80,
          padding: "32px 48px",
          background: hexToRgba(props.overlayColor, overlayAlpha(props.overlayOpacity)),
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          WebkitBackdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          borderLeft: `8px solid ${props.accentColor}`,
          borderRadius: 24,
          color: props.textColor,
          transform: `translateX(${tx}px)`,
          opacity,
          textShadow: textGlow(props),
          maxWidth: "70%",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: hexToRgba(props.textColor, 0.78),
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {props.channelName}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {props.titleText}
        </div>
        <div
          style={{
            fontSize: 28,
            color: hexToRgba(props.textColor, 0.78),
            marginTop: 8,
          }}
        >
          {props.subtitleText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SubscribeScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introFrames = Math.max(1, Math.round(props.introLength * fps));
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
    durationInFrames: introFrames * 2,
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buttonPulse = 1 +
    Math.sin((frame / fps) * 2 * Math.PI * 0.6 * intensityScale(props.motionIntensity)) *
      0.04;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          background: hexToRgba(props.overlayColor, overlayAlpha(props.overlayOpacity)),
          backdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          WebkitBackdropFilter: `blur(${blurPx(props.backgroundBlur)}px)`,
          borderRadius: 36,
          padding: "56px 72px",
          color: props.textColor,
          textAlign: "center",
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          textShadow: textGlow(props),
          border: `1px solid ${hexToRgba(props.accentColor, 0.4)}`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: hexToRgba(props.textColor, 0.78),
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {props.channelName}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          {props.titleText}
        </div>
        <div
          style={{
            fontSize: 30,
            color: hexToRgba(props.textColor, 0.78),
            marginBottom: 32,
          }}
        >
          {props.subtitleText}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: props.accentColor,
            color: "#FFFFFF",
            borderRadius: 999,
            padding: "20px 44px",
            fontSize: 36,
            fontWeight: 700,
            transform: `scale(${buttonPulse})`,
            boxShadow: `0 18px 40px ${hexToRgba(props.accentColor, 0.45)}`,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              fontSize: 22,
            }}
          >
            ▶
          </span>
          {props.finalText || "Subscribe"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introFrames = Math.max(1, Math.round(props.introLength * fps));
  const reveal = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
    durationInFrames: introFrames * 2,
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(reveal, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(reveal, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        textAlign: "center",
      }}
    >
      <div style={{ opacity, transform: `translateY(${ty}px) scale(${scale})` }}>
        {motionTypePill(props)}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: props.textColor,
            lineHeight: 1.05,
            marginTop: 32,
            textShadow: textGlow(props),
          }}
        >
          {props.titleText}
        </div>
        <div
          style={{
            fontSize: 36,
            color: hexToRgba(props.textColor, 0.78),
            marginTop: 24,
          }}
        >
          {props.subtitleText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SlideScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const introFrames = Math.max(1, Math.round(props.introLength * fps));
  const slide = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 130, mass: 0.7 },
    durationInFrames: introFrames * 2,
  });
  const tx = interpolate(slide, [0, 1], [-width / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(slide, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", padding: 80 }}
    >
      <div style={{ transform: `translateX(${tx}px)`, opacity, textAlign: "left" }}>
        <div
          style={{
            fontSize: 28,
            color: hexToRgba(props.textColor, 0.78),
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {props.channelName}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: props.textColor,
            lineHeight: 1.05,
            textShadow: textGlow(props),
          }}
        >
          {props.titleText}
        </div>
        <div
          style={{
            fontSize: 32,
            color: hexToRgba(props.textColor, 0.78),
            marginTop: 18,
          }}
        >
          {props.subtitleText}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 6,
            width: 220,
            borderRadius: 6,
            background: props.accentColor,
            boxShadow: `0 0 20px ${hexToRgba(props.accentColor, 0.5)}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const FadeScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const introFrames = Math.max(1, Math.round(props.introLength * fps));
  const outroFrames = Math.max(1, Math.round(props.outroLength * fps));
  const fadeIn = interpolate(frame, [0, introFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - outroFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.ease) },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        textAlign: "center",
      }}
    >
      <div style={{ opacity }}>
        {motionTypePill(props)}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: props.textColor,
            lineHeight: 1.05,
            marginTop: 32,
            textShadow: textGlow(props),
          }}
        >
          {props.titleText}
        </div>
        <div
          style={{
            fontSize: 36,
            color: hexToRgba(props.textColor, 0.78),
            marginTop: 24,
          }}
        >
          {props.subtitleText}
        </div>
        <div
          style={{
            fontSize: 28,
            color: hexToRgba(props.textColor, 0.6),
            marginTop: 28,
          }}
        >
          {props.finalText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LoopScene: React.FC<{ props: DynamicMotionProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const intensity = intensityScale(props.motionIntensity);
  const minDim = Math.min(width, height);
  const ringSize = minDim * 0.55;
  const rot = (t * 30 * intensity) % 360;
  const innerRot = (t * -45 * intensity) % 360;

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", padding: 80 }}
    >
      <div
        style={{
          position: "relative",
          width: ringSize,
          height: ringSize,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${Math.round(ringSize * 0.04)}px solid ${hexToRgba(
              props.accentColor,
              0.7,
            )}`,
            transform: `rotate(${rot}deg)`,
            boxShadow: `0 0 ${Math.round(
              ringSize * 0.08,
            )}px ${hexToRgba(props.borderGlowColor, 0.6)}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: ringSize * 0.18,
            borderRadius: "50%",
            border: `${Math.round(ringSize * 0.025)}px dashed ${hexToRgba(
              props.primaryColor,
              0.7,
            )}`,
            transform: `rotate(${innerRot}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {motionTypePill(props)}
        </div>
      </div>
      <div
        style={{
          fontSize: 36,
          color: hexToRgba(props.textColor, 0.78),
          marginTop: 32,
          textAlign: "center",
        }}
      >
        {props.subtitleText}
      </div>
    </AbsoluteFill>
  );
};

const AbstractMotionScene: React.FC<{ props: DynamicMotionProps }> = ({
  props,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const drift = Math.sin(t * 0.4 * intensityScale(props.motionIntensity)) * 30;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ transform: `translateY(${drift}px)` }}>
        {motionTypePill(props)}
      </div>
    </AbsoluteFill>
  );
};

const motionTypeRenderer: Record<MotionType, React.FC<{ props: DynamicMotionProps }>> = {
  countdown: CountdownScene,
  reveal: RevealScene,
  slide: SlideScene,
  fade: FadeScene,
  loop: LoopScene,
  subscribe: SubscribeScene,
  "lower-third": LowerThirdScene,
  "abstract-motion": AbstractMotionScene,
};

export const DynamicMotionComposition: React.FC<DynamicMotionProps> = (
  rawProps,
) => {
  // Merge with defaults so any missing field can never crash the composition.
  const props: DynamicMotionProps = { ...DEFAULTS, ...rawProps };
  const Scene = motionTypeRenderer[props.motionType] ?? CountdownScene;

  return (
    <AbsoluteFill style={{ background: props.backgroundEndColor }}>
      <Background props={props} />
      <Scene props={props} />
      <FrameGlow props={props} />
    </AbsoluteFill>
  );
};
