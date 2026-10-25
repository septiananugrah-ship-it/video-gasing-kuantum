import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp} from '../anim';
import {Atom, Badge, Bond, Frac, Glow, Label, Sqrt, Stage, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const Row: React.FC<{p: number; active: boolean; children: React.ReactNode; note?: string}> = ({p, active, children, note}) => (
  <div style={{opacity: p * (active ? 1 : 0.42), translate: `${(1 - p) * 30}px 0px`, marginBottom: 16}}>
    <div style={{fontFamily: FONT.serif, fontSize: 56, color: C.ink, whiteSpace: 'nowrap', lineHeight: 1.3}}>{children}</div>
    {note ? <div style={{fontFamily: FONT.sans, fontSize: 22, color: C.muted, marginTop: 2}}>{note}</div> : null}
  </div>
);

export const BondLength: React.FC = () => {
  const {t, cue} = useScene();
  const mol = ramp(t, 0.2, 1.2, BACK);
  const stick = ramp(t, cue(1), cue(1) + 1);
  const wave = ramp(t, cue(2), cue(2) + 0.8);
  const r1 = ramp(t, cue(3), cue(3) + 0.7);
  const r2 = ramp(t, cue(4), cue(4) + 0.7);
  const r3 = ramp(t, cue(5), cue(5) + 0.7);
  const r4 = ramp(t, cue(6), cue(6) + 0.7);
  const res = ramp(t, cue(7), cue(7) + 0.8, BACK);
  const scale = ramp(t, cue(8), cue(8) + 0.8);
  const ref = ramp(t, cue(9), cue(9) + 0.8, BACK);
  const vib = ramp(t, cue(10), cue(10) + 0.8, BACK);
  const step = t < cue(4) ? 1 : t < cue(5) ? 2 : t < cue(6) ? 3 : 4;
  const shake = vib * 6 * Math.sin(t * 9);
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={500} y={360} r={300} color="aqua" opacity={0.2} />
        <g opacity={mol}>
          <Bond x1={360 - shake} y1={360} x2={640 + shake} y2={360} order={3} width={14} />
          <Atom x={360 - shake} y={360} el="C" r={64} />
          <Atom x={640 + shake} y={360} el="O" r={64} />
          <line x1={360} y1={250} x2={640} y2={250} stroke={C.sun} strokeWidth={3} />
          <line x1={360} y1={236} x2={360} y2={264} stroke={C.sun} strokeWidth={3} />
          <line x1={640} y1={236} x2={640} y2={264} stroke={C.sun} strokeWidth={3} />
          <Label x={500} y={215} size={40} weight={700} italic font="serif" color={C.sun}>
            {res > 0.5 ? 'r ≈ 113 pm' : 'r = ?'}
          </Label>
          <g opacity={scale}>
            <Label x={500} y={470} size={26} color={C.muted}>
              ≈ 0,000 000 000 113 m
            </Label>
          </g>
        </g>
        {/* spektrum: garis pertama */}
        <g opacity={stick}>
          <line x1={200} y1={780} x2={820} y2={780} stroke={C.muted} strokeWidth={2} />
          <line x1={330} y1={780} x2={330} y2={780 - 200 * stick} stroke={C.aqua} strokeWidth={10} strokeLinecap="round" />
          {[2, 3, 4].map((k) => (
            <line key={k} x1={330 + (k - 1) * 150} y1={780} x2={330 + (k - 1) * 150} y2={780 - [0, 0, 150, 90, 50][k]} stroke={C.faint} strokeWidth={8} strokeLinecap="round" />
          ))}
          <Label x={350} y={560} size={30} weight={700} color={C.aqua} anchor="start">
            J 0 → 1 : 115,27 GHz
          </Label>
          <Label x={510} y={812} size={22} color={C.muted}>
            frekuensi →
          </Label>
        </g>
        <g opacity={wave}>
          <Label x={700} y={620} size={28} color={C.sky}>
            λ ≈ 2,6 mm
          </Label>
        </g>
      </Stage>
      <div style={{position: 'absolute', left: 960, top: 196, width: 900}}>
        <Row p={r1} active={step === 1} note="garis pertama = 2B">
          2<V>B</V> = 115,27 GHz → <V>B</V> ≈ 57,64 GHz
        </Row>
        <Row p={r2} active={step === 2} note="momen inersia">
          <V>I</V> ={' '}
          <Frac
            n={<V>h</V>}
            d={
              <>
                8π<Sup>2</Sup>
                <V>B</V>
              </>
            }
          />{' '}
          ≈ 1,456 × 10<Sup>−46</Sup> kg m<Sup>2</Sup>
        </Row>
        <Row p={r3} active={step === 3} note="massa tereduksi ¹²C¹⁶O">
          <V>μ</V> ={' '}
          <Frac n={<>12 × 15,995</>} d={<>12 + 15,995</>} /> u ≈ 6,856 u
        </Row>
        <Row p={r4} active={step === 4} note="panjang ikatan">
          <V>r</V> ={' '}
          <Sqrt>
            <V>I</V> ÷ <V>μ</V>
          </Sqrt>{' '}
          ≈ <span style={{color: C.sun, fontWeight: 600}}>113,1 pm</span>
        </Row>
      </div>
      <Badge x={1300} y={760} text="acuan panjang setimbang rₑ = 112,8 pm" color={C.violet} opacity={ref} size={28} />
      <Badge x={1300} y={830} text="selisih kecil: molekul tetap bergetar saat berputar" color={C.coral} opacity={vib} size={24} />
    </AbsoluteFill>
  );
};
