import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, CONTENT_LEFT, DISPLAY_FONT, MONO_FONT, rand } from "../theme";
import { KineticText, MonoLabel } from "../components/KineticText";
import { Hud } from "../components/Hud";
import { Water } from "../components/Water";
import { CoralSVG, FishSchool, FishSVG } from "../components/Assets";
import { Citation, SourceTag } from "../components/Citation";

const PANEL = { x: 920, y: 170, w: 904, h: 740 };
const HORIZON = 250;

/**
 * Gelombang pada penampang panel: amplitudo tetap di laut terbuka, lalu
 * menyusut begitu melewati puncak karang. Kurvanya dihitung ulang tiap frame.
 */
const buildWave = (frame: number) => {
  const points: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * PANEL.w;
    const amp = x < 340 ? 60 : 18 + 42 * Math.exp(-(x - 340) / 150);
    const theta = (x / 150) * Math.PI * 2 - (frame / 34) * Math.PI * 2;
    const y = HORIZON + amp * Math.sin(theta);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
};

const FLOOR_PATH =
  "M0 740 L0 486 C140 482 300 468 420 404 C490 366 545 344 600 362 C700 396 780 466 860 476 C880 478 892 476 904 472 L904 740 Z";

/**
 * SCENE 4 — BIODIVERSITAS & PERTAHANAN PANTAI.
 * Bagian A: terumbu sebagai kota bawah laut, dengan dua angka dari NOAA.
 * Bagian B: penampang air pantai di panel instrumen, menunjukkan karang
 * meredam gelombang sebelum mencapai daratan.
 */
