import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, CONTENT_LEFT, DISPLAY_FONT, MONO_FONT, RAMSAR} from "../theme";
import {KineticText, MonoLabel} from "../components/KineticText";
import {Hud} from "../components/Hud";
import {Water} from "../components/Water";
import {CoralSVG} from "../components/Assets";
import {SourceTag} from "../components/Citation";

type FormField = {
  readonly label: string;
  readonly value: string;
};

/**
 * SCENE 2 — RAMSAR KODE C.
 * Diperlakukan sebagai "lembar klasifikasi" yang hidup: formulir data Ramsar
 * keluar dari kegelapan, lalu kode C membesar di titik tengah frame — objek
 * yang jadi jangkar transisi ke scene simbiosis.
 */
export const Scene2Ramsar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sheetIn = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const stamp = spring({
    frame: frame - 170,
    fps,
    config: {damping: 10, mass: 0.9, stiffness: 160},
    durationInFrames: 40,
  });

  // Kode C tumbuh jadi lingkaran penuh tepat sebelum cut.
  const grow = interpolate(frame, [260, 340], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Cincin putative terus berputar sampai akhir scene.
  const spin = interpolate(frame, [140, 560], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Garis pemindaian menyapu turun di atas lembar klasifikasi — berulang.
  const scanY = ((frame * 1.4) % 420) - 40;

  const fields: FormField[] = [
    {label: "WETLAND TYPE", value: RAMSAR.latin.toUpperCase()},
    {label: "KODE", value: RAMSAR.code},
    {label: "KELOMPOK", value: `${RAMSAR.category} · LAUT & PESISIR`},
  ];

  return (
    <AbsoluteFill>
      <Water depth={0.62} rays={false} snow />

      {/* siluet karang di dasar — kedalaman */}
      <div
        style={{
          position: "absolute",
          left: -80,
          bottom: -120,
          opacity: 0.3,
          filter: "brightness(0.45)",
        }}
      >
        <CoralSVG variant="staghorn" size={620} seed={4} />
      </div>
      <div
        style={{
          position: "absolute",
          right: -60,
          bottom: -160,
          opacity: 0.24,
          filter: "brightness(0.4)",
        }}
      >
        <CoralSVG variant="plate" size={560} seed={9} color={COLORS.sandDim} />
      </div>

      {/* ---------- Headline ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 172,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <KineticText
          text="KARANG ADALAH"
          delay={18}
          stagger={3}
          size={68}
          weight={700}
          color={COLORS.sand}
          align="center"
          letterSpacing={-0.02}
        />
        <KineticText
          text="LAHAN BASAH PESISIR"
          delay={32}
          stagger={3}
          size={68}
          weight={700}
          color={COLORS.sand}
          align="center"
          letterSpacing={-0.02}
          accentWords={["PESISIR"]}
          accentColor={COLORS.aqua}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 336,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [56, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <MonoLabel delay={56} color={COLORS.sandDim} size={16}>
          {RAMSAR.convention.toUpperCase()} · {RAMSAR.year} ·{" "}
          {RAMSAR.place.toUpperCase()}
        </MonoLabel>
      </div>

      {/* ---------- Kode C di titik tengah ---------- */}
      <div
        style={{
          position: "absolute",
          left: 960 - 145,
          top: 520 - 145,
          width: 290,
          height: 290,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: interpolate(stamp, [0, 1], [1.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${COLORS.aqua}77`,
            boxShadow: `0 0 60px ${COLORS.aqua}22`,
            scale: grow,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 22,
            borderRadius: "50%",
            border: `1px solid ${COLORS.sand}22`,
            scale: grow,
          }}
        />
        {/* cincin putus-putus yang berputar */}
        <div
          style={{
            position: "absolute",
            inset: -26,
            borderRadius: "50%",
            border: `1.5px dashed ${COLORS.amber}66`,
            rotate: `${spin}deg`,
          }}
        />
        <span
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 118,
            fontWeight: 700,
            color: COLORS.sand,
            lineHeight: 1,
            scale: grow * (1 + Math.sin(frame / 34) * 0.014),
            textShadow: "0 0 60px rgba(233,220,198,0.18)",
          }}
        >
          {RAMSAR.code}
        </span>
      </div>

      {/* ---------- Sub-tipe resmi ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 690,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [330, 360], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <MonoLabel delay={332} color={COLORS.aqua} size={15}>
          {RAMSAR.code} · {RAMSAR.latin.toUpperCase()}
        </MonoLabel>
      </div>

      {/* ---------- Baris status ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 732,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [380, 404], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <MonoLabel delay={382} color={COLORS.sandDim} size={15}>
          STATUS PERLINDUNGAN INTERNASIONAL
        </MonoLabel>
      </div>

      {/* ---------- Lembar klasifikasi ---------- */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 812,
          width: 920,
          padding: "26px 30px 24px",
          border: `1px solid ${COLORS.sand}1F`,
          borderRadius: 4,
          backgroundColor: "rgba(4,16,20,0.34)",
          opacity: sheetIn,
          translate: `${(1 - sheetIn) * -30}px 0px`,
          overflow: "hidden",
        }}
      >
        {/* Kurung sudut */}
        {[
          {left: 0, top: 0, dx: 1, dy: 1},
          {right: 0, top: 0, dx: -1, dy: 1},
          {left: 0, bottom: 0, dx: 1, dy: -1},
          {right: 0, bottom: 0, dx: -1, dy: -1},
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.left,
              right: c.right,
              top: c.top,
              bottom: c.bottom,
              width: 26,
              height: 26,
              borderLeft: c.dx > 0 ? `2px solid ${COLORS.aqua}99` : "none",
              borderRight: c.dx < 0 ? `2px solid ${COLORS.aqua}99` : "none",
              borderTop: c.dy > 0 ? `2px solid ${COLORS.aqua}99` : "none",
              borderBottom: c.dy < 0 ? `2px solid ${COLORS.aqua}99` : "none",
            }}
          />
        ))}

        {/* Garis pemindaian */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.aqua}88, transparent)`,
            opacity: interpolate(frame, [64, 100], [0, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        <div style={{display: "flex", gap: 0}}>
          {fields.map((field, i) => (
            <div
              key={field.label}
              style={{
                flex: 1,
                paddingRight: 24,
                borderLeft: i === 0 ? "none" : `1px solid ${COLORS.sand}22`,
                paddingLeft: i === 0 ? 0 : 28,
                opacity: interpolate(frame, [70 + i * 12, 96 + i * 12], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 19,
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  color: COLORS.sand,
                }}
              >
                {field.value}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.26em",
                  color: COLORS.sandFaint,
                  marginTop: 6,
                }}
              >
                {field.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop: 22}}>
          <SourceTag size={12}>
            Ramsar Convention Secretariat · Classification of Wetland Types —
            Rec. 4.7 (1990)
          </SourceTag>
        </div>
      </div>

      {/* Terjemahan resmi — memberi jeda baca sebelum cut ke scene simbiosis */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 962,
          opacity: interpolate(frame, [430, 464], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0px ${interpolate(
            interpolate(frame, [430, 464], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            [0, 1],
            [16, 0],
          )}px`,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 13,
            letterSpacing: "0.2em",
            color: COLORS.sandFaint,
          }}
        >
          TERJEMAHAN · CORAL REEFS = TERUMBU KARANG
        </div>
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 17,
            lineHeight: 1.5,
            letterSpacing: "0.04em",
            color: COLORS.sand,
            marginTop: 8,
          }}
        >
          Marine/Coastal = Lahan Basah Laut &amp; Pesisir
        </div>
      </div>

      <Hud
        absoluteStart={330}
        chapter="S-02 · RAMSAR"
        showRamsar
        chipStamp
        notes={[
          {label: "STATUS", value: "SITUS RAMSAR"},
          {label: "DOKUMEN", value: "LEMBAR KLASIFIKASI"},
        ]}
      />
    </AbsoluteFill>
  );
};
