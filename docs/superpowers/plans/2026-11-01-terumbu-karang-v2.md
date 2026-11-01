# Video V2 "GRID REEF" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun video Remotion kedua (130 detik) tentang terumbu karang sebagai lahan basah Ramsar, dengan solusi berbasis teknologi informasi (Sentinel-2, computer vision, akustik pasif, eDNA) dan bahasa visual "GRID REEF" yang sepenuhnya berbeda dari v1.

**Architecture:** Composition baru `TerumbuKarangV2` (3900 frame) berjalan berdampingan dengan composition `TerumbuKarang` milik v1 yang tidak disentuh. Semua kode v2 berada di `src/v2/` dan berbagi tidak satu pun komponen dengan v1. Di dalam v2, tiga lapis semantik terpisah: **dunia** (grid 24×12 petak karang, digambar dari sub-persegi, di-quantize 4 frame), **manusia** (tipografi Space Grotesk, gerak halus), dan **mesin** (semua data dan overlay, satu warna magenta, tipografi Martian Mono/Silkscreen). Penanda khas "Hantu Enam Bulan" adalah lapisan salinan terumbu yang dievaluasi 180 frame lebih awal.

**Tech Stack:** Remotion 4.0.538, React 19.2.3, TypeScript 5.9.3, `@remotion/transitions` 4.0.538, `@remotion/google-fonts` 4.0.538 (Space Grotesk, Martian Mono, Silkscreen), Node ≥ 20.19 untuk skrip verifikasi.

**Spec:** `docs/superpowers/specs/2026-11-01-terumbu-karang-v2-design.md` — plan ini berargumen dari spec itu; keduanya dibaca bersama.

## Global Constraints

- Durasi **3900 frame** (130 detik) @ 30 fps, 1920×1080. Composition id persis `TerumbuKarangV2`.
- Composition `TerumbuKarang` (v1, 3300 frame) **tidak boleh diubah** — tidak ada scene, komponen, atau asset audio v1 yang boleh diedit.
- Semua kode baru di `src/v2/`. Tidak ada file v1 yang boleh diubah kecuali `src/Root.tsx` (menambah satu `<Composition>`).
- **R1 — satu warna untuk mesin:** seluruh artefak mesin (grid, scan bar, bounding box, counter, label, stempel C, tick) memakai `PALETTE.machine` `#FF2E88` di atas `PALETTE.ink` `#0A0D18`. Termal digambar *duotone* magenta (kerapatan = panas), bukan ramp biru→merah.
- **R2 — warna hanya milik karang:** karang memakai ramp `reefDeep` `#0B4F4A` → `reefMid` `#17A97E` → `reefBright` `#5FE0A8` → `reefTip` `#FFD166`; bleaching `#F4F6FF`; teks manusia `human` `#E9ECF5`; alert `#FF4D3D`.
- **R3 — dunia melangkah, readout mengalir:** hanya lapisan dunia yang di-quantize (`quantize4`); teks, counter, dan transisi tetap 30 fps.
- Grid: 24 kolom × 12 baris, petak 72 px, field 1728 × 864 px, asal di (96, 108).
- Font: `HUMAN_FONT` = Space Grotesk, `MACHINE_FONT` = Martian Mono, `PIXEL_FONT` = Silkscreen. Font Fraunces dan IBM Plex Mono **tidak boleh dipakai** di v2.
- Transisi antar scene: `Sweep` (bilah pemindai horizontal), durasi 20 frame — `BubbleWipe` v1 tidak boleh dipakai di v2.
- Naskah VO: **235 kata**, tempo 145 kata/menit, 97,2 detik bicara, jeda 32,8 detik. Semua jeda antar baris ≥ 0,2 dtk; tidak ada baris yang melewati batas scene. Sumber: `docs/naskah-voiceover-v2.md`.
- Slot VO v2 **tetap kosong** — tidak ada rekaman yang dibuat dan `VO_FILE` di `src/audio.ts` tidak diubah. Naskah diserahkan sebagai dokumen, bukan sebagai file audio.
- Semua audio disintesis dari nol oleh `scripts/generate-audio.mjs` — tanpa aset pihak ketiga.
- Bahasa seluruh teks on-screen: Indonesia, dengan gloss Inggris hanya untuk istilah resmi (mis. `CORAL REEFS`).
- Setiap klaim angka on-screen wajib disertai sumber yang terlihat; angka yang bukan hasil pengukuran wajib dilabeli `ILUSTRASI`.

## Review Focus

Lima kelas kegagalan yang paling mungkin menggigit orang yang memakai video ini, dan yang tidak tersentuh tes mana pun:

1. **Slot teks bertabrakan** — v1 punya bug "25 %" menabrak "KOTA" dan "BLEACHING" menabrak kalimat penjelasan. Uji: setiap scene punya manifest region; band piksel yang terdeteksi harus muat di dalam region-nya dan tidak boleh masuk ke `keepOut` milik slot lain.
2. **Kode Ramsar salah baca** — muncul "A1" atau "Section A" di layar mana pun. Uji: pemindaian seluruh frame render untuk kemunculan literal `A1`/`SECTION A`.
3. **Aturan satu warna mesin dilanggar** — ada artefak mesin dengan warna selain magenta (mis. thermal rainbow, atau teks data putih). Uji: sampling region overlay mesin, assert hanya ada magenta + ink.
4. **Hantu tidak sinkron dengan keadaan reef** — hantu_enam_bulan menampilkan kondisi yang tidak konsisten dengan `GHOST_LAG` 180 frame, sehingga ironi dramatis scene 1 hilang (hantu dan sekarang sama-sama hijau). Uji: banding piksel pada dua frame bersebelahan di awal scene 1.
5. **Nomor dan sumbernya meleset** — angka 1.000 / 25% / 84% / DHW tampil tanpa sumber, atau tampil di frame yang bukan milik scene-nya. Uji: presence check sumber pada frame yang relevan.

---

### Task 1: Scaffold V2 — theme, timing, composition

**Files:**
- Create: `src/v2/theme.ts`
- Create: `src/v2/scenes/Placeholder.tsx`
- Create: `src/v2/Main.tsx`
- Modify: `src/Root.tsx` (tambah satu `<Composition>`, jangan ubah yang lama)

**Interfaces:**
- Consumes: tidak ada.
- Produces:
  - `src/v2/theme.ts` exporting:
    - `PALETTE: {ink, inkSoft, machine, reefDeep, reefMid, reefBright, reefTip, bleached, human, alert}` — semua string hex, persis nilai di Global Constraints.
    - `HUMAN_FONT: string`, `MACHINE_FONT: string`, `PIXEL_FONT: string`
    - `GRID: {cols: 24, rows: 12, tile: 72, x: 96, y: 108}`
    - `VIDEO_V2: {width: 1920, height: 1080, fps: 30, durationInFrames: 3900}`
    - `TRANSITION_FRAMES = 20`
    - `SCENES_V2: readonly {id: string; start: number; duration: number}[]`
    - `CUT_FRAMES_V2: readonly number[]`
    - `RAMSAR_V2: {code: "C"; type: "CORAL REEFS"; group: "MARINE/COASTAL"; gloss: "Lahan Basah Laut & Pesisir"}`
    - `withAlpha(hex: string, alpha: number): string`

