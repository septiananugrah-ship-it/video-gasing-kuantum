import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, rand, ramp, smoothPath, win} from '../anim';
import {Badge, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT, PASTEL} from '../theme';

/* ------------------------------------------------------------------ */
/* Bagian A: "zoom teleskop" berkelanjutan di dalam jendela pandang:   */
/* antena di Atacama → awan molekul pembentuk bintang → molekul.       */
/* ------------------------------------------------------------------ */
const PX0 = 150;
const PY0 = 168;
const PW = 1620;
const PH = 664;
const CX = PX0 + PW / 2; // 960
const CY = PY0 + PH / 2; // 500
const P_SKY: [number, number] = [1300, 300]; // titik di langit yang dibidik antena
const Q_CLUMP: [number, number] = [1080, 470]; // gumpalan padat di dalam awan

const sm = (u: number) => u * u * (3 - 2 * u);
/** Lapisan induk: membesar Z^u di sekitar titik jangkar A yang bergeser ke tengah jendela. */
const parentT = (u: number, A: [number, number], Z: number) => {
  const f = Math.pow(Z, u);
  const cx = A[0] + (CX - A[0]) * sm(u);
  const cy = A[1] + (CY - A[1]) * sm(u);
  return `translate(${cx} ${cy}) scale(${f}) translate(${-A[0]} ${-A[1]})`;
};
/** Lapisan anak: digambar terpusat di (CX, CY); mula-mula sangat kecil di titik A. */
const childT = (u: number, A: [number, number], Z: number) => {
  const f = Math.pow(Z, u) / Z;
  const cx = A[0] + (CX - A[0]) * sm(u);
  const cy = A[1] + (CY - A[1]) * sm(u);
  return `translate(${cx} ${cy}) scale(${f}) translate(${-CX} ${-CY})`;
};

const STARS = Array.from({length: 90}, (_, i) => ({x: PX0 + rand(i * 1.3) * PW, y: PY0 + rand(i * 7.1) * PH * 0.7, r: 0.8 + rand(i * 3.7) * 2.2, tw: rand(i * 5.5) * 6}));
const PUFFS = Array.from({length: 26}, (_, i) => ({
  x: CX + (rand(i * 2.1) - 0.5) * 1100,
  y: CY + (rand(i * 4.3) - 0.5) * 420,
  r: 90 + rand(i * 6.7) * 170,
  col: ['#f6a6c1', '#b49cff', '#7fd8d0', '#ffc59e'][i % 4],
}));
const YOUNG = Array.from({length: 7}, (_, i) => ({x: CX + (rand(i * 9.2) - 0.5) * 900, y: CY + (rand(i * 3.9) - 0.5) * 360, s: 0.6 + rand(i * 1.1) * 0.9}));
const H2S = Array.from({length: 34}, (_, i) => ({x: PX0 + 60 + rand(i * 1.7) * (PW - 120), y: PY0 + 60 + rand(i * 3.9) * (PH - 120), a: rand(i * 8.1) * 6, sp: 0.5 + rand(i * 2.6)}));
const COS = [
  [560, 330],
  [820, 600],
  [1010, 300],
  [1250, 560],
  [1480, 340],
  [700, 470],
  [1600, 620],
].map(([x, y], i) => ({x, y, a: rand(i * 2.2) * 6}));

const Sparkle: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle r={16} fill="#fff7d6" opacity={0.35} />
    <path d="M0,-22 L4,-4 L22,0 L4,4 L0,22 L-4,4 L-22,0 L-4,-4 Z" fill="#fffbe8" />
  </g>
);

const Dish: React.FC<{x: number; y: number; s: number; tilt: number}> = ({x, y, s, tilt}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12,0 L-40,120 L40,120 L12,0 Z" fill="#cfc8f0" stroke={C.ink} strokeWidth={3} />
    <g transform={`rotate(${tilt})`}>
      <path d="M-110,-40 Q0,60 110,-40 Q0,10 -110,-40 Z" fill="#ffffff" stroke={C.ink} strokeWidth={3} />
      <line x1={0} y1={8} x2={0} y2={-70} stroke={C.ink} strokeWidth={4} />
      <circle cx={0} cy={-74} r={8} fill={C.aqua} />
    </g>
  </g>
);

