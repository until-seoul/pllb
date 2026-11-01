import {loadFont} from "@remotion/google-fonts/Fraunces";
import {loadFont as loadMono} from "@remotion/google-fonts/IBMPlexMono";
import {interpolate} from "remotion";

const display = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const DISPLAY_FONT = display.fontFamily;
export const MONO_FONT = mono.fontFamily;

/**
 * "Beige di dalam laut": dasar gelap, kehangatan pasir dan karang sebagai aksen.
 * Tenang, premium, dan tetap terbaca di proyektor kelas.
 */
export const COLORS = {
  abyss: "#06171D",
  deep: "#0B2530",
  mid: "#123B45",
  shallow: "#1C565C",
  surface: "#2E7C79",
  sand: "#E9DCC6",
  sandDim: "#C3AE8A",
  sandFaint: "#8E8467",
  coral: "#D98263",
  coralLight: "#EEAE8B",
  amber: "#F3B75E",
  amberDeep: "#C97F28",
  aqua: "#74D6C2",
  foam: "#DCF0EA",
  bleach: "#F2ECDE",
  danger: "#D4615A",
  ink: "#062026",
};

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 3300,
};

export const TRANSITION_FRAMES = 20;

/**
 * Durasi tiap scene dalam frame, dan frame awal absolutnya di timeline.
 * Transisi (bubble wall) berpusat tepat pada detik 12, 30, 47, 72, dan 91
 * supaya cut scene jatuh persis di batas naskah VO. Total: 110 detik.
 */
export const SCENES = [
  {id: "hook", start: 0, duration: 370},
  {id: "ramsar", start: 350, duration: 560},
  {id: "symbiosis", start: 890, duration: 530},
  {id: "defense", start: 1400, duration: 770},
  {id: "threat", start: 2150, duration: 590},
  {id: "hope", start: 2720, duration: 580},
] as const;

/** Titik potong transisi (pusat bubble) dalam frame absolut. */
export const CUT_FRAMES = [360, 900, 1410, 2160, 2730] as const;

/**
 * Kode jenis lahan basah Ramsar untuk terumbu karang.
 *
 * Mengikuti klasifikasi Ramsar versi 1990 (Rekomendasi 4.7, sebagaimana
 * diamandemen Resolution VI.5) yang memakai satu huruf per jenis lahan basah:
 *   Marine/Coastal — A, B, C (Coral reefs), D … K
 *   Inland Wetlands — L … Zk
 *   "Man-made" wetlands — 1 … 9
 * Semua kemunculan di layar membaca dari sini, jadi mengganti kode cukup ubah
 * satu tempat.
 */
export const RAMSAR = {
  category: "MARINE/COASTAL",
  code: "C",
  title: "Terumbu karang",
  latin: "Coral reefs",
  parent: "Lahan Basah Laut & Pesisir",
  convention: "Konvensi Ramsar",
  year: "1971",
  place: "Ramsar, Iran",
};

/**
 * Margin kiri untuk konten scene. Kolom kedalaman di tepi kiri occupying
 * x = 96–300, jadi konten tidak boleh mulai sebelum ini.
 */
export const CONTENT_LEFT = 320;

export const SAFE = {
  x: 96,
  y: 96,
};

/**
 * Model kedalaman untuk kolom instrumen di tepi kiri.
 * Scene 3 mengubah skala dari meter ke milimeter — kamera masuk ke jaringan,
 * jadi tick, label, dan posisi penanda ikut berganti satuan.
 */
export const SCALE_MAX = {m: 40, mm: 0.4};

export type DepthState = {
  readonly value: number;
  readonly unit: "m" | "mm";
  readonly label: string;
  readonly meterOpacity: number;
  readonly microOpacity: number;
  readonly markerT: number;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

export const getDepthState = (frame: number): DepthState => {
  const microOpacity =
    interpolate(frame, [910, 930], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [1370, 1390], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const meterOpacity = 1 - microOpacity;

  let meterValue: number;
  if (frame < 360) {
    const t = interpolate(frame, [0, 360], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    meterValue = smooth(t) * 30;
  } else if (frame < 1420) {
    meterValue = 30;
  } else if (frame < 1460) {
    meterValue = interpolate(frame, [1420, 1460], [30, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < 2130) {
    meterValue = 6;
  } else {
    meterValue = interpolate(frame, [2130, 2500], [6, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const microValue =
    frame < 1150
      ? interpolate(frame, [930, 1150], [0.4, 0.16], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [1150, 1370], [0.16, 0.1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const useMicro = microOpacity > 0.5;
  const value = useMicro ? microValue : meterValue;
  const unit = useMicro ? "mm" : "m";

  let label: string;
  if (useMicro) {
    label = frame < 1150 ? "MIKROSKOPIS" : "SATU SEL";
  } else if (frame < 40) {
    label = "PERMUKAAN";
  } else if (frame < 360) {
    label = "TURUN · MENYELAM";
  } else if (frame < 1420) {
    label = "−30 m · TEGAKAN";
  } else if (frame < 1460) {
    label = "NAIK KE PERMUKAAN";
  } else if (frame < 2130) {
    label = "−6 m · PUNCAK KARANG";
  } else if (frame < 2500) {
    label = "NAIK · PERMUKAAN";
  } else {
    label = "−2 m · PERMUKAAN";
  }

  return {
    value,
    unit,
    label,
    meterOpacity,
    microOpacity,
    markerT: clamp(value / SCALE_MAX[unit], 0, 1),
  };
};

/** Pseudo-random deterministik supaya scene bisa di-render ulang tanpa berkedip. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Mencampur dua warna hex — dipakai untuk transisi warna teks. */
export const mixHex = (a: string, b: string, t: number): string => {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const k = clamp(t, 0, 1);
  const to = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0");
  return `#${to(r1 + (r2 - r1) * k)}${to(g1 + (g2 - g1) * k)}${to(
    b1 + (b2 - b1) * k,
  )}`;
};
