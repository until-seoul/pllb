import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {COLORS, CONTENT_LEFT, DISPLAY_FONT, MONO_FONT, rand} from "../theme";
import {KineticText, MonoLabel} from "../components/KineticText";
import {Hud} from "../components/Hud";
import {Water} from "../components/Water";
import {Explorer} from "../components/Explorer";
import {PolypSVG} from "../components/Assets";
import {SourceTag} from "../components/Citation";

/**
 * Offset sel zooxanthella target dari tengah polip, dalam px pada skala 1
 * (viewBox 600 dirender pada POLYP_SIZE).
 */
const TARGET = {x: 157 * (560 / 600), y: 59 * (560 / 600)};
const POLYP_SIZE = 560;

/** Titik fokus di layar — di kanan kolom teks, jauh dari meter kedalaman. */
const FOCUS = {x: 1120, y: 520};

/**
 * SCENE 3 — SIMBIOSIS.
 * Kamera jadi sel. Polip karang diperbesar dengan titik fokus terkunci pada
 * satu sel zooxanthella; ketika diperbesar, sel itu yang "menangkap" kamera
 * — dan inilah perkenalan pertama dengan Penjelajah.
 */
export const Scene3Symbiosis: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [120, 300], [1, 3.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.42, 0, 0.2, 1),
  });

  // Tarik sedikit ke belakang di akhir supaya konteks jaringan terlihat lagi.
  const pullBack = interpolate(frame, [340, 480], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const breathe = 1 + Math.sin(frame / 34) * 0.012;

  const polypOpacity = interpolate(frame, [286, 322], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leaderLen = 340;
  const leaderOn = interpolate(frame, [186, 220], [leaderLen, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const reticleSpin = interpolate(frame, [0, 530], [0, 96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exchange = [
    {from: "KARANG", to: "tempat tinggal · CO₂"},
    {from: "ZOOXANTHELLAE", to: "gula · oksigen"},
  ];

  return (
    <AbsoluteFill>
      <Water depth={0.95} rays={false} snow caustics={false} vignette={0.72} />

      {/* Cahaya fokus di belakang polip */}
      <div
        style={{
          position: "absolute",
          left: FOCUS.x - 520,
          top: FOCUS.y - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.sandDim}26 0%, transparent 62%)`,
          opacity: interpolate(frame, [0, 60], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* ---------- Polip karang ---------- */}
      <div
        style={{
          position: "absolute",
          left: FOCUS.x - TARGET.x,
          top: FOCUS.y - TARGET.y,
          width: POLYP_SIZE,
          height: POLYP_SIZE,
          opacity: polypOpacity,
          scale: zoom * pullBack * breathe,
          transformOrigin: `${TARGET.x}px ${TARGET.y}px`,
        }}
      >
        <PolypSVG
          size={POLYP_SIZE}
          tissue={COLORS.sandDim}
          cavity={COLORS.deep}
          algae={COLORS.amber}
        />
      </div>

      {/* ---------- Reticle fokus (instrumen) ---------- */}
      <svg
        viewBox="0 0 1920 1080"
        width={1920}
        height={1080}
        style={{position: "absolute", inset: 0, pointerEvents: "none"}}
      >
        <g
          transform={`translate(${FOCUS.x} ${FOCUS.y}) rotate(${reticleSpin})`}
          opacity={interpolate(frame, [180, 230], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {Array.from({length: 24}, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r1 = 268;
            const r2 = i % 3 === 0 ? 292 : 280;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r1}
                y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2}
                y2={Math.sin(a) * r2}
                stroke={COLORS.aqua}
                strokeWidth={i % 3 === 0 ? 2 : 1}
                strokeOpacity={i % 3 === 0 ? 0.8 : 0.4}
              />
            );
          })}
          <circle
            r={268}
            fill="none"
            stroke={COLORS.aqua}
            strokeWidth={1}
            strokeOpacity={0.28}
            strokeDasharray="6 14"
          />
        </g>
      </svg>

      {/* ---------- Penjelajah (besar) ---------- */}
      <Explorer
        left={FOCUS.x - 220}
        top={FOCUS.y - 220}
        size={440}
        opacity={interpolate(frame, [300, 346], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        glow={1.35}
      />

      {/* Garis penunjuk ke sel */}
      <svg
        viewBox="0 0 1920 1080"
        width={1920}
        height={1080}
        style={{position: "absolute", inset: 0, pointerEvents: "none"}}
      >
        <line
          x1={CONTENT_LEFT + 490}
          y1={318}
          x2={FOCUS.x}
          y2={FOCUS.y}
          stroke={COLORS.aqua}
          strokeWidth={1.5}
          strokeDasharray={leaderLen}
          strokeDashoffset={leaderOn}
          opacity={interpolate(frame, [186, 210], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </svg>

      {/* Mot plankton melayang — kedalaman 2.5D */}
      {Array.from({length: 16}, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 640 + rand(i * 3.1) * 1180,
            top:
              ((rand(i * 5.7) * 1200 - frame * (0.5 + rand(i) * 0.9)) % 1200 +
                1200) %
              1200,
            width: 3 + rand(i * 7.7) * 7,
            height: 3 + rand(i * 7.7) * 7,
            borderRadius: "50%",
            backgroundColor: COLORS.foam,
            opacity: 0.1 + rand(i * 2.3) * 0.26,
          }}
        />
      ))}

      {/* ---------- Scrim kolom kiri (di atas polip, di bawah Penjelajah) ---------- */}
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 0,
          width: 620,
          height: 1080,
          background: `linear-gradient(90deg, rgba(4,16,20,0.95) 0%, rgba(4,16,20,0.86) 58%, rgba(4,16,20,0) 100%)`,
          opacity: interpolate(frame, [100, 140], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* ---------- Kolom kiri ---------- */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 236,
          width: 500,
        }}
      >
        {/* Beat 1 — setup */}
        <div
          style={{
            opacity:
              interpolate(frame, [20, 38], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) *
              interpolate(frame, [150, 176], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
          }}
        >
          <MonoLabel delay={16} color={COLORS.aqua} size={15}>
            MIKROSKOPIS · JARINGAN POLIP
          </MonoLabel>
          <div style={{height: 18}} />
          <KineticText
            text="DI DALAM SETIAP POLIP HIDUP KOMUNITAS KECIL"
            delay={30}
            stagger={2}
            size={42}
            weight={600}
            color={COLORS.sand}
            maxWidth={480}
            lineHeight={1.18}
            rise={18}
          />
        </div>

        {/* Beat 2 — nama simbion */}
        <div
          style={{
            opacity:
              interpolate(frame, [186, 212], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) *
              interpolate(frame, [330, 356], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
          }}
        >
          <KineticText
            text="ZOOXANTHELLAE"
            delay={186}
            stagger={3}
            size={48}
            weight={700}
            color={COLORS.aqua}
            maxWidth={500}
            letterSpacing={-0.01}
          />
          <div style={{height: 14}} />
          <MonoLabel delay={204} color={COLORS.sandDim} size={14}>
            GANGGANG MIKROSKOPIS · DI DALAM JARINGAN KARANG
          </MonoLabel>
        </div>

        {/* Beat 3 — pertukaran */}
        <div
          style={{
            opacity: interpolate(frame, [356, 384], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {exchange.map((row, i) => (
            <div
              key={row.from}
              style={{
                marginBottom: 20,
                opacity: interpolate(frame, [360 + i * 14, 386 + i * 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  color: i === 0 ? COLORS.sand : COLORS.amber,
                }}
              >
                {row.from}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 20,
                  color: COLORS.foam,
                  marginTop: 6,
                  letterSpacing: "0.02em",
                }}
              >
                → {row.to}
              </div>
            </div>
          ))}
        </div>

        {/* Angka 90% */}
        <div
          style={{
            marginTop: 26,
            opacity: interpolate(frame, [430, 462], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{display: "flex", alignItems: "baseline", gap: 12}}>
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 116,
                fontWeight: 700,
                color: COLORS.amber,
                lineHeight: 0.9,
                textShadow: "0 0 60px rgba(243,183,94,0.25)",
              }}
            >
              90%
            </span>
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 16,
                letterSpacing: "0.18em",
                color: COLORS.sandDim,
              }}
            >
              ENERGI KARANG
            </span>
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 15,
              lineHeight: 1.5,
              letterSpacing: "0.04em",
              color: COLORS.sand,
              marginTop: 12,
              maxWidth: 440,
            }}
          >
            Diambil dari hasil fotosintesis simbion.
          </div>
          <div style={{marginTop: 10}}>
            <SourceTag size={12}>
              Sumber: NOAA Ocean Service — hingga 90% energi karang
            </SourceTag>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          bottom: 84,
          fontFamily: MONO_FONT,
          fontSize: 13,
          letterSpacing: "0.26em",
          color: COLORS.sandFaint,
          opacity: interpolate(frame, [46, 80], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        PENAMPANG MELINTANG · SATU POLIP
      </div>

      <Hud
        absoluteStart={870}
        chapter="S-03 · SIMBIOSIS"
        showRamsar
        notes={[
          {label: "SIMBION", value: "ZOOXANTHELLAE"},
          {label: "SUMBER ENERGI", value: "FOTOSINTESIS"},
        ]}
      />
    </AbsoluteFill>
  );
};
