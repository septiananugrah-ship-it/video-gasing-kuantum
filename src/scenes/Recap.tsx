import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, win} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {SpinningTop} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const CARDS = [
  {k: 'Kuantisasi', v: 'gelombang harus menutup → E & L diskret', col: C.aqua},
  {k: 'Rotor 3D', v: 'E = B̃ J(J+1) · 2J+1 orientasi', col: C.violet},
  {k: 'Aturan seleksi', v: 'butuh dipol · ΔJ = ±1 · jarak garis 2B̃', col: C.sun},
  {k: 'Kimia', v: 'panjang ikatan · isotop · suhu', col: C.sky},
  {k: 'Industri', v: 'oven · cuaca · astronomi · farmasi', col: C.coral},
];
const POS = [
  [470, 300],
  [1450, 300],
  [380, 560],
  [1540, 560],
  [960, 760],
];
// molekul udara di sekitar gasing (zona tengah dikosongkan untuk gasing)
const SWARM = Array.from({length: 22}, (_, i) => {
  let x = 200 + rand(i) * 1520;
  if (Math.abs(x - 960) < 250) x = 960 + Math.sign(x - 960 || 1) * (250 + Math.abs(x - 960) * 0.6);
  return {x, y: 230 + rand(i * 3.3) * 380, ph: rand(i * 7) * 6, s: 0.4 + rand(i * 2.1) * 0.4};
});

export const Recap: React.FC = () => {
  const {t, cue} = useScene();
  const pA = win(t, -1, cue(6) - 0.3, 0.5, 0.7);
  const pB = ramp(t, cue(6) - 0.2, cue(6) + 1);
  const swarm = ramp(t, cue(7), cue(7) + 1.5);
  const end = ramp(t, cue(8), cue(8) + 1.2);
  const top = ramp(t, cue(6) - 0.1, cue(6) + 0.8, BACK);
  const topS = 1.25 - 0.3 * ramp(t, cue(7), cue(7) + 1.5);
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={960} y={470} r={360} color="violet" opacity={0.25} />
        <g opacity={pA}>
          <ellipse cx={960} cy={470} rx={210} ry={70} fill="none" stroke={C.aqua} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="5 10" />
          <Diatomic cx={960} cy={470} theta={Math.PI / 2 - 0.2} phi={t * 1.2} len={260} rA={48} rB={50} massRatio={0.43} pitch={0.4} />
        </g>
        <g opacity={pB * top} transform={`translate(0 ${(1 - top) * 40})`}>
          <SpinningTop x={960} y={600} t={t} scale={topS} />
        </g>
        <g opacity={pB}>
          {SWARM.map((m, i) => (
            <g key={i} opacity={swarm * 0.8}>
              <Diatomic cx={m.x} cy={m.y} theta={1.2 + 0.4 * Math.sin(t + i)} phi={t * (0.8 + m.s) + m.ph} len={120 * m.s} rA={20 * m.s + 6} rB={20 * m.s + 6} massRatio={0.5} pitch={0.4} elA={i % 3 ? 'N' : 'C'} elB={i % 3 ? 'N' : 'O'} />
            </g>
          ))}
        </g>
      </Stage>
      {CARDS.map((c, i) => {
        const p = ramp(t, cue(i + 1) - 0.2, cue(i + 1) + 0.6, BACK);
        const active = t >= cue(i + 1) - 0.2 && t < cue(i + 2) - 0.2;
        return (
          <div
            key={c.k}
            style={{
              position: 'absolute',
              left: POS[i][0],
              top: POS[i][1],
              transform: `translate(-50%, -50%) scale(${(0.9 + 0.1 * p) * (active ? 1.04 : 1)})`,
              opacity: p * pA * (active ? 1 : 0.75),
              padding: '16px 26px',
              borderRadius: 20,
              background: '#ffffff',
              border: `2px solid ${C.ink}`,
              borderTop: `10px solid ${c.col}`,
              boxShadow: active ? `6px 7px 0 ${c.col}66` : `5px 6px 0 rgba(35,32,63,0.1)`,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: c.col}}>{c.k}</div>
            <div style={{fontFamily: FONT.sans, fontSize: 24, color: C.ink, marginTop: 4}}>{c.v}</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          top: 690,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 800,
          color: C.ink,
          opacity: end,
          textShadow: '3px 3px 0 #fdefcf',
        }}
      >
        berputar mengikuti tangga <span style={{color: C.aqua}}>mekanika kuantum</span>
      </div>
    </AbsoluteFill>
  );
};
