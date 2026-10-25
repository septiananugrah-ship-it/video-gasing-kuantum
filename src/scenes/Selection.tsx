import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, smoothPath, win} from '../anim';
import {Arrow, Atom, Bond, Formula, Glow, Label, Stage, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

/** Molekul diatomik datar yang berputar di bidang layar. */
const Flat: React.FC<{x: number; y: number; ang: number; len: number; a: string; b: string; r?: number; order?: number}> = ({x, y, ang, len, a, b, r = 44, order = 1}) => {
  const dx = (Math.cos(ang) * len) / 2;
  const dy = (Math.sin(ang) * len) / 2;
  return (
    <g>
      <Bond x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} order={order} width={12} />
      <Atom x={x - dx} y={y - dy} el={a} r={r} />
      <Atom x={x + dx} y={y + dy} el={b} r={r} />
    </g>
  );
};

export const Selection: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(4) - 0.4, 0.5, 0.6);
  const pB = win(t, cue(4) - 0.2, cue(6) - 0.4, 0.7, 0.6);
  const pC = ramp(t, cue(6) - 0.2, cue(6) + 0.6);

  const field = ramp(t, 0.3, 1.2);
  const dip = ramp(t, cue(1), cue(1) + 0.8, BACK);
  const cloud = ramp(t, cue(2), cue(2) + 0.8);
  const spin = ramp(t, cue(3) - 0.2, cue(3) + 1);
  const emit = ramp(t, wordOf(3, 'antena'), wordOf(3, 'antena') + 0.8);
  const mute = ramp(t, cue(5), cue(5) + 0.6, BACK);
  const jumps = ramp(t, cue(6), cue(6) + 1);
  const forbid = ramp(t, cue(7) - 0.2, cue(7) + 0.6, BACK);
  const fSel = ramp(t, cue(7) - 0.1, cue(7) + 0.7);
  const photon = ramp(t, cue(8), cue(8) + 0.8);

  const ang = spin * (t - cue(3)) * 1.4;
  const cx = 600;
  const cy = 500;
  const dx = Math.cos(ang) * 140;
  const dy = Math.sin(ang) * 140;

  const ladderY = (J: number) => 810 - J * (J + 1) * 26;

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: dipol permanen pada CO */}
        <g opacity={pA}>
          {/* medan listrik cahaya */}
          <g opacity={field}>
            <path
              d={smoothPath(Array.from({length: 120}, (_, i) => [1050 + i * 6.5, 500 + 70 * Math.sin(i * 0.12 - t * 4)] as [number, number]))}
              fill="none"
              stroke={C.sky}
              strokeWidth={4}
              opacity={0.75}
            />
            <Label x={1440} y={360} size={28} color={C.sky}>
              medan listrik gelombang mikro
            </Label>
          </g>
          <Glow x={cx} y={cy} r={300} color="violet" opacity={0.2} />
          <g opacity={cloud}>
            <ellipse cx={cx - dx * 0.95} cy={cy - dy * 0.95} rx={110} ry={110} fill="url(#soft-sky)" opacity={0.55} />
            <ellipse cx={cx + dx * 0.95} cy={cy + dy * 0.95} rx={95} ry={95} fill="url(#soft-coral)" opacity={0.45} />
          </g>
          <Flat x={cx} y={cy} ang={ang} len={280} a="C" b="O" r={52} order={3} />
          <g opacity={dip}>
            <Label x={cx - dx * 1.05 - Math.sin(ang) * 85} y={cy - dy * 1.05 + Math.cos(ang) * 85} size={34} weight={700} italic font="serif" color={C.sky}>
              δ−
            </Label>
            <Label x={cx + dx * 1.05 - Math.sin(ang) * 85} y={cy + dy * 1.05 + Math.cos(ang) * 85} size={34} weight={700} italic font="serif" color={C.coral}>
              δ+
            </Label>
            <Arrow
              x1={cx - dx * 0.5 + Math.sin(ang) * 95}
              y1={cy - dy * 0.5 - Math.cos(ang) * 95}
              x2={cx + dx * 0.5 + Math.sin(ang) * 95}
              y2={cy + dy * 0.5 - Math.cos(ang) * 95}
              color="sun"
              width={5}
            />
            <Label x={cx + Math.sin(ang) * 178} y={cy - Math.cos(ang) * 178} size={26} color={C.sun}>
              momen dipol (δ− → δ+)
            </Label>
          </g>
          {/* gelombang yang dipancarkan */}
          {[0, 1, 2, 3].map((k) => {
            const p = (t * 0.5 + k / 4) % 1;
            return <circle key={k} cx={cx} cy={cy} r={170 + 260 * p} fill="none" stroke={C.aqua} strokeWidth={3} opacity={emit * (1 - p) * 0.7} />;
          })}
        </g>

        {/* B: molekul simetris tanpa dipol */}
        <g opacity={pB}>
          {[
            {x: 440, a: 'N', b: 'N', name: 'N₂', o: 3},
            {x: 960, a: 'O', b: 'O', name: 'O₂', o: 2},
            {x: 1480, a: 'H', b: 'H', name: 'H₂', o: 1},
          ].map((m, i) => (
            <g key={i}>
              <Flat x={m.x} y={470} ang={t * (1.1 + i * 0.3)} len={m.a === 'H' ? 150 : 200} a={m.a} b={m.b} r={m.a === 'H' ? 34 : 44} order={m.o} />
              <Label x={m.x} y={650} size={40} weight={700} color={C.ink}>
                {m.name}
              </Label>
              <Label x={m.x} y={700} size={26} color={C.muted} font="mono">
                dipol = 0
              </Label>
              <g opacity={mute}>
                <circle cx={m.x} cy={470} r={150} fill="none" stroke={C.red} strokeWidth={4} opacity={0.7} />
                <line x1={m.x - 106} y1={470 + 106} x2={m.x + 106} y2={470 - 106} stroke={C.red} strokeWidth={4} opacity={0.7} />
              </g>
            </g>
          ))}
          <Label x={960} y={790} size={30} weight={600} color={C.coral} opacity={mute}>
            tetap berputar, tetapi "diam" bagi spektroskopi rotasi murni
          </Label>
        </g>

        {/* C: ΔJ = ±1 */}
        <g opacity={pC}>
          {[0, 1, 2, 3].map((J) => (
            <g key={J}>
              <line x1={420} y1={ladderY(J)} x2={900} y2={ladderY(J)} stroke={C.violet} strokeWidth={4} />
              <Label x={930} y={ladderY(J)} size={28} color={C.ink} anchor="start" font="mono">
                {`J = ${J}`}
              </Label>
            </g>
          ))}
          {[0, 1, 2].map((J) => {
            const p = ramp(jumps, J * 0.25, J * 0.25 + 0.4);
            const x = 500 + J * 110;
            return <Arrow key={J} x1={x} y1={ladderY(J) - 6} x2={x} y2={ladderY(J) + (ladderY(J + 1) - ladderY(J)) * p + 6} color="aqua" width={6} opacity={p} />;
          })}
          <g opacity={forbid}>
            <line x1={830} y1={ladderY(0) - 6} x2={830} y2={ladderY(2) + 10} stroke={C.red} strokeWidth={5} strokeDasharray="8 7" />
            <Label x={830} y={ladderY(2) - 30} size={26} weight={700} color={C.red}>
              ΔJ = 2 ✗
            </Label>
          </g>
          {/* foton membawa momentum sudut */}
          <g opacity={photon}>
            <path d={smoothPath(Array.from({length: 60}, (_, i) => [1130 + i * 6, 640 + 22 * Math.sin(i * 0.5 - t * 6)] as [number, number]))} fill="none" stroke={C.sun} strokeWidth={5} />
            <circle cx={1530} cy={640} r={34} fill="none" stroke={C.sun} strokeWidth={4} />
            <path d="M1530,606 l14,-8 l-2,16 Z" fill={C.sun} />
            <Label x={1500} y={720} size={28} color={C.sun}>
              foton: 1 satuan momentum sudut
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={1400} y={420} p={pC * fSel} accent={C.aqua} caption="aturan seleksi rotasi murni (molekul berdipol)">
        Δ<V>J</V> = ±1
      </Formula>
    </AbsoluteFill>
  );
};
