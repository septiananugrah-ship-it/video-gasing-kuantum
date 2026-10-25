import React from 'react';
import {C, FONT} from '../theme';
import {Atom, Bond} from './primitives';
import {smoothPath} from '../anim';

/* ------------------------------------------------------------------ */
/* Proyeksi 3D sederhana (yaw di sekitar sumbu y-layar, pitch miring). */
/* ------------------------------------------------------------------ */
export type Vec3 = [number, number, number];

/** Putar titik (x, y, z) — z = ke atas layar — lalu proyeksikan. Kembalikan [sx, sy, depth]. */
export const project = (p: Vec3, yaw: number, pitch: number, cx: number, cy: number, s = 1, persp = 2400): [number, number, number] => {
  const [x, y, z] = p;
  // yaw di sekitar sumbu z (vertikal)
  const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
  const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
  // pitch: miringkan ke arah penonton (sumbu x)
  const y2 = y1 * Math.cos(pitch) - z * Math.sin(pitch);
  const z2 = y1 * Math.sin(pitch) + z * Math.cos(pitch);
  const k = persp / (persp + y2 * s);
  return [cx + x1 * s * k, cy - z2 * s * k, y2];
};

/** Molekul diatomik yang berputar di 3D: sumbu ikatan diarahkan oleh (theta, phi). */
export const Diatomic: React.FC<{
  cx: number;
  cy: number;
  theta: number;
  phi: number;
  len: number;
  elA?: string;
  elB?: string;
  rA?: number;
  rB?: number;
  massRatio?: number; // mA / (mA + mB): menentukan letak pusat massa
  pitch?: number;
  showCom?: boolean;
  opacity?: number;
  bondOrder?: number;
}> = ({cx, cy, theta, phi, len, elA = 'C', elB = 'O', rA = 46, rB = 46, massRatio = 0.5, pitch = 0.35, showCom, opacity = 1, bondOrder = 3}) => {
  const u: Vec3 = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
  // atom A berjarak (1 - massRatio)·len dari pusat massa, atom B berjarak massRatio·len
  const dA = (1 - massRatio) * len;
  const dB = massRatio * len;
  const A = project([-u[0] * dA, -u[1] * dA, -u[2] * dA], 0, pitch, cx, cy);
  const B = project([u[0] * dB, u[1] * dB, u[2] * dB], 0, pitch, cx, cy);
  const kA = 2400 / (2400 + A[2]);
  const kB = 2400 / (2400 + B[2]);
  const atoms = [
    {p: A, el: elA, r: rA * kA},
    {p: B, el: elB, r: rB * kB},
  ].sort((a, b) => b.p[2] - a.p[2]);
  return (
    <g opacity={opacity}>
      <Bond x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} order={bondOrder} width={13} />
      {atoms.map((a, i) => (
        <Atom key={i} x={a.p[0]} y={a.p[1]} el={a.el} r={a.r} label={a.el === 'C13' ? '¹³C' : a.el} />
      ))}
      {showCom ? (
        <g>
          <circle cx={cx} cy={cy} r={9} fill={C.sun} stroke="#000" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={16} fill="none" stroke={C.sun} strokeOpacity={0.6} strokeWidth={2} />
        </g>
      ) : null}
    </g>
  );
};

