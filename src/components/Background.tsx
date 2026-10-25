import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, H, MOOD_TINT, W} from '../theme';
import {TIMELINE} from '../timeline.ts';

const tintAt = (t: number) => {
  const stops: number[] = [];
  const colors: string[] = [];
  TIMELINE.scenes.forEach((s) => {
    stops.push(s.start + 0.01, Math.max(s.start + 0.02, s.end - 1.5));
    colors.push(MOOD_TINT[s.mood], MOOD_TINT[s.mood]);
  });
  return interpolateColors(t, stops, colors);
};

// Kisi milimeter ala buku catatan sains: garis halus 24 px, garis tebal tiap 120 px.
const MINOR = (() => {
  const d: string[] = [];
  for (let x = 0; x <= W + 120; x += 24) d.push(`M${x},-120 V${H + 120}`);
  for (let y = 0; y <= H + 120; y += 24) d.push(`M-120,${y} H${W + 120}`);
  return d.join(' ');
})();
const MAJOR = (() => {
  const d: string[] = [];
  for (let x = 0; x <= W + 120; x += 120) d.push(`M${x},-120 V${H + 120}`);
  for (let y = 0; y <= H + 120; y += 120) d.push(`M-120,${y} H${W + 120}`);
  return d.join(' ');
})();

/** Latar kertas berkisi + dua cincin orbit pastel yang berputar pelan (motif rotasi). */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const tint = tintAt(t);
  const drift = (t * 6) % 120;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.bg} 30%, ${tint} 100%)`}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${-drift * 0.2} ${-drift * 0.1})`}>
          <path d={MINOR} stroke={C.grid} strokeOpacity={0.32} strokeWidth={1} fill="none" />
          <path d={MAJOR} stroke={C.grid} strokeOpacity={0.6} strokeWidth={1.4} fill="none" />
        </g>
        {/* cincin orbit dekoratif di pojok */}
        <g transform={`translate(1790 980) rotate(${t * 4})`} opacity={0.5}>
          <ellipse rx={330} ry={130} fill="none" stroke={C.violet} strokeOpacity={0.18} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" />
          <circle cx={330} cy={0} r={9} fill={C.coral} opacity={0.45} />
        </g>
        <g transform={`translate(110 120) rotate(${-t * 5})`} opacity={0.5}>
          <ellipse rx={240} ry={90} fill="none" stroke={C.aqua} strokeOpacity={0.2} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" />
          <circle cx={-240} cy={0} r={7} fill={C.aqua} opacity={0.45} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Bingkai tipis: tepi kertas sedikit lebih gelap (tanpa butiran film). */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 80% at 50% 48%, transparent 65%, rgba(35,32,63,0.06) 100%)'}} />
);
