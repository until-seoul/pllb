import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, CONTENT_LEFT, DISPLAY_FONT, MONO_FONT, mixHex, rand} from "../theme";
import {KineticText, MonoLabel} from "../components/KineticText";
import {Hud} from "../components/Hud";
import {Water} from "../components/Water";
import {CoralSVG, PolypSVG} from "../components/Assets";
import {Explorer} from "../components/Explorer";
import {SourceTag} from "../components/Citation";

/**
 * Diagram batang "kapasitas terumbu karang menyediakan jasa ekosistem".
 * Indeks relatif dengan 1950-an = 100. Titik akhir (100 → 50) mengikuti
 * Eddy et al. (2021); nilai di antaranya digambar sebagai ilustrasi.
 */
const CAPACITY_BARS = [
  {label: "1950-an", value: 100},
  {label: "1980-an", value: 78},
  {label: "2000-an", value: 64},
  {label: "kini", value: 50},
] as const;

const CHART_MAX_HEIGHT = 290;

/** Kolom kiri scene ini: x = 320–940. Kolom kanan: x = 1010–1710. */
const COL_W = 620;
const RIGHT = 1010;
const RIGHT_W = 700;

const CapacityChart: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const last = CAPACITY_BARS.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        left: RIGHT,
        top: 300,
        width: RIGHT_W,
        opacity: interpolate(frame, [delay, delay + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 13,
          letterSpacing: "0.22em",
          color: COLORS.sandDim,
        }}
      >
        KAPASITAS KARANG MENYEDIAKAN JASA EKOSISTEM
      </div>

      <div
        style={{
          position: "relative",
          height: CHART_MAX_HEIGHT + 94,
          marginTop: 22,
          display: "flex",
          alignItems: "flex-end",
          gap: 44,
          borderBottom: `1px solid ${COLORS.sand}33`,
        }}
      >
        {/* Garis acuan: 1950-an = 100 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: CHART_MAX_HEIGHT,
            borderTop: `1px dashed ${COLORS.sand}44`,
          }}
        >
          <span
            style={{
              position: "absolute",
              right: 0,
              top: -24,
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.18em",
              color: COLORS.sandFaint,
            }}
          >
            1950 = 100
          </span>
        </div>

        {CAPACITY_BARS.map((bar, i) => {
          const grow = spring({
            frame: frame - (delay + 14 + i * 18),
            fps,
            config: {damping: 15, mass: 0.7, stiffness: 130},
            durationInFrames: 32,
          });
          const height = (bar.value / 100) * CHART_MAX_HEIGHT * grow;
          const isLast = i === last;

          return (
            <div
              key={bar.label}
              style={{
                width: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 20,
                  fontWeight: 600,
                  color: isLast ? COLORS.danger : COLORS.sand,
                  marginBottom: 8,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(bar.value * grow)}
              </div>
              <div
                style={{
                  width: 120,
                  height,
                  borderRadius: "3px 3px 0 0",
                  background: isLast
                    ? `linear-gradient(180deg, ${COLORS.danger} 0%, ${COLORS.danger}55 100%)`
                    : `linear-gradient(180deg, ${COLORS.aqua} 0%, ${COLORS.aqua}44 100%)`,
                  boxShadow: isLast ? `0 0 26px ${COLORS.danger}44` : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{display: "flex", gap: 44, marginTop: 12}}>
        {CAPACITY_BARS.map((bar) => (
          <div
            key={bar.label}
            style={{
              width: 120,
              textAlign: "center",
              fontFamily: MONO_FONT,
              fontSize: 13,
              letterSpacing: "0.16em",
              color: COLORS.sandFaint,
            }}
          >
            {bar.label}
          </div>
        ))}
      </div>

      <div style={{marginTop: 20}}>
        <SourceTag size={12}>
          Indeks relatif, 1950-an = 100 · Titik akhir: Eddy et al. (2021), One
          Earth · Nilai di antaranya: ilustrasi
        </SourceTag>
      </div>
    </div>
  );
};

/**
 * SCENE 5 — ANCAMAN.
 *
 * Tiga lapis storytelling yang dipisah tegas supaya tidak pernah bertumpuk:
 *   1. Slot headline (kiri atas) — "AIR LAUT MEMANAS" lalu "MEMUTIH".
 *      Kedua state saling memberi tempat, bukan saling menimpa.
 *   2. Slot penjelasan — penjelasan pemutihan, muncul setelah headline kedua.
 *   3. Slot instrumen — kolom kanan: strip suhu, lalu grafik kapasitas.
 * Di bawahnya, karang yang memutih bertahap dengan sel yang keluar dari
 * jaringan, lalu angka 84% sebagai penutupscene.
 */
export const Scene5Threat: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------- 1. Pemutihan karang ---------- */
  const bleach = interpolate(frame, [150, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  const coralColor = mixHex(COLORS.coral, COLORS.bleach, bleach);
  const coralLight = mixHex(COLORS.coralLight, "#FBF7EC", bleach);

  /* ---------- Strip suhu ---------- */
  const gauge = interpolate(frame, [40, 170], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gaugeColor =
    gauge < 0.55 ? COLORS.aqua : gauge < 0.78 ? COLORS.amber : COLORS.danger;

  /* ---------- Cincin 84% ---------- */
  const ringProgress = interpolate(frame, [400, 480], [0, 0.84], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const ringLen = 2 * Math.PI * 58;

  /* ---------- State headline ---------- */
  const stateA = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * interpolate(frame, [118, 142], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stateB = interpolate(frame, [168, 192], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------- Kabut merah saat stres ---------- */
  const heat = interpolate(frame, [110, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Water depth={0.72} rays={false} snow />

      {/* Kabut panas — denyut pelan, memberi tekanan tanpa menutupi teks */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 42% 62%, ${COLORS.danger}22 0%, transparent 58%)`,
          opacity: heat * (0.55 + Math.sin(frame / 22) * 0.18),
        }}
      />

      {/* ================= SLOT 1 — HEADLINE ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 176,
          width: COL_W,
          height: 130,
        }}
      >
        {/* State A — "AIR LAUT MEMANAS" */}
        <div style={{opacity: stateA}}>
          <MonoLabel delay={4} color={COLORS.aqua} size={15}>
            STRES PANAS · SUHU LAUT NAIK
          </MonoLabel>
          <div style={{height: 14}} />
          <KineticText
            text="AIR LAUT MEMANAS"
            delay={14}
            stagger={4}
            size={70}
            weight={700}
            color={COLORS.sand}
            maxWidth={COL_W}
            letterSpacing={-0.02}
          />
        </div>

        {/* State B — "MEMUTIH" (hand-off bersih: A sudah lenyap sebelum B masuk) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: COL_W,
            opacity: stateB,
            translate: `0px ${interpolate(stateB, [0, 1], [26, 0])}px`,
          }}
        >
          <MonoLabel delay={168} color={COLORS.danger} size={15}>
            AKIBAT · SIMBIOSIS TERPUTUS
          </MonoLabel>
          <div style={{height: 10}} />
          {/* "BLEACHING" duduk di samping "MEMUTIH", bukan di bawahnya —
              supaya kata ini tidak pernah menabrak kalimat penjelasan. */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 22,
            }}
          >
            <KineticText
              text="MEMUTIH"
              delay={178}
              stagger={4}
              size={88}
              weight={700}
              color={COLORS.bleach}
              maxWidth={COL_W}
              letterSpacing={-0.03}
              rise={30}
            />
            <div style={{paddingBottom: 12}}>
              <KineticText
                text="BLEACHING"
                delay={200}
                stagger={2}
                size={28}
                weight={600}
                color={COLORS.amber}
                letterSpacing={0.14}
                rise={12}
                rotateIn={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SLOT 2 — PENJELASAN ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 320,
          width: 560,
          opacity: interpolate(frame, [212, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0px ${interpolate(
            interpolate(frame, [212, 240], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            [0, 1],
            [18, 0],
          )}px`,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 18,
            lineHeight: 1.6,
            letterSpacing: "0.03em",
            color: COLORS.sandDim,
          }}
        >
          Zooxanthellae keluar dari jaringan karang.
          <br />
          Simbiosis terputus — lalu warna menghilang.
        </div>
      </div>

      {/* ================= SLOT 3 — KARTU PENJELAJAH ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 396,
          width: 320,
          height: 128,
          border: `1px solid ${COLORS.sand}26`,
          borderRadius: 6,
          backgroundColor: "rgba(4,16,20,0.5)",
          opacity: interpolate(frame, [232, 264], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Explorer
          left={CONTENT_LEFT + 14}
          top={396 + 18}
          size={92}
          state="memutih"
          opacity={interpolate(frame, [244, 280], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          glow={0.9}
        />
        <div
          style={{
            position: "absolute",
            left: 122,
            top: 30,
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
            PENJELAJAH
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: COLORS.bleach,
              marginTop: 8,
            }}
          >
            MEMUTIH
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.14em",
              color: COLORS.danger,
              marginTop: 8,
            }}
          >
            ZOOXANTHELLAE KELUAR
          </div>
        </div>
      </div>

      {/* ================= KARANG YANG MUTIH ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 548,
          width: COL_W,
          height: 280,
        }}
      >
        <PolypSVG
          size={270}
          tissue={mixHex(COLORS.sandDim, COLORS.bleach, bleach * 0.6)}
          cavity={COLORS.deep}
          algae={COLORS.amber}
          algaeRatio={1 - bleach}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            scale: interpolate(frame, [0, 300], [0.94, 1.06], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
          }}
        />

        {/* bercak pemutihan yang muncul satu per satu */}
        {Array.from({length: 7}, (_, i) => {
          const on = interpolate(frame, [170 + i * 15, 200 + i * 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = 26 + rand(i * 4.3) * 180;
          const y = 26 + rand(i * 6.1) * 190;
          const r = 22 + rand(i * 8.7) * 34;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS.bleach} 0%, rgba(242,236,222,0) 70%)`,
                opacity: on * 0.9,
              }}
            />
          );
        })}

        <div style={{position: "absolute", left: 300, top: 14}}>
          <CoralSVG
            variant="staghorn"
            size={250}
            color={coralColor}
            highlight={coralLight}
            seed={8}
          />
        </div>
      </div>

      {/* Zooxanthellae yang keluar dari jaringan karang, melayang ke kanan */}
      {Array.from({length: 14}, (_, i) => {
        const drift = interpolate(frame, [180 + i * 6, 330 + i * 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x0 = 400 + rand(i * 3.3) * 140;
        const y0 = 650 + rand(i * 5.9) * 90;
        const dx = 260 + rand(i * 7.1) * 180;
        const dy = 90 + rand(i * 2.7) * 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + drift * dx,
              top: y0 - drift * dy,
              width: 15,
              height: 15,
              borderRadius: "50%",
              backgroundColor: COLORS.amber,
              opacity:
                (1 - bleach) *
                interpolate(drift, [0, 0.25, 1], [0.9, 0.55, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              boxShadow: `0 0 14px ${COLORS.amber}88`,
            }}
          />
        );
      })}

      {/* Gelombang panas naik dari karang */}
      {Array.from({length: 6}, (_, i) => {
        const t = ((frame * 0.8 + i * 22) % 130) / 130;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 700 + i * 40,
              top: 560 - t * 120,
              width: 60,
              height: 120,
              borderRadius: "50%",
              background: `linear-gradient(180deg, ${COLORS.danger}00 0%, ${COLORS.danger}22 100%)`,
              filter: "blur(14px)",
              opacity: (1 - t) * 0.8,
            }}
          />
        );
      })}

      {/* ================= CINCIN 84% ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 852,
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: interpolate(frame, [392, 424], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={132} height={132} viewBox="0 0 140 140">
          <circle
            cx={70}
            cy={70}
            r={58}
            fill="none"
            stroke={`${COLORS.sand}1F`}
            strokeWidth={8}
          />
          <circle
            cx={70}
            cy={70}
            r={58}
            fill="none"
            stroke={COLORS.danger}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={ringLen}
            strokeDashoffset={ringLen * (1 - ringProgress)}
            transform="rotate(-90 70 70)"
            style={{filter: `drop-shadow(0 0 8px ${COLORS.danger}88)`}}
          />
          <text
            x={70}
            y={80}
            textAnchor="middle"
            fill={COLORS.bleach}
            style={{fontFamily: DISPLAY_FONT, fontSize: 36, fontWeight: 700}}
          >
            {Math.round(ringProgress * 100)}%
          </text>
        </svg>
        <div style={{maxWidth: 400}}>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.22em",
              color: COLORS.sandFaint,
            }}
          >
            AREA KARANG DUNIA
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 17,
              lineHeight: 1.5,
              color: COLORS.sand,
              marginTop: 8,
            }}
          >
            mengalami stres panas tingkat pemutihan pada 2024
          </div>
          <div style={{marginTop: 10}}>
            <SourceTag size={11}>ICRI &amp; NOAA, April 2024</SourceTag>
          </div>
        </div>
      </div>

      {/* ================= KOLOM KANAN — INSTRUMEN ================= */}
      {/* Strip suhu */}
      <div
        style={{
          position: "absolute",
          left: RIGHT,
          top: 206,
          width: RIGHT_W,
          opacity: interpolate(frame, [30, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO_FONT,
            fontSize: 12,
            letterSpacing: "0.24em",
            color: COLORS.sandFaint,
            marginBottom: 10,
          }}
        >
          <span>ΔT SUHU PERMUKAAN</span>
          <span style={{color: gaugeColor}}>+{(gauge * 1.6).toFixed(1)} °C</span>
        </div>
        <div
          style={{
            position: "relative",
            height: 10,
            borderRadius: 5,
            backgroundColor: `${COLORS.sand}14`,
          }}
        >
          <div
            style={{
              width: `${gauge * 100}%`,
              height: "100%",
              borderRadius: 5,
              background: `linear-gradient(90deg, ${COLORS.aqua}, ${gaugeColor})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "62.5%",
              top: -8,
              width: 2,
              height: 26,
              backgroundColor: COLORS.danger,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 12,
          }}
        >
          <span
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.2em",
              color: COLORS.danger,
            }}
          >
            ▲ AMBANG PEMUTIHAN +1,0 °C
          </span>
          <SourceTag size={11}>
            NOAA Coral Reef Watch — anomali 1 °C menetap 4–8 minggu
          </SourceTag>
        </div>
      </div>

      {/* Grafik batang */}
      <CapacityChart delay={330} />

      {/* Kalimat penutup scene */}
      <div
        style={{
          position: "absolute",
          left: RIGHT,
          top: 838,
          width: RIGHT_W,
          opacity: interpolate(frame, [500, 534], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 17,
            lineHeight: 1.6,
            letterSpacing: "0.04em",
            color: COLORS.sand,
          }}
        >
          Setiap derajat yang naik, karang kehilangan warna.
        </div>
      </div>

      <Hud
        absoluteStart={2130}
        chapter="S-05 · ANCAMAN"
        showRamsar
        notes={[
          {label: "STRES", value: "MEMUTIH (BLEACHING)"},
          {label: "KAPASITAS JASA", value: "−50% sejak 1950-an"},
        ]}
      />
    </AbsoluteFill>
  );
};
