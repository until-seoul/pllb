import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, DISPLAY_FONT, MONO_FONT} from "../theme";

export type KineticTextProps = {
  readonly text: string;
  /** Frame (lokal scene) saat kata pertama mulai muncul. */
  readonly delay?: number;
  /** Jeda antar kata, dalam frame. */
  readonly stagger?: number;
  readonly size?: number;
  readonly weight?: number;
  readonly color?: string;
  readonly fontFamily?: string;
  readonly lineHeight?: number;
  readonly align?: "left" | "center" | "right";
  readonly maxWidth?: number;
  readonly letterSpacing?: number;
  readonly uppercase?: boolean;
  /** Kata yang diberi warna aksen (dicocokkan tanpa tanda baca). */
  readonly accentWords?: readonly string[];
  readonly accentColor?: string;
  /** Kata yang dicoret, dan frame saat coretan mulai digambar. */
  readonly strikeWords?: readonly string[];
  readonly strikeDelay?: number;
  readonly strikeColor?: string;
  /** Jarak vertikal kata sebelum settle (dalam px). */
  readonly rise?: number;
  readonly rotateIn?: number;
};

const normalize = (word: string) =>
  word.toLowerCase().replace(/[^a-z0-9]/g, "");

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  delay = 0,
  stagger = 3,
  size = 84,
  weight = 600,
  color = COLORS.sand,
  fontFamily = DISPLAY_FONT,
  lineHeight = 1.08,
  align = "left",
  maxWidth,
  letterSpacing = -0.01,
  uppercase = false,
  accentWords = [],
  accentColor = COLORS.amber,
  strikeWords = [],
  strikeDelay = 0,
  strikeColor = COLORS.danger,
  rise = 26,
  rotateIn = 3,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(" ");
  const accents = accentWords.map(normalize);
  const strikes = strikeWords.map(normalize);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        maxWidth,
        gap: "0 0.28em",
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        color,
        textTransform: uppercase ? "uppercase" : "none",
      }}
    >
      {words.map((word, index) => {
        const start = delay + index * stagger;
        const local = frame - start;
        const bounce = spring({
          frame: local,
          fps,
          config: {damping: 16, mass: 0.55, stiffness: 120},
          durationInFrames: 26,
        });
        const opacity = interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isAccent = accents.includes(normalize(word));
        const isStruck = strikes.includes(normalize(word));
        const strikeOn = isStruck
          ? interpolate(frame, [strikeDelay, strikeDelay + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              opacity,
              color: isAccent ? accentColor : color,
              textDecoration: isStruck ? "line-through" : "none",
              textDecorationColor: `${strikeColor}${Math.round(
                strikeOn * 255,
              )
                .toString(16)
                .padStart(2, "0")}`,
              textDecorationThickness: "4px",
              translate: `0px ${interpolate(
                bounce,
                [0, 1],
                [rise, 0],
              )}px`,
              scale: interpolate(bounce, [0, 1], [0.86, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                output: "perceptual-scale",
              }),
              rotate: `${interpolate(
                bounce,
                [0, 1],
                [`${rotateIn}deg`, "0deg"],
              )}`,
              textShadow: isAccent
                ? `0 0 34px ${COLORS.amber}55`
                : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Versi mono kecil untuk label instrumen: muncul dengan fade + slide pendek
 * tanpa bounce, supaya tidak bersaing dengan headline.
 */
export const MonoLabel: React.FC<{
  readonly children: React.ReactNode;
  readonly delay?: number;
  readonly color?: string;
  readonly size?: number;
  readonly letterSpacing?: number;
  readonly align?: "left" | "center" | "right";
  readonly uppercase?: boolean;
  readonly style?: React.CSSProperties;
}> = ({
  children,
  delay = 0,
  color = COLORS.aqua,
  size = 20,
  letterSpacing = 0.22,
  align = "left",
  uppercase = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        fontFamily: MONO_FONT,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: `${letterSpacing}em`,
        textTransform: uppercase ? "uppercase" : "none",
        color,
        opacity,
        textAlign: align,
        translate: `0px ${interpolate(
          opacity,
          [0, 1],
          [14, 0],
        )}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
