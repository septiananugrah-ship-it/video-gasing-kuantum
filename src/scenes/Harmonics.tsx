import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Formula, Glow, Label, Stage, Sub, V} from '../components/primitives';
import {Diatomic, ShSurface, WireSphere, type YKey} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const PANELS: {yk: YKey; label: string; x: number}[] = [
  {yk: '00', label: 'J = 0, M = 0', x: 420},
  {yk: '10', label: 'J = 1, M = 0', x: 960},
  {yk: '20', label: 'J = 2, M = 0', x: 1500},
];

export const Harmonics: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const fY = win(t, cue(1) - 0.1, cue(3) - 0.3, 0.7, 0.5);
  const showP = (i: number) => ramp(t, cue(3 + i) - 0.3, cue(3 + i) + 0.9, BACK);
  const node = ramp(t, wordOf(4, 'simpul'), wordOf(4, 'simpul') + 0.6);
  const orbs = ramp(t, cue(7), cue(7) + 1);
  const remind = ramp(t, cue(8), cue(8) + 0.8, BACK);
  const yaw = t * 0.35;
  const pitch = 0.32;
  const map = ramp(t, cue(2) - 0.2, cue(2) + 0.8);
  const intro = ramp(t, 0.1, 0.9) * (1 - map);
  const legend = ramp(t, cue(4), cue(4) + 0.8);
  return (
    <AbsoluteFill>
      <Stage>
        {/* pembuka: molekul yang berputar di dalam bola orientasi */}
        <g opacity={intro}>
          <WireSphere cx={960} cy={590} R={185} yaw={0} pitch={0.35} />
          <Diatomic cx={960} cy={590} theta={1.1 + 0.5 * Math.sin(t * 0.5)} phi={t * 0.9} len={370} rA={40} rB={42} massRatio={0.5} pitch={0.35} />
          <Label x={960} y={820} size={30} weight={700} color={C.violet}>
            ψ di permukaan bola = ?
          </Label>
        </g>
        {/* peta peluang: titik-titik orientasi pada bola */}
        <g opacity={map * (1 - showP(0))}>
          <Glow x={960} y={560} r={260} color="violet" opacity={0.2} />
          <ShSurface cx={960} cy={560} size={170} yk="00" yaw={yaw} pitch={pitch} dot={2.6} opacity={0.6} />
          <Label x={960} y={790} size={28} color={C.muted}>
            ke arah mana sumbu molekul paling mungkin menunjuk?
          </Label>
        </g>
        {PANELS.map((pn, i) => {
          const p = showP(i);
          return (
            <g key={pn.yk} opacity={p}>
              <Glow x={pn.x} y={460} r={260} color={i === 0 ? 'aqua' : i === 1 ? 'violet' : 'coral'} opacity={0.15} />
              <ShSurface cx={pn.x} cy={460} size={i === 0 ? 150 : 200} yk={pn.yk} yaw={yaw} pitch={pitch} p={p} dot={i === 0 ? 2.8 : 3.2} />
              <Label x={pn.x} y={700} size={32} weight={700} color={C.ink} font="serif" italic>
                {pn.label}
              </Label>
              {i === 1 ? (
                <g opacity={node}>
                  <ellipse cx={pn.x} cy={460} rx={180} ry={180 * Math.sin(pitch)} fill="none" stroke={C.sun} strokeWidth={3} strokeDasharray="6 8" />
                  <Label x={pn.x + 195} y={460} size={24} color={C.sun} anchor="start">
                    simpul
                  </Label>
                </g>
              ) : null}
              <g opacity={orbs}>
                <Label x={pn.x} y={748} size={28} weight={800} color={[C.aqua, C.violet, C.coral][i]}>
                  {`≈ bagian sudut orbital ${['s', 'p', 'd'][i]}`}
                </Label>
              </g>
            </g>
          );
        })}
        <g opacity={legend * (1 - remind)}>
          <Label x={960} y={804} size={26} color={C.muted}>
            akuamarin = fase positif · koral = fase negatif
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={300} p={fY} accent={C.violet} caption="harmonik sferis: peta peluang orientasi">
        <V>Y</V>
        <Sub>
          <V>J</V>
          <V>M</V>
        </Sub>
        (<V>θ</V>, <V>φ</V>)
      </Formula>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 780,
          transform: `translate(-50%, 0) scale(${0.9 + 0.1 * remind})`,
          opacity: remind,
          padding: '12px 28px',
          borderRadius: 14,
          background: '#ffffff',
          boxShadow: '4px 5px 0 rgba(214,143,0,0.25)',
          border: `2px solid ${C.sun}`,
          color: C.sun,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 28,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        Di sini: orientasi molekul, bukan posisi elektron
      </div>
    </AbsoluteFill>
  );
};