export const Scene4Defense: React.FC = () => {
  const frame = useCurrentFrame();

  const reefOpacity = interpolate(frame, [380, 430], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crossOpacity = interpolate(frame, [392, 442], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const speciesCount = Math.round(
    interpolate(frame, [100, 260], [0, 1000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const wave = buildWave(frame);
  const energy = interpolate(frame, [470, 560], [1, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const benefits = [
    "MEREDAM GELOMBANG",
    "MENJAGA PESISIR",
    "MENOPANG MATA RANTAI",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.abyss }}>
      {/* ================= BAGIAN A — KOTA BAWAH LAUT ================= */}
      <AbsoluteFill style={{ opacity: reefOpacity }}>
        <Water depth={0.46} snow />

        <div style={{ position: "absolute", left: -60, bottom: -150 }}>
          <CoralSVG variant="staghorn" size={620} seed={2} />
        </div>
        <div style={{ position: "absolute", left: 520, bottom: -190, opacity: 0.92 }}>
          <CoralSVG variant="brain" size={560} seed={6} />
        </div>
        <div style={{ position: "absolute", right: -40, bottom: -140, opacity: 0.9 }}>
          <CoralSVG variant="staghorn" size={640} seed={11} />
        </div>

        <FishSchool
          count={9}
          size={86}
          seed={5}
          style={{ left: 240, top: 300, right: 240, bottom: 300 }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 150,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <KineticText
            text="TERUMBU KARANG ADALAH KOTA"
            delay={10}
            stagger={4}
            size={88}
            weight={700}
            color={COLORS.sand}
            align="center"
            maxWidth={860}
            letterSpacing={-0.02}
          />
        </div>

        {/* Dua angka dari NOAA — diberi jarak dari headline dan digeser
            ke kanan agar tidak menabrak kata terakhir judul. */}
        <div
          style={{
            position: "absolute",
            left: CONTENT_LEFT,
            right: 160,
            top: 424,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {[
            {
              value: speciesCount.toLocaleString("id-ID"),
              label: "SPESIES DALAM 1 m³ KARANG",
              color: COLORS.foam,
              delay: 46,
            },
            {
              value: "25%",
              label: "SPESIES LAUT BERGANTUNG PADA KARANG",
              color: COLORS.aqua,
              delay: 86,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                width: 520,
                opacity: interpolate(frame, [stat.delay, stat.delay + 26], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: `0px ${(1 - interpolate(frame, [stat.delay, stat.delay + 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })) * 26}px`,
              }}
            >
              <div
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontSize: 132,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 0.95,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 19,
                  letterSpacing: "0.16em",
                  color: COLORS.sand,
                  marginTop: 10,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Baris spesies yang muncul satu per satu */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 686,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {Array.from({ length: 14 }, (_, i) => {
            const on = interpolate(frame, [130 + i * 8, 146 + i * 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: on,
                  scale: interpolate(on, [0, 1], [0.3, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    output: "perceptual-scale",
                  }),
                  rotate: `${(rand(i * 2.1) - 0.5) * 18}deg`,
                }}
              >
                <FishSVG
                  size={42}
                  seed={i + 3}
                  color={i % 3 === 0 ? COLORS.aqua : COLORS.amber}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 780,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SourceTag size={13}>
            Sumber: NOAA Ocean Service — hingga 1.000 spesies per m³ karang ·
            karang menopang ~25% spesies laut
          </SourceTag>
        </div>
      </AbsoluteFill>

      {/* ================= BAGIAN B — PANEL PENAMPANG PANTAI ================= */}
      <AbsoluteFill style={{ opacity: crossOpacity }}>
        <Water depth={0.88} rays={false} snow caustics={false} />

        {/* ---------- Kolom kiri ---------- */}
        <div
          style={{
            position: "absolute",
            left: CONTENT_LEFT,
            top: 210,
            width: 540,
          }}
        >
          <MonoLabel delay={400} color={COLORS.aqua} size={15}>
            PENAMPANG PERAIRAN PANTAI
          </MonoLabel>
          <div style={{ height: 14 }} />
          <KineticText
            text="PERTAHANAN PANTAI"
            delay={406}
            stagger={3}
            size={72}
            weight={700}
            color={COLORS.sand}
            maxWidth={520}
            letterSpacing={-0.02}
          />
          <div style={{ height: 26 }} />
          {benefits.map((benefit, i) => {
            const o = interpolate(frame, [466 + i * 12, 494 + i * 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={benefit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 12,
                  opacity: o,
                  translate: `${(1 - o) * -24}px 0px`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: COLORS.aqua,
                    boxShadow: `0 0 12px ${COLORS.aqua}88`,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 19,
                    letterSpacing: "0.12em",
                    color: COLORS.foam,
                  }}
                >
                  {benefit}
                </span>
              </div>
            );
          })}

          {/* Instrumen gelombang */}
          <div
            style={{
              marginTop: 30,
              padding: "22px 26px 20px",
              border: `1px solid ${COLORS.sand}26`,
              borderRadius: 6,
              backgroundColor: "rgba(4,16,20,0.5)",
              opacity: interpolate(frame, [456, 494], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `${(1 - interpolate(frame, [456, 498], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })) * 36}px 0px`,
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 12,
                letterSpacing: "0.26em",
                color: COLORS.sandFaint,
              }}
            >
              TINGGI GELOMBANG
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontSize: 48,
                  fontWeight: 700,
                  color: COLORS.sand,
                }}
              >
                2,4 m
              </span>
              <span style={{ fontFamily: MONO_FONT, fontSize: 24, color: COLORS.aqua }}>
                →
              </span>
              <span
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontSize: 48,
                  fontWeight: 700,
                  color: COLORS.aqua,
                }}
              >
                0,7 m
              </span>
            </div>

            <div
              style={{
                marginTop: 20,
                fontFamily: MONO_FONT,
                fontSize: 12,
                letterSpacing: "0.24em",
                color: COLORS.sandFaint,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>ENERGI GELOMBANG</span>
              <span style={{ color: COLORS.aqua }}>−72%</span>
            </div>
            <div
              style={{
                marginTop: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: `${COLORS.sand}1A`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${energy * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.sand})`,
                }}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <Citation size={12} color={COLORS.sandFaint}>
                Kurva dan angka bersifat ilustrasi. Tinjauan manfaat: Yuan et
                al. (2024), Science of the Total Environment.
              </Citation>
            </div>
          </div>
        </div>

        {/* ---------- Panel instrumen penampang ---------- */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: 6,
            border: `1px solid ${COLORS.aqua}33`,
            overflow: "hidden",
            boxShadow: "0 24px 70px rgba(2,10,14,0.55)",
          }}
        >
          <svg
            viewBox={`0 0 ${PANEL.w} ${PANEL.h}`}
            width={PANEL.w}
            height={PANEL.h}
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient id="panel-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22505A" />
                <stop offset="100%" stopColor="#17383F" />
              </linearGradient>
              <linearGradient id="panel-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14565C" />
                <stop offset="60%" stopColor="#0C303A" />
                <stop offset="100%" stopColor="#062028" />
              </linearGradient>
              <linearGradient id="panel-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C5E55" />
                <stop offset="100%" stopColor="#16282E" />
              </linearGradient>
            </defs>

            <rect x={0} y={0} width={PANEL.w} height={PANEL.h} fill="url(#panel-sky)" />

            {/* permukaan gelombang + air */}
            <path d={`${wave} L${PANEL.w} ${PANEL.h} L0 ${PANEL.h} Z`} fill="url(#panel-water)" />
            <path d={wave} fill="none" stroke={COLORS.foam} strokeWidth={2.5} strokeOpacity={0.8} />

            {/* buih di puncak karang */}
            {Array.from({ length: 16 }, (_, i) => {
              const t = ((frame * 0.9 + i * 13) % 90) / 90;
              return (
                <circle
                  key={i}
                  cx={600 + t * 130 + rand(i) * 18}
                  cy={HORIZON + 40 - t * 70}
                  r={2 + rand(i * 3.3) * 5}
                  fill={COLORS.foam}
                  opacity={0.55 * (1 - t)}
                />
              );
            })}

            {/* dasar laut */}
            <path d={FLOOR_PATH} fill="url(#panel-floor)" />
            <path d={FLOOR_PATH} fill="none" stroke={COLORS.sandDim} strokeWidth={1.5} strokeOpacity={0.4} />

            {/* karang di puncak */}
            <g opacity={0.95}>
              <path
                d="M548 372 C566 344 586 336 600 348 C616 362 632 360 644 344"
                stroke={COLORS.coral}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M614 358 C634 328 656 320 670 334 C684 348 702 346 714 328"
                stroke={COLORS.coralLight}
                strokeWidth={9}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M700 356 C718 332 738 326 750 338"
                stroke={COLORS.coral}
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* label bentang laut */}
            {[
              { x: 24, y: 228, label: "LAUT TERBUKA" },
              { x: 552, y: 314, label: "PUNCAK KARANG" },
              { x: 796, y: 452, label: "PANTAI" },
            ].map((tag) => (
              <text
                key={tag.label}
                x={tag.x}
                y={tag.y}
                fill={COLORS.sandDim}
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 15,
                  letterSpacing: "0.2em",
                }}
              >
                {tag.label}
              </text>
            ))}
          </svg>

          {/* Kurung sudut panel */}
          {[
            { left: 0, top: 0, dx: 1, dy: 1 },
            { right: 0, top: 0, dx: -1, dy: 1 },
            { left: 0, bottom: 0, dx: 1, dy: -1 },
            { right: 0, bottom: 0, dx: -1, dy: -1 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.left,
                right: c.right,
                top: c.top,
                bottom: c.bottom,
                width: 30,
                height: 30,
                borderLeft: c.dx > 0 ? `2px solid ${COLORS.aqua}` : "none",
                borderRight: c.dx < 0 ? `2px solid ${COLORS.aqua}` : "none",
                borderTop: c.dy > 0 ? `2px solid ${COLORS.aqua}` : "none",
                borderBottom: c.dy < 0 ? `2px solid ${COLORS.aqua}` : "none",
                opacity: interpolate(frame, [400, 450], [0, 0.9], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              left: 22,
              top: 18,
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.26em",
              color: COLORS.aqua,
              opacity: 0.85,
            }}
          >
            SKEMA · GELOMBANG × KARANG
          </div>
        </div>
      </AbsoluteFill>

      <Hud
        absoluteStart={1380}
        chapter="S-04 · PERTAHANAN"
        showRamsar
        notes={[
          { label: "FUNGSI", value: "MEREDAM GELOMBANG" },
          { label: "SUMBER", value: "YUAN ET AL. 2024" },
        ]}
      />
    </AbsoluteFill>
  );
};
