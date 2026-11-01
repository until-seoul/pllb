import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, CONTENT_LEFT, DISPLAY_FONT, MONO_FONT, RAMSAR } from "../theme";
import { KineticText, MonoLabel } from "../components/KineticText";
import { Hud } from "../components/Hud";
import { Water } from "../components/Water";
import { CoralSVG } from "../components/Assets";
import { Explorer } from "../components/Explorer";
import { Citation } from "../components/Citation";

const STEPS = [
  { no: "01", label: "NURSERY", note: "fragmen ditumbuhkan" },
  { no: "02", label: "FRAGMEN", note: "dipotong & disambungkan" },
  { no: "03", label: "TRANSPLANTASI", note: "dipasang ke reef" },
  { no: "04", label: "KOLONISASI", note: "membentuk koloni baru" },
] as const;

const REFERENCES = [
  "Ramsar Convention Secretariat. Classification of Wetland Types (Rec. 4.7, 1990; amended by Res. VI.5) — Marine/Coastal, C: Coral reefs.",
  "Yuan, M.-H., et al. (2024). Exploring coral reef benefits: A systematic SEEA-driven review. Science of the Total Environment, 950.",
  "Eddy, T. D., et al. (2021). Global decline in capacity of coral reefs to provide ecosystem services. One Earth, 4(9).",
  "Rinkevich, B. (2021). Ecological engineering approaches in coral reef restoration. ICES Journal of Marine Science, 78(1).",
  "NOAA (2024). Fourth global coral bleaching event — ICRI & NOAA monitoring.",
  "NOAA Ocean Service. Coral reef ecosystem services — karang menopang ~25% spesies laut.",
] as const;

/**
 * SCENE 6 — HARAPAN & REFERENSI.
 * Pipeline restorasi (nursery → fragmen → transplantasi → kolonisasi) tumbuh
 * di atas satu tali jaring, lalu video ditutup dengan kalimat kunci dan daftar
 * pustaka.
 */
