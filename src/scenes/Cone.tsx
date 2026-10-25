import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, mix, ramp, win} from '../anim';
import {Arrow, Badge, Formula, Glow, Hbar, Label, Sqrt, Stage, Sub, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const OX = 640;
const OY = 560;
const HB = 165; // piksel per ħ
const SQ = 0.3; // kemiringan elips

export const Cone: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const vec = ramp(t, 0.3, 1.2, BACK);
  const fLen = win(t, cue(1) - 0.1, cue(2) - 0.2, 0.6, 0.4);
  const proj = ramp(t, cue(2), cue(2) + 0.8);
  const fProj = win(t, cue(2) - 0.1, cue(3) - 0.2, 0.6, 0.4);
  const nums = ramp(t, cue(3), cue(3) + 0.8);
  const ghost = win(t, cue(4) - 0.1, cue(5) + 1.5, 0.6, 0.8);
  const cones = ramp(t, wordOf(5, 'kerucut') - 0.4, wordOf(5, 'kerucut') + 0.8);
  const others = ramp(t, cue(6) - 0.5, cue(6) + 1);
  const L = Math.SQRT2 * HB;
  const precess = ramp(t, cue(5), cue(5) + 1);
  const a = 0.6 + precess * (t - cue(5)) * 1.2;
  const rx = HB * Math.cos(a);
  const ry = HB * Math.sin(a) * SQ;
  const tipX = OX + rx;
  const tipY = OY - HB + ry;
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={OX} y={OY - 60} r={360} color="violet" opacity={0.18} />
        {/* sumbu z */}
        <line x1={OX} y1={OY + 330} x2={OX} y2={OY - 330} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" />
        <Label x={OX + 22} y={OY - 345} size={30} italic font="serif" color={C.ink}>
          z
        </Label>
        {/* tingkat proyeksi M = +1, 0, −1 */}
        {[1, 0, -1].map((m) => (
          <g key={m} opacity={m === 1 ? proj : others}>
            <line x1={OX - 30} y1={OY - m * HB} x2={OX + 30} y2={OY - m * HB} stroke={C.sun} strokeWidth={4} />
            <Label x={OX + 268} y={OY - m * HB} size={26} color={C.sun} anchor="start" font="mono">
              {m === 0 ? 'M = 0' : m > 0 ? 'M = +1' : 'M = −1'}
            </Label>
          </g>
        ))}
        {/* kerucut */}
        {[1, 0, -1].map((m) => {
          const r = Math.sqrt(2 - m * m) * HB;
          return (
            <g key={m} opacity={(m === 1 ? cones : others) * 0.9}>
              <ellipse cx={OX} cy={OY - m * HB} rx={r} ry={r * SQ} fill="rgba(160,125,255,0.07)" stroke={C.violet} strokeWidth={2.5} />
              {m !== 0 ? (
                <>
                  <line x1={OX} y1={OY} x2={OX - r} y2={OY - m * HB} stroke={C.violet} strokeOpacity={0.5} strokeWidth={2} />
                  <line x1={OX} y1={OY} x2={OX + r} y2={OY - m * HB} stroke={C.violet} strokeOpacity={0.5} strokeWidth={2} />
                </>
              ) : null}
            </g>
          );
        })}
        {/* panah momentum sudut (M = +1) */}
        <g opacity={vec}>
          <Arrow x1={OX} y1={OY} x2={mix(OX, tipX, vec)} y2={mix(OY, tipY, vec)} color="aqua" width={7} />
          <Label x={mix(OX, tipX, vec) + 34} y={mix(OY, tipY, vec) - 26} size={44} weight={700} italic font="serif" color={C.aqua} anchor="start">
            L
          </Label>
          <g opacity={proj}>
            <line x1={tipX} y1={tipY} x2={OX} y2={OY - HB} stroke={C.sun} strokeWidth={2} strokeDasharray="5 6" />
          </g>
        </g>
        {/* panah tegak yang tidak mungkin */}
        <g opacity={ghost}>
          <line x1={OX} y1={OY} x2={OX} y2={OY - L} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" opacity={0.7} />
          <circle cx={OX} cy={OY - L} r={12} fill="none" stroke={C.red} strokeWidth={4} />
          <Label x={OX + 40} y={OY - L - 10} size={30} weight={700} color={C.red} anchor="start">
            tidak mungkin ✗
          </Label>
        </g>
        {/* angka J = 1 */}
        <g opacity={nums}>
          <Label x={1420} y={460} size={34} weight={700} color={C.ink}>
            Untuk J = 1
          </Label>
          <Label x={1420} y={530} size={32} color={C.aqua} font="mono">
            panjang = √2 ħ ≈ 1,41 ħ
          </Label>
          <Label x={1420} y={590} size={32} color={C.sun} font="mono">
            proyeksi maks = 1 ħ
          </Label>
        </g>
        <g opacity={others}>
          <Label x={1420} y={700} size={28} color={C.muted}>
            L
            <tspan baselineShift="sub" fontSize="0.65em">
              x
            </tspan>{' '}
            dan L
            <tspan baselineShift="sub" fontSize="0.65em">
              y
            </tspan>{' '}
            tidak bisa ditentukan bersamaan
          </Label>
          <Label x={1420} y={750} size={28} color={C.muted}>
            → kerucut = alat bantu gambar
          </Label>
        </g>
      </Stage>
      <Badge x={1420} y={300} text="momentum sudut L = vektor: punya panjang & arah" color={C.aqua} opacity={win(t, 0.8, cue(1) - 0.5, 0.6, 0.4)} size={30} />
      <Formula x={1420} y={300} p={fLen} accent={C.aqua} caption="panjang vektor momentum sudut">
        |<V>L</V>| ={' '}
        <Sqrt>
          <V>J</V>(<V>J</V> + 1)
        </Sqrt>{' '}
        <Hbar />
      </Formula>
      <Formula x={1420} y={300} p={fProj} accent={C.sun} caption="proyeksi pada sumbu z">
        <V>L</V>
        <Sub>
          <V>z</V>
        </Sub>{' '}
        = <V>M</V>
        <Hbar />
      </Formula>
      <Formula x={1440} y={300} p={ramp(t, cue(3) - 0.1, cue(3) + 0.6)} accent={C.violet} size={56}>
        |<V>L</V>| ={' '}
        <Sqrt>
          <V>J</V>(<V>J</V> + 1)
        </Sqrt>{' '}
        <Hbar />
        <span style={{margin: '0 0.6em', color: C.muted}}>·</span>
        <V>L</V>
        <Sub>
          <V>z</V>
        </Sub>{' '}
        = <V>M</V>
        <Hbar />
      </Formula>
    </AbsoluteFill>
  );
};
