import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, smoothPath, win} from '../anim';
import {Badge, BTilde, Formula, Frac, Label, Stage, Sub, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const B = 1.9225; // cm⁻¹, CO (B₀)
const KT_PER_K = 0.695035; // cm⁻¹ per kelvin (k_B / hc)
const NJ = 21;
const X0 = 150;
const DX = 40;
const BASE = 770;

const pops = (T: number) => {
  const kt = KT_PER_K * T;
  return Array.from({length: NJ}, (_, J) => (2 * J + 1) * Math.exp((-B * J * (J + 1)) / kt));
};

/** Warna per tingkat J (dingin → panas): biru → toska → kuning → koral. */
const jColor = (J: number) => interpolateColors(Math.min(1, J / 14), [0, 0.33, 0.66, 1], [C.sky, C.aqua, C.sun, C.coral]);

// Kotak gas: 30 molekul CO dengan J diambil dari distribusi Boltzmann (kuantil, deterministik).
const BOX = {x: 1040, y: 384, w: 760, h: 400};
const NM = 30;
const MOLS = Array.from({length: NM}, (_, i) => ({
  x: BOX.x + 70 + (i % 6) * 124 + (rand(i * 3.3) - 0.5) * 40,
  y: BOX.y + 80 + Math.floor(i / 6) * 68 + (rand(i * 5.1) - 0.5) * 18,
  q: (Array.from({length: NM}, (_, k) => k).sort((a, b) => rand(a * 7.7) - rand(b * 7.7)).indexOf(i) + 0.5) / NM,
  ph: rand(i * 9.9) * Math.PI * 2,
}));
const jOfQuantile = (p: number[], q: number) => {
  const tot = p.reduce((a, b) => a + b, 0);
  let c = 0;
  for (let J = 0; J < p.length; J++) {
    c += p[J] / tot;
    if (c >= q) return J;
  }
  return p.length - 1;
};
const OMEGA = (J: number) => 0.55 * Math.sqrt(J * (J + 1)); // rad/dtk, sebanding |L| = √(J(J+1)) ħ

export const Thermal: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(2) - 0.3, 0.5, 0.6);
  const box = ramp(t, cue(1) - 0.2, cue(1) + 0.8, BACK);
  const chart = ramp(t, cue(2) - 0.3, cue(2) + 0.6);
  const deg = ramp(t, cue(3), cue(3) + 1.2);
  const boltz = ramp(t, cue(4), cue(4) + 1.2);
  const prod = ramp(t, cue(5) - 0.1, cue(5) + 1.2, EASE_IN_OUT);
  const peak = ramp(t, wordOf(6, 'tujuh') - 0.3, wordOf(6, 'tujuh') + 0.6, BACK);
  const ta = cue(7) + 0.2;
  const tb = cue(7) + 2.6;
  const cool = ramp(t, ta, tb, EASE_IN_OUT);
  const thermo = ramp(t, cue(8), cue(8) + 0.8, BACK);
  const fN = ramp(t, cue(5) + 0.4, cue(5) + 1.2);

  const T = mix(300, 77, cool);
  const p300 = pops(300);
  const p77 = pops(77);
  const pT = pops(T);
  const scaleP = 340 / Math.max(...p300);
  const jPeak = pT.indexOf(Math.max(...pT));
  const degH = (J: number) => ((2 * J + 1) / (2 * NJ - 1)) * 340;
  const bolH = (J: number) => Math.exp((-B * J * (J + 1)) / (KT_PER_K * T)) * 340;
  // integral pendinginan (linear) untuk sudut putar yang mulus
  const coolInt = t < ta ? 0 : t < tb ? (t - ta) ** 2 / (2 * (tb - ta)) : t - (ta + tb) / 2;
  const boxHead = interpolateColors(cool, [0, 1], [C.coral, C.sky]);

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: sisir dengan tinggi berbeda */}
        <g opacity={pA}>
          <line x1={150} y1={700} x2={950} y2={700} stroke={C.muted} strokeWidth={2} />
          {Array.from({length: 16}, (_, J) => {
            const x = 190 + J * 48;
            const h = (p300[J] / Math.max(...p300)) * 330 * ramp(t, 0.3 + J * 0.05, 0.9 + J * 0.05);
            return <line key={J} x1={x} y1={700} x2={x} y2={700 - h} stroke={C.aqua} strokeWidth={10} strokeLinecap="round" />;
          })}
          <Label x={550} y={750} size={26} color={C.muted}>
            spektrum rotasi CO (skematis): garis kuat & lemah
          </Label>
        </g>

        {/* B: grafik populasi */}
        <g opacity={chart}>
          <line x1={X0 - 20} y1={BASE} x2={X0 + (NJ - 1) * DX + 20} y2={BASE} stroke={C.muted} strokeWidth={2} />
          {Array.from({length: NJ}, (_, J) =>
            J % 2 === 0 ? (
              <Label key={J} x={X0 + J * DX} y={BASE + 26} size={22} color={C.muted} font="mono">
                {`${J}`}
              </Label>
            ) : null,
          )}
          <Label x={X0 + 10 * DX} y={BASE + 60} size={26} color={C.muted} font="serif" italic>
            J
          </Label>
          <path d={smoothPath(Array.from({length: NJ}, (_, J) => [X0 + J * DX, BASE - degH(J) * deg] as [number, number]))} fill="none" stroke={C.sun} strokeWidth={4} opacity={deg * (1 - 0.6 * prod)} strokeDasharray="8 6" />
          <g opacity={deg * (1 - prod)}>
            <Label x={X0 + 18 * DX} y={BASE - degH(18) - 30} size={26} color={C.sun}>
              2J + 1
            </Label>
          </g>
          <path d={smoothPath(Array.from({length: NJ}, (_, J) => [X0 + J * DX, BASE - bolH(J) * boltz] as [number, number]))} fill="none" stroke={C.coral} strokeWidth={4} opacity={boltz * (1 - 0.6 * prod)} strokeDasharray="8 6" />
          <g opacity={boltz * (1 - prod)}>
            <Label x={X0 + 4 * DX} y={BASE - bolH(4) - 30} size={26} color={C.coral} anchor="start">
              faktor Boltzmann
            </Label>
          </g>
          {Array.from({length: NJ}, (_, J) => {
            const h = pT[J] * scaleP * prod;
            const isPeak = J === jPeak && peak > 0.5;
            return <rect key={J} x={X0 + J * DX - 13} y={BASE - h} width={26} height={h} rx={6} fill={jColor(J)} stroke={isPeak ? C.ink : 'none'} strokeWidth={3} opacity={0.9} />;
          })}
          <g opacity={peak}>
            <Label x={X0 + jPeak * DX} y={BASE - pT[jPeak] * scaleP - 34} size={30} weight={800} color={C.ink}>
              {`puncak J ≈ ${jPeak}`}
            </Label>
          </g>
        </g>

        {/* kotak gas: setiap molekul berputar sesuai J-nya */}
        <g opacity={box}>
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={20} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
          <path d={`M${BOX.x},${BOX.y + 20} a20,20 0 0 1 20,-20 h${BOX.w - 40} a20,20 0 0 1 20,20 v34 h${-BOX.w} Z`} fill={boxHead} />
          <text x={BOX.x + 24} y={BOX.y + 36} fontFamily={FONT.sans} fontWeight={800} fontSize={24} fill="#fff">
            gas CO
          </text>
          <text x={BOX.x + BOX.w - 24} y={BOX.y + 37} textAnchor="end" fontFamily={FONT.mono} fontWeight={600} fontSize={26} fill="#fff">
            {`T = ${Math.round(T)} K`}
          </text>
          {MOLS.map((m, i) => {
            const J300 = jOfQuantile(p300, m.q);
            const J77 = jOfQuantile(p77, m.q);
            const J = jOfQuantile(pT, m.q);
            const ang = m.ph + OMEGA(J300) * t + (OMEGA(J77) - OMEGA(J300)) * coolInt;
            const dx = Math.cos(ang) * 22;
            const dy = Math.sin(ang) * 22;
            const col = jColor(J);
            return (
              <g key={i}>
                <circle cx={m.x} cy={m.y + 4} r={30} fill={col} opacity={0.14} />
                <line x1={m.x - dx} y1={m.y + 4 - dy} x2={m.x + dx} y2={m.y + 4 + dy} stroke={C.ink} strokeWidth={5} />
                <circle cx={m.x - dx} cy={m.y + 4 - dy} r={10} fill="#4b4766" stroke={C.ink} strokeWidth={2} />
                <circle cx={m.x + dx} cy={m.y + 4 + dy} r={11} fill={C.coral} stroke={C.ink} strokeWidth={2} />
                <text x={m.x + 30} y={m.y - 18} fontFamily={FONT.mono} fontSize={17} fontWeight={600} fill={col}>
                  {J}
                </text>
              </g>
            );
          })}
        </g>
        <g opacity={box}>
          <Label x={BOX.x + BOX.w / 2} y={BOX.y + BOX.h + 34} size={24} color={C.muted}>
            angka = J · J tinggi = putaran cepat · J = 0 diam
          </Label>
        </g>
      </Stage>
      <Formula x={1420} y={226} p={fN * (1 - thermo)} accent={C.aqua} size={56} caption="populasi tingkat J pada suhu T">
        <V>N</V>
        <Sub>
          <V>J</V>
        </Sub>{' '}
        ∝ (2<V>J</V> + 1) exp
        <span style={{fontSize: '1.3em'}}>(</span>−
        <Frac
          n={
            <>
              <V>h</V>
              <V>c</V>
              <BTilde />
              <V>J</V>(<V>J</V> + 1)
            </>
          }
          d={
            <>
              <V>k</V>
              <Sub>B</Sub>
              <V>T</V>
            </>
          }
        />
        <span style={{fontSize: '1.3em'}}>)</span>
      </Formula>
      <Badge x={1420} y={250} text="pola tinggi garis → suhu gas = termometer jarak jauh" color={C.sky} opacity={thermo} size={28} />
    </AbsoluteFill>
  );
};
