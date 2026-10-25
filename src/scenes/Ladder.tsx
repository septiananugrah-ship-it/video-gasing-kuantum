import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Arrow, BTilde, Formula, Frac, Label, NuTilde, Stage, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const U = 21; // piksel per B̃
const BASE = 790;
const yOf = (J: number) => BASE - J * (J + 1) * U;
const SX0 = 1080;
const SPX = 70; // piksel per B̃ pada sumbu spektrum
const SY = 760;

export const Ladder: React.FC = () => {
  const {t, cue} = useScene();
  const lad = ramp(t, 0.2, 1.2);
  const fB = win(t, cue(1) - 0.1, cue(4) - 0.3, 0.7, 0.5);
  const fBfull = ramp(t, cue(2) - 0.1, cue(2) + 0.7);
  const lvl = ramp(t, cue(3), cue(3) + 1.2);
  const fJump = ramp(t, cue(4) - 0.1, cue(4) + 0.7);
  const arrows = ramp(t, cue(5) - 0.2, cue(5) + 2.2);
  const spec = ramp(t, cue(7) - 0.4, cue(7) + 1.4);
  const even = ramp(t, cue(7) + 1.5, cue(7) + 2.3);
  const comb = ramp(t, cue(8), cue(8) + 0.8);
  const readI = ramp(t, cue(9), cue(9) + 0.8, BACK);
  return (
    <AbsoluteFill>
      <Stage>
        {[0, 1, 2, 3, 4].map((J) => (
          <g key={J} opacity={lad}>
            <line x1={330} y1={yOf(J)} x2={880} y2={yOf(J)} stroke={C.violet} strokeWidth={4} />
            <Label x={300} y={yOf(J)} size={26} color={C.ink} anchor="end" font="mono">
              {`J = ${J}`}
            </Label>
            <g opacity={ramp(lvl, J * 0.15, J * 0.15 + 0.3)}>
              <Label x={905} y={yOf(J)} size={26} color={C.sun} anchor="start" font="mono">
                {J === 0 ? '0' : `${J * (J + 1)}B̃`}
              </Label>
            </g>
          </g>
        ))}
        {[0, 1, 2, 3].map((J) => {
          const p = ramp(arrows, J * 0.22, J * 0.22 + 0.3);
          const x = 400 + J * 120;
          return (
            <g key={J} opacity={p}>
              <Arrow x1={x} y1={yOf(J) - 5} x2={x} y2={yOf(J + 1) + 9} color="aqua" width={6} />
              <Label x={x + 14} y={(yOf(J) + yOf(J + 1)) / 2} size={26} weight={700} color={C.aqua} anchor="start" font="mono">
                {`${2 * (J + 1)}B̃`}
              </Label>
            </g>
          );
        })}
        {/* spektrum: sisir berjarak sama */}
        <g opacity={spec}>
          <line x1={SX0 - 20} y1={SY} x2={SX0 + 10 * SPX} y2={SY} stroke={C.muted} strokeWidth={2} />
          <Label x={SX0 + 5 * SPX} y={SY + 50} size={24} color={C.muted}>
            bilangan gelombang →
          </Label>
          {[0, 1, 2, 3].map((J) => {
            const x = SX0 + 2 * (J + 1) * SPX;
            const h = [190, 280, 300, 240][J];
            const p = ramp(spec, J * 0.18, J * 0.18 + 0.4);
            return (
              <g key={J} opacity={p}>
                <line x1={x} y1={SY} x2={x} y2={SY - h * p} stroke={C.aqua} strokeWidth={8} strokeLinecap="round" />
                <Label x={x} y={SY + 22} size={22} color={C.aqua} font="mono">
                  {`${2 * (J + 1)}B̃`}
                </Label>
              </g>
            );
          })}
          {[0, 1, 2].map((J) => {
            const x1 = SX0 + 2 * (J + 1) * SPX;
            const x2 = x1 + 2 * SPX;
            return (
              <g key={J} opacity={even}>
                <line x1={x1 + 6} y1={SY - 330} x2={x2 - 6} y2={SY - 330} stroke={C.sun} strokeWidth={3} />
                <line x1={x1 + 6} y1={SY - 342} x2={x1 + 6} y2={SY - 318} stroke={C.sun} strokeWidth={3} />
                <line x1={x2 - 6} y1={SY - 342} x2={x2 - 6} y2={SY - 318} stroke={C.sun} strokeWidth={3} />
                <Label x={(x1 + x2) / 2} y={SY - 362} size={24} weight={700} color={C.sun} font="mono">
                  2B̃
                </Label>
              </g>
            );
          })}
          <g opacity={comb}>
            <Label x={SX0 + 5 * SPX} y={SY - 400} size={30} weight={700} color={C.ink}>
              spektrum rotasi = sisir teratur
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={1420} y={222} p={fB * (1 - fJump)} accent={C.violet} caption={fBfull > 0.5 ? 'konstanta rotasi (bilangan gelombang)' : 'konstanta rotasi'}>
        <BTilde /> ={' '}
        {fBfull > 0.05 ? (
          <span style={{opacity: fBfull}}>
            <Frac
              n={<V>h</V>}
              d={
                <>
                  8π
                  <Sup>2</Sup>
                  <V>c</V>
                  <V>I</V>
                </>
              }
            />
          </span>
        ) : (
          <span style={{color: C.muted}}>?</span>
        )}
      </Formula>
      <Formula x={1420} y={222} p={fJump * (1 - readI)} accent={C.aqua} caption="garis J → J + 1">
        <NuTilde /> = 2<BTilde />(<V>J</V> + 1)
      </Formula>
      <Formula x={1420} y={222} p={readI} accent={C.sun} caption="jarak garis → B̃ → momen inersia I">
        jarak garis = 2<BTilde />
      </Formula>
    </AbsoluteFill>
  );
};