/** Bola rangka kawat (garis lintang & bujur) dengan sisi belakang lebih redup. */
export const WireSphere: React.FC<{cx: number; cy: number; R: number; yaw: number; pitch: number; opacity?: number; color?: string}> = ({
  cx,
  cy,
  R,
  yaw,
  pitch,
  opacity = 1,
  color = C.violet,
}) => {
  const segs: {d: string; front: boolean}[] = [];
  const addCurve = (f: (s: number) => Vec3) => {
    const pts = Array.from({length: 73}, (_, i) => project(f((i / 72) * Math.PI * 2), yaw, pitch, cx, cy, R, 1e9));
    // pecah menjadi depan/belakang
    let cur: [number, number][] = [];
    let front = pts[0][2] < 0;
    pts.forEach((p) => {
      const f2 = p[2] < 0;
      if (f2 !== front && cur.length > 1) {
        segs.push({d: smoothPath(cur), front});
        cur = [cur[cur.length - 1]];
        front = f2;
      }
      cur.push([p[0], p[1]]);
    });
    if (cur.length > 1) segs.push({d: smoothPath(cur), front});
  };
  for (let k = 1; k < 6; k++) {
    const th = (k * Math.PI) / 6;
    addCurve((s) => [Math.sin(th) * Math.cos(s), Math.sin(th) * Math.sin(s), Math.cos(th)]);
  }
  for (let k = 0; k < 6; k++) {
    const ph = (k * Math.PI) / 6;
    addCurve((s) => [Math.sin(s) * Math.cos(ph), Math.sin(s) * Math.sin(ph), Math.cos(s)]);
  }
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={R} fill="rgba(160,125,255,0.04)" stroke={color} strokeOpacity={0.45} strokeWidth={2} />
      {segs.map((s, i) => (
        <path key={i} d={s.d} fill="none" stroke={color} strokeOpacity={s.front ? 0.38 : 0.1} strokeWidth={s.front ? 1.8 : 1.2} />
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Harmonik sferis (bagian riil) untuk J ≤ 2.                          */
/* ------------------------------------------------------------------ */
export type YKey = '00' | '10' | '11' | '20' | '21' | '22';
export const Yreal = (key: YKey, th: number, ph: number) => {
  const c = Math.cos(th);
  const s = Math.sin(th);
  switch (key) {
    case '00':
      return 0.2821;
    case '10':
      return 0.4886 * c;
    case '11':
      return 0.4886 * s * Math.cos(ph);
    case '20':
      return 0.3154 * (3 * c * c - 1);
    case '21':
      return 1.0925 * s * c * Math.cos(ph);
    case '22':
      return 0.5463 * s * s * Math.cos(2 * ph);
  }
};

/**
 * Plot polar |Y|: permukaan dengan jari-jari ∝ |Y(θ,φ)|, digambar sebagai titik-titik terurut kedalaman.
 * Akuamarin = fase +, koral = fase −.
 */
export const ShSurface: React.FC<{cx: number; cy: number; size: number; yk: YKey; yaw: number; pitch: number; p?: number; opacity?: number; dot?: number}> = ({
  cx,
  cy,
  size,
  yk,
  yaw,
  pitch,
  p = 1,
  opacity = 1,
  dot = 3.2,
}) => {
  const NT = 46;
  const NP = 72;
  const pts: {x: number; y: number; d: number; pos: boolean; shade: number}[] = [];
  const norm = yk === '00' ? 0.2821 : yk === '20' ? 0.631 : yk === '10' || yk === '11' ? 0.4886 : yk === '21' ? 0.546 : 0.5463;
  for (let i = 1; i < NT; i++) {
    const th = (i / NT) * Math.PI;
    for (let j = 0; j < NP; j++) {
      const ph = (j / NP) * Math.PI * 2;
      const v = Yreal(yk, th, ph);
      const r = (Math.abs(v) / norm) * size * p;
      if (r < 2) continue;
      const P = project([r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)], yaw, pitch, cx, cy, 1, 3000);
      pts.push({x: P[0], y: P[1], d: P[2], pos: v >= 0, shade: 0});
    }
  }
  pts.sort((a, b) => b.d - a.d);
  const dMax = size;
  return (
    <g opacity={opacity}>
      {pts.map((q, i) => {
        const f = 0.35 + 0.65 * Math.min(1, Math.max(0, 0.5 - q.d / (2 * dMax)));
        return <circle key={i} cx={q.x} cy={q.y} r={dot} fill={q.pos ? C.aqua : C.coral} opacity={0.18 + 0.62 * f} />;
      })}
    </g>
  );
};

/** Label kecil gaya plot. */
export const AxisText: React.FC<{x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string}> = ({
  x,
  y,
  children,
  anchor = 'middle',
  size = 22,
  color = C.muted,
}) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fontFamily={FONT.mono} fontSize={size} fill={color}>
    {children}
  </text>
);

/** Gelombang yang melingkari cincin: r(φ) = R + A·cos(kφ − ωt). Untuk k non-bulat, ujungnya tidak menyambung. */
export const ringWavePath = (cx: number, cy: number, R: number, A: number, k: number, phase: number, squash = 1, turns = 1) => {
  const n = 360;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const ph = (i / n) * Math.PI * 2 * turns;
    const r = R + A * Math.cos(k * ph - phase);
    pts.push([cx + r * Math.cos(ph), cy + r * Math.sin(ph) * squash]);
  }
  return smoothPath(pts);
};
