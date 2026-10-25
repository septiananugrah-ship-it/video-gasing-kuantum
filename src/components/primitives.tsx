import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ATOM, C, FONT, H, type Hue, PASTEL, W} from '../theme';

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
};

export const hue = (h: Hue) => (h === 'ink' ? C.ink : h === 'muted' ? C.muted : C[h]);
const HUES: Hue[] = ['aqua', 'coral', 'violet', 'sun', 'sky', 'lime', 'red', 'ink', 'muted'];

/** Gradien & filter bersama. Dipasang sekali di setiap <Stage>. */
export const Defs: React.FC = () => (
  <defs>
    {Object.entries(ATOM).map(([el, a]) => (
      <React.Fragment key={el}>
        <radialGradient id={`atom-${el}`} cx="36%" cy="32%" r="72%">
          <stop offset="0%" stopColor={shade(a.fill, 0.75)} />
          <stop offset="28%" stopColor={shade(a.fill, 0.2)} />
          <stop offset="70%" stopColor={a.fill} />
          <stop offset="100%" stopColor={shade(a.fill, -0.6)} />
        </radialGradient>
        <radialGradient id={`glow-${el}`}>
          <stop offset="0%" stopColor={a.glow} stopOpacity="0.3" />
          <stop offset="45%" stopColor={a.glow} stopOpacity="0.14" />
          <stop offset="100%" stopColor={a.glow} stopOpacity="0" />
        </radialGradient>
      </React.Fragment>
    ))}
    {HUES.map((k) => (
      <radialGradient key={k} id={`soft-${k}`}>
        <stop offset="0%" stopColor={hue(k)} stopOpacity="0.28" />
        <stop offset="45%" stopColor={hue(k)} stopOpacity="0.1" />
        <stop offset="100%" stopColor={hue(k)} stopOpacity="0" />
      </radialGradient>
    ))}
    {HUES.map((k) => (
      <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 L2.5,5 Z" fill={hue(k)} />
      </marker>
    ))}
    <linearGradient id="bond-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#d6d0f5" />
      <stop offset="55%" stopColor="#8a84ad" />
      <stop offset="100%" stopColor="#2d2847" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="blur-soft">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>
);

/** Kanvas SVG penuh 1920×1080 untuk sebuah adegan. HTML (Card/Formula) diletakkan DI LUAR Stage. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={style}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <Defs />
      {children}
    </svg>
  </AbsoluteFill>
);

export const Atom: React.FC<{
  x: number;
  y: number;
  el: string;
  r?: number;
  label?: string | null;
  opacity?: number;
  glow?: number;
  charge?: string;
}> = ({x, y, el, r, label, opacity = 1, charge}) => {
  const key = el in ATOM ? el : 'C';
  const a = ATOM[key];
  const R = r ?? a.r;
  const text = label === undefined ? el : label;
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={R} fill={a.fill} stroke={C.ink} strokeWidth={Math.max(2, R * 0.07)} />
      <path d={`M${x - R * 0.62},${y + R * 0.2} A${R * 0.66},${R * 0.66} 0 0 0 ${x + R * 0.55},${y + R * 0.38}`} fill="none" stroke="#000" strokeOpacity={0.13} strokeWidth={R * 0.22} strokeLinecap="round" />
      <circle cx={x - R * 0.36} cy={y - R * 0.38} r={R * 0.16} fill="#fff" opacity={0.7} />
      {text ? (
        <text x={x} y={y + R * 0.02} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={R * 0.7} fill={key === 'H' ? C.ink : '#ffffff'}>
          {text}
        </text>
      ) : null}
      {charge ? (
        <text x={x + R * 0.9} y={y - R * 0.95} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={Math.max(26, R * 0.7)} fill={C.ink}>
          {charge}
        </text>
      ) : null}
    </g>
  );
};

/** Ikatan kimia (tunggal/rangkap/tiga) berbentuk batang. */
export const Bond: React.FC<{x1: number; y1: number; x2: number; y2: number; order?: number; width?: number; opacity?: number; color?: string}> = ({
  x1,
  y1,
  x2,
  y2,
  order = 1,
  width = 12,
  opacity = 1,
  color,
}) => {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const gap = width * 1.15;
  const offsets = order === 1 ? [0] : order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap];
  const w = order === 1 ? width : width * 0.62;
  return (
    <g opacity={opacity}>
      {offsets.map((o, i) => (
        <g key={i}>
          <line x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} stroke={C.ink} strokeWidth={w + 4} strokeLinecap="round" />
          <line x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} stroke={color ?? '#e4e0f2'} strokeWidth={w} strokeLinecap="round" />
          <line
            x1={x1 + nx * (o - w * 0.18)}
            y1={y1 + ny * (o - w * 0.18)}
            x2={x2 + nx * (o - w * 0.18)}
            y2={y2 + ny * (o - w * 0.18)}
            stroke="#fff"
            strokeOpacity={0}
            strokeWidth={w * 0.25}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
};

export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color?: Hue; width?: number; opacity?: number; dash?: string; both?: boolean}> = ({
  x1,
  y1,
  x2,
  y2,
  color = 'ink',
  width = 4,
  opacity = 1,
  dash,
  both,
}) => {
  if (Math.hypot(x2 - x1, y2 - y1) < 2) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={hue(color)}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={opacity}
      markerEnd={`url(#arrow-${color})`}
      markerStart={both ? `url(#arrow-${color})` : undefined}
    />
  );
};

