import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, win} from '../anim';
import {Atom, Bond, Glow, Label, Stage} from '../components/primitives';
import {project} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const HALF = (104.5 / 2) * (Math.PI / 180);

/** Molekul air 3D yang berputar. */
const H2O: React.FC<{x: number; y: number; s: number; yaw: number; pitch: number; roll?: number; axes?: number; opacity?: number}> = ({x, y, s, yaw, pitch, roll = 0, axes = 0, opacity = 1}) => {
  const L = 96 * s;
  const H1 = project([Math.sin(HALF) * L * Math.cos(roll), Math.sin(HALF) * L * Math.sin(roll), -Math.cos(HALF) * L], yaw, pitch, x, y);
  const H2 = project([-Math.sin(HALF) * L * Math.cos(roll), -Math.sin(HALF) * L * Math.sin(roll), -Math.cos(HALF) * L], yaw, pitch, x, y);
  const O = project([0, 0, 0], yaw, pitch, x, y);
  const items = [
    {p: H1, el: 'H', r: 22 * s},
    {p: H2, el: 'H', r: 22 * s},
    {p: O, el: 'O', r: 36 * s},
  ].sort((a, b) => b.p[2] - a.p[2]);
  const ax = (v: [number, number, number], col: string, name: string) => {
    // sumbu melewati pusat massa (sedikit di bawah O, ke arah kedua H)
    const zc = -0.0685 * L;
    const a = project([v[0] * 1.9 * L, v[1] * 1.9 * L, v[2] * 1.9 * L + zc], yaw, pitch, x, y);
    const b = project([-v[0] * 1.9 * L, -v[1] * 1.9 * L, -v[2] * 1.9 * L + zc], yaw, pitch, x, y);
    return (
      <g opacity={axes}>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={3} strokeDasharray="8 7" />
        <text x={a[0] + 8} y={a[1] - 8} fill={col} fontSize={30} fontStyle="italic" fontFamily="Source Serif 4, serif">
          {name}
        </text>
      </g>
    );
  };
  return (
    <g opacity={opacity}>
      {/* sumbu utama H₂O: b = sumbu C₂, a = sejajar H···H (di bidang), c = tegak lurus bidang */}
      {ax([Math.cos(roll), Math.sin(roll), 0], C.aqua, 'a')}
      {ax([0, 0, 1], C.coral, 'b')}
      {ax([-Math.sin(roll), Math.cos(roll), 0], C.sun, 'c')}
      {items.map((it, i) =>
        it.el === 'O' ? null : <Bond key={`b${i}`} x1={O[0]} y1={O[1]} x2={it.p[0]} y2={it.p[1]} width={10 * s} />,
      )}
      {items.map((it, i) => (
        <Atom key={i} x={it.p[0]} y={it.p[1]} el={it.el} r={it.r} label={s > 0.7 ? it.el : ''} glow={s > 0.7 ? 1 : 0.4} />
      ))}
    </g>
  );
};

// pola garis "rumit" untuk rotor asimetris (skematis)
const MESSY = Array.from({length: 46}, (_, i) => ({f: 8 + rand(i * 2.7) * 190, h: 0.15 + rand(i * 4.1) * 0.55}));
const AX0 = 1040;
const AX1 = 1800;
const fx = (f: number) => AX0 + (f / 200) * (AX1 - AX0);
const SY = 700;

const NET = Array.from({length: 13}, (_, i) => ({x: 300 + (i % 5) * 330 + (Math.floor(i / 5) % 2) * 165, y: 340 + Math.floor(i / 5) * 165, yaw: rand(i * 3) * 6, roll: rand(i * 5) * 6}));

