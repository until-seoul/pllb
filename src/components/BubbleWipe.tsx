import React from "react";
import type {TransitionPresentationComponentProps} from "@remotion/transitions";
import {AbsoluteFill, Easing, interpolate} from "remotion";
import {COLORS} from "../theme";

/** Radius yang menutupi frame 1920x1080 dari titik tengah (√(960²+540²)). */
const MAX_R = 1180;

const ease = (t: number) =>
  Easing.bezier(0.22, 1, 0.36, 1)(t);

/**
 * Transisi "bubble wall".
 *
 * Scene baru dibuka lewat lingkaran yang membesar dari titik tengah, sementara
 * dinding gelembung (lapisan teal) sedikit lebih cepat menutupi scene lama.
 * Celah antara keduanya terlihat sebagai dinding gelembung yang bergerak.
 * Scene lama ikut membesar — efeknya seperti kamera menyelam menembus gelembung.
 *
 * Karena transisi selalu berangkat dari titik tengah, objek kunci di tiap
 * scene selalu diposisikan di titik tengah sesaat sebelum cut.
 */
export const BubbleWipe: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({children, presentationDirection, presentationProgress}) => {
  const p = Math.min(1, Math.max(0, presentationProgress));

  if (presentationDirection === "exiting") {
    const zoom = interpolate(p, [0, 1], [1, 1.16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const coverR = ease(Math.min(1, p * 1.6)) * MAX_R;

    return (
      <AbsoluteFill style={{scale: zoom}}>
        {children}
        <AbsoluteFill
          style={{
            clipPath: `circle(${coverR}px at 50% 50%)`,
            backgroundColor: COLORS.deep,
            opacity: interpolate(p, [0, 0.25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    );
  }

  const r = ease(p) * MAX_R;
  const settle = interpolate(p, [0, 1], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{scale: settle}}>
      <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`}}>
        {children}
      </AbsoluteFill>

      {/* cincin busa pada batas lingkaran */}
      <AbsoluteFill style={{pointerEvents: "none"}}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: r * 2,
            height: r * 2,
            translate: "-50% -50%",
            borderRadius: "50%",
            border: `2px solid ${COLORS.foam}88`,
            boxShadow: `0 0 70px ${COLORS.aqua}55, inset 0 0 90px ${COLORS.foam}22`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: (r + 26) * 2,
            height: (r + 26) * 2,
            translate: "-50% -50%",
            borderRadius: "50%",
            border: `1px solid ${COLORS.aqua}33`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
