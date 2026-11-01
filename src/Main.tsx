import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { COLORS, SCENES, TRANSITION_FRAMES } from "./theme";
import { BubbleWipe } from "./components/BubbleWipe";
import { AudioBed } from "./components/AudioBed";
import {
  Scene1Hook,
  Scene2Ramsar,
  Scene3Symbiosis,
  Scene4Defense,
  Scene5Threat,
  Scene6Hope,
} from "./Composition";

/**
 * TIMELINE UTAMA.
 *
 * Enam scene disusun berurutan; setiap batas scene memakai "bubble wall" —
 * transisi yang selalu berangkat dari titik tengah frame. Karena transisi
 * memotong 20 frame dari tiap scene, panjang scene disetel agar titik potong
 * (dan karena itu timestamp naskah VO) jatuh persis di detik 12, 30, 47, 72,
 * dan 91. Total durasi: 3300 frame = 110 detik @ 30fps.
 *
 * Lapisan suara (bed ambient + aksen transisi + detikan gelembung) dipasang
 * di luar TransitionSeries supaya bisa membaca frame absolut.
 */
export const Main: React.FC = () => {
  const [hook, ramsar, symbiosis, defense, threat, hope] = SCENES;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.abyss }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="01 · Hook" durationInFrames={hook.duration}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={{ component: BubbleWipe, props: {} }}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          name="02 · Ramsar C"
          durationInFrames={ramsar.duration}
        >
          <Scene2Ramsar />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={{ component: BubbleWipe, props: {} }}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          name="03 · Simbiosis"
          durationInFrames={symbiosis.duration}
        >
          <Scene3Symbiosis />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={{ component: BubbleWipe, props: {} }}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          name="04 · Pertahanan"
          durationInFrames={defense.duration}
        >
          <Scene4Defense />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={{ component: BubbleWipe, props: {} }}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          name="05 · Ancaman"
          durationInFrames={threat.duration}
        >
          <Scene5Threat />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={{ component: BubbleWipe, props: {} }}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          name="06 · Harapan"
          durationInFrames={hope.duration}
        >
          <Scene6Hope />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <AudioBed />
    </AbsoluteFill>
  );
};