- [ ] **Step 1: Tulis `src/v2/theme.ts`**

  Muat tiga font lewat `@remotion/google-fonts`: `SpaceGrotesk` (weights 300/400/500/600/700), `MartianMono` (weights 400/500/600/700), `Silkscreen` (weights 400/700) — semuanya `loadFont("normal", {weights, subsets: ["latin"]})`, mengikuti pola `src/theme.ts` yang sudah ada.

  `SCENES_V2` (start & duration dalam frame absolut):

  | id | start | duration |
  |---|---|---|
  | `enam-bulan` | 0 | 400 |
  | `kode-c` | 380 | 620 |
  | `satu-meter-kubik` | 980 | 530 |
  | `cara-lama` | 1490 | 530 |
  | `empat-sensor` | 2000 | 740 |
  | `april-2024` | 2720 | 590 |
  | `denyut-nadi` | 3290 | 610 |

  `CUT_FRAMES_V2 = [390, 990, 1500, 2010, 2730, 3300]`.

  Verifikasi aritmetika: `SCENES_V2[i].start + SCENES_V2[i].duration === CUT_FRAMES_V2[i] + 10` untuk i = 0..5, dan `SCENES_V2[6].start + SCENES_V2[6].duration === 3900`.

- [ ] **Step 2: Tulis `src/v2/scenes/Placeholder.tsx`**

  `AbsoluteFill` dengan `backgroundColor: PALETTE.ink` dan satu `MonoLabel`-gaya sederhana yang men-AMSAH "SCENE <id>" di tengah, memakai `HUMAN_FONT`, warna `PALETTE.human` size 20, opasitas 0.25. Export `export const Placeholder: React.FC<{readonly sceneId: string}>`.

- [ ] **Step 3: Tulis `src/v2/Main.tsx`**

  `TransitionSeries` dengan 7 `<TransitionSeries.Sequence>`, masing-masing `durationInFrames` dari `SCENES_V2[i].duration` dan `name` = `"0X · " + id`. Lima `TransitionSeries.Transition` di antaranya memakai `presentation={{component: Sweep, props: {}}}` dan `timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}`.

  Untuk Task 1, `Sweep` diimplementasikan lokal sebagai placeholder yang hanya-return `children` —_task terpisah_ menggantinya. Import `Sweep` dari `./components/Sweep`.

- [ ] **Step 4: Daftarkan composition di `src/Root.tsx`**

  Tambahkan tanpa menyentuh `<Composition id="TerumbuKarang">` yang sudah ada:

  ```tsx
  <Composition
    id="TerumbuKarangV2"
    component={MainV2}
    durationInFrames={VIDEO_V2.durationInFrames}
    fps={VIDEO_V2.fps}
    width={VIDEO_V2.width}
    height={VIDEO_V2.height}
  />
  ```

  dengan `import {Main as MainV2} from "./v2/Main";` dan `import {VIDEO_V2} from "./v2/theme";`.

- [ ] **Step 5: Verifikasi composition terdaftar**

  Run: `npx remotion compositions src/index.ts`
  Expected: dua baris — `TerumbuKarang` (3300 frame) dan `TerumbuKarangV2` (3900 frame).

- [ ] **Step 6: Verifikasi tipe dan lint**

  Run: `npx tsc --noEmit && npx eslint src`
  Expected: exit 0, tanpa output.

- [ ] **Step 7: Commit**

  ```bash
  git add src/v2 src/Root.tsx
  git commit -m "feat(v2): scaffold composition TerumbuKarangV2 dengan theme dan timing"
  ```

---

### Task 2: Naskah VO v2 + validator timing

**Files:**
- Create: `docs/naskah-voiceover-v2.md`
- Create: `scripts/vo-check.mjs`

**Interfaces:**
- Consumes: `src/v2/theme.ts` (`SCENES_V2`, `CUT_FRAMES_V2`) — dibaca sebagai data statis, bukan di-import (skrip Node tidak boleh meng-import TS).
- Produces: `docs/naskah-voiceover-v2.md` berisi tabel per scene dengan kolom `Mulai | Baris | Frame absolut | Frame lokal scene | Visual yang_landung`, plus tabel paper-per-scene dan blok "Naskah polos".

- [ ] **Step 1: Tulis `scripts/vo-check.mjs`**

  Node ESM tanpa dependensi. Isi: array `SCENES` dengan `{name, start, end, lines: [[text, startSeconds, cue]]}`; `WPM = 145`; `W = 60 / WPM`. Hitung durasi per baris, cetak `m:ss.s → m:ss.s (dur, kata) teks`, cetak sisa setelah kalimat terakhir tiap scene, lalu **gagal dengan exit code 1** bila: (a) jeda antar baris < 0,2 dtk, (b) baris melewati batas scene, (c) jumlah kata ≠ 235, (d) `start` scene tidak sama dengan `SCENES_V2` di `src/v2/theme.ts` (parse file itu dengan regex untuk membandingkan).

  Source of truth untuk isi `SCENES` adalah tabel di Task 2 Step 2.

- [ ] **Step 2: Tulis `docs/naskah-voiceover-v2.md`**

  Isi: judul, header (durasi 130 detik, 235 kata, 97,2 detik bicara, 32,8 detik jeda), lalu tujuh sub-bagian scene dengan tabel di atas. Frame absolut = detik × 30. Frame lokal = absolut − start scene.

  Tabel baris (absolut frame, dari konversi detik × 30):

  | Scene | Baris | absolut |
  |---|---|---|
  | ENAM BULAN | Kalau karang memutih hari ini, kita tahu bulan depan. | 0 |
  | | Enam bulan sudah terlalu lambat. | 150 |
  | | Terumbu karang adalah lahan basah. | 228 |
  | | Kita masih memantaunya dengan mata. | 306 |
  | KODE C | Konvensi Ramsar memberi dunia satu taksonomi lahan basah. | 390 |
  | | Tiga kelompok: laut dan pesisir, daratan, dan buatan manusia. | 507 |
  | | Di kelompok laut, kodenya C: Coral reefs. | 636 |
  | | Status itu berarti perlindungan internasional. | 741 |
  | | Tapi perlindungan harus bisa dibuktikan, bukan sekadar diklaim. | 822 |
  | SATU METER KUBIK | Satu meter kubik karang menampung hingga seribu spesies. | 990 |
  | | Seperempat spesies laut dunia bergantung padanya. | 1107 |
  | | Karang juga meredam gelombang sebelum mencapai daratan. | 1212 |
  | | Sekali rusak, karang butuh puluhan tahun untuk pulih. | 1329 |
  | CARA LAMA | Bagaimana cara kita memantaunya? | 1500 |
  | | Sampai sekarang: menyelam. | 1566 |
  | | Penyelam menghitung spesies di garis transek. | 1617 |
  | | Sekali, mungkin dua kali setahun. | 1707 |
  | | Untuk daerah yang sedikit, dengan biaya besar. | 1785 |
  | | Mata manusia menjadi titik lemahnya. | 1899 |
  | EMPAT SENSOR | Sekarang sensor yang mengerjakan. | 2010 |
  | | Satelit termal, mengukur suhu permukaan laut. | 2076 |
  | | Kamera bawah air dengan AI, mencari tanda pemutihan. | 2166 |
  | | Hidrofon, merekam suara dan bunyi karang. | 2280 |
  | | Air laut pun bisa jadi bahan sampel. | 2370 |
  | | Dari air itu, DNA ikan dan karang dibaca. | 2472 |
  | | Empat sensor, satu sistem. | 2586 |
  | | Mata manusia tidak lagi sendirian. | 2652 |
  | APRIL 2024 | April 2024. Satu derajat, dan bertahan. | 2730 |
  | | Satelit melihatnya lebih dulu. | 2820 |
  | | AI menandai 84% terumbu dunia berstres panas. | 2886 |
  | | Manusia baru mengetahuinya berbulan-bulan kemudian. | 2988 |
  | | Selisihnya: bulan, bukan tahun. | 3066 |
  | | Banyak karang sudah terlambat pulih. | 3132 |
  | | Responnya bisa dimulai lebih awal. | 3222 |
  | DENYUT NADI | Sekarang lahan basahnya punya denyut nadi. | 3300 |
  | | Sistemnya tahu saat karang sakit, dan saat kembali. | 3390 |
  | | Terumbu karang bukan lanskap. | 3504 |
  | | Dia infrastruktur. | 3570 |
  | | Dia lahan basah yang bisa dipantau. | 3609 |
  | | Yang bisa dipantau, bisa dilindungi. | 3699 |

  Kolom `Visual yang_landung` juga wajib diisi di tabel yang sama, memakai deskripsi singkat yang menunjuk momen visual — ini yang dipakai narator saat merekam.