export const Water: React.FC = () => {
  const {t, cue} = useScene();
  const pA = win(t, -1, cue(5) - 0.4, 0.5, 0.6);
  const pB = ramp(t, cue(5) - 0.2, cue(5) + 0.8);
  const axes = ramp(t, cue(1) + 0.5, cue(1) + 1.5);
  const messy = ramp(t, cue(2) + 0.5, cue(2) + 2);
  const two = ramp(t, cue(3), cue(3) + 0.8, BACK);
  const gas = ramp(t, cue(4), cue(4) + 0.6);
  const wiggle = ramp(t, cue(6), cue(6) + 0.6);
  const key = ramp(t, cue(7), cue(7) + 0.8, BACK);
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={pA}>
          <Glow x={520} y={460} r={300} color="sky" opacity={0.2} />
          <H2O x={520} y={460} s={1.6} yaw={t * 0.7} pitch={0.4} roll={t * 0.35} axes={axes} />
          <g opacity={axes}>
            <Label x={520} y={720} size={28} color={C.ink}>
              tiga momen inersia: I
              <tspan baselineShift="sub" fontSize="0.65em">
                a
              </tspan>{' '}
              &lt; I
              <tspan baselineShift="sub" fontSize="0.65em">
                b
              </tspan>{' '}
              &lt; I
              <tspan baselineShift="sub" fontSize="0.65em">
                c
              </tspan>
            </Label>
          </g>
          {/* spektrum rotor asimetris */}
          <g opacity={messy}>
            <line x1={AX0} y1={SY} x2={AX1} y2={SY} stroke={C.muted} strokeWidth={2} />
            {[0, 50, 100, 150, 200].map((f) => (
              <Label key={f} x={fx(f)} y={SY + 30} size={22} color={C.muted} font="mono">
                {`${f}`}
              </Label>
            ))}
            <Label x={(AX0 + AX1) / 2} y={SY + 66} size={22} color={C.muted}>
              frekuensi (GHz) · pola garis lain skematis
            </Label>
            {MESSY.map((m, i) => (
              <line key={i} x1={fx(m.f)} y1={SY} x2={fx(m.f)} y2={SY - m.h * 220 * ramp(messy, i / 60, i / 60 + 0.3)} stroke={C.violet} strokeWidth={3} opacity={0.5 * (1 - 0.6 * two)} />
            ))}
            <Label x={(AX0 + AX1) / 2} y={SY - 300} size={28} weight={600} color={C.violet} opacity={1 - two}>
              rotor asimetris: bukan sisir sederhana
            </Label>
            {[
              [22.235, '22,235 GHz'],
              [183.31, '183,31 GHz'],
            ].map(([f, lbl], i) => (
              <g key={i} opacity={two}>
                <line x1={fx(f as number)} y1={SY} x2={fx(f as number)} y2={SY - 260} stroke={C.sky} strokeWidth={8} strokeLinecap="round" />
                <Label x={fx(f as number) + (i ? -14 : 14)} y={SY - 285} size={28} weight={700} color={C.sky} anchor={i ? 'end' : 'start'}>
                  {lbl as string}
                </Label>
              </g>
            ))}
            <Label x={(AX0 + AX1) / 2} y={SY - 360} size={30} weight={700} color={C.sky} opacity={gas}>
              tajam hanya untuk uap air (fase gas)
            </Label>
          </g>
        </g>
        {/* air cair: jaringan ikatan hidrogen */}
        <g opacity={pB}>
          {NET.map((a, i) =>
            NET.map((b, j) =>
              j > i && Math.hypot(a.x - b.x, a.y - b.y) < 360 ? (
                <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.sky} strokeOpacity={0.4} strokeWidth={2.5} strokeDasharray="5 8" />
              ) : null,
            ),
          )}
          {NET.map((m, i) => (
            <H2O key={i} x={m.x} y={m.y} s={0.75} yaw={m.yaw + wiggle * 0.25 * Math.sin(t * 5 + i)} pitch={0.3} roll={m.roll + wiggle * 0.2 * Math.sin(t * 4 + i * 2)} />
          ))}
          <Label x={960} y={790} size={30} weight={600} color={C.ink} opacity={wiggle}>
            air cair: tidak berputar bebas, hanya bergoyang & berganti pasangan
          </Label>
        </g>
      </Stage>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 205,
          transform: 'translate(-50%,0)',
          opacity: pB * key,
          padding: '10px 26px',
          borderRadius: 14,
          border: `2px solid ${C.coral}`,
          background: '#ffffff',
          boxShadow: '4px 5px 0 rgba(232,80,111,0.25)',
          color: C.coral,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: 28,
          whiteSpace: 'nowrap',
        }}
      >
        kunci untuk memahami oven microwave →
      </div>
    </AbsoluteFill>
  );
};
