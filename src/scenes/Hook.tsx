import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, smoothPath} from '../anim';
import {Glow, Label, Stage} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {Oven} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

/** Antena parabola. */
const Dish: React.FC<{x: number; y: number; s: number; tilt: number}> = ({x, y, s, tilt}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12,0 L-40,120 L40,120 L12,0 Z" fill="#e4e0f2" stroke={C.ink} strokeWidth={3} />
    <g transform={`rotate(${tilt})`}>
      <path d="M-110,-40 Q0,60 110,-40 Q0,10 -110,-40 Z" fill="#ffffff" stroke={C.ink} strokeWidth={3} />
      <line x1={0} y1={8} x2={0} y2={-70} stroke={C.ink} strokeWidth={4} />
      <circle cx={0} cy={-74} r={8} fill={C.aqua} />
    </g>
  </g>
);

export const Hook: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const ovenIn = ramp(t, 0.2, 1.4, BACK);
  const dishIn = ramp(t, cue(1) - 0.3, cue(1) + 1, BACK);
  const waves = ramp(t, cue(2), cue(2) + 1);
  const mol = ramp(t, wordOf(3, 'molekul') - 0.2, wordOf(3, 'molekul') + 0.8, BACK);
  const pick = ramp(t, cue(4) + 0.4, cue(4) + 1.2, BACK);
  const myth = ramp(t, cue(5), cue(5) + 0.8, BACK);
  const focus = ramp(t, cue(6) - 0.2, cue(6) + 1.4, EASE_IN_OUT);
  const end = 1 - ramp(t, dur - 0.9, dur - 0.1);
  const molX = mix(960, 960, focus);
  const molY = mix(330, 480, focus);
  const molS = mix(0.8, 1.5, focus);
  return (
    <AbsoluteFill>
      <Stage>
        {/* kiri: dapur */}
        <g opacity={ovenIn * (1 - focus)} transform={`translate(0 ${(1 - ovenIn) * 40})`}>
          <Glow x={470} y={560} r={360} color="sun" opacity={0.18} />
          <Oven x={470} y={590} t={t} glow={ovenIn} />
          <Label x={470} y={800} size={28} color={C.muted}>
            dapur · 2,45 GHz
          </Label>
        </g>
        {/* kanan: gurun & bintang */}
        <g opacity={dishIn * (1 - focus)} transform={`translate(0 ${(1 - dishIn) * 40})`}>
          <defs>
            <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9d2fb" />
              <stop offset="100%" stopColor="#fde3d4" />
            </linearGradient>
          </defs>
          <rect x={1060} y={170} width={820} height={600} rx={36} fill="url(#dusk)" stroke={C.ink} strokeWidth={3} />
          {Array.from({length: 60}, (_, i) => (
            <circle key={i} cx={1100 + rand(i) * 720} cy={190 + rand(i + 9) * 330} r={1 + rand(i + 3) * 2.2} fill={C.violet} opacity={0.12 + 0.25 * rand(i + 5) * (0.6 + 0.4 * Math.sin(t * 2 + i))} />
          ))}
          <ellipse cx={1680} cy={260} rx={130} ry={60} fill="url(#soft-violet)" opacity={0.7} />
          <ellipse cx={1660} cy={250} rx={70} ry={30} fill="url(#soft-coral)" opacity={0.6} />
          <path d="M1060,740 Q1300,670 1480,720 T1880,700 L1880,770 Q1880,770 1844,770 L1096,770 Q1060,770 1060,740 Z" fill="#f6cfb5" stroke={C.ink} strokeWidth={3} />
          <Dish x={1260} y={610} s={0.9} tilt={-24} />
          <Dish x={1460} y={630} s={0.75} tilt={-24} />
          <Dish x={1620} y={650} s={0.6} tilt={-24} />
          <Label x={1450} y={810} size={28} color={C.muted}>
            teleskop radio · garis CO 115 GHz
          </Label>
          {/* gelombang dari awan ke antena */}
          {[0, 1, 2, 3].map((k) => {
            const p = ((t * 0.6 + k / 4) % 1) * waves;
            return <circle key={k} cx={mix(1660, 1290, p)} cy={mix(260, 540, p)} r={10 + 30 * p} fill="none" stroke={C.aqua} strokeOpacity={0.6 * (1 - p) * waves} strokeWidth={3} />;
          })}
        </g>
        {/* gelombang mikro yang menghubungkan */}
        <path
          d={smoothPath(Array.from({length: 120}, (_, i) => [760 + i * 3.3, 430 + 26 * Math.sin(i * 0.22 - t * 5)] as [number, number]))}
          fill="none"
          stroke={C.aqua}
          strokeWidth={4}
          opacity={waves * (1 - focus) * (1 - mol * 0.7)}
         
        />
        {/* molekul berputar */}
        <g opacity={mol * end}>
          <Glow x={molX} y={molY} r={220 * molS} color="aqua" opacity={0.25} />
          <ellipse cx={molX} cy={molY} rx={150 * molS} ry={52 * molS} fill="none" stroke={C.aqua} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 10" />
          <Diatomic cx={molX} cy={molY} theta={Math.PI / 2} phi={t * 2.2} len={140 * molS} rA={34 * molS} rB={34 * molS} massRatio={0.43} pitch={0.5} />
        </g>
        {/* centang di antena, tanda tanya di oven */}
        <g opacity={pick * (1 - focus)}>
          <circle cx={1260} cy={430} r={40} fill="rgba(54,241,205,0.15)" stroke={C.aqua} strokeWidth={4} />
          <path d="M1242,430 l13,14 l24,-28" fill="none" stroke={C.aqua} strokeWidth={6} strokeLinecap="round" />
        </g>
        <g opacity={myth * (1 - focus)}>
          <circle cx={470} cy={390} r={40} fill="rgba(255,107,139,0.15)" stroke={C.coral} strokeWidth={4} />
          <Label x={470} y={392} size={48} weight={800} color={C.coral}>
            ?
          </Label>
        </g>
        {/* pertanyaan inti */}
        <g opacity={ramp(t, cue(7) - 0.2, cue(7) + 0.8) * end}>
          <Label x={960} y={720} size={46} weight={700} color={C.ink}>
            Bagaimana molekul berputar
          </Label>
          <Label x={960} y={778} size={46} weight={700} color={C.aqua}>
            menurut mekanika kuantum?
          </Label>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
