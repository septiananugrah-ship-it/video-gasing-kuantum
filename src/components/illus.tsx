import React from 'react';
import {smoothPath} from '../anim';
import {C, FONT} from '../theme';

/** Oven microwave sederhana dengan secangkir teh. */
export const Oven: React.FC<{x: number; y: number; t: number; glow: number}> = ({x, y, t, glow}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-250} y={-150} width={500} height={300} rx={26} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
    <rect x={-220} y={-120} width={330} height={240} rx={16} fill={`rgba(255,209,102,${0.08 + 0.22 * glow})`} stroke="#8a80c4" strokeWidth={2} />
    {/* gelombang di dalam */}
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={smoothPath(Array.from({length: 40}, (_, i) => [-205 + i * 7.8, -70 + k * 55 + 10 * Math.sin(i * 0.7 - t * 6 + k)] as [number, number]))}
        fill="none"
        stroke={C.sun}
        strokeOpacity={0.25 + 0.4 * glow}
        strokeWidth={3}
      />
    ))}
    {/* cangkir */}
    <path d="M-95,95 L-85,25 L-5,25 L5,95 Z" fill="#ffffff" stroke="#6d64a3" strokeWidth={2} />
    <path d="M5,40 q32,8 0,40" fill="none" stroke="#6d64a3" strokeWidth={6} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M${-70 + k * 25},15 q-12,-25 0,-45 q12,-20 0,-40`} fill="none" stroke="#6d64a3" strokeOpacity={0.35 * glow * (0.6 + 0.4 * Math.sin(t * 2 + k))} strokeWidth={4} />
    ))}
    {/* panel tombol */}
    <rect x={135} y={-115} width={90} height={60} rx={8} fill="#0d0a1d" stroke="#6d64a3" />
    <text x={180} y={-80} textAnchor="middle" fontFamily={FONT.mono} fontSize={26} fill={C.lime}>
      {`0:${String(30 - Math.floor(t) % 30).padStart(2, '0')}`}
    </text>
    {[0, 1, 2, 3].map((k) => (
      <circle key={k} cx={160 + (k % 2) * 40} cy={-15 + Math.floor(k / 2) * 45} r={13} fill="#e7e3f5" stroke="#6d64a3" />
    ))}
  </g>
);


/** Gasing (spinning top) bergaya datar: garis berputar di badan, sedikit presesi, bayangan di lantai.
 *  (x, y) = ujung gasing yang menyentuh lantai. */
export const SpinningTop: React.FC<{x: number; y: number; t: number; scale?: number; spin?: number}> = ({x, y, t, scale = 1, spin = 9}) => {
  // profil setengah lebar badan sebagai fungsi tinggi u (0 = ujung, 128 = bibir atas)
  const hw = (u: number) => (u <= 100 ? 130 * Math.pow(Math.sin((u / 100) * (Math.PI / 2)), 0.8) : 130 - (u - 100) ** 2 * 0.023);
  const us = Array.from({length: 33}, (_, i) => (i / 32) * 128);
  const right = us.map((u) => [hw(u), -u] as [number, number]);
  const left = [...us].reverse().map((u) => [-hw(u), -u] as [number, number]);
  const body = smoothPath(right) + ' ' + smoothPath(left).replace(/^\s*M/, 'L') + ' Z';
  const tilt = 7 * Math.sin(t * 1.3); // presesi pelan
  const stripes = Array.from({length: 10}, (_, k) => spin * t + (k * 2 * Math.PI) / 10);
  const COLS = [C.aqua, C.coral, C.sun, C.violet, C.sky];
  // garis gerak melingkar: bagian belakang tertutup badan, bagian depan di atasnya
  const arcs = [0, 1].map((k) => {
    const a0 = spin * 0.35 * t + k * Math.PI;
    const pts = Array.from({length: 16}, (_, i) => {
      const a = a0 + (i / 15) * 1.1;
      return [Math.cos(a) * 168, -92 + Math.sin(a) * 30] as [number, number];
    }).filter((q) => Math.abs(q[0]) > 146); // hanya di luar siluet badan
    return {d: pts.length > 1 ? smoothPath(pts) : '', front: Math.sin(a0 + 0.55) > 0};
  });
  const arcEl = (front: boolean) =>
    arcs.filter((a) => a.front === front && a.d).map((a, i) => <path key={i} d={a.d} fill="none" stroke={C.ink} strokeOpacity={front ? 0.45 : 0.2} strokeWidth={3} strokeLinecap="round" />);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={120 - 3 * Math.abs(tilt)} ry={14} fill="rgba(35,32,63,0.12)" />
      <g transform={`rotate(${tilt})`}>
        {arcEl(false)}
        <path d={body} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
        {/* pita warna (simetris putar) */}
        <path
          d={smoothPath(Array.from({length: 21}, (_, i) => {
            const a = Math.PI * (i / 20);
            return [-(hw(84) - 7) * Math.cos(a), -84 + 14 * Math.sin(a)] as [number, number];
          }))}
          fill="none"
          stroke={C.coral}
          strokeWidth={16}
          strokeOpacity={0.85}
        />
        {/* garis-garis yang berputar: hanya sisi depan */}
        {stripes.map((th, k) => {
          const c = Math.cos(th);
          if (c <= 0.05) return null;
          const pts = Array.from({length: 14}, (_, i) => {
            const u = 6 + (i / 13) * 116;
            return [hw(u) * Math.sin(th), -u + 10 * c * Math.sin(Math.PI * (u / 128))] as [number, number];
          });
          return <path key={k} d={smoothPath(pts)} fill="none" stroke={COLS[k % COLS.length]} strokeWidth={6} strokeOpacity={0.25 + 0.65 * c} strokeLinecap="round" />;
        })}
        <path d={body} fill="none" stroke={C.ink} strokeWidth={3} />
        {/* permukaan atas & tangkai */}
        <ellipse cx={0} cy={-128} rx={hw(128)} ry={20} fill="#f4f1fb" stroke={C.ink} strokeWidth={3} />
        <rect x={-15} y={-196} width={30} height={72} rx={12} fill={C.violet} stroke={C.ink} strokeWidth={3} />
        <ellipse cx={0} cy={-196} rx={15} ry={5} fill="#b9a8f5" stroke={C.ink} strokeWidth={2} />
        {arcEl(true)}
      </g>
    </g>
  );
};