- [ ] **Step 3: Jalankan validator**

  Run: `node scripts/vo-check.mjs`
  Expected: `OK: 235 kata, semua jeda >= 0.2 dtk, tidak ada baris melewati batas scene`, exit 0.

- [ ] **Step 4: Commit**

  ```bash
  git add docs/naskah-voiceover-v2.md scripts/vo-check.mjs
  git commit -m "feat(v2): naskah voice-over 235 kata plus validator timing"
  ```

---

### Task 3: Tooling verifikasi layout

**Files:**
- Create: `scripts/png.mjs`
- Create: `scripts/bands.mjs`
- Create: `scripts/check-layout.mjs`

**Interfaces:**
- Consumes: tidak ada.
- Produces:
  - `scripts/png.mjs` exporting `decodePng(path: string): {w: number; h: number; channels: number; data: Buffer}`.
  - `scripts/bands.mjs` CLI: `node scripts/bands.mjs <png> <x0> <y0> <x1> <y1> <threshold> [hexFilter]` — mencetak satu baris per band: `y <y0>-<y1>  x <xa>-<xb>  maxpx <n>`. `hexFilter` opsional: hanya hitung piksel yang warnanya dekat dengan hex itu (jarak Euclidean RGB ≤ 90).
  - `scripts/check-layout.mjs` CLI: `node scripts/check-layout.mjs <png> <manifest.json>` — manifest `{regions: [{label, x, y, w, h}], keepOut: [{label, x, y, w, h}]}`. Aturan: (a) setiap band yang terdeteksi di dalam `regions[i]` harus sepenuhnya berada di dalam `regions[i]`; (b) tidak boleh ada band di dalam `keepOut`; (c) setiap `region` harus punya ≥ 1 band, kalau tidak, region itu kosong. Exit 1 + pesan kalau ada pelanggaran.

- [ ] **Step 1: Tulis `scripts/png.mjs`**

  Decoder PNG tanpa dependensi: baca signature 8 byte, iterasi chunk; kumpulkan `IHDR` (width, height, bitDepth, colorType) dan semua `IDAT`; `inflateSync`; kembalikan tiap baris dengan filter 0–4 (None/Sub/Up/Average/Paeth); kembalikan `{w, h, channels, data}` dengan `channels = {0:1, 2:3, 4:2, 6:4}[colorType]`. Tolak `bitDepth !== 8` dengan pesan jelas.

- [ ] **Step 2: Tulis `scripts/bands.mjs`**

  Pakai `decodePng` dari `png.mjs`. Scan area, hitung luminance `0.299r + 0.587g + 0.114b`; sebuah baris=row yang "berisi" kalau ≥ 3 piksel melewati threshold (dan, bila `hexFilter` diberikan, ≥ 3 piksel sekaligus lolos filter warna). Band = run baris berisi berurutan. Cetak format di atas.

- [ ] **Step 3: Tulis `scripts/check-layout.mjs`**

  Pakai `decodePng` + logika band dari `bands.mjs` (ekstrak jadi fungsi `findBands(img, rect, threshold, hexFilter)` yang di-`export` dari `bands.mjs` supaya tidak diduplikasi).

  Untuk tiap region: panggil `findBands` dengan threshold 110 di region itu; tiap band yang ditemukan harus punya `y0 >= region.y` dan `y1 <= region.y + region.h` dan `xa >= region.x` dan `xb <= region.x + region.w`. Untuk tiap keepOut: `findBands` harus mengembalikan nol band. Region tanpa band → pelanggaran.

  Tambahkan mode `--dump` yang hanya mencetak band per region, untuk debugging manual.

- [ ] **Step 4: Buktikan tool menangkap tumpang-tindih lewat self-test**

  Tambahkan mode `--selftest` pada `check-layout.mjs`: mode ini membangun buffer piksel sintetis 60×40 di memori (tanpa menulis PNG), menggambar dua blok terang yang saling menumpuk, lalu menjalankan aturan region/keepOut yang sama.

  Run: `node scripts/check-layout.mjs --selftest`
  Expected: dua assertion internal lulus — (a) band yang keluar dari region terdeteksi sebagai pelanggaran, (b) manifest dengan region yang tidak bertabrakan tidak menghasilkan pelanggaran. Exit 0 dan print "selftest OK".

