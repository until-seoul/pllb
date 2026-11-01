/**
 * KONFIGURASI SUARA.
 *
 * Semua berkas audio dibuat dari nol oleh `scripts/generate-audio.mjs`
 * (tanpa aset pihak ketiga, bebas lisensi). Kalau kamu punya rekaman lapangan
 * sendiri, ganti isi public/audio/ dengan nama file yang sama — Remotion hanya
 * membaca nama file di bawah ini.
 */

/**
 * Slot voice-over. Isi dengan nama file di dalam public/ (mis. "audio/vo.mp3")
 * kalau sudah merekam naskah; null = belum ada VO (video tetap berjalan, hanya
 * tanpa narasi).
 */
export const VO_FILE: string | null = null;

/** Sumber audio. */
export const SFX = {
  underwater: "audio/ambient-underwater.wav",
  surface: "audio/ambient-surface.wav",
  whoosh: "audio/whoosh.wav",
  bubble: "audio/bubble.wav",
  bubbles: "audio/bubbles.wav",
} as const;

/** Pengali level ambient — turunkan (mis. 0.5) kalau narasi mulai padat. */
export const AMBIENT_GAIN = 1;

/** Level narasi (1 = penuh). */
export const VO_GAIN = 1;

/**
 * Detikuan gelembung: frame absolut + level. Dipilih supaya bunyi gelembung
 * jatuh bersamaan dengan peristiwa visual (penyelam, stempel C,_sel yang
 * keluar dari jaringan, dan setangkai fragmen yang tumbuh).
 */
export const BUBBLE_ACCENTS: readonly {frame: number; volume: number}[] = [
  {frame: 104, volume: 0.3},
  {frame: 172, volume: 0.24},
  {frame: 306, volume: 0.2},
  {frame: 452, volume: 0.18},
  {frame: 214, volume: 0.22},
  {frame: 74, volume: 0.18},
];
