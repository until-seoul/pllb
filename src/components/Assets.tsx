import React from "react";
import {AbsoluteFill} from "remotion";
import {COLORS, rand} from "../theme";

export type CoralVariant = "staghorn" | "brain" | "plate";

export type CoralSVGProps = {
  readonly variant?: CoralVariant;
  readonly size?: number;
  readonly color?: string;
  readonly highlight?: string;
  readonly seed?: number;
  readonly style?: React.CSSProperties;
};

/**
 * PLACEHOLDER ASET KARANG.
 * Ganti isi <svg> di sini dengan SVG karangan milikmu — komponennya hanya
 *pegang transform (posisi, skala, rotasi) sehingga aset baru langsung ikut
 * teranimasi.
 */
export const CoralSVG: React.FC<CoralSVGProps> = ({
  variant = "staghorn",
  size = 420,
  color = COLORS.coral,
  highlight = COLORS.coralLight,
  seed = 1,
  style,
}) => {
  const tips =
    variant === "staghorn"
      ? [
          [94, 60],
          [24, 96],
          [248, 118],
          [186, 104],
          [52, 134],
          [94, 60],
        ]
      : [];

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      style={{display: "block", overflow: "visible", ...style}}
    >
      {variant === "staghorn" ? (
        <>
          <g
            stroke={color}
            strokeWidth={17}
            strokeLinecap="round"
            fill="none"
            opacity={0.95}
          >
            <path d="M150 292 C149 250 142 220 120 192" />
            <path d="M141 220 C120 214 101 197 93 173" />
            <path d="M121 193 C116 166 109 146 113 120" />
            <path d="M141 220 C162 208 179 192 187 168" />
            <path d="M161 208 C187 202 205 186 213 160" />
            <path d="M94 173 C74 169 59 155 53 134" />
            <path d="M113 120 C101 100 93 82 95 60" />
            <path d="M188 168 C184 145 181 125 187 104" />
            <path d="M213 160 C233 152 245 138 249 118" />
            <path d="M53 134 C37 128 27 114 25 96" />
          </g>
          <g
            stroke={highlight}
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          >
            <path d="M150 292 C149 250 142 220 120 192" />
            <path d="M141 220 C120 214 101 197 93 173" />
            <path d="M121 193 C116 166 109 146 113 120" />
            <path d="M161 208 C187 202 205 186 213 160" />
            <path d="M188 168 C184 145 181 125 187 104" />
          </g>
          {tips.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx + (rand(seed + i) - 0.5) * 18}
              cy={cy}
              r={5.5}
              fill={highlight}
              opacity={0.8}
            />
          ))}
        </>
      ) : variant === "brain" ? (
        <>
          <path
            d="M40 258 C40 170 88 112 150 112 C212 112 260 170 260 258 Z"
            fill={color}
            opacity={0.95}
          />
          <g
            stroke={highlight}
            strokeWidth={4}
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
          >
            {Array.from({length: 7}, (_, i) => (
              <path
                key={i}
                d={`M${58 + i * 30} 250 C${48 + i * 30} 190 ${78 + i * 28} 140 ${70 + i * 30} 120`}
              />
            ))}
          </g>
        </>
      ) : (
        <>
          <path
            d="M36 244 C40 178 96 148 150 148 C204 148 260 178 264 244 Z"
            fill={color}
            opacity={0.95}
          />
          <path
            d="M60 236 C70 196 108 176 150 176 C192 176 230 196 240 236"
            stroke={highlight}
            strokeWidth={6}
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
          />
          <path d="M146 148 L146 268" stroke={color} strokeWidth={12} />
        </>
      )}
    </svg>
  );
};

export type FishSVGProps = {
  readonly size?: number;
  readonly color?: string;
  readonly seed?: number;
  readonly style?: React.CSSProperties;
};

/**
 * PLACEHOLDER ASET IKAN. Shape sederhana, diganti dengan SVG ikan milikmu.
 */
export const FishSVG: React.FC<FishSVGProps> = ({
  size = 120,
  color = COLORS.amber,
  seed = 1,
  style,
}) => {
  const fin = rand(seed + 1) > 0.5 ? COLORS.coralLight : COLORS.aqua;
  return (
    <svg
      viewBox="0 0 120 70"
      width={size}
      height={(size * 70) / 120}
      style={{display: "block", overflow: "visible", ...style}}
    >
      <path
        d="M18 35 C34 10 74 8 92 34 C74 60 34 60 18 35 Z"
        fill={color}
        opacity={0.95}
      />
      <path d="M92 34 L116 16 L110 35 L116 54 Z" fill={color} opacity={0.8} />
      <path d="M44 18 C52 6 66 6 72 14 Z" fill={fin} opacity={0.85} />
      <path d="M44 52 C52 64 66 64 72 56 Z" fill={fin} opacity={0.6} />
      <circle cx={34} cy={30} r={3.6} fill={COLORS.ink} />
    </svg>
  );
};

