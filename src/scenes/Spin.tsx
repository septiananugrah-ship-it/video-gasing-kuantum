import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Formula, Frac, Glow, Label, Part, Stage, Sub, Sup, V} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

/** Gasing: badan elips bergaris yang garis-garisnya bergeser saat berputar. */
const Top: React.FC<{x: number; y: number; s: number; spin: number; color: string; wobble: number}> = ({x, y, s, spin, color, wobble}) => {
  const stripes = 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${wobble}) scale(${s})`}>
      <ellipse cx={0} cy={118} rx={60} ry={12} fill="#000" opacity={0.35} />
      <line x1={0} y1={-120} x2={0} y2={-70} stroke={C.muted} strokeWidth={10} strokeLinecap="round" />
      <path d="M-110,-40 Q-110,-75 0,-75 Q110,-75 110,-40 L8,110 L-8,110 Z" fill={color} />
      <clipPath id={`topclip-${x}`}>
        <path d="M-110,-40 Q-110,-75 0,-75 Q110,-75 110,-40 L8,110 L-8,110 Z" />
      </clipPath>
      <g clipPath={`url(#topclip-${x})`}>
        {Array.from({length: stripes}, (_, k) => {
          const ph = ((k / stripes + spin) % 1) * Math.PI;
          const sx = -110 * Math.cos(ph);
          return <line key={k} x1={sx} y1={-80} x2={sx * 0.05} y2={115} stroke="#fff" strokeOpacity={0.25 * Math.sin(ph)} strokeWidth={14} />;
        })}
      </g>
      <ellipse cx={0} cy={-40} rx={110} ry={30} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} />
    </g>
  );
};

