import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {
  COLORS,
  DISPLAY_FONT,
  MONO_FONT,
  RAMSAR,
  getDepthState,
} from "../theme";

export type FieldNote = {
  readonly label: string;
  readonly value: string;
};

export type HudProps = {
  /** Frame absolut saat scene ini dimulai — dipakai untuk membaca kedalaman. */
  readonly absoluteStart: number;
  readonly chapter: string;
  readonly notes: readonly FieldNote[];
  readonly showRamsar?: boolean;
  /** Hanya scene 2 yang "mematuhi" chip kategori. */
  readonly chipStamp?: boolean;
};

const RAIL_X = 108;
const RAIL_TOP = 186;
const RAIL_BOTTOM = 912;
const RAIL_SPAN = RAIL_BOTTOM - RAIL_TOP;

const TICKS = [0, 0.25, 0.5, 0.75, 1];

const METER_LABELS = ["0", "10", "20", "30", "40"];
const MICRO_LABELS = ["0.0", "0.1", "0.2", "0.3", "0.4"];

/**
 * HUD "lembar survei" — instrumen permanen yang mengapit seluruh video:
 * kolom kedalaman di kiri, chip kategori Ramsar di kanan atas, catatan lapangan
 * di kanan bawah. Semua nilai diambil dari frame absolut timeline supaya
 * kedalaman tetap kontinu melewati batas scene.
 */
export const Hud: React.FC<HudProps> = ({
  absoluteStart,
  chapter,
  notes,
  showRamsar = false,
  chipStamp = false,
}) => {
  const local = useCurrentFrame();
  const {fps} = useVideoConfig();
  const abs = local + absoluteStart;
  const depth = getDepthState(abs);

  const markerY = RAIL_TOP + depth.markerT * RAIL_SPAN;
  const readout = depth.unit === "m" ? `−${depth.value.toFixed(0)}` : depth.value.toFixed(2);

  const stamp = chipStamp
    ? spring({
        frame: local - 34,
        fps,
        config: {damping: 11, mass: 0.8, stiffness: 150},
        durationInFrames: 34,
      })
    : 1;

  const chipIn = interpolate(local, [chipStamp ? 18 : 0, chipStamp ? 40 : 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {/* ---------- Kolom kedalaman ---------- */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X,
          top: RAIL_TOP,
          width: 1,
          height: RAIL_SPAN,
          backgroundColor: `${COLORS.sand}33`,
        }}
      />

      {TICKS.map((t, i) => {
        const y = RAIL_TOP + t * RAIL_SPAN;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: RAIL_X - 7,
                top: y,
                width: 15,
                height: 1,
                backgroundColor: `${COLORS.sand}44`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: RAIL_X + 22,
                top: y - 9,
                fontFamily: MONO_FONT,
                fontSize: 13,
                letterSpacing: "0.12em",
                color: COLORS.sandFaint,
                opacity: depth.meterOpacity * 0.9,
              }}
            >
              {METER_LABELS[i]}
            </div>
            <div
              style={{
                position: "absolute",
                left: RAIL_X + 22,
                top: y - 9,
                fontFamily: MONO_FONT,
                fontSize: 13,
                letterSpacing: "0.12em",
                color: COLORS.aqua,
                opacity: depth.microOpacity * 0.9,
              }}
            >
              {MICRO_LABELS[i]}
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: RAIL_X + 22,
          top: RAIL_TOP - 34,
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.3em",
          color: COLORS.sandFaint,
          opacity: depth.meterOpacity * 0.85,
        }}
      >
        {depth.unit === "m" ? "METER" : ""}
      </div>
      <div
        style={{
          position: "absolute",
          left: RAIL_X + 22,
          top: RAIL_TOP - 34,
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.3em",
          color: COLORS.aqua,
          opacity: depth.microOpacity * 0.85,
        }}
      >
        {depth.unit === "mm" ? "MILIMETER" : ""}
      </div>

      {/* Penanda posisi kamera */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 14,
          top: markerY,
          width: 29,
          height: 1,
          backgroundColor: COLORS.amber,
          boxShadow: `0 0 14px ${COLORS.amber}88`,
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 4,
          top: markerY - 4,
          width: 9,
          height: 9,
          borderRadius: "50%",
          backgroundColor: COLORS.amber,
          boxShadow: `0 0 18px ${COLORS.amber}AA`,
        }}
      />

      {/* Pembacaan kedalaman */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X + 26,
          top: markerY - 30,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: MONO_FONT,
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: COLORS.sand,
            lineHeight: 1,
            textShadow: "0 2px 18px rgba(4,16,20,0.6)",
          }}
        >
          {readout}
        </span>
        <span
          style={{
            fontFamily: MONO_FONT,
            fontSize: 17,
            fontWeight: 500,
            color: COLORS.amber,
          }}
        >
          {depth.unit}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: RAIL_X + 28,
          top: markerY + 18,
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.24em",
          color: COLORS.aqua,
          whiteSpace: "nowrap",
        }}
      >
        {depth.label}
      </div>

      {/* ---------- Label bab ---------- */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 12,
          top: RAIL_TOP - 70,
          fontFamily: MONO_FONT,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: COLORS.sandFaint,
        }}
      >
        {chapter}
      </div>

      {/* ---------- Chip kategori Ramsar ---------- */}
      {showRamsar ? (
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 96,
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: chipIn,
            translate: `${(1 - chipIn) * 40}px 0px`,
          }}
        >
          <div style={{textAlign: "right"}}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 13,
                letterSpacing: "0.28em",
                color: COLORS.aqua,
                marginBottom: 4,
              }}
            >
              KATEGORI RAMSAR · {RAMSAR.category}
            </div>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 36,
                fontWeight: 600,
                color: COLORS.sand,
                lineHeight: 1.05,
              }}
            >
              {RAMSAR.title}
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: COLORS.sandFaint,
                marginTop: 6,
              }}
            >
              {RAMSAR.parent}
            </div>
          </div>

          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 4,
              border: `1.5px solid ${COLORS.aqua}66`,
              backgroundColor: `${COLORS.aqua}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: interpolate(stamp, [0, 1], [1.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                output: "perceptual-scale",
              }),
              boxShadow: `0 0 34px ${COLORS.aqua}22`,
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 44,
                fontWeight: 700,
                color: COLORS.sand,
                lineHeight: 1,
              }}
            >
              {RAMSAR.code}
            </span>
          </div>
        </div>
      ) : null}

      {/* ---------- Catatan lapangan ---------- */}
      <div
        style={{
          position: "absolute",
          right: 96,
          bottom: 84,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 16,
          textAlign: "right",
        }}
      >
        {notes.map((note, i) => {
          const o = interpolate(local, [8 + i * 8, 22 + i * 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={note.label}
              style={{
                opacity: o,
                translate: `0px ${(1 - o) * 16}px`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 19,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: COLORS.sand,
                  lineHeight: 1.2,
                }}
              >
                {note.value}
              </div>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.26em",
                  color: COLORS.sandFaint,
                  marginTop: 3,
                }}
              >
                {note.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
