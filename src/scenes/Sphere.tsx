import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Formula, Frac, Glow, Hbar, Label, Stage, Sub, Sup, V} from '../components/primitives';
import {Diatomic, WireSphere, project} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const CX = 600;
const CY = 520;
const R = 230;
const PITCH = 0.35;

const orient = (t: number) => ({theta: 1.15 + 0.75 * Math.sin(0.43 * t + 0.6), phi: 0.75 * t});

export const Sphere: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const flat = 1 - ramp(t, cue(1) - 0.3, cue(1) + 1.2, EASE_IN_OUT); // 1 = rotasi datar
  const sph = ramp(t, cue(2), cue(2) + 1);
  const angles = ramp(t, wordOf(2, 'theta'), wordOf(2, 'theta') + 0.8);
  const rigid = ramp(t, cue(3), cue(3) + 0.8, BACK);
  const fE = ramp(t, cue(5) - 0.1, cue(5) + 0.8);
  const lad = ramp(t, cue(6) - 0.2, cue(6) + 0.8, BACK);
  const gaps = ramp(t, cue(7), cue(7) + 0.8);
  const dots = ramp(t, cue(8), cue(8) + 1.2);
  const same = ramp(t, cue(9), cue(9) + 0.8);

  const o = orient(t);
  const theta = mix(o.theta, Math.PI / 2, flat);
  const phi = o.phi;
  // jejak ujung sumbu di permukaan bola
  const trail = Array.from({length: 70}, (_, i) => {
    const tt = t - i * 0.06;
    const oo = orient(tt);
    const th = mix(oo.theta, Math.PI / 2, flat);
    const P = project([R * Math.sin(th) * Math.cos(oo.phi), R * Math.sin(th) * Math.sin(oo.phi), R * Math.cos(th)], 0, PITCH, CX, CY, 1, 1e9);
    return P;
  });

  const levels = [0, 1, 2, 3, 4];
  const yOf = (J: number) => 805 - J * (J + 1) * 19;

  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={CX} y={CY} r={340} color="violet" opacity={0.2} />
        <WireSphere cx={CX} cy={CY} R={R} yaw={0} pitch={PITCH} opacity={sph} />
        <ellipse cx={CX} cy={CY} rx={R} ry={R * Math.sin(PITCH)} fill="none" stroke={C.aqua} strokeOpacity={0.5 * flat} strokeWidth={3} strokeDasharray="5 9" />
        {/* jejak ujung sumbu: sisi depan tebal, sisi belakang bola tipis & redup */}
        {trail.slice(1).map((P, i) => {
          const Q = trail[i];
          const front = (P[2] + Q[2]) / 2 < 0;
          const fade = 1 - i / trail.length;
          return (
            <line
              key={i}
              x1={Q[0]}
              y1={Q[1]}
              x2={P[0]}
              y2={P[1]}
              stroke={C.aqua}
              strokeWidth={front ? 5 : 2.5}
              strokeOpacity={sph * fade * (front ? 0.9 : 0.3)}
              strokeLinecap="round"
              strokeDasharray={front ? undefined : '3 6'}
            />
          );
        })}
        <Diatomic cx={CX} cy={CY} theta={theta} phi={phi} len={R * 2} rA={44} rB={46} massRatio={0.5} pitch={PITCH} elA="C" elB="O" />
        {/* sudut theta & phi */}
        <g opacity={angles * (1 - lad * 0.6)}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - R - 40} stroke={C.ink} strokeWidth={2} strokeDasharray="6 8" />
          <Label x={CX + 18} y={CY - R - 52} size={28} italic font="serif" color={C.ink}>
            z
          </Label>
          <Label x={CX + 46} y={CY - 120} size={40} italic font="serif" color={C.sun}>
            θ
          </Label>
          <Label x={CX - 120} y={CY + 135} size={40} italic font="serif" color={C.coral}>
            φ
          </Label>
        </g>
        <g opacity={rigid}>
          <Label x={CX} y={CY + R + 70} size={28} color={C.muted}>
            rotor kaku linear · panjang ikatan tetap
          </Label>
        </g>

        {/* tangga energi rotor 3D */}
        <g opacity={lad}>
          {levels.map((J) => {
            const y = yOf(J);
            const n = 2 * J + 1;
            return (
              <g key={J}>
                <line x1={1130} y1={y} x2={1560} y2={y} stroke={C.violet} strokeWidth={4} />
                <Label x={1100} y={y} size={26} color={C.muted} anchor="end" font="mono">
                  {`${J * (J + 1)}`}
                </Label>
                <Label x={1585} y={y} size={26} color={C.ink} anchor="start" font="mono">
                  {`J = ${J}`}
                </Label>
                {Array.from({length: n}, (_, k) => {
                  const x = 1345 + (k - (n - 1) / 2) * 44;
                  const p = ramp(dots, k / (n + 1), k / (n + 1) + 0.3);
                  return <circle key={k} cx={x} cy={y - 16} r={9} fill={same > 0.5 ? C.aqua : C.sun} opacity={p} />;
                })}
                {J > 0 ? (
                  <g opacity={gaps}>
                    <line x1={1700} y1={yOf(J - 1) - 4} x2={1700} y2={y + 4} stroke={C.coral} strokeWidth={3} />
                    <Label x={1720} y={(y + yOf(J - 1)) / 2} size={24} color={C.coral} anchor="start" font="mono">
                      {`${2 * J}`}
                    </Label>
                  </g>
                ) : null}
              </g>
            );
          })}
          <g opacity={dots}>
            <Label x={1345} y={yOf(4) - 46} size={26} color={C.sun}>
              2J + 1 orientasi (M = −J … +J)
            </Label>
          </g>
          <Label x={1100} y={yOf(4) - 50} size={22} color={C.muted} anchor="end">
            energi relatif
          </Label>
        </g>
      </Stage>

      <Formula x={1400} y={250} p={fE} accent={C.violet} caption={same > 0.5 ? 'tanpa medan luar: semua M berenergi sama' : 'rotor kaku linear'}>
        <V>E</V>
        <Sub>
          <V>J</V>
        </Sub>{' '}
        ={' '}
        <Frac
          n={
            <>
              <Hbar />
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              2<V>I</V>
            </>
          }
        />
        <V>J</V>(<V>J</V> + 1)
      </Formula>
    </AbsoluteFill>
  );
};