// peta galaksi: titik-titik emisi CO di sepanjang lengan spiral
const ARMS = Array.from({length: 300}, (_, i) => {
  const arm = i % 2;
  const s = (i / 300) * 3.2;
  const th = s * 2.1 + arm * Math.PI;
  const r = 30 + s * 75;
  return {x: Math.cos(th) * r + (rand(i) - 0.5) * 30, y: Math.sin(th) * r * 0.55 + (rand(i * 3) - 0.5) * 18, v: Math.cos(th)};
});

const MOLS = ['CO', 'HCN', 'HC₃N', 'CH₃OH', 'NH₃', 'H₂CO', 'CH₃CN', 'HCOOCH₃', 'C₂H₅OH', 'SiO', 'CS', 'HNCO'];
const MOL_COL = [C.aqua, C.violet, C.coral, C.sky, C.sun, C.lime];

export const Cosmos: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(4) - 0.4, 0.5, 0.7);
  const pB = win(t, cue(4) - 0.2, cue(7) - 0.4, 0.7, 0.6);
  const pC = ramp(t, cue(7) - 0.2, cue(7) + 0.6);

  const u1 = ramp(t, cue(1) - 0.6, cue(1) + 1.8, EASE_IN_OUT);
  const u2 = ramp(t, cue(2) - 0.5, cue(2) + 1.4, EASE_IN_OUT);
  const ghost = ramp(t, wordOf(2, 'hampir') - 0.2, wordOf(2, 'hampir') + 0.8);
  const co = ramp(t, cue(3) - 0.1, cue(3) + 0.9, BACK);
  const beam = ramp(t, 0.6, 1.6);

  const lay0 = 1 - ramp(u1, 0.55, 0.95);
  const lay1 = ramp(u1, 0.25, 0.6) * (1 - ramp(u2, 0.55, 0.95));
  const lay2 = ramp(u2, 0.3, 0.65);

  const map = ramp(t, cue(4), cue(4) + 2);
  const dop = ramp(t, cue(5), cue(5) + 0.6);
  const ratio = ramp(t, cue(6), cue(6) + 0.8);
  const lab = ramp(t, cue(8), cue(8) + 0.8, BACK);
  // pergeseran garis: positif = frekuensi lebih tinggi = sumber mendekat (biru)
  const vshift = dop * 60 * Math.sin(t * 0.9);
  const gx = 560;
  const gy = 480;

  const scaleChip = lay2 > 0.5 ? 'molekul · ≈ 10⁻⁹ m' : lay1 > 0.5 ? 'awan molekul · ≈ 10¹⁷ m (beberapa tahun cahaya)' : 'antena ALMA · ≈ 10 m';

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="cosmos-view">
            <rect x={PX0} y={PY0} width={PW} height={PH} rx={34} />
          </clipPath>
          <linearGradient id="cosmos-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1747" />
            <stop offset="62%" stopColor="#4a3b8f" />
            <stop offset="100%" stopColor="#f2a98e" />
          </linearGradient>
          <radialGradient id="cosmos-deep" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#2d2466" />
            <stop offset="100%" stopColor="#14112f" />
          </radialGradient>
        </defs>

        {/* ===== A: jendela teleskop ===== */}
        <g opacity={pA}>
          <g clipPath="url(#cosmos-view)">
            <rect x={PX0} y={PY0} width={PW} height={PH} fill="url(#cosmos-deep)" />
            {/* lapisan 0: Atacama */}
            <g opacity={lay0} transform={parentT(u1, P_SKY, 60)}>
              <rect x={PX0 - 400} y={PY0 - 300} width={PW + 800} height={PH + 600} fill="url(#cosmos-sky)" />
              {STARS.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2 + s.tw))} />
              ))}
              <ellipse cx={P_SKY[0]} cy={P_SKY[1]} rx={26} ry={14} fill="#f6a6c1" opacity={0.85} />
              <ellipse cx={P_SKY[0] + 6} cy={P_SKY[1] - 2} rx={14} ry={8} fill="#b49cff" />
              <path d={`M${PX0 - 200},790 Q600,700 960,760 T${PX0 + PW + 200},740 L${PX0 + PW + 200},${PY0 + PH + 300} L${PX0 - 200},${PY0 + PH + 300} Z`} fill="#f6cfb5" stroke={C.ink} strokeWidth={3} />
              {/* berkas antena ke titik sasaran */}
              <path d={`M520,560 L${P_SKY[0]},${P_SKY[1]} L760,600 Z`} fill="#7fd8d0" opacity={0.16 * beam} />
              {[0, 1, 2].map((k) => {
                const p = (t * 0.45 + k / 3) % 1;
                return (
                  <circle key={k} cx={P_SKY[0] + (640 - P_SKY[0]) * p} cy={P_SKY[1] + (575 - P_SKY[1]) * p} r={8 + 6 * p} fill="none" stroke="#7fd8d0" strokeWidth={3} opacity={beam * (1 - p)} />
                );
              })}
              <Dish x={640} y={640} s={1.0} tilt={30} />
              <Dish x={880} y={668} s={0.78} tilt={30} />
              <Dish x={1060} y={690} s={0.6} tilt={30} />
            </g>
            {/* lapisan 1: awan molekul pembentuk bintang */}
            <g opacity={lay1} transform={childT(u1, P_SKY, 60)}>
              <g transform={parentT(u2, Q_CLUMP, 40)}>
                {PUFFS.map((p, i) => (
                  <circle key={i} cx={p.x + 12 * Math.sin(t * 0.2 + i)} cy={p.y} r={p.r} fill={p.col} opacity={0.22} />
                ))}
                {/* lajur debu gelap */}
                <path d={`M${CX - 620},${CY + 60} Q${CX - 200},${CY - 40} ${CX + 120},${CY + 30} T${CX + 640},${CY - 20}`} fill="none" stroke="#120f2b" strokeOpacity={0.55} strokeWidth={46} strokeLinecap="round" />
                {YOUNG.map((s, i) => (
                  <Sparkle key={i} x={s.x} y={s.y} s={s.s * (0.85 + 0.15 * Math.sin(t * 3 + i))} o={0.95} />
                ))}
                <circle cx={Q_CLUMP[0]} cy={Q_CLUMP[1]} r={60} fill="#f6a6c1" opacity={0.35} />
                <circle cx={Q_CLUMP[0]} cy={Q_CLUMP[1]} r={30} fill="#ffd2e0" opacity={0.5} />
              </g>
            </g>
            {/* lapisan 2: molekul */}
            <g opacity={lay2} transform={childT(u2, Q_CLUMP, 40)}>
              {H2S.map((m, i) => {
                const ang = m.a + t * 0.9 * m.sp;
                const dx = Math.cos(ang) * 16;
                const dy = Math.sin(ang) * 9;
                const x = m.x + 14 * Math.sin(t * 0.3 + i);
                return (
                  <g key={i} opacity={1 - 0.75 * ghost}>
                    <line x1={x - dx} y1={m.y - dy} x2={x + dx} y2={m.y + dy} stroke="#d9d3f5" strokeWidth={4} />
                    <circle cx={x - dx} cy={m.y - dy} r={9} fill="#ffffff" stroke="#9d96c2" strokeWidth={2} />
                    <circle cx={x + dx} cy={m.y + dy} r={9} fill="#ffffff" stroke="#9d96c2" strokeWidth={2} />
                  </g>
                );
              })}
              {COS.map((m, i) => {
                const ang = m.a + t * 1.6;
                const dx = Math.cos(ang) * 24;
                const dy = Math.sin(ang) * 13;
                return (
                  <g key={i} opacity={co}>
                    {[0, 1].map((k) => {
                      const p = (t * 0.6 + k / 2 + i * 0.13) % 1;
                      return <circle key={k} cx={m.x} cy={m.y} r={30 + 110 * p} fill="none" stroke="#7fe3d3" strokeWidth={3} opacity={(1 - p) * 0.8} />;
                    })}
                    <line x1={m.x - dx} y1={m.y - dy} x2={m.x + dx} y2={m.y + dy} stroke="#e4e0f2" strokeWidth={6} />
                    <circle cx={m.x - dx} cy={m.y - dy} r={15} fill={C.ink} stroke="#fff" strokeWidth={2} />
                    <circle cx={m.x + dx} cy={m.y + dy} r={15} fill={C.coral} stroke="#fff" strokeWidth={2} />
                  </g>
                );
              })}
              <g opacity={co}>
                <text x={COS[2].x + 40} y={COS[2].y - 50} fontFamily={FONT.mono} fontSize={26} fill="#7fe3d3">
                  115 GHz
                </text>
              </g>
            </g>
          </g>
          <rect x={PX0} y={PY0} width={PW} height={PH} rx={34} fill="none" stroke={C.ink} strokeWidth={3} />
        </g>

        {/* ===== B: peta galaksi & pergeseran Doppler ===== */}
        <g opacity={pB}>
          <circle cx={gx} cy={gy} r={50} fill={PASTEL.sun} />
          {ARMS.map((a, i) => {
            const p = ramp(map, i / 340, i / 340 + 0.2);
            // sisi galaksi yang menjauh (merah, frekuensi turun) dan mendekat (biru, frekuensi naik)
            const col = dop > 0.5 ? (a.v > 0 ? C.coral : C.sky) : C.aqua;
            return <circle key={i} cx={gx + a.x} cy={gy + a.y} r={4.5} fill={col} opacity={p * 0.8} />;
          })}
          <g opacity={dop}>
            <Label x={gx + 270} y={gy - 150} size={24} weight={700} color={C.coral}>
              sisi menjauh
            </Label>
            <Label x={gx - 270} y={gy + 150} size={24} weight={700} color={C.sky}>
              sisi mendekat
            </Label>
          </g>
          <Label x={gx} y={gy + 230} size={26} color={C.muted}>
            peta emisi CO 115 GHz sebuah galaksi (skematis)
          </Label>
          {/* profil garis */}
          <line x1={1060} y1={700} x2={1800} y2={700} stroke={C.muted} strokeWidth={2} />
          <line x1={1430} y1={700} x2={1430} y2={340} stroke={C.muted} strokeWidth={2} strokeDasharray="5 8" />
          <Label x={1430} y={320} size={22} color={C.muted}>
            115,271 GHz (diam)
          </Label>
          <path
            d={smoothPath(
              Array.from({length: 160}, (_, i) => {
                const x = 1060 + i * 4.6;
                const g = Math.exp(-(((x - 1430 - vshift) / 40) ** 2));
                return [x, 700 - g * 300 * map] as [number, number];
              }),
            )}
            fill="rgba(14,159,138,0.12)"
            stroke={vshift > 5 ? C.sky : vshift < -5 ? C.coral : C.aqua}
            strokeWidth={4}
          />
          <g opacity={dop}>
            <Label x={1430 + vshift} y={370} size={26} weight={700} color={vshift > 0 ? C.sky : C.coral}>
              {Math.abs(vshift) < 5 ? '' : vshift > 0 ? 'mendekat → frekuensi naik' : 'menjauh → frekuensi turun'}
            </Label>
          </g>
          <Label x={1430} y={740} size={22} color={C.muted}>
            frekuensi →
          </Label>
        </g>
      </Stage>

      {/* label skala lapisan zoom */}
      <div
        style={{
          position: 'absolute',
          right: PX0 + 24,
          top: PY0 + 22,
          opacity: pA,
          padding: '6px 16px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          border: `2px solid ${C.ink}`,
          fontFamily: FONT.mono,
          fontSize: 22,
          color: C.ink,
        }}
      >
        {scaleChip}
      </div>
      <Badge x={960} y={780} text="H₂: tanpa dipol permanen → hampir tak terlihat" color={C.muted} opacity={pA * ghost * lay2 * (1 - co)} size={28} />
      <Badge x={960} y={780} text="CO (berdipol) memancar di 115 GHz → penanda awan H₂" color={C.aqua} opacity={pA * co} size={28} />
      <Badge x={1430} y={250} text="tinggi garis J1–0, J2–1, … → suhu awan" color={C.sun} opacity={pB * ratio} size={26} />

      {/* ===== C: katalog molekul antarbintang ===== */}
      {MOLS.map((m, i) => {
        const x = 300 + (i % 6) * 264;
        const y = 330 + Math.floor(i / 6) * 140;
        const p = ramp(t, cue(7) + i * 0.15, cue(7) + i * 0.15 + 0.5, BACK);
        const col = MOL_COL[i % MOL_COL.length];
        return (
          <div
            key={m}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`,
              opacity: pC * p,
              width: 210,
              padding: '14px 0',
              textAlign: 'center',
              background: '#fff',
              border: `2px solid ${C.ink}`,
              borderTop: `9px solid ${col}`,
              borderRadius: 14,
              boxShadow: `4px 5px 0 ${col}40`,
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: m.length > 6 ? 28 : 34,
              color: C.ink,
            }}
          >
            {m}
          </div>
        );
      })}
      <Badge x={960} y={640} text="ratusan jenis molekul ditemukan di ruang antarbintang" color={C.violet} opacity={pC} size={30} />
      <Badge x={960} y={730} text="← katalog frekuensi dari laboratorium kimia di Bumi" color={C.sun} opacity={pC * lab} size={28} />
    </AbsoluteFill>
  );
};
