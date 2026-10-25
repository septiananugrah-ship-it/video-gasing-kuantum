import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {ringWavePath} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const ITEMS = [
  {n: '1', title: 'Prinsip & teori dasar', sub: 'cincin · rotor 3D · aturan seleksi', color: C.aqua},
  {n: '2', title: 'Implementasi dalam kimia', sub: 'panjang ikatan · isotop · spektrometer', color: C.violet},
  {n: '3', title: 'Penerapan di industri', sub: 'oven · satelit · teleskop · farmasi', color: C.coral},
];

const Icon: React.FC<{i: number; x: number; y: number; t: number; color: string}> = ({i, x, y, t, color}) => {
  if (i === 0) return <path d={ringWavePath(x, y, 70, 14, 3, t * 3)} fill="none" stroke={color} strokeWidth={4} />;
  if (i === 1)
    return (
      <g>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <line key={k} x1={x - 75 + k * 30} y1={y + 55} x2={x - 75 + k * 30} y2={y + 55 - [40, 75, 100, 90, 60, 30][k]} stroke={color} strokeWidth={8} strokeLinecap="round" />
        ))}
        <line x1={x - 95} y1={y + 58} x2={x + 95} y2={y + 58} stroke={C.muted} strokeWidth={2} />
      </g>
    );
  return (
    <g transform={`rotate(${t * 20} ${x} ${y})`}>
      {Array.from({length: 8}, (_, k) => (
        <rect key={k} x={x - 12} y={y - 78} width={24} height={30} rx={5} fill={color} transform={`rotate(${k * 45} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={52} fill="none" stroke={color} strokeWidth={14} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  // "tiga bagian": ketiga kartu menyala bergiliran (setengah terang), lalu terang penuh saat disebut
  const base = (i: number) => 0.22 + 0.33 * ramp(t, wordOf(0, 'tiga') - 0.2 + i * 0.25, wordOf(0, 'tiga') + 0.5 + i * 0.25, BACK);
  return (
    <AbsoluteFill>
      <Stage>
        {ITEMS.map((it, i) => {
          const x = 380 + i * 580;
          const p = ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.6, BACK);
          const active = t >= cue(i + 1) - 0.3 && (i === 2 || t < cue(i + 2) - 0.3);
          return (
            <g key={i} opacity={base(i) + (1 - base(i)) * p} transform={`translate(0 ${(1 - p) * 30})`}>
              <Glow x={x} y={420} r={240} color={(['aqua', 'violet', 'coral'] as const)[i]} opacity={active ? 0.3 : 0.08} />
              <Icon i={i} x={x} y={420} t={t} color={it.color} />
            </g>
          );
        })}
        <line x1={300} y1={250} x2={1620} y2={250} stroke={C.faint} strokeWidth={2} strokeDasharray="3 10" opacity={ramp(t, 0, 1)} />
      </Stage>
      {ITEMS.map((it, i) => {
        const x = 380 + i * 580;
        const p = ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.6, BACK);
        return (
          <div key={i} style={{position: 'absolute', left: x - 250, width: 500, top: 560, textAlign: 'center', opacity: base(i) + (1 - base(i)) * p}}>
            <div style={{fontFamily: FONT.mono, fontSize: 24, color: it.color, letterSpacing: 4}}>BAGIAN {it.n}</div>
            <div style={{fontFamily: FONT.sans, fontSize: 40, fontWeight: 700, color: C.ink, marginTop: 8}}>{it.title}</div>
            <div style={{fontFamily: FONT.sans, fontSize: 25, color: C.muted, marginTop: 10}}>{it.sub}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, letterSpacing: 6, color: C.muted, opacity: ramp(t, 0.2, 1)}}>
        PETA VIDEO
      </div>
    </AbsoluteFill>
  );
};
