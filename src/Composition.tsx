import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, EASE_IN_OUT, ramp} from './anim';
import {Background, Vignette} from './components/Background';
import {Captions} from './components/Captions';
import {ChapterHeading} from './components/ChapterHeading';
import {POST, PRE, SceneProvider, useScene} from './SceneContext';
import {SCENES} from './scenes';
import {type VideoProps, defaultVideoProps} from './defaults.ts';
import {FPS, TIMELINE, lineKey, type TScene} from './timeline.ts';
import {C} from './theme';

export {defaultVideoProps, type VideoProps};

/**
 * Transisi "putar-tembus": adegan lama berputar sedikit searah jarum jam sambil membesar
 * dan memudar habis sebelum batas; adegan baru masuk dari putaran berlawanan.
 * Tidak ada dua adegan yang tampil bertumpuk.
 */
const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {t, dur} = useScene();
  const enter = ramp(t, 0, 0.7, EASE);
  const exit = ramp(t, dur - 0.55, dur + 0.05, EASE_IN_OUT);
  const push = 1 + 0.025 * (t / Math.max(dur, 1));
  const scale = push * (0.93 + 0.07 * enter) * (1 + 0.06 * exit);
  const rot = -5 * (1 - enter) + 5 * exit;
  const blur = 12 * (1 - enter) + 16 * exit;
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        scale: String(scale),
        rotate: `${rot.toFixed(2)}deg`,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SceneSlot: React.FC<{scene: TScene}> = ({scene}) => {
  const Comp = SCENES[scene.id];
  const pre = scene.index === 0 ? 0 : PRE;
  const from = Math.round((scene.start - pre) * FPS);
  const isLast = scene.index === TIMELINE.scenes.length - 1;
  const duration = Math.round((scene.duration + pre + (isLast ? 0 : POST)) * FPS);
  if (!Comp) return null;
  return (
    <Sequence name={`${scene.chapter ? scene.chapter + ' · ' : ''}${scene.title}`} from={from} durationInFrames={duration}>
      <SceneProvider scene={scene} pre={pre}>
        <SceneShell>
          <Comp />
        </SceneShell>
      </SceneProvider>
    </Sequence>
  );
};

/** Cincin cahaya yang mengembang di setiap pergantian adegan (selaras dengan whoosh musik). */
const TransitionRing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const b = TIMELINE.scenes.slice(1).find((s) => Math.abs(t - s.start) < 0.45);
  if (!b) return null;
  const p = Math.min(1, Math.max(0, (t - (b.start - 0.45)) / 0.9));
  const k = Math.pow(Math.sin(Math.PI * p), 1.6);
  const r = 60 + 900 * p;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 48%, rgba(12,158,134,${0.1 * k}), transparent 55%)`}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <ellipse cx={960} cy={518} rx={r} ry={r * 0.62} fill="none" stroke={C.aqua} strokeOpacity={0.4 * k} strokeWidth={2 + 5 * (1 - p)} />
        <ellipse cx={960} cy={518} rx={r * 0.8} ry={r * 0.5} fill="none" stroke={C.coral} strokeOpacity={0.25 * k} strokeWidth={1.5} />
      </svg>
    </AbsoluteFill>
  );
};

const MusicFade: React.FC<{volume: number}> = ({volume}) => {
  const {durationInFrames} = useVideoConfig();
  useCurrentFrame();
  return <Audio src={staticFile('music.mp3')} volume={(f) => volume * Math.min(1, f / 30) * Math.min(1, (durationInFrames - f) / 60)} />;
};

export const GasingKuantum: React.FC<VideoProps> = ({showCaptions, musicVolume, voiceover}) => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <Background />
    {TIMELINE.scenes.map((s) => (
      <SceneSlot key={s.id} scene={s} />
    ))}
    <TransitionRing />
    <ChapterHeading />
    {showCaptions ? <Captions /> : null}
    <Vignette />
    {musicVolume > 0 ? <MusicFade volume={musicVolume} /> : null}
    {voiceover
      ? TIMELINE.scenes.flatMap((s) =>
          s.tLines.map((l) => (
            <Sequence key={lineKey(s.id, l.index)} name={`VO ${lineKey(s.id, l.index)}`} from={Math.round(l.start * FPS)} layout="none">
              <Audio src={staticFile(`voiceover/${lineKey(s.id, l.index)}.mp3`)} />
            </Sequence>
          )),
        )
      : null}
  </AbsoluteFill>
);

/** Versi 2K (2560×1440): desain 1920×1080 diperbesar sebagai vektor, jadi tetap tajam. */
export const GasingKuantum2K: React.FC<VideoProps> = (props) => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <GasingKuantum {...props} />
    </div>
  </AbsoluteFill>
);

/** Pratinjau satu adegan (folder "Adegan" di Studio). */
export const SingleScene: React.FC<{sceneId: string}> = ({sceneId}) => {
  const scene = TIMELINE.scenes.find((s) => s.id === sceneId)!;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Sequence from={-Math.round(scene.start * FPS)} layout="absolute-fill">
        <Background />
        <SceneSlot scene={scene} />
        <ChapterHeading />
        <Captions />
        <Vignette />
      </Sequence>
    </AbsoluteFill>
  );
};