- [ ] **Step 5: Buktikan tool menolak layout yang bertabrakan**

  Run: `node scripts/check-layout.mjs --selftest --expect-violation`
  Expected: exit 1 dengan pesan pelanggaran yang menyebut label region yang meluber.

  Jika `--expect-violation` belum ada, tambahkan di Step 4.

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/png.mjs scripts/bands.mjs scripts/check-layout.mjs
  git commit -m "test(v2): decoder PNG dan pemeriksa overlap layout"
  ```

---

### Task 4: Model reef + komponen Grid + ReefTile

**Files:**
- Create: `src/v2/reef.ts`
- Create: `src/v2/components/ReefTile.tsx`
- Create: `src/v2/components/Grid.tsx`
- Modify: `src/v2/scenes/Placeholder.tsx` (hanya untuk meng-import; bikin `src/v2/scenes/S1_EnamBulan.tsx`)

**Interfaces:**
- Consumes: `PALETTE`, `GRID` dari `src/v2/theme.ts`.
- Produces:
  - `src/v2/reef.ts` exporting:
    - `export type Tile = {readonly col: number; readonly row: number; readonly seed: number; readonly shape: 0 | 1 | 2; readonly x: number; readonly y: number}`
    - `export const GHOST_LAG = 180`
    - `export const quantize4 = (frame: number): number`
    - `export const buildField = (seed: number): readonly Tile[]`
    - `export type BleachEvent = {readonly startFrame: number; readonly spreadFrames: number; readonly originCol: number; readonly originRow: number}`
    - `export const isBleached = (tile: Tile, frame: number, ev: BleachEvent): boolean`
    - `export const fieldBleachedFraction = (tiles: readonly Tile[], frame: number, ev: BleachEvent): number`
  - `src/v2/components/ReefTile.tsx`: `export const ReefTile: React.FC<{readonly tile: Tile; readonly bleached: boolean; readonly resolution: number}>`
  - `src/v2/components/Grid.tsx`: `export const Grid: React.FC<{readonly tiles: readonly Tile[]; readonly frame: number; readonly ev: BleachEvent; readonly zoom?: number; readonly ghost?: boolean}>`

- [ ] **Step 1: Tulis `src/v2/reef.ts`**

  `buildField(seed)` mengisi `GRID.cols × GRID.rows` tile; `seed` per tile dari PRNG deterministik (pola `mulberry32` yang sudah dipakai `scripts/generate-audio.mjs`); `shape` = 0|1|2 dari seed; `x = GRID.x + col * GRID.tile`, `y = GRID.y + row * GRID.tile`.

  `isBleached` menghitung jarak Manhattan tile dari `(originCol, originRow)`, radius = `max(0, (frame - startFrame) / spreadFrames) * maxRadius`, dengan `maxRadius = GRID.cols + GRID.rows`. Mengembalikan true bila jarak ≤ radius.

  `quantize4(frame) = Math.floor(frame / 4) * 4`.

- [ ] **Step 2: Tulis `src/v2/components/ReefTile.tsx`**

  Kotak `GRID.tile` px. Kalau `bleached`, isi `PALETTE.bleached`; kalau tidak, isi ramp karang berdasarkan `tile.seed`: `< 0.35` → `reefDeep`, `< 0.7` → `reefMid`, `< 0.9` → `reefBright`, selain itu `reefTip`. Setiap tile digambar dari 2–4 sub-persegi kecil (bukan satu kotak solid) supaya terbaca sebagai bentuk karang — pilih 3 pola tetap berdasarkan `tile.shape`, semua variants berada dalam kotak tile, tanpa kurva, tanpa border-radius, tanpa glow. `resolution` = 1 | 2 | 4: bila > 1, gambar hanya sub-persegi yang terpilih agarResolution tinggi berarti lebih detail, bukan lebih besar.

- [ ] **Step 3: Tulis `src/v2/components/Grid.tsx`**

  `AbsoluteFill` berisi `tiles.map(...)` dengan `position: absolute; left: tile.x; top: tile.y`. `zoom` (default 1) diterapkan lewat `scale` pada `transformOrigin: "96px 108px"`. `ghost` = true → pakai `PALETTE.inkSoft` dan `PALETTE.human` dengan opasitas rendah, bukan ramp karang.

- [ ] **Step 4: Tulis `src/v2/scenes/S1_EnamBulan.tsx` (kerangka)**

  `AbsoluteFill` `backgroundColor: PALETTE.ink`; `Grid` dengan `buildField(7)`; `ev = {startFrame: 120, spreadFrames: 260, originCol: 15, originRow: 4}`. Headline "LAHAN BASAH" dengan `HumanText` (Task 5) — sampai Task 5 selesai, pakai `<div style={{fontFamily: HUMAN_FONT}}>` biasa.

  Daftarkan S1 di `src/v2/Main.tsx`, menggantikan `Placeholder` untuk slot pertama.

- [ ] **Step 5: Render still dan ukur**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s1-grid.png --frame=120`
  Expected: file PNG 1920×1080 dengan grid petak terlihat.

  Run: `node scripts/bands.mjs out/v2/s1-grid.png 96 108 1824 972 60`
  Expected: baris band kontinu (grid penuh), yang membuktikan petak tergambar.

- [ ] **Step 6: Verifikasi tipe dan lint**

  Run: `npx tsc --noEmit && npx eslint src` → exit 0.

- [ ] **Step 7: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): model reef, Grid, dan ReefTile"
  ```

---

### Task 5: Lapisan tipe — HumanText + Readout

**Files:**
- Create: `src/v2/components/HumanText.tsx`
- Create: `src/v2/components/Readout.tsx`

**Interfaces:**
- Consumes: `HUMAN_FONT`, `MACHINE_FONT`, `PIXEL_FONT`, `PALETTE` dari `src/v2/theme.ts`.
- Produces:
  - `export const HumanText: React.FC<{readonly text: string; readonly delay?: number; readonly stagger?: number; readonly size?: number; readonly weight?: number; readonly color?: string; readonly align?: "left" | "center" | "right"; readonly maxWidth?: number; readonly letterSpacing?: number; readonly accentWords?: readonly string[]; readonly accentColor?: string; readonly rise?: number}>`
  - `export const Readout: React.FC<{readonly children: React.ReactNode; readonly delay?: number; readonly size?: number; readonly color?: string; readonly letterSpacing?: number; readonly align?: "left" | "center" | "right"; readonly pixel?: boolean; readonly style?: React.CSSProperties}>`

- [ ] **Step 1: Tulis `src/v2/components/HumanText.tsx`**

  Meniru pola `KineticText` v1 (kata demi kata, spring + rise) tetapi tanpa strike-through dan tanpa rotateIn. Font `HUMAN_FONT` default, `letterSpacing` default -0.01, `align` default "left". Aksen memakai `accentColor` default `PALETTE.reefTip`. Wort teks dinormalisasi (lowercase + buang non-alnum) sebelum dicocokkan dengan `accentWords`.

- [ ] **Step 2: Tulis `src/v2/components/Readout.tsx`**

  Label mesin: font `MACHINE_FONT` default (atau `PIXEL_FONT` bila `pixel` true), warna default `PALETTE.machine`, `letterSpacing` default 0.08, `align` default "left". Muncul dengan fade + translate Y 8 px, tanpa bounce. Menerima `style` untuk penempatan.

- [ ] **Step 3: Verifikasi dua lapis tipe punya peran berbeda**

  Tambahkan sementara ke `S1_EnamBulan.tsx` satu `HumanText` "TERUMBU KARANG" (warna `PALETTE.human`) pada `top: 900` dan satu `Readout` "RAMSAR · KODE C" (warna `PALETTE.machine`) pada `top: 960`, keduanya `left: 300`.

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s1-type.png --frame=120`
  Run: `node scripts/bands.mjs out/v2/s1-type.png 300 880 1600 1000 110`
  Expected: dua band terpisah — band atas (teks manusia, x ≈ 300–560) dan band bawah (label magenta).

  Run: `node scripts/bands.mjs out/v2/s1-type.png 300 880 1600 1000 110 FF2E88`
  Expected: hanya satu band, yaitu band bawah (magenta). Band atas tidak muncul karena warnanya bukan magenta.

  Setelah verifikasi, hapus kedua elemen sementara itu dari `S1_EnamBulan.tsx` — penempatannya final ada di Task 8.