/** Kawanan ikan: beberapa individu dengan offset deterministik. */
export const FishSchool: React.FC<{
  readonly count?: number;
  readonly size?: number;
  readonly color?: string;
  readonly seed?: number;
  readonly style?: React.CSSProperties;
}> = ({count = 7, size = 78, color = COLORS.amber, seed = 3, style}) => (
  <AbsoluteFill style={style}>
    {Array.from({length: count}, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${rand(seed + i * 3) * 62}%`,
          top: `${rand(seed + i * 3 + 1) * 46 + 6}%`,
          scale: 0.7 + rand(seed + i * 3 + 2) * 0.55,
          rotate: `${-6 + rand(seed + i) * 12}deg`,
        }}
      >
        <FishSVG size={size} color={color} seed={seed + i} />
      </div>
    ))}
  </AbsoluteFill>
);

export type PolypSVGProps = {
  readonly size?: number;
  readonly tissue?: string;
  readonly cavity?: string;
  readonly algae?: string;
  readonly showAlgae?: boolean;
  readonly algaeRatio?: number;
  readonly style?: React.CSSProperties;
};

/**
 * PLACEHOLDER ASET POLIP KARANG — penampang melintang satu polip.
 * Dipakai di scene simbiosis sebagai "kamera" yang masuk ke jaringan karang.
 */
export const PolypSVG: React.FC<PolypSVGProps> = ({
  size = 700,
  tissue = COLORS.sandDim,
  cavity = COLORS.deep,
  algae = COLORS.amber,
  showAlgae = true,
  algaeRatio = 1,
  style,
}) => (
  <svg
    viewBox="0 0 600 600"
    width={size}
    height={size}
    style={{display: "block", overflow: "visible", ...style}}
  >
    <defs>
      <radialGradient id="polyp-cavity" cx="50%" cy="46%">
        <stop offset="0%" stopColor={cavity} stopOpacity={0.35} />
        <stop offset="100%" stopColor={cavity} stopOpacity={0.95} />
      </radialGradient>
    </defs>

    {/* dinding jaringan (mantel karang) */}
    <path
      d="M300 40 C180 40 100 140 100 280 C100 420 180 520 300 520 C420 520 500 420 500 280 C500 140 420 40 300 40 Z"
      fill={tissue}
      opacity={0.9}
    />
    {/* rongga gastrovaskular */}
    <path
      d="M300 108 C216 108 168 180 168 276 C168 372 216 444 300 444 C384 444 432 372 432 276 C432 180 384 108 300 108 Z"
      fill="url(#polyp-cavity)"
    />
    {/* nukleus jaringan */}
    {Array.from({length: 26}, (_, i) => {
      const angle = (i / 26) * Math.PI * 2;
      const rx = 300 + Math.cos(angle) * 148;
      const ry = 280 + Math.sin(angle) * 190;
      return (
        <circle
          key={i}
          cx={rx}
          cy={ry}
          r={11}
          fill={COLORS.ink}
          opacity={0.22}
        />
      );
    })}

    {/* zooxanthellae di lapisan gastrodermis */}
    {showAlgae
      ? Array.from({length: 30}, (_, i) => {
          const angle = (i / 30) * Math.PI * 2 + 0.2;
          const jitter = rand(i * 4.7) * 34;
          const rx = 300 + Math.cos(angle) * (160 + jitter);
          const ry = 280 + Math.sin(angle) * (196 + jitter);
          return (
            <g key={i}>
              <circle
                cx={rx}
                cy={ry}
                r={17}
                fill={algae}
                opacity={0.9 * algaeRatio}
              />
              <circle
                cx={rx + 3}
                cy={ry - 3}
                r={6}
                fill={COLORS.amberDeep}
                opacity={0.55 * algaeRatio}
              />
            </g>
          );
        })
      : null}
    {/* sel fokus: satu zooxanthella yang jadi titik kunci zoom di scene 3 */}
    {showAlgae ? (
      <g>
        <circle
          cx={457}
          cy={339}
          r={22}
          fill={algae}
          opacity={0.95 * algaeRatio}
        />
        <circle
          cx={462}
          cy={334}
          r={8}
          fill={COLORS.amberDeep}
          opacity={0.6 * algaeRatio}
        />
        <circle
          cx={457}
          cy={339}
          r={30}
          fill="none"
          stroke={algae}
          strokeWidth={2}
          strokeOpacity={0.5 * algaeRatio}
        />
      </g>
    ) : null}
  </svg>
);
