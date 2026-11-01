import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, DISPLAY_FONT, MONO_FONT, RAMSAR, mixHex, rand } from "../theme";
import { KineticText, MonoLabel } from "../components/KineticText";
import { Hud } from "../components/Hud";
import { Explorer } from "../components/Explorer";

const DIVE_START = 70;

/**
 * Tanaman rawa (silhouette) yang berdiri di garis air. Diorama "dunia kering"
 * yang akan tinggalkan layar saat kamera menyelam.
 */
const Reeds: React.FC<{ y: number; scale: number }> = ({ y, scale }) => (
  <div
    style={{
      position: "absolute",
      left: -200,
      top: y - 160,
      width: 2320,
      height: 160,
      scale,
      transformOrigin: "50% 100%",
    }}
  >
    <svg viewBox="0 0 2320 160" width={2320} height={160}>
      {Array.from({ length: 26 }, (_, i) => {
        const x = 40 + i * 88 + rand(i) * 30;
        const h = 62 + rand(i * 2.1) * 88;
        const bend = (rand(i * 3.3) - 0.5) * 40;
        return (
          <g key={i} opacity={0.72 + rand(i * 5) * 0.28}>
            <path
              d={`M${x} 160 C${x + bend * 0.4} ${160 - h * 0.5} ${x + bend} ${160 - h * 0.8
                } ${x + bend * 1.4} ${160 - h}`}
              stroke={COLORS.ink}
              strokeWidth={2.4 + rand(i * 7) * 2.2}
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx={x + bend * 1.4}
              cy={160 - h - 5}
              rx={4.5}
              ry={11}
              fill={COLORS.ink}
              opacity={0.85}
            />
          </g>
        );
      })}
      {/* siluet ranting mangrove di kiri */}
      <path
        d="M0 160 C40 138 74 148 96 120 C112 100 140 98 158 116 C176 134 206 134 226 112"
        stroke={COLORS.ink}
        strokeWidth={7}
        fill="none"
        opacity={0.8}
        strokeLinecap="round"
      />
    </svg>
  </div>
);

