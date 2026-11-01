import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {COLORS, mixHex, rand} from "../theme";

export type WaterProps = {
  /** 0 = di permukaan, 1 = terdalam. Mengatur gradasi warna. */
  readonly depth?: number;
  readonly rays?: boolean;
  readonly snow?: boolean;
  readonly caustics?: boolean;
  readonly vignette?: number;
  /** Gumpalan kabut blur yang bergerak dengan kecepatan berbeda — parallax 2.5D. */
  readonly parallax?: boolean;
  readonly style?: React.CSSProperties;
};

/**
 * Lapisan air laut: gradasi kedalaman, sinar matahari, kista optik (caustics),
 * marine snow, dan gumpalan kabut berlapis. Semua bergerak lewat transform
 * pada container — bukan CSS animation — supaya aman di-render.
 */
export const Water: React.FC<WaterProps> = ({
  depth = 0.4,
  rays = true,
  snow = true,
  caustics = true,
  vignette = 0.45,
  parallax = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const drift = (frame / 42) % 1;

  const top = mixHex(COLORS.surface, COLORS.abyss, depth);
  const mid = mixHex(COLORS.shallow, COLORS.deep, depth);
  const bottom = mixHex(COLORS.mid, COLORS.abyss, depth);

  return (
    <AbsoluteFill style={{...style, backgroundColor: COLORS.abyss}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${top} 0%, ${mid} 42%, ${bottom} 100%)`,
        }}
      />

      {parallax ? (
        <>
          {/* Lapisan jauh — bergerak paling lambat */}
          <AbsoluteFill
            style={{
              opacity: 0.5,
              mixBlendMode: "screen",
              translate: `${Math.sin(frame / 320) * 90}px ${Math.cos(frame / 410) * 34}px`,
            }}
          >
            <AbsoluteFill
              style={{
                background: `radial-gradient(38% 30% at ${24 + Math.sin(frame / 300) * 8}% ${
                  22 + Math.cos(frame / 340) * 6
                }%, ${COLORS.aqua}22 0%, transparent 70%)`,
              }}
            />
            <AbsoluteFill
              style={{
                background: `radial-gradient(34% 28% at ${76 - Math.cos(frame / 360) * 7}% ${
                  58 + Math.sin(frame / 420) * 6
                }%, ${COLORS.surface}26 0%, transparent 72%)`,
              }}
            />
          </AbsoluteFill>

          {/* Lapisan sedang — kecepatan sedang, lebih blur */}
          <AbsoluteFill
            style={{
              opacity: 0.42,
              mixBlendMode: "screen",
              filter: "blur(26px)",
              translate: `${Math.sin(frame / 170) * 150}px ${Math.cos(frame / 230) * 58}px`,
            }}
          >
            <AbsoluteFill
              style={{
                background: `radial-gradient(30% 24% at ${
                  38 + Math.sin(frame / 190) * 10
                }% ${34 + Math.cos(frame / 210) * 8}%, ${COLORS.foam}18 0%, transparent 72%)`,
              }}
            />
            <AbsoluteFill
              style={{
                background: `radial-gradient(26% 22% at ${
                  68 - Math.cos(frame / 240) * 9
                }% ${72 + Math.sin(frame / 280) * 7}%, ${COLORS.aqua}18 0%, transparent 74%)`,
              }}
            />
          </AbsoluteFill>
        </>
      ) : null}

      {caustics ? (
        <AbsoluteFill
          style={{
            opacity: interpolate(depth, [0, 1], [0.5, 0.12]),
            mixBlendMode: "screen",
          }}
        >
          <AbsoluteFill
            style={{
              background: `radial-gradient(60% 42% at ${28 + drift * 30}% ${
                8 + Math.sin(frame / 90) * 6
              }%, ${COLORS.foam}33 0%, transparent 70%)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(46% 34% at ${78 - drift * 26}% ${
                16 + Math.cos(frame / 110) * 5
              }%, ${COLORS.aqua}26 0%, transparent 72%)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {rays ? (
        <AbsoluteFill
          style={{
            opacity: interpolate(depth, [0, 1], [0.5, 0.06]),
            mixBlendMode: "screen",
            rotate: `${Math.sin(frame / 130) * 1.6}deg`,
            translate: `${Math.sin(frame / 170) * 40}px 0px`,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${8 + i * 24}%`,
                top: "-20%",
                width: 150 - i * 12,
                height: "150%",
                background: `linear-gradient(180deg, ${COLORS.foam}30 0%, transparent 78%)`,
                rotate: `${-12 + i * 7}deg`,
                filter: "blur(16px)",
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}

      {snow ? (
        <AbsoluteFill
          style={{
            opacity: 0.5,
            translate: `0px ${(frame * 1.6) % 1200}px`,
          }}
        >
          <AbsoluteFill>
            {Array.from({length: 54}, (_, i) => {
              const size = 2 + rand(i * 2.3) * 4.5;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${rand(i * 1.7) * 100}%`,
                    top: `${rand(i * 5.1) * 130}%`,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: COLORS.foam,
                    opacity: 0.12 + rand(i * 3.9) * 0.3,
                  }}
                />
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {snow ? (
        <AbsoluteFill
          style={{
            opacity: 0.42,
            translate: `0px ${(frame * 4.2) % 1700}px`,
            filter: "blur(3px)",
          }}
        >
          <AbsoluteFill>
            {Array.from({length: 14}, (_, i) => {
              const size = 14 + rand(i * 7.3) * 26;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${rand(i * 9.1) * 100}%`,
                    top: `${rand(i * 4.6) * 165}%`,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: COLORS.foam,
                    opacity: 0.06 + rand(i * 2.9) * 0.11,
                  }}
                />
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(72% 72% at 50% 46%, transparent 42%, rgba(4,16,20,${
              vignette
            }) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