- [ ] **Step 4: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): HumanText dan Readout untuk dua lapis suara"
  ```

---

### Task 6: Hantu Enam Bulan

**Files:**
- Create: `src/v2/components/GhostLayer.tsx`
- Modify: `src/v2/scenes/S1_EnamBulan.tsx`

**Interfaces:**
- Consumes: `buildField`, `isBleached`, `GHOST_LAG` dari `src/v2/reef.ts`; `Grid` dari `src/v2/components/Grid.tsx`.
- Produces:
  - `export const GhostLayer: React.FC<{readonly tiles: readonly Tile[]; readonly frame: number; readonly ev: BleachEvent; readonly merge?: number; readonly offsetX?: number; readonly offsetY?: number}>`
    - `merge` 0..1: menggeser hantu mendekati grid sekarang (offset → 0) dan menaikkan opasitasnya.

- [ ] **Step 1: Tulis `src/v2/components/GhostLayer.tsx`**

  Render `Grid` dengan `frame - GHOST_LAG` (dan `ev` yang sama), mode `ghost`. Default `offsetX = -132`, `offsetY = -96`. Saat `merge` naik, offset dikalikan `(1 - merge)` dan opasitas naik dari 0.28 → 0.55.

- [ ] **Step 2: Pasang hantu di S1**

  `GhostLayer` digambar sebelum `Grid` (di belakang), dengan `frame` = frame lokal scene.

- [ ] **Step 3: Buktikan hantu berbeda dari keadaan sekarang**

  Di awal scene 1, `ev.startFrame` = 120 membuat frame 120 masih hijau; hantu pada frame 120 mengevaluasi frame −60 (sebelum mulai bleach) sehingga juga hijau. **Untuk dramatisasi, geser `ev.startFrame` ke −60** sehingga frame 120 sudah di dalam radius bleach, sementara hantu (frame −60) belum — petak putih muncul di grid sekarang, dan petak yang sama masih berwarna di lapisan hantu.

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s1-ghost.png --frame=150`
  Expected: petak putih hadir di area центра bawah-kanan (radius bleaching di frame 150), dan area yang sama masih berwarna di lapisan hantu.

  Run: `node scripts/bands.mjs out/v2/s1-ghost.png 900 400 1500 700 200`
  Expected: minimal dua band — band petak putih sekarang dan band petak berwarna hantu.

  Uji negatif (mematikan hantu sementara): ubah `GhostLayer` jadi `opacity: 0`, render ulang, dan pastikan band petak putih/hantu berubah — lalu kembalikan.

- [ ] **Step 4: Verifikasi tipe dan lint**

  Run: `npx tsc --noEmit && npx eslint src` → exit 0.

- [ ] **Step 5: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): lapisan hantu enam bulan"
  ```

---

### Task 7: ScanBar + Sweep (transisi)

**Files:**
- Create: `src/v2/components/ScanBar.tsx`
- Create: `src/v2/components/Sweep.tsx`

**Interfaces:**
- Consumes: `PALETTE` dari `src/v2/theme.ts`; `TransitionPresentationComponentProps` dari `@remotion/transitions`.
- Produces:
  - `export const ScanBar: React.FC<{readonly progress: number; readonly height?: number; readonly color?: string; readonly vertical?: boolean}>`
  - `export const Sweep: React.FC<TransitionPresentationComponentProps<Record<string, never>>>`

- [ ] **Step 1: Tulis `src/v2/components/ScanBar.tsx`**

  Bilah `PALETTE.machine` dengan lebar 6 px (vertikal) atau tinggi 6 px (horizontal), ditambah gradient transparan → magenta diendered-depannya. `progress` 0..1 menentukan posisi; `vertical` default true (bilah bergerak horizontal dari kiri ke kanan).

- [ ] **Step 2: Tulis `src/v2/components/Sweep.tsx`**

  Menggantikan placeholder Sweep di Task 1. `presentationDirection === "exiting"`: `children` diberi `clipPath: inset(0 ${100 - p*100}% 0 0)` — bilah menyapu dari kiri. `presentationDirection === "entering"`: `children` diberi `clipPath: inset(0 0 0 ${p*100}%)` plus garis magenta 4 px di tepi bilah. `p` di-ease dengan `Easing.bezier(0.16, 1, 0.3, 1)`.

- [ ] **Step 3: Render dua frame lintas batas dan cek kontinuitas**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/sweep-a.png --frame=385 && npx remotion still src/index.ts TerumbuKarangV2 out/v2/sweep-b.png --frame=395`
  Expected: kedua still menunjukkan sebagian scene 1 dan sebagian scene 2 dengan bilah magenta di antaranya.

- [ ] **Step 4: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): bilah pemindai dan transisi Sweep"
  ```

---

### Task 8: Scene 1 — ENAM BULAN

**Files:**
- Modify: `src/v2/scenes/S1_EnamBulan.tsx`

**Interfaces:**
- Consumes: `Grid`, `GhostLayer`, `HumanText`, `Readout`, `ScanBar`, `reef.ts`, `theme.ts`.
- Produces: scene lengkap; replaced `Placeholder` untuk slot 1 di `src/v2/Main.tsx`.

- [ ] **Step 1: Susun slot scene 1**

  Slot (mengikuti aturan slot non-tumpang-tindih dari `docs/naskah-voiceover.md` v1):
  - Grid penuh sebagai latar (96–1824 × 108–972).
  - `HumanText` "TERUMBU KARANG" di `top: 196`, `maxWidth: 900`, size 72 — slot atas-kiri.
  - `Readout` "LAHAN BASAH · MARINE/COASTAL" di `top: 300` — slot kiri bawah headline.
  - `Readout` "RAMSAR · KODE C" di `top: 348`.
  - `HumanText` "ENAM BULAN" size 96, `top: 430`, aksen `PALETTE.machine` — blok tengah.
  - `Readout` "KITA TAHU 6 BULAN KEMUDIAN" di `top: 546`.

  Baris VO lokal: 0, 150, 228, 306 — headline muncul di frame 0, "ENAM BULAN" di 150, dst.

- [ ] **Step 2: Tulis manifest layout S1**

  `src/v2/layout/S1.json`:

  ```json
  {
    "regions": [
      {"label": "HEADLINE", "x": 96, "y": 186, "w": 900, "h": 90},
      {"label": "GLOSS", "x": 96, "y": 292, "w": 700, "h": 30},
      {"label": "CODE", "x": 96, "y": 340, "w": 700, "h": 30},
      {"label": "SIXMONTHS", "x": 96, "y": 420, "w": 1100, "h": 110},
      {"label": "DELAY", "x": 96, "y": 538, "w": 900, "h": 30}
    ],
    "keepOut": [
      {"label": "GRID-RIGHT", "x": 1200, "y": 120, "w": 600, "h": 200}
    ]
  }
  ```

  `keepOut` dipakai untuk memastikan tidak ada teks yang bocor ke area kanan atas tempat grid dibaca.

- [ ] **Step 3: Render dan jalankan pemeriksa layout**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s1.png --frame=306`
  Run: `node scripts/check-layout.mjs out/v2/s1.png src/v2/layout/S1.json`
  Expected: `OK: 5 region, N band`, exit 0.

  Kalau gagal: perbaiki posisi slot (bukan manifest) sampai teks muat.

