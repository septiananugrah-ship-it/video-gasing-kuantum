import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Badge, Formula, Frac, Glow, Label, Sqrt, Stage, V} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const F0 = 105;
const F1 = 120;
const AX0 = 1020;
const AX1 = 1800;
const fx = (f: number) => AX0 + ((f - F0) / (F1 - F0)) * (AX1 - AX0);
const SY = 720;

export const Isotope: React.FC = () => {
  const {t, cue} = useScene();
  const top = ramp(t, 0.2, 1);
  const iso = ramp(t, cue(0) + 1.0, cue(0) + 2.0, BACK);
  const same = ramp(t, cue(1), cue(1) + 0.8);
  const mu = ramp(t, cue(2), cue(2) + 0.8, BACK);
  const bDown = ramp(t, cue(3), cue(3) + 0.8, BACK);
  const pred = ramp(t, cue(4), cue(4) + 1.2);
  const meas = ramp(t, cue(5), cue(5) + 0.8, BACK);
  const fCmp = win(t, cue(6) - 0.1, cue(7) + 0.2, 0.7, 0.6);
  const sep = ramp(t, cue(7) + 0.3, cue(7) + 1.2);
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={480} y={460} r={330} color="violet" opacity={0.18} />
        <g opacity={top}>
          <Diatomic cx={480} cy={330} theta={Math.PI / 2} phi={t * 1.3} len={250} rA={46} rB={48} massRatio={12 / 28} pitch={0.3} />
          <Label x={480} y={440} size={34} weight={700} color={C.aqua}>
            ¹²C¹⁶O
          </Label>
        </g>
        <g opacity={iso}>
          <Diatomic cx={480} cy={620} theta={Math.PI / 2} phi={t * 1.3 * 0.956} len={250} elA="C13" rA={50} rB={48} massRatio={13 / 29} pitch={0.3} />
          <Label x={480} y={730} size={34} weight={700} color={C.violet}>
            ¹³C¹⁶O
          </Label>
        </g>
        <g opacity={same}>
          <Label x={480} y={790} size={26} color={C.muted}>
            elektron sama → panjang ikatan hampir sama
          </Label>
        </g>
        {/* sumbu frekuensi */}
        <g opacity={pred}>
          <line x1={AX0} y1={SY} x2={AX1} y2={SY} stroke={C.muted} strokeWidth={2} />
          {[105, 110, 115, 120].map((f) => (
            <g key={f}>
              <line x1={fx(f)} y1={SY} x2={fx(f)} y2={SY + 10} stroke={C.muted} strokeWidth={2} />
              <Label x={fx(f)} y={SY + 32} size={22} color={C.muted} font="mono">
                {`${f}`}
              </Label>
            </g>
          ))}
          <Label x={(AX0 + AX1) / 2} y={SY + 68} size={22} color={C.muted}>
            frekuensi garis J 0 → 1 (GHz)
          </Label>
          <line x1={fx(115.271)} y1={SY} x2={fx(115.271)} y2={SY - 260} stroke={C.aqua} strokeWidth={9} strokeLinecap="round" />
          <Label x={fx(115.271)} y={SY - 290} size={28} weight={700} color={C.aqua} font="mono">
            115,27
          </Label>
          {/* prediksi */}
          <line x1={fx(110.189)} y1={SY} x2={fx(110.189)} y2={SY - 220} stroke={C.violet} strokeWidth={5} strokeDasharray="8 7" />
          <Label x={fx(110.189) - 14} y={SY - 250} size={26} color={C.violet} anchor="end">
            prediksi 110,19
          </Label>
          <path d={`M${fx(115.0)},${SY - 140} Q${fx(112.7)},${SY - 200} ${fx(110.5)},${SY - 150}`} fill="none" stroke={C.muted} strokeWidth={2.5} markerEnd="url(#arrow-muted)" />
        </g>
        <g opacity={meas}>
          <line x1={fx(110.201)} y1={SY} x2={fx(110.201)} y2={SY - 180} stroke={C.coral} strokeWidth={9} strokeLinecap="round" />
          <Label x={fx(110.201) + 16} y={SY - 90} size={26} weight={700} color={C.coral} anchor="start">
            terukur 110,20
          </Label>
        </g>
        <g opacity={sep}>
          <Label x={(AX0 + AX1) / 2} y={SY - 340} size={28} weight={600} color={C.ink}>
            garis isotop terpisah jelas → analisis isotop
          </Label>
        </g>
      </Stage>
      <Badge x={1400} y={250} text="μ naik ≈ 4,6 %" color={C.violet} opacity={mu * (1 - fCmp)} size={30} />
      <Badge x={1400} y={320} text="I naik → B turun" color={C.sun} opacity={bDown * (1 - fCmp)} size={28} />
      <Formula x={1410} y={260} p={fCmp} accent={C.coral} size={56} caption="rotasi: berbanding terbalik dengan μ · vibrasi: dengan akar μ">
        <V>ν</V>
        <sub style={{fontSize: '0.55em', verticalAlign: '-0.32em', lineHeight: 0}}>rot</sub> ∝ <Frac n="1" d={<V>μ</V>} />
        <span style={{margin: '0 0.7em', color: C.muted}}>vs</span>
        <V>ν</V>
        <sub style={{fontSize: '0.55em', verticalAlign: '-0.32em', lineHeight: 0}}>vib</sub> ∝{' '}
        <Frac
          n="1"
          d={
            <Sqrt>
              <V>μ</V>
            </Sqrt>
          }
        />
      </Formula>
    </AbsoluteFill>
  );
};
