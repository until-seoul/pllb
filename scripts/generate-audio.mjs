/**
 * Generator aset audio — SEMUA DISINTESISIS DARI NOL, TANPA FILE EKSTERNAL.
 *
 *   node scripts/generate-audio.mjs
 *
 * Hasilnya ditulis ke public/audio/ sebagai WAV 16-bit mono 22050 Hz.
 * Semua nada dibuat dari noise yang difilter + osilator, jadi bebas lisensi.
 * Ganti file hasil ini dengan rekaman lapangan sendiri kalau punya — Remotion
 * hanya membaca nama file yang sama.
 */

import fs from "node:fs";
import path from "node:path";

const SR = 22050;
const OUT_DIR = path.join(process.cwd(), "public", "audio");

/* ------------------------------------------------------------------ util */

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Lowpass satu kutub. */
const lowpass = (fc) => {
  const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  return (x) => (y += a * (x - y));
};

/** Bandpass biquad (RBJ). */
const bandpass = (fc, q) => {
  const w0 = (2 * Math.PI * fc) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const cosw = Math.cos(w0);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * cosw;
  const a2 = 1 - alpha;
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  return (x) => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    return y;
  };
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Normalisasi-peak supaya semua file punya level yang konsisten. */
const normalize = (buf, peak = 0.92) => {
  let max = 0;
  for (const s of buf) max = Math.max(max, Math.abs(s));
  if (max === 0) return buf;
  const k = peak / max;
  return buf.map((s) => s * k);
};

/**
 * Lipatan mulus: silangkan 0,6 detik terakhir ke depan, supaya loop tidak
 * terdengar ada sambungan.
 */
const makeSeamless = (buf, seconds) => {
  const fade = Math.round(seconds * SR);
  const out = buf.slice(0, buf.length - fade);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    out[i] = out[i] * t + buf[buf.length - fade + i] * (1 - t);
  }
  return out;
};

const writeWav = (name, samples) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = clamp(samples[i], -1, 1);
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, buf);
  return {file, bytes: buf.length};
};

/* --------------------------------------------------- 1. bed bawah laut */

/**
 * Ambient bawah laut: gemuruh brown-noise yang sangat rendah + desis
 * halus + denyut arus lambat. Sepuluh detik, di-loop mulus.
 */
const ambientUnderwater = () => {
  const seconds = 12;
  const n = seconds * SR;
  const rnd = mulberry32(20240607);
  const lpDeep = lowpass(150);
  const lpHiss = lowpass(850);
  const out = new Float64Array(n);

  let brown = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const white = rnd() * 2 - 1;
    brown = (brown + white * 0.04) * 0.998;
    const deep = lpDeep(brown * 6);
    const hiss = lpHiss(white) * 0.05;

    // denyut arus: seluruh periode membagi 12 detik, jadi loop-nya rapat
    const swell =
      1 +
      0.34 * Math.sin(2 * Math.PI * (t / 12)) +
      0.2 * Math.sin(2 * Math.PI * (t / 6) + 1.1) +
      0.12 * Math.sin(2 * Math.PI * (t / 4) + 2.4);

    out[i] = (deep * 0.9 + hiss) * swell;
  }

  // klik jauh yang jarang, ditempatkan di detik bulat supaya tidak menabrak loop
  for (const at of [2.5, 5.5, 8.5]) {
    const idx = Math.round(at * SR);
    const f = 190 + rnd() * 90;
    for (let i = 0; i < 900 && idx + i < n; i++) {
      const env = Math.exp(-i / 190);
      out[idx + i] += Math.sin((2 * Math.PI * f * i) / SR) * env * 0.05;
    }
  }

  return normalize(makeSeamless(Array.from(out), 0.6), 0.72);
};

/* ------------------------------------------------------ 2. bed permukaan */

