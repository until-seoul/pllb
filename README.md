# Terumbu Karang: Lahan Basah di Bawah Laut

Video edukasi motion graphic 110 detik (1920×1080, 30fps) tentang terumbu karang
sebagai lahan basah pesisir dalam klasifikasi Ramsar — **Marine/Coastal
(Lahan Basah Laut & Pesisir) → C (Coral reefs)**.

**Konsep visual — "Lembar Survei Ramsar".** Video ini diposisikan sebagai satu
halaman lembar survei lapangan yang hidup, bukan explainer generik. Tiga
penanda identitas:

1. **HUD instrumen permanen** — kolom kedalaman di tepi kiri yang menghitung
   turun sepanjang video (meter → milimeter di scene 3), chip kategori Ramsar,
   dan catatan lapangan.
2. **"Penjelajah"** — satu sel zooxanthella sebagai karakter: memberi karang
   warnanya, ikut memutih saat bleaching, pulih di scene restorasi.
3. **Transisi "bubble wall"** — selalu berangkat dari titik tengah frame, tempat
   objek kunci tiap scene berada.

Naskah voice-over lengkap ada di [`docs/naskah-voiceover.md`](docs/naskah-voiceover.md).

## Struktur

```
src/
  Main.tsx              timeline: 6 scene + 5 transisi BubbleWipe + AudioBed
  Root.tsx              registrasi Composition (3300 frame @ 30fps)
  theme.ts              palet, font, timing scene, model kedalaman
  audio.ts              konfigurasi narasi (VO) dan layer SFX
  components/           KineticText, Hud, BubbleWipe, Explorer, Water, Assets, AudioBed
  scenes/               Scene1_Hook … Scene6_Hope
scripts/
  generate-audio.mjs    sintesis bed ambient + SFX transisi (WAV, tanpa aset eksternal)
public/audio/           hasil sintesis audio
```

`CoralSVG`, `FishSVG`, dan `PolypSVG` di `src/components/Assets.tsx` adalah
placeholder — ganti isi `<svg>`-nya dengan aset milikmu, posisi dan skalanya
tetap teranimasi.

## Suara

Narasi (VO) adalah lapisan utama; SFX hanya pendukung: bed ambient bawah
laut, aksen whoosh di setiap transisi, dan detikan gelembung pada momen visual.
Semua file audio di `public/audio/` **didisintesis dari nol** oleh
`scripts/generate-audio.mjs` (bebas lisensi) — buat ulang dengan:

```console
npm run audio
```

Pasang rekaman VO: simpan ke `public/audio/vo.mp3`, lalu di `src/audio.ts` ubah
`VO_FILE` menjadi `"audio/vo.mp3"`. Turunkan `AMBIENT_GAIN` kalau narasi
terasa tenggelam.

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
