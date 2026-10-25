import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from './components/Background';
import {Glow, Stage} from './components/primitives';
import {Diatomic, ringWavePath} from './components/viz';
import {BRAND} from './brand';
import {C, FONT} from './theme';

/** Thumbnail 2560×1440 (desain 1920×1080 diperbesar). */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <Background />
      <Stage>
        <Glow x={1350} y={520} r={520} color="violet" opacity={0.35} />
        {[0, 1, 2, 3].map((q) => (
          <path key={q} d={ringWavePath(1350, 520, 170 + q * 75, 14, q + 1, q, 0.62)} fill="none" stroke={[C.aqua, C.coral, C.violet, C.sun][q]} strokeOpacity={0.75 - q * 0.12} strokeWidth={4} />
        ))}
        <Diatomic cx={1350} cy={520} theta={1.2} phi={0.5} len={270} rA={70} rB={74} massRatio={0.43} pitch={0.4} />
      </Stage>
      <div style={{position: 'absolute', left: 110, top: 250, width: 900}}>
        <div style={{fontFamily: FONT.sans, fontSize: 40, fontWeight: 600, color: C.aqua, letterSpacing: 5}}>KIMIA KUANTUM</div>
        <div style={{fontFamily: FONT.sans, fontSize: 150, fontWeight: 800, color: C.ink, lineHeight: 0.98, marginTop: 10}}>GERAK ROTASI</div>
        <div style={{fontFamily: FONT.sans, fontSize: 58, fontWeight: 700, color: C.coral, marginTop: 24}}>{BRAND.title}</div>
        <div style={{fontFamily: FONT.sans, fontSize: 34, color: C.muted, marginTop: 34}}>molekul berputar · spektrum · industri</div>
        <div style={{fontFamily: FONT.sans, fontSize: 30, color: C.ink, marginTop: 50}}>{BRAND.author}</div>
      </div>
    </div>
  </AbsoluteFill>
);