/** Angin + riak air dangkal, 8 detik loop. */
const ambientSurface = () => {
  const seconds = 8;
  const n = seconds * SR;
  const rnd = mulberry32(19710614);
  const lpWind = lowpass(700);
  const lpSea = lowpass(260);
  const out = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const white = rnd() * 2 - 1;
    const wind = lpWind(white) * 0.16;
    const sea = lpSea(white) * 0.5;
    const gust =
      1 + 0.4 * Math.sin(2 * Math.PI * (t / 8)) + 0.22 * Math.sin(2 * Math.PI * (t / 4) + 0.7);
    out[i] = (wind + sea) * gust;
  }

  return normalize(makeSeamless(Array.from(out), 0.6), 0.5);
};

/* ---------------------------------------------------------- 3. whoosh */

/**
 * Whoosh transisi: derau yang disaring dengan resonansi yang menyapu naik
 * lalu turun, ditutup dengan gumpalan gelembung — supaya cocok dengan
 * transisi "bubble wall".
 */
const whoosh = () => {
  const seconds = 1.8;
  const n = seconds * SR;
  const rnd = mulberry32(20240101);
  const out = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const white = rnd() * 2 - 1;
    // resonansi bergerak: 240 Hz -> 2200 Hz -> 380 Hz
    const p = t / seconds;
    const fc = 240 + 1960 * Math.sin(Math.PI * Math.pow(p, 0.8));
    const bp = bandpass(fc, 2.6);
    // amplop: serang cepat, ekor panjang
    const env = Math.min(1, t / 0.16) * Math.pow(1 - p, 2.1);
    out[i] = bp(white) * env;
  }

  // gumpalan gelembung di ujung whoosh
  const pops = [0.95, 1.04, 1.12, 1.22, 1.33];
  pops.forEach((at, k) => {
    const idx = Math.round(at * SR);
    const f0 = 420 + k * 120;
    for (let i = 0; i < 1400 && idx + i < n; i++) {
      const env = Math.exp(-i / 260) * (1 - i / 1400);
      const f = f0 * (1 + i / 3000);
      out[idx + i] += Math.sin((2 * Math.PI * f * i) / SR) * env * 0.22;
    }
  });

  return normalize(out, 0.85);
};

/* ------------------------------------------------------- 4. bubble pop */

/** Satu letupan gelembung: "plip" nada naik cepat. */
const bubble = () => {
  const seconds = 0.55;
  const n = seconds * SR;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const env = Math.exp(-i / 320) * (1 - i / n);
    const f = 340 * (1 + i / 900);
    out[i] = Math.sin((2 * Math.PI * f * i) / SR) * env;
  }
  // klik attack supaya terdengar "pop"
  for (let i = 0; i < 120; i++) {
    out[i] += (1 - i / 120) * 0.18 * (i % 2 === 0 ? 1 : -1);
  }
  return normalize(out, 0.85);
};

/* --------------------------------------------------- 5. cluster gelembung */

/** Tujuh gelembung bergantian — dipakai saat kamera menyelam. */
const bubbles = () => {
  const seconds = 2.2;
  const n = seconds * SR;
  const rnd = mulberry32(778899);
  const out = new Float64Array(n);
  const times = [0.05, 0.22, 0.38, 0.52, 0.74, 0.96, 1.24, 1.58];
  times.forEach((at, k) => {
    const idx = Math.round(at * SR);
    const f0 = 320 + rnd() * 520;
    for (let i = 0; i < 2000 && idx + i < n; i++) {
      const env = Math.exp(-i / (260 + rnd() * 120)) * (1 - i / 2000);
      const f = f0 * (1 + i / 1400);
      out[idx + i] += Math.sin((2 * Math.PI * f * i) / SR) * env * 0.3;
    }
  });
  return normalize(out, 0.8);
};

/* ------------------------------------------------------------------ main */

fs.mkdirSync(OUT_DIR, {recursive: true});

const files = [
  ["ambient-underwater.wav", ambientUnderwater()],
  ["ambient-surface.wav", ambientSurface()],
  ["whoosh.wav", whoosh()],
  ["bubble.wav", bubble()],
  ["bubbles.wav", bubbles()],
];

for (const [name, data] of files) {
  const {file, bytes} = writeWav(name, data);
  console.log(
    `${name.padEnd(24)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  ${(
      data.length / SR
    ).toFixed(1)}s`,
  );
}
