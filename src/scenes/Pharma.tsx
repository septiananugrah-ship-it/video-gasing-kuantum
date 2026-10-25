import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, win} from '../anim';
import {Atom, Badge, Bond, Glow, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

type A = [string, number, number];
// kerangka 2D skematis (atom berat saja), C3H8O
const PROPANOL1: A[] = [
  ['C', -150, 0],
  ['C', -50, -50],
  ['C', 50, 0],
  ['O', 150, -50],
];
const PROPANOL2: A[] = [
  ['C', -110, -40],
  ['C', 0, -10],
  ['C', 110, -40],
  ['O', 0, 95],
];
// pusat kiral skematis: satu karbon dengan empat gugus berbeda
const CHIRAL: A[] = [
  ['C', 0, 0],
  ['O', -110, -70],
  ['N', 105, -85],
  ['C', -25, 125],
  ['H', 80, 70],
];
const BONDS_CH = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
];
// molekul pembantu kiral (skematis, mirip propilena oksida: cincin C–C–O + metil)
const TAG: A[] = [
  ['C', -25, 10],
  ['C', 25, 10],
  ['O', 0, -32],
  ['C', -70, 34],
];
const BONDS_TAG = [
  [0, 1],
  [1, 2],
  [2, 0],
  [0, 3],
];
const BONDS1 = [
  [0, 1],
  [1, 2],
  [2, 3],
];
const BONDS2 = [
  [0, 1],
  [1, 2],
  [1, 3],
];

const Mol: React.FC<{x: number; y: number; atoms: A[]; bonds: number[][]; rot: number; s?: number; mirror?: boolean}> = ({x, y, atoms, bonds, rot, s = 1, mirror}) => {
  const P = atoms.map(([, ax, ay]) => {
    const mx = mirror ? -ax : ax;
    const c = Math.cos(rot);
    const sn = Math.sin(rot);
    return [x + (mx * c - ay * sn) * s, y + (ay * c + mx * sn) * s];
  });
  return (
    <g>
      {bonds.map(([a, b], i) => (
        <Bond key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} width={10 * s} />
      ))}
      {atoms.map(([el], i) => (
        <Atom key={i} x={P[i][0]} y={P[i][1]} el={el} r={30 * s} />
      ))}
    </g>
  );
};

const LINES1 = Array.from({length: 14}, (_, i) => ({x: rand(i * 3.3), h: 0.3 + 0.7 * rand(i * 1.7)}));
const LINES2 = Array.from({length: 14}, (_, i) => ({x: rand(i * 5.9 + 4), h: 0.3 + 0.7 * rand(i * 2.9 + 1)}));

