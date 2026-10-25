import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {BRAND} from '../brand';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

export const Title: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0.2, 1.4, BACK);
  const out = 1 - ramp(t, dur - 1, dur - 0.1, EASE_IN_OUT);
  const letters = BRAND.title.toUpperCase().split('');
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={390} r={420} color="violet" opacity={0.28 * a} />
        {[0, 1, 2].map((k) => (
          <ellipse
            key={k}
            cx={960}
            cy={390}
            rx={(300 + k * 60) * a}
            ry={(100 + k * 22) * a}
            fill="none"
            stroke={[C.aqua, C.coral, C.violet][k]}
            strokeOpacity={0.45 - k * 0.1}
            strokeWidth={2.5}
            strokeDasharray={k === 1 ? '4 12' : undefined}
            transform={`rotate(${(k - 1) * 12 + 6 * Math.sin(t * 0.6 + k * 2)} 960 390)`}
          />
        ))}
        <Diatomic cx={960} cy={390} theta={Math.PI / 2 - 0.25} phi={t * 1.6} len={210 * a} rA={46} rB={46} massRatio={0.43} pitch={0.45} opacity={a} />
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 190}}>
        <div style={{fontFamily: FONT.sans, fontSize: 30, fontWeight: 500, color: C.aqua, letterSpacing: 8, opacity: ramp(t, 1.0, 2.0)}}>{BRAND.subtitle.toUpperCase()}</div>
        <div style={{display: 'flex', marginTop: 6}}>
          {letters.map((ch, i) => {
            const p = ramp(t, 0.6 + i * 0.05, 1.3 + i * 0.05, BACK);
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT.sans,
                  fontSize: 132,
                  fontWeight: 800,
                  color: C.ink,
                  letterSpacing: 4,
                  whiteSpace: 'pre',
                  display: 'inline-block',
                  opacity: p,
                  translate: `0px ${(1 - p) * 40}px`,
                  rotate: `${(1 - p) * -25}deg`,
                  textShadow: `5px 5px 0 ${['#d8f3ec', '#fde2e8', '#e9e3fd'][i % 3]}`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{marginTop: 18, fontFamily: FONT.sans, fontSize: 32, color: C.muted, opacity: ramp(t, 2.4, 3.4)}}>
          oleh <span style={{color: C.coral, fontWeight: 700}}>{BRAND.author}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