- [ ] **Step 4: Pastikan tidak ada "A1" di layar**

  Run: `node scripts/bands.mjs out/v2/s1.png 96 120 1824 700 110` dan periksa secara visual bahwa tidak ada "A1". Tambahkan assert sederhana: `grep -c "A1"` tidak berlaku untuk PNG, jadi andalkan pemeriksaan visual + grep di sumber:
  Run: `grep -rn "A1" src/v2/` → Expected: tidak ada output.

- [ ] **Step 5: Verifikasi tipe dan lint**

  Run: `npx tsc --noEmit && npx eslint src` → exit 0.

- [ ] **Step 6: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 1 Enam Bulan"
  ```

---

### Task 9: Scene 2 — KODE C

**Files:**
- Create: `src/v2/scenes/S2_KodeC.tsx`
- Create: `src/v2/layout/S2.json`
- Modify: `src/v2/Main.tsx` (slot 2)

**Interfaces:**
- Consumes: komponen Task 4–7.
- Produces: scene + manifest.

- [ ] **Step 1: Susun scene 2 sebagai lookup di dataset**

  Grid dirombak jadi **tiga pita horizontal** (bukan 24×12 penuh): pita atas 12 baris `MARINE/COASTAL`, pita tengah 12 baris `INLAND`, pita bawah 12 baris `MAN-MADE`. Hanya pita atas menyala; dua pita lain meredup ke `PALETTE.inkSoft` pada frame 300 (VO baris 3).

  Satu tile di pita atas (col 9, row 3) **membesar** ke 2×2 tile mulai frame 236 dan mendapat stempel `C` (Readout `PALETTE.machine`, size 64). Field `Readout` di frame 256: `WETLAND TYPE CORAL REEFS` / `KODE C` / `KELOMPOK MARINE/COASTAL`.

  Dari frame 306, semua tile pita atas mendapat outline `PALETTE.machine` 2 px (perlindungan).

  Blok terjemahan di frame 440: `CORAL REEFS = TERUMBU KARANG` dan `MARINE/COASTAL = LAHAN BASAH LAUT & PESISIR` (Readout, `PIXEL_FONT`, size 12).

- [ ] **Step 2: Tulis `src/v2/layout/S2.json`** dengan region untuk judul, tiga label pita, tiga baris field, blok terjemahan, dan `keepOut` di area kanan atas.

- [ ] **Step 3: Render dan periksa layout**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s2.png --frame=460`
  Run: `node scripts/check-layout.mjs out/v2/s2.png src/v2/layout/S2.json`
  Expected: exit 0.

- [ ] **Step 4: Verifikasi kode Ramsar**

  Run: `grep -rn "A1" src/v2/` → Expected: tidak ada output. Pastikan `RAMSAR_V2.code === "C"`.

- [ ] **Step 5: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 2 Kode C"
  ```

---

### Task 10: Scene 3 — SATU METER KUBIK

**Files:**
- Create: `src/v2/scenes/S3_SatuMeterKubik.tsx`
- Create: `src/v2/layout/S3.json`
- Modify: `src/v2/Main.tsx` (slot 3)

**Interfaces:**
- Consumes: `Grid` dengan prop `zoom` dan `resolution`; komponen Task 4–7.

- [ ] **Step 1: Susun tiga operasi grid (bukan chart)**

  Frame 10–100: `Grid` di-`zoom` 4× ke tile (col 9, row 3); di dalamnya counter `Readout` "000" → "1.000" (tabular, `PALETTE.machine`) plus specik kecil yang memenuhi tile seiring counter naik.

  Frame 127–160: zoom kembali ke 1×; **seperempat** tile (deterministik, berdasarkan `seed`) menyala `PALETTE.reefBright`, sisanya `PALETTE.inkSoft`.

  Frame 232–260: baris paling bawah grid (row 11) dirender sebagai **profil gelombang**: tinggi setiap kolom mengikuti `sin`, lalu meredam (amplitudo mengecil) dari kiri ke kanan. `Readout` "2,4 m → 0,7 m" + "ILUSTRASI" di bawahnya.

  Frame 349–390: `Readout` caption "MASA DEPAN KARANG BUKAN URUSAN KARANG SAJA" (size 20, `PALETTE.human`) + `Readout` "Sumber: NOAA Ocean Service · Yuan et al. (2024)" (size 11, `PIXEL_FONT`).

- [ ] **Step 2: Tulis manifest dan verifikasi**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s3.png --frame=300`
  Run: `node scripts/check-layout.mjs out/v2/s3.png src/v2/layout/S3.json` → exit 0.

  Pastikan label "ILUSTRASI" benar-benar ada di frame 300 (gelombang) — ini memenuhi aturan spec bahwa angka non-pengukuran wajib dilabeli.

- [ ] **Step 3: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 3 Satu Meter Kubik"
  ```

---

### Task 11: Scene 4 — CARA LAMA

**Files:**
- Create: `src/v2/scenes/S4_CaraLama.tsx`
- Create: `src/v2/layout/S4.json`
- Modify: `src/v2/Main.tsx` (slot 4)

**Interfaces:**
- Consumes: komponen Task 4–7; `GhostLayer` (hantu **tidak** ada di scene 4? — lihat catatan).

- [ ] **Step 1: Tentukan peran hantu di scene 4**

  Hantu **ada** di scene 4 (sesuai spec §3.1) dan maknanya sama seperti di scene 1 dan 6: hantu adalah keadaan terumbu **6 bulan lalu** — ekuivalen dengan apa yang tercatat pada survei manusia terakhir. Jadi di scene 4 hantu lebih **hijau**, sementara grid sekarang sudah memunculkan petak putih. Perbedaan itu persis argumen scene: catatan manusia masih hijau, padahal mesin sudah melihat kerusakannya.

  Dokumentasikan di komentar file: `GhostLayer` selalu evaluating `frame - GHOST_LAG`; di scene 4 dan 6 kontrasnya dibalik terhadap pembacaan "apa yang dilaporkan manusia" vs "apa yang dilihat mesin".

- [ ] **Step 2: Susun adegan**

  Frame 10: `HumanText` "Bagaimana cara kita memantaunya?" size 56.
  Frame 76: ikon mata manusia digambar dari persegi (Readout + dua kotak) turun ke satu garis transek horizontal.
  Frame 127: garis transek + tick hitungan manual; `Readout` "TRANSEK 50 m".
  Frame 217: kalender — dua kotak Readout "1×/TAHUN" dan "2×/TAHUN", hanya yang kedua menyala.
  Frame 295: area yang disorot di grid mengecil (hanya ~4% tile menyala) + `Readout` "CAKUPAN 0,4%".
  Frame 409: `Readout` "MATA MANUSIA = TITIK LEMAH" dengan `PALETTE.machine`, dan satu tile diberi tanda silang magenta.

- [ ] **Step 3: Manifest + verifikasi**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s4.png --frame=460`
  Run: `node scripts/check-layout.mjs out/v2/s4.png src/v2/layout/S4.json` → exit 0.

