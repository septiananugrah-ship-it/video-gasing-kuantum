import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, mix, ramp, win} from '../anim';
import {Atom, Badge, BTilde, DTilde, Formula, Glow, Label, Stage, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const ROWS = [
  {j: '0 → 1', rigid: '115,271', real: '115,271'},
  {j: '2 → 3', rigid: '345,814', real: '345,796'},
  {j: '4 → 5', rigid: '576,356', real: '576,268'},
  {j: '5 → 6', rigid: '691,627', real: '691,473'},
];

// Pita rotasi-vibrasi CO (skematis): pusat 2143 cm⁻¹, B ≈ 1,92 cm⁻¹
const NU0 = 2143.3;
const BR = 1.92;
const pop = (J: number) => (2 * J + 1) * Math.exp((-BR * J * (J + 1)) / 208.5);
const PMAX = pop(7);
const X0 = 210;
const X1 = 1710;
const nx = (nu: number) => X0 + ((nu - (NU0 - 75)) / 150) * (X1 - X0);
const SY = 720;

export const Stretch: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(6) - 0.4, 0.5, 0.6);
  const pB = ramp(t, cue(6) - 0.2, cue(6) + 0.6);
  const speed = ramp(t, cue(1), cue(1) + 2.5);
  const fD = ramp(t, cue(3) - 0.1, cue(3) + 0.8);
  const table = ramp(t, cue(4), cue(4) + 1);
  const ok = ramp(t, cue(5), cue(5) + 0.6, BACK);
  const band = ramp(t, cue(7) - 0.3, cue(7) + 1.5);
  const branches = ramp(t, wordOf(7, 'cabang'), wordOf(7, 'cabang') + 0.8);
  const gap = ramp(t, cue(8), cue(8) + 0.8, BACK);
  const spacing = ramp(t, cue(9), cue(9) + 0.8);

  const omega = mix(0.6, 3.2, speed);
  const ang = t * omega;
  const stretch = mix(0, 40, speed);
  const L = 230 + stretch;
  const cx = 470;
  const cy = 480;
  const dx = (Math.cos(ang) * L) / 2;
  const dy = (Math.sin(ang) * L * 0.4) / 2;

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: ikatan meregang */}
        <g opacity={pA}>
          <Glow x={cx} y={cy} r={300} color="coral" opacity={0.15 + 0.15 * speed} />
          <ellipse cx={cx} cy={cy} rx={L / 2 + 10} ry={(L / 2) * 0.4 + 6} fill="none" stroke={C.coral} strokeOpacity={0.35} strokeDasharray="5 9" strokeWidth={2} />
          {/* ikatan lentur digambar sebagai pegas */}
          <path
            d={Array.from({length: 25}, (_, i) => {
              const u = i / 24;
              const x = cx - dx + 2 * dx * u;
              const y = cy - dy + 2 * dy * u;
              const nxv = -Math.sin(ang);
              const off = i === 0 || i === 24 ? 0 : (i % 2 ? 1 : -1) * 12;
              return `${i ? 'L' : 'M'}${(x + nxv * off * 0.5).toFixed(1)},${(y + Math.cos(ang) * off * 0.5).toFixed(1)}`;
            }).join(' ')}
            fill="none"
            stroke="#8a84ad"
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <Atom x={cx - dx} y={cy - dy} el="C" r={46} />
          <Atom x={cx + dx} y={cy + dy} el="O" r={48} />
          <Label x={cx} y={cy + 150} size={28} color={C.coral} opacity={speed}>
            {speed > 0.5 ? 'berputar cepat → ikatan sedikit memanjang' : ''}
          </Label>
        </g>
        {/* B: pita rotasi-vibrasi */}
        <g opacity={pB}>
          <line x1={X0} y1={SY} x2={X1} y2={SY} stroke={C.muted} strokeWidth={2} />
          {[2080, 2110, 2140, 2170, 2200].map((v) => (
            <Label key={v} x={nx(v)} y={SY + 30} size={22} color={C.muted} font="mono">
              {`${v}`}
            </Label>
          ))}
          <Label x={(X0 + X1) / 2} y={SY + 66} size={22} color={C.muted}>
            bilangan gelombang (cm⁻¹) · pita getaran CO, skematis
          </Label>
          {Array.from({length: 19}, (_, J) => {
            const h = (pop(J) / PMAX) * 300;
            const xR = nx(NU0 + 2 * BR * (J + 1) - 0.017 * (J + 1) ** 2);
            const xP = nx(NU0 - 2 * BR * (J + 1) - 0.017 * (J + 1) ** 2);
            const p = ramp(band, J * 0.03, J * 0.03 + 0.4);
            return (
              <g key={J} opacity={p}>
                <line x1={xR} y1={SY} x2={xR} y2={SY - h * p} stroke={C.coral} strokeWidth={5} strokeLinecap="round" />
                <line x1={xP} y1={SY} x2={xP} y2={SY - h * p} stroke={C.sky} strokeWidth={5} strokeLinecap="round" />
              </g>
            );
          })}
          <g opacity={branches}>
            <Label x={nx(NU0 - 30)} y={SY - 350} size={36} weight={800} color={C.sky}>
              cabang P (ΔJ = −1)
            </Label>
            <Label x={nx(NU0 + 30)} y={SY - 350} size={36} weight={800} color={C.coral}>
              cabang R (ΔJ = +1)
            </Label>
          </g>
          <g opacity={gap}>
            <line x1={nx(NU0)} y1={SY - 280} x2={nx(NU0)} y2={SY + 5} stroke={C.sun} strokeWidth={3} strokeDasharray="6 7" />
            <Label x={nx(NU0)} y={SY - 302} size={26} weight={700} color={C.sun}>
              celah: ΔJ = 0 tidak ada
            </Label>
          </g>
          <g opacity={spacing}>
            {[3, 4].map((J) => {
              const a = nx(NU0 + 2 * BR * (J + 1) - 0.017 * (J + 1) ** 2);
              const b = nx(NU0 + 2 * BR * (J + 2) - 0.017 * (J + 2) ** 2);
              return <line key={J} x1={a} y1={SY + 2} x2={b} y2={SY + 2} stroke={C.sun} strokeWidth={6} />;
            })}
          </g>
        </g>
      </Stage>
      <Formula x={1340} y={270} p={pA * fD} accent={C.coral} size={56} caption="koreksi distorsi sentrifugal (D̃ sangat kecil)">
        <V>F</V>(<V>J</V>) = <BTilde />
        <V>J</V>(<V>J</V> + 1) − <DTilde />[<V>J</V>(<V>J</V> + 1)]<Sup>2</Sup>
      </Formula>
      {table > 0.01 ? (
        <div style={{position: 'absolute', left: 1000, top: 400, width: 700, opacity: pA * table, fontFamily: FONT.mono, fontSize: 28, color: C.ink}}>
          <div style={{display: 'grid', gridTemplateColumns: '160px 240px 240px', rowGap: 12, columnGap: 20}}>
            <div style={{color: C.muted, fontSize: 22}}>garis J</div>
            <div style={{color: C.muted, fontSize: 22}}>rotor kaku (GHz)</div>
            <div style={{color: C.muted, fontSize: 22}}>terukur (GHz)</div>
            {ROWS.map((r, i) => (
              <React.Fragment key={r.j}>
                <div style={{opacity: ramp(table, i * 0.2, i * 0.2 + 0.3)}}>{r.j}</div>
                <div style={{opacity: ramp(table, i * 0.2, i * 0.2 + 0.3), color: C.violet}}>{r.rigid}</div>
                <div style={{opacity: ramp(table, i * 0.2, i * 0.2 + 0.3), color: i === 3 ? C.coral : C.aqua, fontWeight: i === 3 ? 600 : 400}}>{r.real}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}
      <Badge x={1350} y={760} text="J 5 → 6: ≈ 154 MHz lebih rendah" color={C.coral} opacity={pA * ok} size={28} />
      <Badge x={1370} y={260} text="jarak garis ≈ 2B̃ → konstanta rotasi" color={C.sun} opacity={pB * spacing} size={28} />
    </AbsoluteFill>
  );
};