export const Pharma: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(3) - 0.4, 0.5, 0.6);
  const pB = win(t, cue(3) - 0.2, cue(6) - 0.4, 0.7, 0.6);
  const pC = ramp(t, cue(6) - 0.2, cue(6) + 0.6);
  const iso = ramp(t, cue(1), cue(1) + 0.8, BACK);
  const spec = ramp(t, cue(2), cue(2) + 1.2);
  const year = ramp(t, cue(4), cue(4) + 0.8, BACK);
  const flow = ramp(t, cue(3) + 0.8, cue(5) + 1.2);
  const enL = ramp(t, cue(6) + 0.1, cue(6) + 0.9, BACK);
  const tag = ramp(t, wordOf(6, 'kiral') - 0.3, wordOf(6, 'kiral') + 0.7, BACK);
  const mirror = ramp(t, wordOf(6, 'enansiomer') - 0.4, wordOf(6, 'enansiomer') + 0.9);
  const diff = ramp(t, wordOf(6, 'enansiomer') + 0.8, wordOf(6, 'enansiomer') + 1.6);
  const calc = ramp(t, cue(7), cue(7) + 1);
  const rot = 0.25 * Math.sin(t * 0.7);
  return (
    <AbsoluteFill>
      <Stage>
        {/* A: isomer → spektrum berbeda */}
        <g opacity={pA}>
          <Glow x={480} y={460} r={320} color="violet" opacity={0.18} />
          <Mol x={480} y={380} atoms={PROPANOL1} bonds={BONDS1} rot={rot} />
          <Label x={480} y={455} size={26} color={C.aqua}>
            1-propanol
          </Label>
          <g opacity={iso}>
            <Mol x={480} y={590} atoms={PROPANOL2} bonds={BONDS2} rot={rot} />
            <Label x={480} y={760} size={26} color={C.coral}>
              2-propanol
            </Label>
            <Label x={480} y={250} size={30} weight={700} color={C.ink}>
              rumus sama: C₃H₈O (atom H tidak digambar)
            </Label>
          </g>
          <g opacity={spec}>
            {[0, 1].map((k) => {
              const y = k ? 690 : 420;
              const L = k ? LINES2 : LINES1;
              return (
                <g key={k}>
                  <line x1={1000} y1={y} x2={1780} y2={y} stroke={C.muted} strokeWidth={2} />
                  {L.map((l, i) => (
                    <line key={i} x1={1010 + l.x * 760} y1={y} x2={1010 + l.x * 760} y2={y - l.h * 170 * ramp(spec, i / 20, i / 20 + 0.3)} stroke={k ? C.coral : C.aqua} strokeWidth={4} strokeLinecap="round" />
                  ))}
                </g>
              );
            })}
            <Label x={1390} y={760} size={22} color={C.muted}>
              spektrum rotasi (skematis): pola garis berbeda
            </Label>
          </g>
        </g>

        {/* B: alur pemeriksaan bahan baku */}
        <g opacity={pB}>
          {[
            {x: 420, label: 'sampel bahan baku'},
            {x: 960, label: 'spektrometer MRR'},
            {x: 1500, label: 'identitas & kemurnian'},
          ].map((s, i) => {
            const p = ramp(flow, i * 0.3, i * 0.3 + 0.35);
            return (
              <g key={i} opacity={i === 0 ? Math.max(p, ramp(t, cue(3), cue(3) + 0.6)) : p}>
                <circle cx={s.x} cy={480} r={120} fill="rgba(160,125,255,0.08)" stroke={[C.sky, C.violet, C.lime][i]} strokeWidth={3} />
                {i === 0 ? (
                  <g>
                    <rect x={s.x - 30} y={410} width={60} height={110} rx={10} fill="rgba(92,200,255,0.25)" stroke={C.sky} strokeWidth={3} />
                    <rect x={s.x - 34} y={398} width={68} height={20} rx={4} fill={C.sky} />
                  </g>
                ) : i === 1 ? (
                  <g>
                    <rect x={s.x - 70} y={430} width={140} height={90} rx={12} fill="#ffffff" stroke={C.violet} strokeWidth={3} />
                    {[0, 1, 2, 3, 4].map((k) => (
                      <line key={k} x1={s.x - 50 + k * 25} y1={505} x2={s.x - 50 + k * 25} y2={505 - [30, 55, 20, 45, 35][k]} stroke={C.violet} strokeWidth={4} />
                    ))}
                  </g>
                ) : (
                  <path d={`M${s.x - 45},480 l30,32 l60,-70`} fill="none" stroke={C.lime} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
                )}
                <Label x={s.x} y={640} size={30} weight={600} color={C.ink}>
                  {s.label}
                </Label>
                {i < 2 ? <line x1={s.x + 135} y1={480} x2={s.x + 405} y2={480} stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" markerEnd="url(#arrow-muted)" opacity={p} /> : null}
              </g>
            );
          })}
          <Label x={960} y={720} size={26} color={C.muted} opacity={flow}>
            membedakan isomer tanpa kolom kromatografi
          </Label>
        </g>

        {/* C: enansiomer & perhitungan kuantum */}
        <g opacity={pC}>
          <line x1={720} y1={260} x2={720} y2={640} stroke={C.ink} strokeOpacity={0.4} strokeWidth={3} strokeDasharray="10 8" />
          <Label x={720} y={240} size={22} color={C.muted}>
            cermin
          </Label>
          <g opacity={enL}>
            <Mol x={480} y={440} atoms={CHIRAL} bonds={BONDS_CH} rot={0.2 * Math.sin(t)} s={1.2} />
          </g>
          {/* enansiomer kedua muncul dari cermin */}
          <g opacity={mirror}>
            <Mol x={720 + 240 * mirror} y={440} atoms={CHIRAL} bonds={BONDS_CH} rot={-0.2 * Math.sin(t)} s={1.2 * (0.4 + 0.6 * mirror)} mirror />
          </g>
          {/* pembantu kiral yang SAMA (tidak dicerminkan) menempel pada keduanya */}
          {[0, 1].map((k) => {
            const p = k === 0 ? tag : tag * ramp(t, wordOf(6, 'enansiomer') + 0.3, wordOf(6, 'enansiomer') + 1.1, BACK);
            const cx = k === 0 ? 480 : 960;
            const y = 236 - 50 * (1 - p);
            return (
              <g key={k} opacity={p}>
                <circle cx={cx + 5} cy={y + 2} r={72} fill="none" stroke={C.violet} strokeWidth={2.5} strokeDasharray="6 7" />
                <Mol x={cx + 12} y={y + 6} atoms={TAG} bonds={BONDS_TAG} rot={k === 0 ? -0.15 : 0.35} s={0.62} />
              </g>
            );
          })}
          <g opacity={tag * (1 - mirror)}>
            <Label x={398} y={244} size={24} weight={700} color={C.violet} anchor="end">
              molekul pembantu kiral →
            </Label>
          </g>
          <g opacity={mirror}>
            <Label x={720} y={690} size={28} weight={700} color={C.sun}>
              pasangan enansiomer (pusat kiral, skematis)
            </Label>
          </g>
          <g opacity={diff}>
            <Label x={720} y={736} size={24} color={C.violet}>
              + pembantu kiral yang sama → kompleks tak lagi bercermin → garis berbeda
            </Label>
          </g>
          <g opacity={calc}>
            <rect x={1180} y={300} width={600} height={360} rx={18} fill="rgba(255,255,255,0.92)" stroke={C.aqua} strokeWidth={2.5} />
            <line x1={1220} y1={600} x2={1740} y2={600} stroke={C.muted} strokeWidth={2} />
            {LINES1.slice(0, 9).map((l, i) => (
              <g key={i}>
                <line x1={1230 + l.x * 500} y1={600} x2={1230 + l.x * 500} y2={600 - l.h * 200} stroke={C.aqua} strokeWidth={5} />
                <line x1={1236 + l.x * 500} y1={600} x2={1236 + l.x * 500} y2={600 - l.h * 190 * calc} stroke={C.coral} strokeWidth={3} strokeDasharray="6 5" />
              </g>
            ))}
            <Label x={1480} y={340} size={24} color={C.ink}>
              terukur vs perhitungan kimia kuantum
            </Label>
            <Label x={1480} y={630} size={20} color={C.muted}>
              (skematis)
            </Label>
          </g>
        </g>
      </Stage>
      <Badge x={960} y={260} text="Spektroskopi Resonansi Rotasi Molekul (MRR)" color={C.violet} opacity={pB} size={32} />
      <Badge x={960} y={330} text="spektrometer chirped pulse · sekitar 2008" color={C.sun} opacity={pB * year} size={26} />
    </AbsoluteFill>
  );
};