- [ ] **Step 4: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 4 Cara Lama"
  ```

---

### Task 12: Scene 5 — EMPAT SENSOR

**Files:**
- Create: `src/v2/components/SensorStack.tsx`
- Create: `src/v2/scenes/S5_EmpatSensor.tsx`
- Create: `src/v2/layout/S5.json`
- Modify: `src/v2/Main.tsx` (slot 5)

**Interfaces:**
- Consumes: `Readout`, `Grid`, `PALETTE`.
- Produces:
  - `export const SensorStack: React.FC<{readonly frame: number; readonly active: 0 | 1 | 2 | 3; readonly merge?: number}>`
    - `active` = sensor yang sedang talking (0 termal, 1 kamera+AI, 2 akustik, 3 eDNA); `merge` 0..1 untuk menyatukan keempat bidang jadi satu grid.

- [ ] **Step 1: Tulis `src/v2/components/SensorStack.tsx`**

  Empat bidang (plane) ditumpuk vertikal dengan offset isometric: field 1728 × 864 dipecah jadi empat bidang setinggi 216 px, tiap bidang digeser `x += i * 26`, `y -= i * 14` supaya terbaca bertumpuk.

  - **Bidang 0 — termal:** grid dirender dengan kerapatan magenta proportional terhadap "suhu" (pakai `tile.seed`), tanpa ramp warna. Label `SENTINEL-2 · ΔT`.
  - **Bidang 1 — kamera + AI:** grid + satu `ScanBar` + bounding box magenta bergerak + `Readout` "BLEACHING 0.94".
  - **Bidang 2 — akustik:** grid diganti bar spektogram (batang magenta varying height) + `Readout` "PAM · 1.2 kHz".
  - **Bidang 3 — eDNA:** kolom read sekuensing (huruf A/C/G/T magenta beruntun) + `Readout` "42 GENUS vs 23".

- [ ] **Step 2: Susun scene 5**

  Frame 10: `HumanText` "Sekarang sensor yang mengerjakan." size 56.
  Frame 76/166/280/370: `active` berpindah ke bidang berikutnya tiap baris VO.
  Frame 472–520: `merge` 0→1, empat bidang menyatu ke satu grid.
  Frame 586: `Readout` "EMPAT SENSOR · SATU SISTEM".
  Frame 652: `Readout` "MATA MANUSIA TIDAK LAGI SENDIRIAN".

  Sumber per sensor di `Readout` kecil (size 11, `PIXEL_FONT`): "Wu et al. 2024 · Remote Sensing 16:2473", "Ouassine et al. 2025 · Ecological Informatics", "Williams et al. 2025", "Hong et al. 2025 · Marine Biodiversity".

- [ ] **Step 3: Manifest + verifikasi aturan satu warna**

  Run: `npx remotion still src/index.ts TerumboKarangV2 out/v2/s5.png --frame=300`
  Run: `node scripts/check-layout.mjs out/v2/s5.png src/v2/layout/S5.json` → exit 0.

  Run: `node scripts/bands.mjs out/v2/s5.png 0 0 1920 1080 60 FF2E88` → semua band terdeteksi harus magenta; secara visual pastikan tidak ada merah/oranye/biru di bidang termal.

- [ ] **Step 4: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 5 Empat Sensor dengan empat bidang sensor"
  ```

---

### Task 13: Scene 6 — APRIL 2024

**Files:**
- Create: `src/v2/scenes/S6_April2024.tsx`
- Create: `src/v2/layout/S6.json`
- Modify: `src/v2/Main.tsx` (slot 6)

**Interfaces:**
- Consumes: `Grid`, `GhostLayer`, `Readout`, `HumanText`, `reef.ts`.

- [ ] **Step 1: Susun banjir bleaching**

  `ev` untuk scene 6: `{startFrame: 40, spreadFrames: 300, originCol: 12, originRow: 0}` sehingga flooding turun dari atas. `Grid` memakai `quantize4(frame)` untuk waktu; `GhostLayer` memakai `frame - GHOST_LAG` → masih hijau.

  Frame 10: `HumanText` "April 2024." size 64 + `Readout` "ΔT +1,0 °C · DHW 6,4".
  Frame 100: counter `Readout` "84%" size 96 + `Readout` "ICRI & NOAA · APRIL 2024".
  Frame 166–268: grid berubah kuning `PALETTE.reefTip` → putih; caption `Readout` "MANUSIA BARU TAHU +3 BULAN".
  Frame 346: garis pengukur enam bulan digambar antara grid dan hantu, dengan `Readout` "SELISIH: 6 BULAN".
  Frame 502: `Readout` "RESPON BISA DIMULAI LEBIH AWAL" `PALETTE.machine` + satu tile berkedip.

- [ ] **Step 2: Manifest + verifikasi kontras hantu/sekarang**

  Run: `npx remotion still src/index.ts TerumboKarangV2 out/v2/s6.png --frame=380`
  Run: `node scripts/check-layout.mjs out/v2/s6.png src/v2/layout/S6.json` → exit 0.

  Band-scan layer hantu (area dengan offset −132/−96) harus menunjukkan petak berwarna (hijau), sementara area yang sama pada grid sekarang putih. Verifikasi dengan dua band-scan berbeda dan bandingkan hasilnya secara visual lewat ffmpeg crop.

