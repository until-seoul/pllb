# Desain Video V2 — "Terumbu Karang: Lahan Basah yang Bisa Dipantau"

**Status:** menunggu review · **Tanggal:** 2026-11-01 · **Durasi:** 130 detik (3900 frame @ 30fps)

---

## 1. Why — latar belakang

Video V1 ("Lembar Survei Ramsar", 110 dtk) sudah dipresentasikan. Revisi dari dosen:
**penyelesaian masalah karang mutih harus terkait TI.** V1 sama sekali tidak punya
komponen teknologi — solusinya murni ekologi (nurseri, fragmen, rekayasa ekologi,
Rinkevich 2021).

Selain itu, V1 sudah "ke-spoiler": hook dan struktur visualnya sudah terlihat.
V2 harus berdiri sendiri sebagai karya, bukan revisi kosmetik.

**Topik tetap sama:** terumbu karang sebagai lahan basah Ramsar (kode **C**).

---

## 2. Tesis

> **Kategori lahan basah yang tertulis di atas kertas bisa diubah jadi sinyal yang hidup.**

Kode C adalah kategori hukum. Tapi "sehat atau tidak" hanya dicek sesekali oleh
mata manusia. TI menutup celah itu: terumbu karang punya denyut jantung digital,
dan lanskap yang dilindungi punya bukti yang bisa dipantau.

---

## 3. Konsep visual — "GRID REEF"

Substrat: **grid 24 × 12 petak** (72 px per petak, 1728 × 864 px, margin 96).

Aturan estetik (tiga lapis semantik):

| Lapis | Arti | Gaya | Gerak |
|---|---|---|---|
| **Dunia** | terumbu karang | petak persegi tajam, tanpa kurva, tanpa glow, palet 3 hijau → 2 putih | **di-quantize 4 frame** — dunia direduksi menjadi sel data |
| **Manusia** | narasi, headline, triad | Space Grotesk | halus 30 fps |
| **Mesin** | data, counter, label | Martian Mono + Silkscreen (mikro-telemetry) | halus, dengan tick 4 frame |

**R1 — satu warna untuk mesin.** Semua artefak mesin (grid, scan bar, bounding
box, counter, label, stempel C) digambar dalam **satu magenta** di atas ink.
Termal pun di-*duotone* magenta (kerapatan = panas), bukan ramp biru→merah.

**R2 — warna hanya milik karang.** Warna adalah denyut nadi karang. Saat karang
memutih, warnanya **mengalir keluar dari frame**. Arc warna = arc emosional film.

**R3 — dunia melangkah, readout mengalir.** Kontras antara petak yang ter-quantize
dan teks yang bergerak halus itulah yang membuat tema terasa, bukan sekadar dekorasi.

### 3.1 Peningkatan utama — "Hantu Enam Bulan"

Grid selalu menampilkan **hantu**: salinan terumbu yang sama **enam bulan lebih
lama**, digambar *desaturasi* (warnanya sudah dialirkan), dengan offset dan
opasitas lebih rendah.

- Hantu **ada** di scene 1, 3, 4, 6, 7 — di mana pun waktu karang itu sendiri
  yang dibicarakan.
- Hantu **tidak ada** di scene 2 (tampilan dataset) dan scene 5 (tumpukan sensor)
  — instrumen tidak punya masa lalu.
- Di scene 1, penonton langsung melihat petak sudah putih di hantu sementara
  grid sekarang masih hijau: **ironi dramatis**, klaim hook jadi gambar, bukan
  kalimat.
- **Penutup:** di scene 7 hantu meluncur masuk ke grid dan keduanya berimpit —
  jarak enam bulan menutup diri. *Tesis dan gambar menjadi hal yang sama.*

### 3.2 Peningkatan lain

- **Grid = field, bukan bingkai.** Kamera bisa memotong (1× → 2× → 4×), jadi
  scene 3 bisa masuk ke satu petak (1.000 spesies) dan scene 6 bisa menunjukkan
  seluruh ladang. Variasi skala tanpa perlu cut.
- **Tipografi berdisiplin.** Space Grotesk (manusia) · Martian Mono (mesin) ·
  Silkscreen (mikro-telemetry, tekstur bitmap). Tidak ada Fraunces, tidak ada
  IBM Plex Mono.
- **Transisi.** `BubbleWipe` v1 diganti **scan bar horizontal** yang menyapu dan
  me-*re-form* grid — transisi menyatu dengan motif AI.

---

## 4. Struktur & naskah

Cuts: **0:13 / 0:33 / 0:50 / 1:07 / 1:31 / 1:50**, akhir **2:10**.