export const Spin: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(4) - 0.5, 0.5, 0.6);
  const pB = win(t, cue(4) - 0.3, cue(9) - 0.5, 0.7, 0.6);
  const pC = ramp(t, cue(9) - 0.2, cue(9) + 0.6);

  // fase A
  const two = ramp(t, cue(1), cue(1) + 0.8, BACK);
  const iLbl = ramp(t, wordOf(2, 'inersia') - 0.2, wordOf(2, 'inersia') + 0.6, BACK);
  const orbit = ramp(t, cue(3) - 0.2, cue(3) + 0.8, BACK);
  const fI = ramp(t, wordOf(3, 'kali') - 0.3, wordOf(3, 'kuadrat') + 0.3);

  // fase B
  const com = ramp(t, wordOf(5, 'pusat'), wordOf(5, 'pusat') + 0.7, BACK);
  const arms = ramp(t, cue(6), cue(6) + 0.8);
  const fMu = ramp(t, cue(7) - 0.2, cue(7) + 0.8);
  const fMu2 = ramp(t, cue(8), cue(8) + 0.8);
  const ang = t * 1.1;

  // fase C
  const quant = ramp(t, cue(10) - 0.1, cue(10) + 0.8, EASE_IN_OUT);
  const level = 0.5 + 0.42 * Math.sin(t * 1.3);
  const steps = [0, 0.18, 0.42, 0.74];
  const snapped = steps.reduce((b, s) => (Math.abs(s - level) < Math.abs(b - level) ? s : b), 0);
  const shown = mix(level, snapped, quant);

  // pusat massa CO: massa C 12, O 16 → C berjarak 16/28·r dari pusat massa
  const cx = 760;
  const cy = 470;
  const L = 300;
  const mr = 12 / 28;
  const uA = [-Math.cos(ang) * (1 - mr) * L, Math.sin(ang) * 0.35 * (1 - mr) * L];
  const uB = [Math.cos(ang) * mr * L, -Math.sin(ang) * 0.35 * mr * L];

  return (
    <AbsoluteFill>
      <Stage>
        {/* Fase A: gasing */}
        <g opacity={pA}>
          <Glow x={600} y={520} r={300} color="violet" opacity={0.2} />
          <Top x={mix(760, 520, two)} y={500} s={1.1} spin={t * 2.2} color={C.violet} wobble={4 * Math.sin(t * 2)} />
          <g opacity={two}>
            <Top x={980} y={540} s={0.7} spin={t * 4.5} color={C.aqua} wobble={3 * Math.sin(t * 3)} />
            <Label x={980} y={690} size={28} color={C.aqua}>
              ringan · mudah diputar
            </Label>
            <Label x={520} y={690} size={28} color={C.violet}>
              berat & lebar · malas berputar
            </Label>
          </g>
          <g opacity={iLbl * (1 - orbit)}>
            <Label x={760} y={250} size={64} weight={700} italic font="serif" color={C.sun}>
              I
            </Label>
            <Label x={760} y={315} size={28} color={C.muted}>
              momen inersia
            </Label>
          </g>
          {/* satu massa mengorbit */}
          <g opacity={orbit}>
            <circle cx={1450} cy={470} r={170} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="5 9" />
            <circle cx={1450} cy={470} r={8} fill={C.ink} />
            <line x1={1450} y1={470} x2={1450 + 170 * Math.cos(t * 1.4)} y2={470 + 170 * Math.sin(t * 1.4)} stroke={C.muted} strokeWidth={3} />
            <circle cx={1450 + 170 * Math.cos(t * 1.4)} cy={470 + 170 * Math.sin(t * 1.4)} r={30} fill={C.sun} />
            <Label x={1450 + 170 * Math.cos(t * 1.4)} y={470 + 170 * Math.sin(t * 1.4)} size={26} weight={700} color="#2b1d00" italic font="serif">
              m
            </Label>
            <Label x={1450 + 85 * Math.cos(t * 1.4) + 22} y={470 + 85 * Math.sin(t * 1.4) - 22} size={30} italic font="serif" color={C.ink}>
              r
            </Label>
          </g>
        </g>

        {/* Fase B: CO berputar di pusat massa */}
        <g opacity={pB}>
          <Glow x={cx} y={cy} r={320} color="aqua" opacity={0.16} />
          <ellipse cx={cx} cy={cy} rx={(1 - mr) * L} ry={(1 - mr) * L * 0.35} fill="none" stroke={C.muted} strokeOpacity={0.35} strokeDasharray="4 10" strokeWidth={2} />
          <ellipse cx={cx} cy={cy} rx={mr * L} ry={mr * L * 0.35} fill="none" stroke={C.coral} strokeOpacity={0.45} strokeDasharray="4 10" strokeWidth={2} />
          <Diatomic cx={cx} cy={cy} theta={Math.PI / 2} phi={ang} len={L} rA={52} rB={56} massRatio={mr} pitch={0.357} showCom={com > 0.5} />
          <g opacity={com}>
            <Label x={cx} y={cy + 170} size={28} color={C.sun}>
              pusat massa
            </Label>
          </g>
          <g opacity={arms}>
            {/* lengan dari pusat massa ke tiap atom, digeser ke bawah agar tidak menutupi molekul */}
            <line x1={cx} y1={cy + 90} x2={cx + uA[0]} y2={cy + 90 + uA[1]} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            <line x1={cx} y1={cy + 110} x2={cx + uB[0]} y2={cy + 110 + uB[1]} stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
            <Label x={1200} y={300} size={30} color={C.ink} anchor="start">
              C (12 u): lengan lebih panjang
            </Label>
            <Label x={1200} y={350} size={30} color={C.coral} anchor="start">
              O (16 u): lebih dekat ke pusat
            </Label>
          </g>
        </g>
      </Stage>

      <Formula x={1450} y={790} p={pA * fI} accent={C.sun}>
        <V>I</V> = <V>m</V>
        <V>r</V>
        <Sup>2</Sup>
      </Formula>
      <Formula x={1400} y={600} p={pB * fMu} accent={C.aqua} caption={fMu2 > 0.3 ? 'μ = massa tereduksi · r = panjang ikatan' : undefined}>
        <V>I</V> = <V>μ</V>
        <V>r</V>
        <Sup>2</Sup>
        <Part p={fMu2}>
          <span style={{margin: '0 0.5em', color: C.muted}}>,</span>
          <V>μ</V> ={' '}
          <Frac
            n={
              <>
                <V>m</V>
                <Sub>1</Sub>
                <V>m</V>
                <Sub>2</Sub>
              </>
            }
            d={
              <>
                <V>m</V>
                <Sub>1</Sub> + <V>m</V>
                <Sub>2</Sub>
              </>
            }
          />
        </Part>
      </Formula>

      {/* Fase C: energi klasik kontinu vs kuantum diskret */}
      <AbsoluteFill style={{opacity: pC}}>
        <Stage>
          <g>
            <Label x={620} y={260} size={34} weight={700} color={C.muted}>
              Klasik
            </Label>
            <Label x={1300} y={260} size={34} weight={700} color={C.aqua} opacity={quant}>
              Kuantum
            </Label>
            {/* batang energi klasik */}
            <rect x={580} y={320} width={80} height={460} rx={14} fill="rgba(106,74,216,0.05)" stroke={C.faint} strokeWidth={2} />
            <rect x={580} y={320 + 460 * (1 - level)} width={80} height={460 * level} rx={14} fill={C.violet} opacity={0.35} />
            <line x1={560} y1={320 + 460 * (1 - level)} x2={680} y2={320 + 460 * (1 - level)} stroke={C.violet} strokeWidth={5} />
            <Label x={700} y={320 + 460 * (1 - level)} size={26} color={C.violet} anchor="start">
              energi berapa saja
            </Label>
            {/* tangga kuantum */}
            <g opacity={quant}>
              {steps.map((s, k) => (
                <g key={k}>
                  <line x1={1220} y1={780 - 460 * s} x2={1380} y2={780 - 460 * s} stroke={C.aqua} strokeWidth={4} opacity={0.85} />
                  <Label x={1400} y={780 - 460 * s} size={24} color={C.muted} anchor="start" font="mono">
                    {['E₀', 'E₁', 'E₂', 'E₃'][k]}
                  </Label>
                </g>
              ))}
              <circle cx={1300} cy={780 - 460 * shown} r={16} fill={C.aqua} />
            </g>
          </g>
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
