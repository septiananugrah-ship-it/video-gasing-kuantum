import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, mix, ramp, win} from '../anim';
import {Atom, Bond, Formula, Frac, Glow, Hbar, Label, Stage, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';
import {smoothPath} from '../anim';

const CX = 600;
const CY = 560;
const R = 260;
const T = 0.38; // kemiringan cincin (rasio sumbu pendek elips)

/** Titik di cincin miring: φ naik = berlawanan jarum jam bila dilihat dari atas; sin φ > 0 = sisi belakang. */
const ringPt = (cx: number, cy: number, r: number, tilt: number, phi: number, lift = 0): [number, number] => [cx + r * Math.cos(phi), cy - r * tilt * Math.sin(phi) - lift];

/**
 * Gelombang yang melingkari cincin 3D: simpangan vertikal A·cos(kφ − fase).
 * Sisi belakang tipis & redup, sisi depan tebal, plus "tiang" tipis agar terasa ruang.
 */
const RingWave3D: React.FC<{cx: number; cy: number; r: number; tilt?: number; A: number; k: number; phase: number; color: string; stems?: boolean; width?: number}> = ({
  cx,
  cy,
  r,
  tilt = T,
  A,
  k,
  phase,
  color,
  stems = true,
  width = 5,
}) => {
  const N = 240;
  const pts = Array.from({length: N + 1}, (_, i) => {
    const phi = (i / N) * Math.PI * 2;
    return {phi, p: ringPt(cx, cy, r, tilt, phi, A * Math.cos(k * phi - phase)), back: Math.sin(phi) > 0};
  });
  const segs: {d: string; back: boolean}[] = [];
  let cur: [number, number][] = [pts[0].p];
  let back = pts[0].back;
  for (let i = 1; i < pts.length; i++) {
    cur.push(pts[i].p);
    if (pts[i].back !== back || i === pts.length - 1) {
      segs.push({d: smoothPath(cur), back});
      cur = [pts[i].p];
      back = pts[i].back;
    }
  }
  return (
    <g>
      {stems
        ? pts
            .filter((_, i) => i % 8 === 0)
            .map((q, i) => {
              const b = ringPt(cx, cy, r, tilt, q.phi);
              return <line key={i} x1={b[0]} y1={b[1]} x2={q.p[0]} y2={q.p[1]} stroke={color} strokeOpacity={q.back ? 0.12 : 0.28} strokeWidth={2} />;
            })
        : null}
      {segs.map((sg, i) => (
        <path key={i} d={sg.d} fill="none" stroke={color} strokeWidth={sg.back ? width * 0.55 : width} strokeOpacity={sg.back ? 0.4 : 1} strokeLinecap="round" />
      ))}
    </g>
  );
};

/** Cincin dasar (elips) dengan sisi belakang putus-putus. */
const RingBase: React.FC<{cx: number; cy: number; r: number; tilt?: number; stroke?: string; width?: number}> = ({cx, cy, r, tilt = T, stroke = C.faint, width = 3}) => (
  <g>
    <path d={`M${cx - r},${cy} A${r},${r * tilt} 0 0 1 ${cx + r},${cy}`} fill="none" stroke={stroke} strokeWidth={width * 0.7} strokeDasharray="5 9" />
    <path d={`M${cx - r},${cy} A${r},${r * tilt} 0 0 0 ${cx + r},${cy}`} fill="none" stroke={stroke} strokeWidth={width} />
  </g>
);

export const Ring: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const ringIn = ramp(t, 0.1, 1.0, BACK);
  const phiP = win(t, cue(1) - 0.2, cue(2) + 0.4, 0.6, 0.6);
  const particle = 1 - ramp(t, cue(2) - 0.2, cue(2) + 0.6);
  const wave = ramp(t, cue(2), cue(2) + 1.2);
  const bad = win(t, cue(5) - 0.2, cue(6) + 0.2, 0.6, 0.7);
  const fCond = win(t, cue(6) - 0.1, cue(9) - 0.4, 0.7, 0.5);
  const minis = win(t, cue(7) - 0.2, cue(10) - 0.3, 0.7, 0.6);
  const qLbl = ramp(t, cue(8), cue(8) + 0.6);
  const fE = ramp(t, cue(9) - 0.1, cue(9) + 0.8);
  const ladder = ramp(t, cue(10) - 0.2, cue(10) + 0.8, BACK);
  // panel kanan: (1) molekul berputar di bidang = massa μ pada cincin, (2) cincin "dibuka" menjadi garis 0 → 2π
  const why = win(t, cue(0) + 1.2, cue(3) - 0.5, 0.8, 0.5);
  const whyEq = ramp(t, cue(0) + 2.6, cue(0) + 3.4, BACK);
  const unroll = win(t, cue(3) - 0.2, cue(7) - 0.5, 0.8, 0.5);
  const match = ramp(t, cue(4), cue(4) + 0.6, BACK) * (1 - bad);

  const ang = t * 1.2;
  const k = mix(3, 2.5, bad);
  const amp = 26 * wave;

  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={ringIn}>
          <Glow x={CX} y={CY} r={340} color="violet" opacity={0.2} />
          <ellipse cx={CX} cy={CY} rx={R} ry={R * T} fill="rgba(108,78,224,0.05)" />
          <RingBase cx={CX} cy={CY} r={R} stroke={wave > 0.5 ? C.faint : C.muted} />
          <circle cx={CX} cy={CY} r={6} fill={C.muted} />
          {/* sudut phi di bidang cincin */}
          <g opacity={phiP}>
            <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" />
            <line x1={CX} y1={CY} x2={ringPt(CX, CY, R, T, ang)[0]} y2={ringPt(CX, CY, R, T, ang)[1]} stroke={C.ink} strokeWidth={3} />
            <path
              d={smoothPath(Array.from({length: 40}, (_, i) => ringPt(CX, CY, 95, T, (i / 39) * (ang % (2 * Math.PI)))))}
              fill="none"
              stroke={C.sun}
              strokeWidth={4}
            />
            <Label x={ringPt(CX, CY, 135, T, (ang % (2 * Math.PI)) / 2)[0]} y={ringPt(CX, CY, 135, T, (ang % (2 * Math.PI)) / 2)[1]} size={40} italic font="serif" color={C.sun}>
              φ
            </Label>
            <Label x={CX + R / 2} y={CY + 26} size={30} italic font="serif" color={C.ink}>
              r
            </Label>
          </g>
          {/* partikel */}
          <g opacity={particle}>
            <circle cx={ringPt(CX, CY, R, T, ang)[0]} cy={ringPt(CX, CY, R, T, ang)[1]} r={Math.sin(ang) > 0 ? 16 : 22} fill={C.aqua} stroke={C.ink} strokeWidth={2.5} />
          </g>
          {/* gelombang 3D yang melingkari cincin */}
          {wave > 0 ? (
            <g opacity={wave}>
              <RingWave3D cx={CX} cy={CY} r={R} A={amp * 1.5} k={k} phase={t * 2} color={bad > 0.5 ? C.coral : C.aqua} />
            </g>
          ) : null}
          <g opacity={bad}>
            <line x1={CX + R} y1={CY - amp * 1.5 * Math.cos(-t * 2)} x2={CX + R} y2={CY - amp * 1.5 * Math.cos(k * 2 * Math.PI - t * 2)} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
            <circle cx={CX + R} cy={CY - (amp * 1.5 * (Math.cos(-t * 2) + Math.cos(k * 2 * Math.PI - t * 2))) / 2} r={38} fill="none" stroke={C.red} strokeWidth={4} />
            <Label x={CX + R} y={CY - 120} size={30} weight={700} color={C.red}>
              ujung tidak bertemu ✗
            </Label>
          </g>
        </g>

        {/* panel kanan 1: rotor datar = partikel pada cincin */}
        <g opacity={why}>
          <Label x={1440} y={360} size={34} weight={800} color={C.violet}>
            Kenapa cincin?
          </Label>
          {(() => {
            const a = t * 1.2;
            const ox = 1215;
            const oy = 545;
            const pA: [number, number] = [ox - 76 * Math.cos(a), oy - 76 * 0.38 * Math.sin(a)];
            const pB: [number, number] = [ox + 58 * Math.cos(a), oy + 58 * 0.38 * Math.sin(a)];
            return (
              <g>
                <ellipse cx={ox} cy={oy} rx={118} ry={118 * 0.38} fill="none" stroke={C.faint} strokeWidth={2.5} strokeDasharray="5 8" />
                <Bond x1={pA[0]} y1={pA[1]} x2={pB[0]} y2={pB[1]} width={11} />
                <Atom x={pA[0]} y={pA[1]} el="C" r={31} />
                <Atom x={pB[0]} y={pB[1]} el="O" r={33} />
                <Label x={ox} y={650} size={26} color={C.muted}>
                  molekul berputar di bidang
                </Label>
              </g>
            );
          })()}
          <g opacity={whyEq}>
            <Label x={1440} y={545} size={60} weight={800} color={C.ink}>
              =
            </Label>
            <RingBase cx={1665} cy={545} r={118} />
            <circle cx={ringPt(1665, 545, 118, T, t * 1.2)[0]} cy={ringPt(1665, 545, 118, T, t * 1.2)[1]} r={15} fill={C.aqua} stroke={C.ink} strokeWidth={2.5} />
            <Label x={ringPt(1665, 545, 118, T, t * 1.2)[0]} y={ringPt(1665, 545, 118, T, t * 1.2)[1] - 32} size={26} italic font="serif" color={C.aqua}>
              μ
            </Label>
            <Label x={1665} y={650} size={26} color={C.muted}>
              massa μ pada cincin jari-jari r
            </Label>
            <Label x={1440} y={724} size={30} weight={700} color={C.violet}>
              {'I = μr² · persoalannya sama persis'}
            </Label>
          </g>
        </g>

        {/* panel kanan 2: cincin dibuka menjadi garis φ = 0 … 2π */}
        <g opacity={unroll}>
          {(() => {
            const X0 = 1090;
            const X1 = 1760;
            const BY = 600;
            const A = 60;
            const val = (phi: number) => A * Math.cos(k * phi - t * 2);
            const xs = Array.from({length: 161}, (_, i) => (i / 160) * Math.PI * 2);
            const y0 = BY - val(0);
            const y1 = BY - val(Math.PI * 2);
            const col = bad > 0.5 ? C.coral : C.aqua;
            return (
              <g>
                <g opacity={1 - Math.max(match, bad)}>
                  <Label x={(X0 + X1) / 2} y={440} size={26} weight={700} color={C.ink}>
                    cincin dibuka menjadi garis
                  </Label>
                </g>
                <line x1={X0} y1={BY} x2={X1} y2={BY} stroke={C.muted} strokeWidth={2} />
                <line x1={X0} y1={BY - 90} x2={X0} y2={BY + 90} stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" />
                <line x1={X1} y1={BY - 90} x2={X1} y2={BY + 90} stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" />
                <path d={smoothPath(xs.map((phi) => [X0 + (phi / (Math.PI * 2)) * (X1 - X0), BY - val(phi)] as [number, number]))} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" />
                <circle cx={X0} cy={y0} r={11} fill={col} stroke={C.ink} strokeWidth={2} />
                <circle cx={X1} cy={y1} r={11} fill={col} stroke={C.ink} strokeWidth={2} />
                <Label x={X0} y={BY + 122} size={28} italic font="serif" color={C.ink}>
                  {'φ = 0'}
                </Label>
                <Label x={X1} y={BY + 122} size={28} italic font="serif" color={C.ink}>
                  {'φ = 2π'}
                </Label>
                <path d={`M${X0 + 14},${y0} C${X0 + 200},${BY - 150} ${X1 - 200},${BY - 150} ${X1 - 14},${y1}`} fill="none" stroke={C.lime} strokeWidth={3} strokeDasharray="7 7" opacity={match} />
                <g opacity={match}>
                  <Label x={(X0 + X1) / 2} y={440} size={26} weight={700} color={C.lime}>
                    titik yang sama → nilainya harus sama ✓
                  </Label>
                </g>
                <g opacity={bad}>
                  <line x1={X1 + 30} y1={y0} x2={X1 + 30} y2={y1} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
                  <line x1={X1 + 18} y1={y0} x2={X1 + 42} y2={y0} stroke={C.red} strokeWidth={4} />
                  <Label x={(X0 + X1) / 2} y={440} size={26} weight={700} color={C.red}>
                    nilai di 0 ≠ nilai di 2π ✗
                  </Label>
                </g>
              </g>
            );
          })()}
        </g>

        {/* contoh q = 0..3 */}
        <g opacity={minis}>
          {[0, 1, 2, 3].map((q) => {
            const x = 1180 + q * 165;
            const p = ramp(t, cue(7) + q * 0.6, cue(7) + q * 0.6 + 0.6, BACK);
            return (
              <g key={q} opacity={p}>
                <RingBase cx={x} cy={575} r={66} width={2} />
                <RingWave3D cx={x} cy={575} r={66} A={q === 0 ? 0 : 16} k={q} phase={t * 2} color={C.aqua} width={4} stems={false} />
                <Label x={x} y={665} size={30} weight={700} color={C.ink} font="serif" italic opacity={0.4 + 0.6 * qLbl}>
                  {`q = ${q}`}
                </Label>
              </g>
            );
          })}
          <Label x={1428} y={735} size={26} color={C.muted} opacity={qLbl}>
            bilangan kuantum cincin
          </Label>
        </g>

        {/* tangga energi E ∝ q² */}
        <g opacity={ladder}>
          {[0, 1, 2, 3].map((q) => {
            const y = 800 - q * q * 36;
            return (
              <g key={q}>
                <line x1={1200} y1={y} x2={1560} y2={y} stroke={C.aqua} strokeWidth={4} />
                <Label x={1590} y={y} size={26} color={C.ink} anchor="start" font="mono">
                  {q === 0 ? 'q = 0' : `q = ±${q}`}
                </Label>
                <Label x={1170} y={y} size={24} color={C.muted} anchor="end" font="mono">
                  {`${q * q}`}
                </Label>
              </g>
            );
          })}
          <Label x={1170} y={400} size={22} color={C.muted} anchor="end">
            energi relatif
          </Label>
        </g>
      </Stage>

      <Formula x={1420} y={300} p={fCond} accent={C.aqua} caption="kondisi batas periodik">
        <V>ψ</V>(<V>φ</V> + 2π) = <V>ψ</V>(<V>φ</V>)
      </Formula>
      <Formula x={1420} y={300} p={fE * (1 - fCond)} accent={C.sun} caption={ramp(t, wordOf(10, 'terkuantisasi'), wordOf(10, 'terkuantisasi') + 0.5) > 0.5 ? 'q = 0, ±1, ±2, …' : 'energi partikel pada cincin'}>
        <V>E</V>
        <sub style={{fontSize: '0.62em', verticalAlign: '-0.32em', lineHeight: 0, fontStyle: 'italic'}}>q</sub> ={' '}
        <Frac
          n={
            <>
              <V>q</V>
              <Sup>2</Sup>
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
      </Formula>
    </AbsoluteFill>
  );
};