Total **235 kata**, 97,2 detik bicara pada 145 kata/menit, jeda 32,8 detik (25%).
Semua jeda antar baris ≥ 0,2 dtk; tidak ada baris yang melewati batas scene
(divalidasi mesin).

### Scene 1 — ENAM BULAN (0:00–0:13)

Grid: petak hijau; hantu enam bulan lalu sudah putih. Pengukur jarak enam bulan.
Judul LAHAN BASAH. Ikon mata manusia.

| Mulai | Baris |
|---|---|
| 0:00.0 | Kalau karang memutih hari ini, kita tahu bulan depan. |
| 0:05.0 | Enam bulan sudah terlalu lambat. |
| 0:07.6 | Terumbu karang adalah lahan basah. |
| 0:10.2 | Kita masih memantaunya dengan mata. |

### Scene 2 — KODE C (0:13–0:33)

Grid berubah menjadi **dataset**: tiga pita kategori (`MARINE/COASTAL`,
`INLAND`, `MAN-MADE`). Hanya pita pertama menyala; satu petak membesar dan
mendapat stempel `C`; seluruh petak pita pertama diberi outline magenta
*protected*. Blok terjemahan: `CORAL REEFS = TERUMBU KARANG`,
`MARINE/COASTAL = LAHAN BASAH LAUT & PESISIR`.

| Mulai | Baris |
|---|---|
| 0:13.0 | Konvensi Ramsar memberi dunia satu taksonomi lahan basah. |
| 0:16.9 | Tiga kelompok: laut dan pesisir, daratan, dan buatan manusia. |
| 0:21.2 | Di kelompok laut, kodenya C: Coral reefs. |
| 0:24.7 | Status itu berarti perlindungan internasional. |
| 0:27.4 | Tapi perlindungan harus bisa dibuktikan, bukan sekadar diklaim. |

### Scene 3 — SATU METER KUBIK (0:33–0:50)

Zoom 4× ke satu petak; counter 000→1.000; seperempat grid menyala; baris bawah
grid menjadi profil gelombang yang meredam. Caption akhir:
`MASA DEPAN KARANG BUKAN URUSAN KARANG SAJA`.

| Mulai | Baris |
|---|---|
| 0:33.0 | Satu meter kubik karang menampung hingga seribu spesies. |
| 0:36.9 | Seperempat spesies laut dunia bergantung padanya. |
| 0:40.4 | Karang juga meredam gelombang sebelum mencapai daratan. |
| 0:44.3 | Sekali rusak, karang butuh puluhan tahun untuk pulih. |

### Scene 4 — CARA LAMA (0:50–1:07)

Grid kembali ke satu petak = satu transek. Ikon mata manusia turun ke garis
transek; hitungan manual; kalender 1–2×/tahun; area yang disorot kecil; titik
lemah ditandai magenta.

| Mulai | Baris |
|---|---|
| 0:50.0 | Bagaimana cara kita memantaunya? |
| 0:52.2 | Sampai sekarang: menyelam. |
| 0:53.9 | Penyelam menghitung spesies di garis transek. |
| 0:56.9 | Sekali, mungkin dua kali setahun. |
| 0:59.5 | Untuk daerah yang sedikit, dengan biaya besar. |
| 1:03.3 | Mata manusia menjadi titik lemahnya. |

### Scene 5 — EMPAT SENSOR (1:07–1:31)

Grid dipecah jadi **empat bidang bertumpuk**: termal (duotone magenta),
bounding box AI, spektrogram akustik, sekuensing DNA. Keempat bidang lalu
menyatu jadi satu grid.

| Mulai | Baris |
|---|---|
| 1:07.0 | Sekarang sensor yang mengerjakan. |
| 1:09.2 | Satelit termal, mengukur suhu permukaan laut. |
| 1:12.2 | Kamera bawah air dengan AI, mencari tanda pemutihan. |
| 1:16.0 | Hidrofon, merekam suara dan bunyi karang. |
| 1:19.0 | Air laut pun bisa jadi bahan sampel. |
| 1:22.4 | Dari air itu, DNA ikan dan karang dibaca. |
| 1:26.2 | Empat sensor, satu sistem. |
| 1:28.4 | Mata manusia tidak lagi sendirian. |

### Scene 6 — APRIL 2024 (1:31–1:50)

Grid menguning dari atas, warna mulai hilang; counter `84%`; caption `+3 bulan`;
selisih enam bulan ditandai; alert magenta menyala.

| Mulai | Baris |
|---|---|
| 1:31.0 | April 2024. Satu derajat, dan bertahan. |
| 1:34.0 | Satelit melihatnya lebih dulu. |
| 1:36.2 | AI menandai 84% terumbu dunia berstres panas. |
| 1:39.6 | Manusia baru mengetahuinya berbulan-bulan kemudian. |
| 1:42.2 | Selisihnya: bulan, bukan tahun. |
| 1:44.4 | Banyak karang sudah terlambat pulih. |
| 1:47.4 | Responnya bisa dimulai lebih awal. |

