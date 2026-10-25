import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, mix, ramp, smoothPath, win} from '../anim';
import {Badge, Formula, Glow, Hbar, Label, Stage, Sub, TSub, V} from '../components/primitives';
import {ringWavePath} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

/** Panah melingkar (arah putaran). dir = +1 berlawanan jarum jam (dilihat dari atas), −1 searah. */
const CircArrow: React.FC<{x: number; y: number; r: number; dir: number; color: string; t: number}> = ({x, y, r, dir, color, t}) => {
  const a0 = t * 1.5 * dir;
  const pts: [number, number][] = Array.from({length: 40}, (_, i) => {
    const a = a0 + dir * (i / 39) * Math.PI * 1.2;
    return [x + r * Math.cos(a), y - r * Math.sin(a)];
  });
  const e = pts[pts.length - 1];
  const p2 = pts[pts.length - 3];
  const ang = Math.atan2(e[1] - p2[1], e[0] - p2[0]);
  return (
    <g>
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${e[0] + 18 * Math.cos(ang)},${e[1] + 18 * Math.sin(ang)} L${e[0] + 14 * Math.cos(ang + 2.4)},${e[1] + 14 * Math.sin(ang + 2.4)} L${e[0] + 14 * Math.cos(ang - 2.4)},${e[1] + 14 * Math.sin(ang - 2.4)} Z`} fill={color} />
    </g>
  );
};

/** Gelombang berjalan pada cincin, ditandai titik fase yang ikut berputar. */
const TravelRing: React.FC<{x: number; y: number; q: number; t: number; color: string}> = ({x, y, q, t, color}) => (
  <g>
    <circle cx={x} cy={y} r={150} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="4 9" />
    <path d={ringWavePath(x, y, 150, 18, Math.abs(q), Math.sign(q) * t * 3, -1)} fill="none" stroke={color} strokeWidth={5} />
    {Array.from({length: Math.abs(q)}, (_, k) => {
      const a = (Math.sign(q) * t * 3) / Math.abs(q) + (k * 2 * Math.PI) / Math.abs(q);
      return <circle key={k} cx={x + 168 * Math.cos(a)} cy={y - 168 * Math.sin(a)} r={9} fill={color} />;
    })}
  </g>
);

export const Direction: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(4) - 0.4, 0.5, 0.6);
  const pB = win(t, cue(4) - 0.2, cue(6) - 0.4, 0.7, 0.6);
  const pC = win(t, cue(6) - 0.2, cue(8) - 0.4, 0.7, 0.6);
  const pD = ramp(t, cue(8) - 0.2, cue(8) + 0.6);

  const second = ramp(t, wordOf(1, 'searah') - 0.2, wordOf(1, 'searah') + 0.6, BACK);
  const ghost2 = 0.3 * ramp(t, wordOf(0, 'negatif') - 0.2, wordOf(0, 'negatif') + 0.6);
  const qz = ramp(t, wordOf(8, 'nol') - 0.3, wordOf(8, 'nol') + 0.6, BACK);
  const fL = ramp(t, cue(2), cue(2) + 0.8);
  const ticks = ramp(t, cue(3), cue(3) + 0.8);
  const deg = ramp(t, wordOf(5, 'berdegenerasi'), wordOf(5, 'berdegenerasi') + 0.6, BACK);
  const fifty = ramp(t, cue(7), cue(7) + 0.8, BACK);
  const cmp = ramp(t, cue(9) - 0.2, cue(9) + 0.8, BACK);
  const still = ramp(t, cue(10), cue(10) + 0.8);

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: dua arah putaran */}
        <g opacity={pA}>
          <Glow x={470} y={480} r={260} color="aqua" opacity={0.18} />
          <TravelRing x={470} y={480} q={2} t={t} color={C.aqua} />
          <CircArrow x={470} y={480} r={70} dir={1} color={C.aqua} t={t} />
          <Label x={470} y={700} size={34} weight={700} color={C.aqua} font="serif" italic>
            q = +2
          </Label>
          <g opacity={Math.max(second, ghost2)}>
            <Glow x={950} y={480} r={260} color="coral" opacity={0.18} />
            <TravelRing x={950} y={480} q={-2} t={t} color={C.coral} />
            <CircArrow x={950} y={480} r={70} dir={-1} color={C.coral} t={t} />
            <Label x={950} y={700} size={34} weight={700} color={C.coral} font="serif" italic>
              q = −2
            </Label>
          </g>
          {/* nilai Lz yang diizinkan */}
          <g opacity={ticks}>
            <line x1={1250} y1={600} x2={1770} y2={600} stroke={C.muted} strokeWidth={2} />
            {[-3, -2, -1, 0, 1, 2, 3].map((m) => (
              <g key={m}>
                <circle cx={1510 + m * 80} cy={600} r={11} fill={m > 0 ? C.aqua : m < 0 ? C.coral : C.ink} />
                <Label x={1510 + m * 80} y={645} size={24} color={C.muted} font="mono">
                  {m === 0 ? '0' : `${m > 0 ? '+' : '−'}${Math.abs(m)}ħ`}
                </Label>
              </g>
            ))}
            <Label x={1510} y={545} size={26} color={C.muted}>
              nilai L<TSub>z</TSub> yang diizinkan
            </Label>
          </g>
        </g>

        {/* B: degenerasi ±q */}
        <g opacity={pB}>
          {[0, 1, 2, 3].map((q) => {
            const y = 790 - q * q * 50;
            return (
              <g key={q}>
                <line x1={700} y1={y} x2={1220} y2={y} stroke={C.violet} strokeWidth={4} />
                {q === 0 ? (
                  <circle cx={960} cy={y} r={14} fill={C.ink} />
                ) : (
                  <g opacity={0.35 + 0.65 * deg}>
                    <circle cx={880} cy={y} r={14} fill={C.coral} />
                    <circle cx={1040} cy={y} r={14} fill={C.aqua} />
                  </g>
                )}
                <Label x={1250} y={y} size={26} color={C.ink} anchor="start" font="mono">
                  {q === 0 ? 'q = 0   (1 keadaan)' : `q = ±${q}  (2 keadaan)`}
                </Label>
              </g>
            );
          })}
          <Label x={880} y={250} size={28} color={C.coral}>
            searah jarum jam
          </Label>
          <Label x={1040} y={290} size={28} color={C.aqua}>
            berlawanan
          </Label>
        </g>

        {/* C: gelombang berdiri */}
        <g opacity={pC}>
          <Glow x={640} y={500} r={300} color="violet" opacity={0.2} />
          <circle cx={640} cy={500} r={200} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="4 9" />
          <path
            d={smoothPath(
              Array.from({length: 361}, (_, i) => {
                const ph = (i / 360) * Math.PI * 2;
                const r = 200 + 34 * Math.cos(2 * ph) * Math.cos(t * 3);
                return [640 + r * Math.cos(ph), 500 + r * Math.sin(ph)] as [number, number];
              }),
            )}
            fill="none"
            stroke={C.violet}
            strokeWidth={5}
           
          />
          {[0, 1, 2, 3].map((k) => {
            const a = Math.PI / 4 + (k * Math.PI) / 2;
            return <circle key={k} cx={640 + 200 * Math.cos(a)} cy={500 + 200 * Math.sin(a)} r={10} fill={C.sun} />;
          })}
          <Label x={640} y={760} size={28} color={C.sun}>
            simpul diam di tempat
          </Label>
        </g>

        {/* D: q = 0 dan energi titik nol */}
        <g opacity={pD}>
          {[
            {x: 420, name: 'partikel dalam kotak', zero: false},
            {x: 960, name: 'osilator harmonik', zero: false},
            {x: 1500, name: 'rotor bebas', zero: true},
          ].map((m, i) => {
            const p = i === 2 ? 1 : cmp;
            const base = 720;
            // rotor bebas: mula-mula besar di tengah, lalu mengecil & bergeser ke kanan saat pembanding muncul
            const cx = i === 2 ? mix(960, 1500, cmp) : m.x;
            const sc = i === 2 ? mix(1.45, 1, cmp) : 1;
            const cy = base - 160;
            return (
              <g key={i} opacity={p} transform={`translate(${cx} ${cy}) scale(${sc}) translate(${-m.x} ${-cy})`}>
                {i === 0 ? (
                  <path d={`M${m.x - 150},${base - 260} L${m.x - 150},${base} L${m.x + 150},${base} L${m.x + 150},${base - 260}`} fill="none" stroke={C.muted} strokeWidth={4} />
                ) : i === 1 ? (
                  <path d={smoothPath(Array.from({length: 41}, (_, k) => {
                    const u = (k - 20) / 20;
                    return [m.x + u * 160, base - u * u * 260] as [number, number];
                  }))} fill="none" stroke={C.muted} strokeWidth={4} />
                ) : (
                  <ellipse cx={m.x} cy={base - 120} rx={150} ry={50} fill="none" stroke={C.muted} strokeWidth={4} />
                )}
                {i === 2 ? (
                  <g opacity={qz}>
                    {Array.from({length: 12}, (_, k) => {
                      const a = (k / 12) * Math.PI * 2 + t * 0.4;
                      const front = Math.sin(a) < 0;
                      return <line key={k} x1={m.x + 150 * Math.cos(a)} y1={base - 120 - 50 * Math.sin(a)} x2={m.x + 150 * Math.cos(a)} y2={base - 156 - 50 * Math.sin(a)} stroke={C.aqua} strokeOpacity={front ? 0.45 : 0.18} strokeWidth={2} />;
                    })}
                    <ellipse cx={m.x} cy={base - 156} rx={150} ry={50} fill="none" stroke={C.aqua} strokeWidth={6} />
                    <Label x={m.x} y={base - 250} size={26} weight={700} color={C.aqua} opacity={1 - cmp}>
                      q = 0: gelombang rata, tanpa simpul
                    </Label>
                  </g>
                ) : null}
                <line x1={m.x - 130} y1={base} x2={m.x + 130} y2={base} stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
                {m.zero ? (
                  <g opacity={still}>
                    <line x1={m.x - 130} y1={base} x2={m.x + 130} y2={base} stroke={C.aqua} strokeWidth={6} />
                    <Label x={m.x} y={base + 40} size={28} weight={700} color={C.aqua}>
                      E = 0 diizinkan
                    </Label>
                  </g>
                ) : (
                  <g>
                    <line x1={m.x - 110} y1={base - (i === 0 ? 70 : 90)} x2={m.x + 110} y2={base - (i === 0 ? 70 : 90)} stroke={C.coral} strokeWidth={6} />
                    <Label x={m.x} y={base + 40} size={28} weight={700} color={C.coral}>
                      E terendah &gt; 0
                    </Label>
                  </g>
                )}
                <Label x={m.x} y={base - 320} size={30} weight={600} color={C.ink}>
                  {m.name}
                </Label>
              </g>
            );
          })}
        </g>
      </Stage>

      <Formula x={1510} y={380} p={pA * fL} accent={C.aqua} caption="momentum sudut terkuantisasi">
        <V>L</V>
        <Sub>
          <V>z</V>
        </Sub>{' '}
        = <V>q</V>
        <Hbar />
      </Formula>
      <Badge x={1460} y={420} text="peluang 50% : 50%" color={C.sun} opacity={pC * fifty} size={34} />
      <Badge x={1460} y={540} text="arah putaran tidak pasti" color={C.violet} opacity={pC * fifty} size={28} />
      <Badge x={1460} y={660} text="energi tetap pasti" color={C.aqua} opacity={pC * fifty} size={28} />
    </AbsoluteFill>
  );
};
