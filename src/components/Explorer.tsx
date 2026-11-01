import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {COLORS} from "../theme";

export type ExplorerState = "sehat" | "memutih" | "pulih";

export type ExplorerProps = {
  /** Posisi absolut dalam px dari sudut kiri atas frame. */
  readonly left: number;
  readonly top: number;
  readonly size?: number;
  readonly state?: ExplorerState;
  readonly opacity?: number;
  readonly glow?: number;
  readonly rotate?: number;
};

/**
 * "Penjelajah" — satu sel zooxanthella (alga simbiotik) yang menjadi karakter
 * sekaligus mata kamera video ini. Dia yang memberi karang warnanya, ikut
 * memutih saat karang bleaching, dan pulih lagi di scene restorasi.
 */
export const Explorer: React.FC<ExplorerProps> = ({
  left,
  top,
  size = 220,
  state = "sehat",
  opacity = 1,
  glow = 1,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.035;
  const drift = Math.sin(frame / 17) * 6;

  const healthy = state === "sehat";
  const recovering = state === "pulih";
  const body = healthy
    ? COLORS.amber
    : recovering
      ? COLORS.amber
      : COLORS.bleach;
  const deep = healthy
    ? COLORS.amberDeep
    : recovering
      ? COLORS.amberDeep
      : "#CFC6B4";
  const halo = healthy
    ? "rgba(243,183,94,0.55)"
    : recovering
      ? "rgba(243,183,94,0.40)"
      : "rgba(242,236,222,0.28)";

  return (
    <AbsoluteFill
      style={{
        left,
        top,
        width: size,
        height: size,
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          display: "block",
          scale: pulse,
          rotate: `${rotate}deg`,
          translate: `0px ${drift}px`,
          filter: `drop-shadow(0 0 ${28 * glow}px ${halo})`,
        }}
      >
        <defs>
          <radialGradient id="explorer-core" cx="42%" cy="38%">
            <stop offset="0%" stopColor={body} stopOpacity={0.95} />
            <stop offset="55%" stopColor={deep} stopOpacity={0.8} />
            <stop offset="100%" stopColor={deep} stopOpacity={0.25} />
          </radialGradient>
        </defs>

        {/* membran sel */}
        <circle
          cx={100}
          cy={100}
          r={88}
          fill="url(#explorer-core)"
          stroke={body}
          strokeOpacity={0.75}
          strokeWidth={2.5}
        />

        {/* kloroplas / alga inang */}
        {[
          [66, 74, 26, -18],
          [128, 68, 22, 24],
          [72, 132, 24, 12],
          [132, 126, 28, -8],
          [100, 46, 18, 6],
          [52, 106, 16, -30],
          [148, 100, 18, 20],
        ].map(([cx, cy, r, rot], i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={r}
            ry={r * 0.46}
            fill={deep}
            fillOpacity={healthy || recovering ? 0.42 : 0.16}
            stroke={body}
            strokeOpacity={healthy || recovering ? 0.6 : 0.2}
            strokeWidth={1.4}
            transform={`rotate(${rot} ${cx} ${cy})`}
          />
        ))}

        {/* nukleus */}
        <circle
          cx={104}
          cy={108}
          r={17}
          fill={deep}
          fillOpacity={0.75}
          stroke={body}
          strokeOpacity={0.8}
          strokeWidth={1.6}
        />
      </svg>
    </AbsoluteFill>
  );
};