### Scene 7 — DENYUT NADI (1:50–2:10)

Grid hijau kembali berdenyut; **hantu meluncur masuk dan berimpit** dengan grid
sekarang; triad penutup dikunci dengan aksen pada `BISA DIPANTAU`; lockup
`C · CORAL REEFS`; daftar referensi muncul satu per satu.

| Mulai | Baris |
|---|---|
| 1:50.0 | Sekarang lahan basahnya punya denyut nadi. |
| 1:53.0 | Sistemnya tahu saat karang sakit, dan saat kembali. |
| 1:56.8 | Terumbu karang bukan lanskap. |
| 1:59.0 | Dia infrastruktur. |
| 2:00.3 | Dia lahan basah yang bisa dipantau. |
| 2:03.3 | Yang bisa dipantau, bisa dilindungi. |

> Baris terakhir diakhiri pada 2:05.4; sisa **4,6 detik** untuk merge hantu,
> lockup, dan daftar referensi.

---

## 5. SumberIlmiah

| Scene | Klaim | Sumber |
|---|---|---|
| 2 | Kode C = Coral reefs, kategori Marine/Coastal | Ramsar Convention Secretariat, *Classification of Wetland Types* (Rec. 4.7, 1990, amended Res. VI.5) |
| 3 | 1.000 spesies per m³; ~25% spesies laut | NOAA Ocean Service |
| 3 | Meredam gelombang sebelum mencapai daratan | Yuan et al. (2024), *Science of the Total Environment* 950 |
| 3 | Pemulihan karang memakan puluhan tahun | umum biologi karang (pertumbuhan beberapa mm/tahun) |
| 5 | Deteksi bleaching dari Sentinel-2 | Wu et al. (2024), *Remote Sensing* 16(13):2473 |
| 5 | Deteksi & pelacakan karang dari video (YOLOv8) | Ouassine et al. (2025), *Ecological Informatics* |
| 5 | Soundscape karang dengan AI | Williams et al. (2025) |
| 5 | eDNA menemukan 42 genera vs 23 (diver) | Hong et al. (2025), *Marine Biodiversity* |
| 6 | 84% terumbu dunia stres panas April 2024 | ICRI & NOAA (2024) |
| 6 | Ambang +1,0 °C / DHW | NOAA Coral Reef Watch |

Label "ilustrasi" tetap dipakai untuk angka yang bukan hasil pengukuran.

---

## 6. Implementasi

Struktur baru di repo yang sama, **V1 tidak dihapus** — V1 tetap jadi composition
`TerumbuKarang` (3300 frame), V2 jadi composition `TerumbuKarangV2` (3900 frame),
keduanya bisa dirender.

```
src/v2/
  theme.ts              palet, tipografi, konstanta grid, timing 7 scene
  components/
    Grid.tsx            field 24x12 + raster petak
    ReefTile.tsx        bentuk karang dari sub-persegi (seeded)
    GhostLayer.tsx      salinan 6 bulan: desaturasi + offset
    ScanBar.tsx         bilah pemindai + tick
    Readout.tsx         label mesin (Martian Mono / Silkscreen)
    SensorStack.tsx     empat bidang sensor
    Triad.tsx           penutup tiga baris
    Sweep.tsx           transisi scan (pengganti BubbleWipe)
  scenes/
    S1_EnamBulan.tsx … S7_DenyutNadi.tsx
src/Composition.tsx     + composition TerumbuKarangV2
```

Tidak ada aset SVG baru yang wajib: karang dibangun dari sub-persegi, ikon
sensor digambar dari persegi dan garis. `scripts/generate-audio.mjs` diperluas
dengan tick, sweep, dan nada merge — tetap disintesis dari nol.

---

## 7. Audio

| Lapis | Peran |
|---|---|
| Bed bawah laut (v1, level lebih rendah) | Ruang; tidak menutupi narasi |
| Hum "ruang data" | Menandai lapisan mesin |
| Tick per petak ter-resolve (4 frame) | Ritme visual, quantized |
| Echo tertunda | Tick hantu — enam bulan "lambat" |
| Sweep | Transisi antar scene |
| Nada panjang | Saat hantu berimpit di scene 7 |

---

## 8. Di luar lingkup

- Tidak mengubah scene, komponen, atau audio V1.
- Tidak membuat rekaman VO — `VO_FILE` tetap `null`, naskah dilepas sebagai
  `docs/naskah-voiceover-v2.md`.
- Tidak memakai aset pihak ketiga.
