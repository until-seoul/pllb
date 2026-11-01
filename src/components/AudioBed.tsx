import React from "react";
import {Audio} from "@remotion/media";
import {interpolate, Sequence, staticFile} from "remotion";
import {CUT_FRAMES, VIDEO} from "../theme";
import {AMBIENT_GAIN, BUBBLE_ACCENTS, SFX, VO_FILE, VO_GAIN} from "../audio";

/**
 * SOUND DESIGN.
 *
 * Tiga lapis: (1) bed ambient yang mengikuti dive kamera, (2) aksen transisi
 * "bubble wall" di setiap batas scene, (3) detikan gelembung pada momen
 * visual tertentu. Narasi (VO) tidak disertakan — letakkan file rekamanmu di
 * public/audio/ lalu isi VO_FILE di src/audio.ts.
 *
 * Semua lapisan ambient dijaga rendah (maks 0,2) supaya narasi tetap
 * menjadi suara utama.
 */
export const AudioBed: React.FC = () => {
  /** Level bed bawah laut mengikuti kedalaman naratif video. */
  const underwaterVolume = (f: number) =>
    interpolate(
      f,
      [90, 150, 880, 1180, 1420, 2140, 2600, 3240, VIDEO.durationInFrames],
      [0, 0.2, 0.2, 0.09, 0.2, 0.2, 0.17, 0.17, 0],
      {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
    ) * AMBIENT_GAIN;

  /** Angin permukaan hanya hidup sebelum kamera menyelam. */
  const surfaceVolume = (f: number) =>
    interpolate(
      f,
      [0, 24, 92, 148],
      [0, 0.16, 0.16, 0],
      {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
    ) * AMBIENT_GAIN;

  return (
    <>
      {VO_FILE ? (
        <Audio src={staticFile(VO_FILE)} volume={VO_GAIN} />
      ) : null}

      <Audio
        src={staticFile(SFX.underwater)}
        loop
        loopVolumeCurveBehavior="extend"
        volume={underwaterVolume}
      />

      <Audio
        src={staticFile(SFX.surface)}
        loop
        loopVolumeCurveBehavior="extend"
        volume={surfaceVolume}
      />

      {/* Aksen transisi — jatuh tepat di titik potong antar scene */}
      {CUT_FRAMES.map((cut) => (
        <Sequence
          key={cut}
          from={Math.max(0, cut - 14)}
          durationInFrames={70}
        >
          <Audio src={staticFile(SFX.whoosh)} volume={0.32} />
        </Sequence>
      ))}

      {/* Detikan gelembung pada momen visual tertentu */}
      {BUBBLE_ACCENTS.map((accent, i) => (
        <Sequence
          key={`${accent.frame}-${i}`}
          from={Math.max(0, accent.frame)}
          durationInFrames={70}
        >
          <Audio src={staticFile(SFX.bubble)} volume={accent.volume} />
        </Sequence>
      ))}

      {/* Cluster gelembung saat kamera menyelam di scene 1 */}
      <Sequence from={92} durationInFrames={80}>
        <Audio src={staticFile(SFX.bubbles)} volume={0.34} />
      </Sequence>
    </>
  );
};