- [ ] **Step 3: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 6 April 2024"
  ```

---

### Task 14: Scene 7 — DENYUT NADI + Triad

**Files:**
- Create: `src/v2/components/Triad.tsx`
- Create: `src/v2/scenes/S7_DenyutNadi.tsx`
- Create: `src/v2/layout/S7.json`
- Modify: `src/v2/Main.tsx` (slot 7)

**Interfaces:**
- Consumes: `Grid`, `GhostLayer` (dengan prop `merge`), `HumanText`, `Readout`, `RAMSAR_V2`.
- Produces:
  - `export const Triad: React.FC<{readonly lines: readonly string[]; readonly delay?: number; readonly stagger?: number; readonly size?: number; readonly accentWords?: readonly string[]; readonly accentColor?: string}>`

- [ ] **Step 1: Tulis `src/v2/components/Triad.tsx`**

  Tiga baris `HumanText` berpusat, `align: "center"`, jarak 10 px, `stagger` 6 frame antar baris, `rise` 18. Aksen memakai `accentWords` per baris.

- [ ] **Step 2: Susun scene 7**

  Frame 10: grid kembali hijau; denyut nadi = `Grid` dengan `scale` berdenyut ±0.004 pada periode 60 frame.
  Frame 100: `HumanText` "Sistemnya tahu saat karang sakit, dan saat kembali." size 44.
  Frame 214/280/319: `Triad` dengan baris `Terumbu karang bukan lanskap.` / `Dia infrastruktur.` / `Dia lahan basah yang bisa dipantau.` — aksen `PALETTE.machine` pada kata `BISA` `DIPANTAU` di baris ketiga.
  Frame 409–500: `GhostLayer` dengan `merge` 0→1 (hantu meluncur ke grid, offset → 0); `Readout` "YANG BISA DIPANTAU, BISA DILINDUNGI" size 22.
  Frame 540–570: lockup `RAMSAR_V2.code` di kotak magenta + `Terumbu Karang` + `LAHAN BASAH YANG BISA DIPANTAU`.
  Frame 580–650: daftar referensi muncul satu per satu (6 baris, `Readout` size 12, `PIXEL_FONT`), stagger 10 frame.

  Daftar referensi (6 entri, persis seperti di spec §5):
  1. Ramsar Convention Secretariat. *Classification of Wetland Types* (Rec. 4.7, 1990; amended Res. VI.5) — Marine/Coastal, C: Coral reefs.
  2. Wu, K., et al. (2024). Detection of Coral Reef Bleaching by Multitemporal Remote Sensing. *Remote Sensing*, 16(13), 2473.
  3. Ouassine, H., et al. (2025). Deep learning for automated coral reef monitoring. *Ecological Informatics*.
  4. Williams, N., et al. (2025). Unlocking the soundscape of coral reefs with artificial intelligence.
  5. Hong, D. K., et al. (2025). Multi-marker eDNA metabarcoding reveals more abundant taxa than diver surveys. *Marine Biodiversity*.
  6. ICRI & NOAA (2024). Fourth global coral bleaching event — April 2024.

- [ ] **Step 3: Manifest + verifikasi merge**

  Run: `npx remotion still src/index.ts TerumbuKarangV2 out/v2/s7.png --frame=470`
  Run: `node scripts/check-layout.mjs out/v2/s7.png src/v2/layout/S7.json` → exit 0.

  Band-scan dua area yang tumpang-tindih (satu pada posisi hantu sebelum merge, satu sesudah) untuk membuktikan offset hantu benar-benar bergerak ke 0 pada frame 500.

- [ ] **Step 4: Verifikasi kode dan label**

  Run: `grep -rn "A1" src/v2/` → Expected: tidak ada output.
  Pastikan label `ILUSTRASI` muncul di scene mana pun yang menampilkan angka ilustrasi.

- [ ] **Step 5: Commit**

  ```bash
  git add src/v2
  git commit -m "feat(v2): scene 7 Denyut Nadi dengan merge hantu"
  ```

---

### Task 15: Audio v2

**Files:**
- Modify: `scripts/generate-audio.mjs`
- Create: `src/v2/components/AudioBedV2.tsx`
- Modify: `src/v2/Main.tsx` (pasang `<AudioBedV2 />` di luar `TransitionSeries`)

**Interfaces:**
- Consumes: `src/audio.ts` untuk pola `VO_FILE`/`AMBIENT_GAIN`; `scripts/generate-audio.mjs` untuk util `writeWav`, `normalize`, `bandpass`, `mulberry32`.
- Produces:
  - `src/v2/components/AudioBedV2.tsx`: `export const AudioBedV2: React.FC` — memasang layer ambient v1 (level 0.12), hum "ruang data", tick, sweep, dan nada merge.

- [ ] **Step 1: Tambah generator audio baru**

  Di `scripts/generate-audio.mjs`, tambahkan lima generator baru yang menulis ke `public/audio/`:
  - `tick.wav` — klik pendek 18 ms, 2 kHz, decay cepat (bisa dipakai berulang).
  - `tick-echo.wav` — versi tick yang lebih redup dengan delay 260 ms (echo hantu).
  - `sweep.wav` — sweep 400→4000 Hz selama 1,2 detik, untuk transisi.
  - `merge.wav` — nada dua oscillators (220 Hz + 330 Hz) yang menyatu jadi satu, 2,5 detik.
  - `hum.wav` — noise yang di-lowpass 400 Hz, loop 8 detik (lapisan "ruang data").

  Tambahkan kelima file itu ke array `files` di main.

- [ ] **Step 2: Jalankan generator**

  Run: `npm run audio`
  Expected: `public/audio/` berisi berkas lama + 4 berkas baru; script exit 0.

- [ ] **Step 3: Tulis `AudioBedV2`**

  Ambient bawah laut (file v1, level 0.12) diputar kontinu. Hum "ruang data" = `hum.wav` (file baru, filter lowpass 400 Hz) pada level 0.05, di-mix dengan `<Audio volume={0.05} loop>`. Tick diputar pada frame statically-defined (mis. setiap 8 frame pada frame 20–120 scene 1, 4 frame pada scene 7 denyut). `sweep.wav` pada enam titik cut. `merge.wav` pada frame absolut 3700.

  Karena Remotion memutar `<Audio>` per frame, untuk tick yang berulang gunakan array frame eksplisit.

- [ ] **Step 4: Render still dan pastikan audio tidak_error**

  Run: `npx remotion still src/index.ts TerumboKarangV2 out/v2/audio-check.png --frame=3700`
  Expected: exit 0, tanpa error audio.

- [ ] **Step 5: Commit**

  ```bash
  git add scripts/generate-audio.mjs src/v2 public/audio
  git commit -m "feat(v2): lapisan audio tick, echo, sweep, dan merge"
  ```

---

### Task 16: Render penuh + sapuan verifikasi

**Files:**
- Modify: `src/v2/layout/*.json` bila ada temuan
- Create: `docs/naskah-voiceover-v2.md` — tambahkan bagian "Verifikasi" berisi hasil band-scan per scene

**Interfaces:**
- Consumes: seluruh hasil Task 1–15.

- [ ] **Step 1: Render video penuh**

  Run: `npx remotion render src/index.ts TerumbuKarangV2 out/terumbu-karang-v2.mp4 --codec h264`
  Expected: exit 0, file mp4 ada, durasi 130 detik.

- [ ] **Step 2: Render still tiap batas scene**

  Run, untuk tiap scene, still pada frame lokal 10, 150, dan 300 (atau frame terakhir scene bila scene lebih pendek):
  `npx remotion still src/index.ts TerumbuKarangV2 out/v2/check-<scene>-<frame>.png --frame=<absolut>`

  Frame absolut yang wajib: 0, 150, 306, 390, 636, 822, 990, 1329, 1500, 1899, 2010, 2652, 2730, 3222, 3300, 3699, 3899.

- [ ] **Step 3: Jalankan pemeriksa layout untuk semua manifest**

  Run: untuk tiap `src/v2/layout/*.json`, `node scripts/check-layout.mjs out/v2/check-<scene>-<frame>.png src/v2/layout/<scene>.json`
  Expected: semua exit 0.

- [ ] **Step 4: Verifikasi global lima butir Review Focus**

  1. `grep -rn "A1" src/v2/ docs/naskah-voiceover-v2.md` → tidak ada output.
  2. `node scripts/vo-check.mjs` → OK 235 kata.
  3. Band-scan dengan filter magenta pada scene 5 → hanya magenta.
  4. Band-scan scene 1 frame 150 → hantu dan sekarang berbeda.
  5. Cek secara visual bahwa `NOAA`, `Yuan`, `ICRI`, `Wu`, `Ouassine`, `Williams`, `Hong` muncul di scene yang sesuai.

- [ ] **Step 5: Verifikasi tipe dan lint**

  Run: `npx tsc --noEmit && npx eslint src` → exit 0.

- [ ] **Step 6: Tulis hasil verifikasi ke `docs/naskah-voiceover-v2.md`**

  Tambahkan tabel: scene | frame | band terdeteksi | slot | status. Tulis angka hasil pengukuran, bukan klaim umum.

- [ ] **Step 7: Commit**

  ```bash
  git add src/v2 docs/naskah-voiceover-v2.md
  git commit -m "chore(v2): render penuh dan hasil sapuan verifikasi layout"
  ```