export const Scene6Hope: React.FC = () => {
  const frame = useCurrentFrame();

  const grow = interpolate(frame, [26, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const nurseryOpacity = interpolate(frame, [230, 264], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ropeLeft = 340;
  const ropeRight = ropeLeft + grow * 1440;
  const ropeY = 646;
  const sway = Math.sin(frame / 44) * 0.6;

  return (
    <AbsoluteFill>
      <Water depth={0.78} rays={false} snow />

      {/* ================= BAGIAN A — RESTORASI ================= */}
      <AbsoluteFill style={{ opacity: nurseryOpacity }}>
        <div
          style={{
            position: "absolute",
            left: CONTENT_LEFT,
            top: 196,
            width: 620,
          }}
        >
          <MonoLabel delay={4} color={COLORS.aqua} size={15}>
            RESTORASI · REKAYASA EKOLOGI
          </MonoLabel>
          <div style={{ height: 12 }} />
          <KineticText
            text="MEMULIHKAN KARANG"
            delay={12}
            stagger={3}
            size={72}
            weight={700}
            color={COLORS.sand}
            maxWidth={600}
            letterSpacing={-0.02}
          />
          <div style={{ height: 18 }} />
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 17,
              lineHeight: 1.6,
              letterSpacing: "0.03em",
              color: COLORS.sandDim,
              maxWidth: 560,
              opacity: interpolate(frame, [32, 58], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Fragmen karang ditumbuhkan di nurseri, disambungkan, lalu disebar
            ke perairan.
          </div>
        </div>

        {/* Tahapan pipeline */}
        {STEPS.map((step, i) => {
          const x = CONTENT_LEFT + i * 390;
          const on = interpolate(frame, [40 + i * 38, 66 + i * 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={step.no}
              style={{
                position: "absolute",
                left: x,
                top: 476,
                width: 320,
                opacity: on,
                translate: `0px ${(1 - on) * 16}px`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 13,
                  letterSpacing: "0.24em",
                  color: COLORS.amber,
                }}
              >
                {step.no}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: COLORS.foam,
                  marginTop: 6,
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  color: COLORS.sandFaint,
                  marginTop: 6,
                }}
              >
                {step.note}
              </div>
              {i < STEPS.length - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 336,
                    top: 16,
                    fontFamily: MONO_FONT,
                    fontSize: 24,
                    color: COLORS.aqua,
                    opacity: 0.7,
                  }}
                >
                  →
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Tali jaring nurseri */}
        <div
          style={{
            position: "absolute",
            left: ropeLeft,
            top: ropeY,
            width: Math.max(0, ropeRight - ropeLeft),
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.sandDim}, ${COLORS.sand})`,
            boxShadow: `0 0 18px ${COLORS.sand}44`,
            rotate: `${sway}deg`,
            transformOrigin: "0% 50%",
          }}
        />

        {/* Fragmen karang di sepanjang tali */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = ropeLeft + 60 + i * 160;
          const born = 30 + ((x - ropeLeft) / 1440) * 180;
          const on = interpolate(frame, [born, born + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 36,
                top: ropeY - 66,
                opacity: on,
                scale: interpolate(on, [0, 1], [0.35, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  output: "perceptual-scale",
                }),
                rotate: `${(i % 3) * 6 - 6 + sway * 2}deg`,
              }}
            >
              <CoralSVG
                variant={
                  i % 3 === 0 ? "staghorn" : i % 3 === 1 ? "brain" : "plate"
                }
                size={72}
                color={COLORS.coral}
                highlight={COLORS.coralLight}
                seed={i + 1}
              />
            </div>
          );
        })}

        {/* Penjelajah pulih di ujung tali */}
        <Explorer
          left={ropeLeft + grow * 1440 - 70}
          top={ropeY - 210}
          size={140}
          state="pulih"
          opacity={interpolate(frame, [170, 214], [0, 0.95], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          glow={1.3}
        />

      </AbsoluteFill>

      {/* Skala restorasi — bagian dari adegan MEMULIHKAN KARANG: duduk di kolom
          kanan sebaris headline, muncul saat kalimat "dari satu meter menjadi
          satu kilometer" diucapkan, lalu hilang sebelum kalimat penutup. */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 196,
          opacity:
            interpolate(frame, [110, 150], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            interpolate(frame, [380, 396], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 62,
              fontWeight: 700,
              color: COLORS.foam,
              lineHeight: 1,
            }}
          >
            1 m
          </span>
          <span style={{ fontFamily: MONO_FONT, fontSize: 26, color: COLORS.aqua }}>
            →
          </span>
          <span
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 62,
              fontWeight: 700,
              color: COLORS.aqua,
              lineHeight: 1,
            }}
          >
            1 km
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <Citation size={12} color={COLORS.sandFaint}>
            Skala restorasi bersifat ilustrasi. Pendekatan: Rinkevich (2021),
            ICES Journal of Marine Science.
          </Citation>
        </div>
      </div>

      {/* Gelembung naik — napas perairan */}
      {Array.from({ length: 12 }, (_, i) => {
        const speed = 1.1 + (i % 5) * 0.5;
        const y = 1080 - ((frame * speed + i * 97) % 1300);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${6 + ((i * 37) % 88)}%`,
              top: y,
              width: 5 + (i % 4) * 5,
              height: 5 + (i % 4) * 5,
              borderRadius: "50%",
              border: `1.5px solid ${COLORS.foam}55`,
              opacity: 0.3,
            }}
          />
        );
      })}

      {/* ================= BAGIAN B — KALIMAT PENUTUP ================= */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 268,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: interpolate(frame, [396, 428], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <KineticText
          text="TERUMBU KARANG"
          delay={398}
          stagger={4}
          size={78}
          weight={700}
          color={COLORS.sand}
          align="center"
          letterSpacing={-0.02}
        />
        <KineticText
          text="BUKAN LANGSKAP."
          delay={452}
          stagger={3}
          size={78}
          weight={700}
          color={COLORS.sand}
          align="center"
          letterSpacing={-0.02}
        />
        <KineticText
          text="DIA INFRASTRUKTUR. DIA LAHAN BASAH."
          delay={482}
          stagger={3}
          size={78}
          weight={700}
          color={COLORS.sand}
          align="center"
          maxWidth={1400}
          letterSpacing={-0.02}
          accentWords={["INFRASTRUKTUR", "LAHAN", "BASAH"]}
          accentColor={COLORS.amber}
        />
      </div>

      {/* ================= BAGIAN C — REFERENSI ================= */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: 676,
          width: 1300,
          opacity: interpolate(frame, [500, 524], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <MonoLabel delay={500} color={COLORS.aqua} size={13}>
          REFERENSI
        </MonoLabel>
        <div style={{ height: 14 }} />
        {REFERENCES.map((ref, i) => (
          <div
            key={i}
            style={{
              fontFamily: MONO_FONT,
              fontSize: 14,
              lineHeight: 1.5,
              letterSpacing: "0.015em",
              color: COLORS.sandDim,
              marginBottom: 7,
              opacity: interpolate(frame, [506 + i * 10, 522 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0px ${(1 - interpolate(frame, [506 + i * 10, 528 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })) * 10}px`,
            }}
          >
            {ref}
          </div>
        ))}
      </div>

      {/* Wordmark penutup */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          bottom: 84,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(frame, [546, 570], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 3,
            border: `1.5px solid ${COLORS.aqua}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: DISPLAY_FONT,
            fontSize: 26,
            fontWeight: 700,
            color: COLORS.sand,
          }}
        >
          {RAMSAR.code}
        </div>
        <div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 30,
              fontWeight: 600,
              color: COLORS.sand,
              lineHeight: 1.1,
            }}
          >
            Terumbu Karang
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              letterSpacing: "0.24em",
              color: COLORS.sandFaint,
              marginTop: 5,
            }}
          >
            LAHAN BASAH DI BAWAH LAUT
          </div>
        </div>
      </div>

      <Hud
        absoluteStart={2700}
        chapter="S-06 · HARAPAN"
        showRamsar
        notes={[
          { label: "METODE", value: "REKAYASA EKOLOGI" },
          { label: "SUMBER", value: "RINKEVICH 2021" },
        ]}
      />
    </AbsoluteFill>
  );
};