/**
 * SCENE 1 — HOOK.
 * Frame pembuka adalah penampang kolom air: langit beige dan rawa di atas,
 * laut teal di bawah. Saat kamera menyelam, garis air menyapu ke atas dan
 * warna tipografi berbalik dari tinta di atas kertas menjadi pasir di dalam
 * laut. Teks hook menghilang sebelum kartu judul muncul — tidak ada dua
 * kalimat besar bertumpuk.
 */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const dive = interpolate(frame, [DIVE_START, DIVE_START + 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });

  const waterlineY = interpolate(dive, [0, 1], [560, -420]);
  const submerged = interpolate(dive, [0.2, 0.34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookColor = mixHex(COLORS.ink, COLORS.sand, submerged);
  const ruleWidth = interpolate(frame, [262, 302], [0, 460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Kamera berayun pelan — memberi rasa handheld underwater.
  const driftX = Math.sin(frame / 96) * 14;
  const driftY = Math.cos(frame / 128) * 9;

  const skyHeight = Math.max(0, waterlineY + 70);
  const waterTop = mixHex(COLORS.surface, COLORS.deep, dive);
  const waterBottom = mixHex(COLORS.mid, COLORS.abyss, dive);

  const hookOpacity =
    interpolate(frame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [64, 88], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const diveOpacity =
    interpolate(frame, [DIVE_START + 6, DIVE_START + 24], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [214, 240], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const titleOpacity = interpolate(frame, [236, 262], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.abyss }}>
      {/* ---------- Dunia di atas & di bawah air ---------- */}
      <AbsoluteFill
        style={{
          translate: `${driftX}px ${driftY}px`,
          scale: 1 + dive * 0.14,
          transformOrigin: "50% 40%",
        }}
      >
        {/* Langit + rawa */}
        <AbsoluteFill
          style={{
            height: skyHeight,
            background: `linear-gradient(180deg, #EFE3CE 0%, #DCC9A6 72%, #C9B48C 100%)`,
            opacity: interpolate(dive, [0, 0.55], [1, 0.55], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* matahari rendah */}
          <div
            style={{
              position: "absolute",
              left: 1290,
              top: 170,
              width: 190,
              height: 190,
              borderRadius: "50%",
              background: `radial-gradient(circle, #FFF6E0 0%, #F4DFB0 42%, rgba(244,223,176,0) 72%)`,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -30,
              height: 120,
              background: `linear-gradient(180deg, rgba(201,180,140,0) 0%, #C9B48C 88%)`,
            }}
          />
        </AbsoluteFill>

        <Reeds y={waterlineY} scale={1 + dive * 0.18} />

        {/* Air */}
        <AbsoluteFill
          style={{
            top: waterlineY,
            height: Math.max(0, 1080 - waterlineY),
            background: `linear-gradient(180deg, ${waterTop} 0%, ${waterBottom} 100%)`,
          }}
        >
          {/* Sinar matahari menembus permukaan */}
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${2 + i * 21}%`,
                top: -40,
                width: 120 - i * 8,
                height: 700,
                background: `linear-gradient(180deg, ${COLORS.foam}26 0%, transparent 82%)`,
                rotate: `${-10 + i * 5}deg`,
                filter: "blur(14px)",
                opacity: interpolate(dive, [0, 0.45], [0.85, 0.08], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${COLORS.foam}66, transparent)`,
              opacity: 0.7,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Gelembung naik saat menyelam */}
      {Array.from({ length: 18 }, (_, i) => {
        const speed = 1.6 + rand(i * 2.7) * 3.4;
        const y = 1080 - ((frame * speed + rand(i * 4.4) * 1400) % 1500);
        const size = 5 + rand(i * 6.1) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${4 + rand(i * 3.9) * 92}%`,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1.5px solid ${COLORS.foam}77`,
              opacity: interpolate(dive, [0, 0.2, 0.9], [0, 0.75, 0.25], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}

      {/* ---------- Teks hook ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 92,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: hookOpacity,
          translate: `0px ${interpolate(frame, [40, 70], [0, -46], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px`,
        }}
      >
        <KineticText
          text="LAHAN BASAH"
          delay={0}
          stagger={4}
          size={104}
          weight={700}
          color={hookColor}
          align="center"
          letterSpacing={-0.02}
        />
        <KineticText
          text="BUKAN HANYA RAWA."
          delay={26}
          stagger={4}
          size={104}
          weight={700}
          color={hookColor}
          align="center"
          letterSpacing={-0.02}
          accentWords={["RAWA"]}
          accentColor={mixHex(COLORS.danger, COLORS.bleach, submerged)}
          strikeWords={["RAWA"]}
          strikeDelay={44}
          strikeColor={mixHex(COLORS.danger, COLORS.bleach, submerged)}
        />
      </div>

      {/* ---------- Teks saat menyelam ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          display: "flex",
          justifyContent: "center",
          opacity: diveOpacity,
        }}
      >
        <KineticText
          text="SEBAGIAN BERDIRI DI DASAR LAUT"
          delay={DIVE_START + 6}
          stagger={3}
          size={58}
          weight={600}
          color={COLORS.sand}
          align="center"
          maxWidth={1300}
          letterSpacing={-0.01}
          accentWords={["DASAR", "LAUT"]}
          accentColor={COLORS.aqua}
        />
      </div>

      {/* ---------- Kartu judul ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 392,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: titleOpacity,
          translate: `0px ${interpolate(frame, [186, 216], [26, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px`,
        }}
      >
        <MonoLabel delay={192} color={COLORS.aqua} size={17}>
          RAMSAR · KODE {RAMSAR.code} · LAHAN BASAH LAUT &amp; PESISIR
        </MonoLabel>

        <KineticText
          text="TERUMBU KARANG"
          delay={198}
          stagger={5}
          size={132}
          weight={700}
          color={COLORS.sand}
          align="center"
          letterSpacing={-0.03}
          rise={34}
        />

        <div
          style={{
            width: ruleWidth,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.amber} 50%, transparent)`,
          }}
        />

        <KineticText
          text="Lahan Basah di Bawah Laut"
          delay={218}
          stagger={3}
          size={42}
          weight={400}
          color={COLORS.foam}
          align="center"
          fontFamily={DISPLAY_FONT}
        />

        {/* Kurung sudut ala lembar survei */}
        <svg
          width={960}
          height={40}
          viewBox="0 0 960 40"
          style={{ overflow: "visible", marginTop: 6 }}
        >
          {[
            { x: 0, dir: 1 },
            { x: 960, dir: -1 },
          ].map((c) => (
            <path
              key={c.x}
              d={`M${c.x + c.dir * 34} 4 L${c.x + c.dir * 34} 36 L${c.x + c.dir * 4} 36`}
              fill="none"
              stroke={COLORS.aqua}
              strokeWidth={2}
              strokeOpacity={0.55}
              strokeDasharray={70}
              strokeDashoffset={
                70 -
                interpolate(frame, [200, 250], [0, 70], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              }
            />
          ))}
        </svg>
      </div>

      {/* Penjelajah — sel zooxanthella yang akan jadi mata kamera */}
      <Explorer
        left={1396}
        top={628}
        size={120}
        opacity={interpolate(frame, [192, 224], [0, 0.95], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        glow={1.2}
      />

      <Hud
        absoluteStart={0}
        chapter="S-01 · HOOK"
        notes={[
          { label: "POSISI KAMERA", value: "PERMUKAAN" },
          { label: "KONDISI LAUT", value: "TENANG" },
        ]}
      />

      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 84,
          fontFamily: MONO_FONT,
          fontSize: 13,
          letterSpacing: "0.26em",
          color: COLORS.sandFaint,
          opacity: interpolate(frame, [60, 84], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        SURVEI 001 · PENELUSURAN
      </div>
    </AbsoluteFill>
  );
};