/** Teks SVG dengan gaya konsisten (bergaris tepi gelap agar terbaca di atas grafik). */
export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  opacity?: number;
  font?: 'sans' | 'mono' | 'serif';
  italic?: boolean;
  spacing?: number;
}> = ({x, y, children, size = 30, color = C.ink, anchor = 'middle', weight = 500, opacity = 1, font = 'sans', italic, spacing}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    dominantBaseline="central"
    fontFamily={FONT[font]}
    fontSize={size}
    fontWeight={weight}
    fill={color}
    opacity={opacity}
    fontStyle={italic ? 'italic' : undefined}
    letterSpacing={spacing}
    style={{paintOrder: 'stroke', stroke: 'rgba(251,250,246,0.95)', strokeWidth: size * 0.16}}
  >
    {children}
  </text>
);

/** Subskrip di label SVG. */
export const TSub: React.FC<{children: React.ReactNode}> = ({children}) => (
  <tspan baselineShift="sub" fontSize="0.65em">
    {children}
  </tspan>
);
export const TSup: React.FC<{children: React.ReactNode}> = ({children}) => (
  <tspan baselineShift="super" fontSize="0.65em">
    {children}
  </tspan>
);

/** Kartu HTML (rumus & catatan) yang diposisikan absolut. */
export const Card: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  opacity?: number;
  scale?: number;
  anchor?: 'center' | 'left' | 'right';
  accent?: string;
  style?: React.CSSProperties;
  plain?: boolean;
}> = ({x, y, children, opacity = 1, scale = 1, anchor = 'center', accent = C.aqua, style, plain}) => {
  if (opacity <= 0.001) return null;
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) scale(${scale})`,
        transformOrigin: anchor === 'center' ? '50% 50%' : anchor === 'left' ? '0% 50%' : '100% 50%',
        opacity,
        padding: plain ? 0 : '18px 30px',
        borderRadius: 18,
        background: plain ? undefined : '#ffffff',
        border: plain ? undefined : `2px solid ${C.ink}`,
        borderTop: plain ? undefined : `10px solid ${accent}`,
        boxShadow: plain ? undefined : `6px 8px 0 ${C.ink}1f`,
        color: C.ink,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Variabel matematika bergaya miring. */
export const V: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <span style={{fontFamily: FONT.serif, fontStyle: 'italic', color}}>{children}</span>
);

/** ħ (h bar). */
export const Hbar: React.FC<{color?: string}> = ({color}) => <V color={color}>ħ</V>;

export const Badge: React.FC<{x: number; y: number; text: string; color: string; opacity?: number; scale?: number; size?: number}> = ({
  x,
  y,
  text,
  color,
  opacity = 1,
  scale = 1,
  size = 26,
}) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        padding: '10px 24px',
        borderRadius: 999,
        background: '#ffffff',
        border: `2px solid ${color}`,
        boxShadow: `4px 5px 0 ${color}33`,
        color,
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );

/** Lingkaran cahaya lembut. */
export const Glow: React.FC<{x: number; y: number; r: number; color?: Hue; opacity?: number}> = ({x, y, r, color = 'aqua', opacity = 1}) => (
  <circle cx={x} cy={y} r={r * 0.62} fill={PASTEL[color] ?? PASTEL.violet} opacity={Math.min(1, opacity * 3.2)} />
);

/** Path yang tergambar progresif (0..1). */
export const DrawPath: React.FC<{d: string; p: number; stroke: string; width?: number; opacity?: number; glow?: boolean; dash?: string; fill?: string}> = ({
  d,
  p,
  stroke,
  width = 4,
  opacity = 1,
  glow,
  dash,
  fill = 'none',
}) => {
  if (p <= 0) return null;
  const len = 1000;
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      filter={glow ? 'url(#glow)' : undefined}
      strokeDasharray={dash ?? `${len} ${len}`}
      strokeDashoffset={dash ? undefined : len * (1 - p)}
      pathLength={dash ? undefined : len}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Tipografi rumus (HTML): pecahan bertumpuk, subskrip & superskrip.    */
/* Isi rumus berupa baris inline (bukan flex) agar <sub> tidak naik.    */
/* ------------------------------------------------------------------ */

export const Frac: React.FC<{n: React.ReactNode; d: React.ReactNode; size?: number}> = ({n, d, size = 0.84}) => (
  <span
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      verticalAlign: 'middle',
      margin: '0 0.14em',
      fontSize: `${size}em`,
      lineHeight: 1.12,
      position: 'relative',
      top: '-0.08em',
    }}
  >
    <span style={{padding: '0 0.2em 0.08em', whiteSpace: 'nowrap'}}>{n}</span>
    <span style={{alignSelf: 'stretch', height: 3, borderRadius: 2, background: 'currentColor', opacity: 0.85}} />
    <span style={{padding: '0.08em 0.2em 0', whiteSpace: 'nowrap'}}>{d}</span>
  </span>
);

export const Sub: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <sub style={{fontSize: '0.62em', verticalAlign: '-0.32em', lineHeight: 0, color, fontStyle: 'normal'}}>{children}</sub>
);

export const Sup: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <sup style={{fontSize: '0.62em', verticalAlign: '0.55em', lineHeight: 0, color}}>{children}</sup>
);

/** Akar kuadrat dengan garis atas. */
/** Akar kuadrat: tanda akar digambar SVG setinggi isi, garis atas menempel ke tanda akar. */
export const Sqrt: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{display: 'inline-block', position: 'relative', paddingLeft: '0.6em', whiteSpace: 'nowrap', lineHeight: 1.05}}>
    <svg viewBox="0 0 60 100" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: 0, width: '0.62em', height: '100%', overflow: 'visible'}}>
      <path d="M4,60 L16,53 L33,97 L60,1.5" fill="none" stroke="currentColor" strokeWidth="0.055em" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <span style={{display: 'inline-block', borderTop: '0.055em solid currentColor', padding: '0.1em 0.06em 0 0.08em', lineHeight: 1.05}}>{children}</span>
  </span>
);

/** Bagian rumus yang muncul bertahap (p: 0..1) mengikuti narasi. */
export const Part: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color}) => (
  <span style={{opacity: Math.max(0, Math.min(1, p)), color, filter: p < 0.99 ? `blur(${(1 - Math.max(0, p)) * 3}px)` : undefined}}>{children}</span>
);

/** Kartu rumus utama: ≥ 56 px, satu per momen. */
export const Formula: React.FC<{
  x: number;
  y: number;
  p: number;
  children: React.ReactNode;
  accent?: string;
  size?: number;
  anchor?: 'center' | 'left' | 'right';
  caption?: React.ReactNode;
}> = ({x, y, p, children, accent = C.aqua, size = 60, anchor = 'center', caption}) =>
  p <= 0.001 ? null : (
    <Card x={x} y={y} opacity={Math.min(1, p * 1.4)} scale={0.92 + 0.08 * p} accent={accent} anchor={anchor} style={{padding: '24px 40px'}}>
      <div style={{fontSize: size, lineHeight: 1.3, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FONT.serif}}>{children}</div>
      {caption ? <div style={{fontSize: 26, color: C.muted, textAlign: 'center', marginTop: 10, fontFamily: FONT.sans, whiteSpace: 'nowrap'}}>{caption}</div> : null}
    </Card>
  );

/** B̃ (konstanta rotasi dalam bilangan gelombang): tilde digambar sendiri. */
export const BTilde: React.FC<{color?: string}> = ({color}) => (
  <span style={{position: 'relative', display: 'inline-block', fontFamily: FONT.serif, fontStyle: 'italic', color}}>
    B
    <span style={{position: 'absolute', left: '0.2em', top: '-0.5em', fontSize: '0.8em', fontStyle: 'normal'}}>~</span>
  </span>
);

/** ν̃ (bilangan gelombang): tilde digambar sendiri. */
export const NuTilde: React.FC<{color?: string}> = ({color}) => (
  <span style={{position: 'relative', display: 'inline-block', fontFamily: FONT.serif, fontStyle: 'italic', color}}>
    ν
    <span style={{position: 'absolute', left: '0.1em', top: '-0.5em', fontSize: '0.8em', fontStyle: 'normal'}}>~</span>
  </span>
);

/** D̃ (konstanta distorsi sentrifugal dalam bilangan gelombang). */
export const DTilde: React.FC<{color?: string}> = ({color}) => (
  <span style={{position: 'relative', display: 'inline-block', fontFamily: FONT.serif, fontStyle: 'italic', color}}>
    D
    <span style={{position: 'absolute', left: '0.22em', top: '-0.5em', fontSize: '0.8em', fontStyle: 'normal'}}>~</span>
  </span>
);
