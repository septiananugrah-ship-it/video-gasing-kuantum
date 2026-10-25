import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, smoothPath} from '../anim';
import {Badge, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const MOL = Array.from({length: 26}, (_, i) => ({sx: rand(i * 3.3), sy: rand(i * 5.1 + 2), ph: rand(i * 7.7) * Math.PI * 2, sp: 0.6 + rand(i * 1.9)}));

export const Instrument: React.FC = () => {
  const {t, cue} = useScene();
  const box = ramp(t, 0.2, 1.2);
  const jet = ramp(t, cue(2), cue(2) + 1);
  const pulse = ramp(t, cue(3), cue(3) + 0.8);
  const sync = ramp(t, cue(4), cue(4) + 1);
  const fid = ramp(t, cue(5), cue(5) + 1);
  const ft = ramp(t, cue(6), cue(6) + 1.2);
  const prec = ramp(t, cue(7), cue(7) + 0.8, BACK);
  // denyut lewat ruang sampel
  const pulsePos = ((t - cue(3)) * 0.8) % 1;
  return (
    <AbsoluteFill>
      <Stage>
        {/* ruang vakum */}
        <g opacity={box}>
          <rect x={260} y={250} width={780} height={430} rx={40} fill="rgba(255,255,255,0.75)" stroke="#7b72b5" strokeWidth={3} />
          <Label x={650} y={715} size={24} color={C.muted}>
            ruang bertekanan sangat rendah
          </Label>
          {/* nosel */}
          <path d="M200,430 L290,445 L290,485 L200,500 Z" fill="#5d548f" stroke="#a69de0" strokeWidth={2} opacity={jet} />
          <Label x={230} y={540} size={22} color={C.sky} opacity={jet}>
            nosel
          </Label>
          {/* antena tanduk kiri-kanan */}
          <path d="M1000,320 L940,350 L940,580 L1000,610 Z" fill="rgba(255,209,102,0.12)" stroke={C.sun} strokeWidth={2} />
          <Label x={970} y={300} size={22} color={C.sun}>
            antena
          </Label>
          {/* molekul */}
          {MOL.map((m, i) => {
            const coneX = 300 + ((m.sx + t * 0.12 * m.sp * (0.3 + jet)) % 1) * 620;
            const spread = (coneX - 300) / 620;
            const y = 465 + (m.sy - 0.5) * (40 + 330 * spread);
            const a = sync > 0.5 ? t * 3 : m.ph + t * 3 * m.sp;
            const blend = sync;
            const ang = a * blend + (m.ph + t * 3 * m.sp) * (1 - blend);
            const dx = Math.cos(ang) * 16;
            const dy = Math.sin(ang) * 16;
            return (
              <g key={i} opacity={0.4 + 0.6 * box}>
                <line x1={coneX - dx} y1={y - dy} x2={coneX + dx} y2={y + dy} stroke="#8a84ad" strokeWidth={4} />
                <circle cx={coneX - dx} cy={y - dy} r={7} fill="#6b6690" />
                <circle cx={coneX + dx} cy={y + dy} r={7} fill={C.coral} />
              </g>
            );
          })}
          <g opacity={jet}>
            <Label x={650} y={220} size={28} weight={700} color={C.sky}>
              pancaran supersonik · beberapa kelvin
            </Label>
          </g>
          {/* denyut gelombang mikro */}
          <g opacity={pulse * (1 - fid * 0.7)}>
            <path
              d={smoothPath(Array.from({length: 60}, (_, i) => [940 - pulsePos * 600 - i * 3, 465 + 40 * Math.sin(i * (0.3 + i * 0.012))] as [number, number]))}
              fill="none"
              stroke={C.sun}
              strokeWidth={4}
            />
          </g>
          {/* pancaran balik */}
          {[0, 1, 2].map((k) => {
            const p = (t * 0.6 + k / 3) % 1;
            return <circle key={k} cx={650} cy={465} r={60 + 250 * p} fill="none" stroke={C.aqua} strokeWidth={3} opacity={fid * (1 - p) * 0.6} />;
          })}
        </g>
        {/* panel sinyal kanan */}
        <g opacity={pulse}>
          <Label x={1150} y={300} size={24} color={C.sun} anchor="start">
            1 · denyut kicau (chirp)
          </Label>
          <path d={smoothPath(Array.from({length: 240}, (_, i) => [1150 + i * 2.7, 360 + 32 * Math.sin(0.02 * i * i * 0.35)] as [number, number]))} fill="none" stroke={C.sun} strokeWidth={2.5} />
        </g>
        <g opacity={fid}>
          <Label x={1150} y={450} size={24} color={C.aqua} anchor="start">
            2 · sinyal yang meluruh
          </Label>
          <path
            d={smoothPath(Array.from({length: 240}, (_, i) => [1150 + i * 2.7, 515 + 40 * Math.exp(-i / 90) * (Math.sin(i * 0.5) + 0.6 * Math.sin(i * 0.83))] as [number, number]))}
            fill="none"
            stroke={C.aqua}
            strokeWidth={2.5}
          />
        </g>
        <g opacity={ft}>
          <Label x={1150} y={610} size={24} color={C.violet} anchor="start">
            3 · transformasi Fourier → spektrum
          </Label>
          <line x1={1150} y1={760} x2={1800} y2={760} stroke={C.muted} strokeWidth={2} />
          {[
            [1330, 110],
            [1500, 70],
          ].map(([x, h], i) => (
            <line key={i} x1={x} y1={760} x2={x} y2={760 - h * ft} stroke={C.violet} strokeWidth={6} strokeLinecap="round" />
          ))}
        </g>
      </Stage>
      <Badge x={650} y={800} text="ketelitian: beberapa kilohertz" color={C.lime} opacity={prec} size={30} />
    </AbsoluteFill>
  );
};
