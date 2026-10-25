import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, rand, ramp, smoothPath} from '../anim';
import {Badge, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT, PASTEL} from '../theme';

/* Penampang atmosfer (kartu kiri): ketinggian naik ke atas. */
const AX = 110;
const AY = 236;
const AW = 900;
const AH = 560;
const GROUND = AY + AH - 46;

// Kanal oksigen sounder suhu (frekuensi kanal AMSU-A, GHz). Makin dekat ke pusat pita ≈ 60 GHz,
// atmosfer makin "buram", sehingga kanal itu melihat lapisan yang makin tinggi.
const CH = [
  {f: '50,3', y: GROUND - 36, T: 0.9},
  {f: '52,8', y: GROUND - 100, T: 0.8},
  {f: '53,6', y: GROUND - 170, T: 0.66},
  {f: '54,4', y: GROUND - 245, T: 0.5},
  {f: '54,9', y: GROUND - 315, T: 0.38},
  {f: '55,5', y: GROUND - 375, T: 0.33},
  {f: '57,3', y: GROUND - 440, T: 0.42},
];
const tempX = (T: number) => AX + 360 + T * 400;

const CLOUDS = Array.from({length: 5}, (_, i) => ({x: AX + 160 + i * 170 + rand(i) * 40, y: GROUND - 150 - rand(i * 3) * 60, s: 0.55 + rand(i * 7) * 0.3}));
const DROPS = Array.from({length: 26}, (_, i) => ({x: AX + 40 + rand(i * 2.3) * (AW - 80), y: GROUND - 20 - rand(i * 4.1) * 190}));

const Cloud: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={90} ry={34} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
    <ellipse cx={-35} cy={-20} rx={45} ry={35} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
    <ellipse cx={30} cy={-26} rx={52} ry={40} fill="#ffffff" stroke={C.ink} strokeWidth={3} />
    <ellipse cx={0} cy={-4} rx={84} ry={28} fill="#ffffff" />
  </g>
);

/* Kartu kanan atas: pita serapan O₂ di sekitar 60 GHz (skematis). */
const SA = {x: 1090, y: 236, w: 730, h: 270};
const fO = (f: number) => SA.x + 50 + ((f - 49.5) / (60.5 - 49.5)) * (SA.w - 100);
const absO2 = (f: number) => {
  const d = Math.abs(f - 59);
  const band = Math.exp(-(d * d) / 9);
  const lines = 0.18 * Math.max(0, Math.sin((f - 50) * 4.2)) * band;
  return Math.min(1, 0.05 + 0.85 * band + lines);
};
/* Kartu kanan bawah: garis uap air 183,31 GHz. */
const SB = {x: 1090, y: 546, w: 730, h: 250};
const fH = (f: number) => SB.x + 50 + ((f - 170) / (196 - 170)) * (SB.w - 100);

export const Satellite: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const card = ramp(t, 0.1, 1.0, BACK);
  const sat = ramp(t, cue(1) - 0.3, cue(1) + 1, BACK);
  const radio = ramp(t, cue(2), cue(2) + 0.8);
  const hum = ramp(t, cue(3), cue(3) + 1);
  const temp = ramp(t, cue(4) - 0.2, cue(4) + 0.6);
  const layerT = (i: number) => ramp(t, wordOf(4, 'suhu') + i * 0.45, wordOf(4, 'suhu') + i * 0.45 + 0.5);
  const mag = ramp(t, cue(5), cue(5) + 0.8, BACK);
  const cloud = ramp(t, cue(6), cue(6) + 0.8);
  const fc = ramp(t, cue(7), cue(7) + 0.8, BACK);
  const sx = 840;
  const sy = 178;
  const nLit = CH.reduce((n, _, i) => n + layerT(i), 0);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <linearGradient id="atm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e9e3fd" />
            <stop offset="60%" stopColor="#dceefb" />
            <stop offset="100%" stopColor="#d8f3ec" />
          </linearGradient>
          <clipPath id="atm-clip">
            <rect x={AX} y={AY} width={AW} height={AH} rx={22} />
          </clipPath>
        </defs>

        {/* ===== penampang atmosfer ===== */}
        <g opacity={card}>
          <g clipPath="url(#atm-clip)">
            <rect x={AX} y={AY} width={AW} height={AH} fill="url(#atm-sky)" />
            {/* lapisan uap air (troposfer bawah) */}
            <rect x={AX} y={GROUND - 220} width={AW} height={220} fill={C.sky} opacity={0.16 * hum} />
            {DROPS.map((d, i) => (
              <path key={i} d={`M${d.x},${d.y - 9} q7,9 0,14 q-7,-5 0,-14 Z`} fill={C.sky} opacity={hum * (0.5 + 0.4 * Math.sin(t * 2 + i))} />
            ))}
            {/* lapisan kanal O₂ yang menyala satu per satu */}
            {CH.map((c, i) => {
              const p = layerT(i) * temp;
              const col = interpolateColors(i / (CH.length - 1), [0, 1], [C.coral, C.violet]);
              return (
                <g key={c.f} opacity={0.25 + 0.75 * p}>
                  <rect x={AX} y={c.y - 26} width={AW} height={52} fill={col} opacity={0.1 + 0.18 * p} />
                  <line x1={AX} y1={c.y} x2={AX + AW} y2={c.y} stroke={col} strokeWidth={2} strokeDasharray="4 8" opacity={0.6} />
                  <text x={AX + 22} y={c.y + 8} fontFamily={FONT.mono} fontSize={22} fontWeight={600} fill={col} opacity={temp}>
                    {`${c.f} GHz`}
                  </text>
                </g>
              );
            })}
            {/* profil suhu yang terbangun dari kanal-kanal */}
            <path
              d={smoothPath(CH.slice(0, Math.max(1, Math.ceil(nLit))).map((c) => [tempX(c.T), c.y] as [number, number]))}
              fill="none"
              stroke={C.ink}
              strokeWidth={4}
              opacity={temp * Math.min(1, nLit)}
            />
            {CH.map((c, i) => (
              <circle key={c.f} cx={tempX(c.T)} cy={c.y} r={9} fill="#fff" stroke={C.ink} strokeWidth={3} opacity={layerT(i) * temp} />
            ))}
            {/* awan */}
            {CLOUDS.map((c, i) => (
              <Cloud key={i} x={c.x + ((t * 6) % 40)} y={c.y} s={c.s} o={cloud} />
            ))}
            {/* tanah */}
            <path d={`M${AX},${GROUND} Q${AX + AW / 2},${GROUND - 14} ${AX + AW},${GROUND} L${AX + AW},${AY + AH} L${AX},${AY + AH} Z`} fill="#bfe3a8" stroke={C.ink} strokeWidth={3} />
            {Array.from({length: 9}, (_, i) => (
              <rect key={i} x={AX + 70 + i * 95} y={GROUND - 22 - (i % 3) * 10} width={26} height={22 + (i % 3) * 10} fill="#ffffff" stroke={C.ink} strokeWidth={2} />
            ))}
            {/* sinyal naik menuju radiometer */}
            {[0, 1, 2, 3, 4].map((k) => {
              const x0 = AX + 180 + k * 150;
              const ph = (t * 0.6 + k / 5) % 1;
              return (
                <path
                  key={k}
                  d={smoothPath(Array.from({length: 30}, (_, i) => {
                    const u = i / 29;
                    return [x0 + (sx - x0) * u, GROUND - 40 - (GROUND - 40 - AY) * u + 8 * Math.sin(u * 18 - t * 6)] as [number, number];
                  }))}
                  fill="none"
                  stroke={k % 2 ? C.sky : C.violet}
                  strokeWidth={3}
                  opacity={radio * 0.6 * (0.4 + 0.6 * Math.sin(Math.PI * ph))}
                />
              );
            })}
          </g>
          <rect x={AX} y={AY} width={AW} height={AH} rx={22} fill="none" stroke={C.ink} strokeWidth={3} />
          {/* sumbu */}
          <g opacity={temp}>
            <text x={tempX(0.35)} y={AY + 34} textAnchor="middle" fontFamily={FONT.sans} fontWeight={700} fontSize={22} fill={C.ink}>
              profil suhu (skematis)
            </text>
            <text x={tempX(0.08)} y={GROUND + 32} fontFamily={FONT.sans} fontSize={20} fill={C.muted}>
              ← dingin · hangat →
            </text>
          </g>
          <text x={AX + AW - 18} y={AY + 32} textAnchor="end" fontFamily={FONT.sans} fontSize={20} fill={C.muted}>
            ketinggian ↑
          </text>
        </g>

        {/* ===== satelit ===== */}
        <g opacity={sat} transform={`translate(${sx} ${sy + 4 * Math.sin(t * 1.2)})`}>
          <rect x={-150} y={-14} width={104} height={30} fill={C.sky} stroke={C.ink} strokeWidth={2.5} />
          <rect x={46} y={-14} width={104} height={30} fill={C.sky} stroke={C.ink} strokeWidth={2.5} />
          {[-120, -90, -60, 76, 106, 136].map((x) => (
            <line key={x} x1={x} y1={-14} x2={x} y2={16} stroke={C.ink} strokeWidth={1.5} opacity={0.5} />
          ))}
          <rect x={-40} y={-30} width={80} height={60} rx={8} fill="#d9d3f5" stroke={C.ink} strokeWidth={3} />
          <ellipse cx={0} cy={40} rx={30} ry={10} fill={C.sun} stroke={C.ink} strokeWidth={2} />
          <text x={172} y={8} fontFamily={FONT.sans} fontWeight={700} fontSize={22} fill={C.ink}>
            satelit · radiometer gelombang mikro
          </text>
        </g>

        {/* ===== kartu O₂ ===== */}
        <g opacity={temp}>
          <rect x={SA.x} y={SA.y} width={SA.w} height={SA.h} rx={18} fill="#fff" stroke={C.ink} strokeWidth={3} />
          <rect x={SA.x} y={SA.y} width={SA.w} height={10} rx={5} fill={C.lime} />
          <text x={SA.x + 24} y={SA.y + 44} fontFamily={FONT.sans} fontWeight={800} fontSize={26} fill={C.ink}>
            O₂ · pita ≈ 60 GHz → suhu
          </text>
          <path
            d={smoothPath(Array.from({length: 120}, (_, i) => {
              const f = 49.5 + (i / 119) * 11;
              return [fO(f), SA.y + SA.h - 50 - absO2(f) * 140] as [number, number];
            }))}
            fill="none"
            stroke={C.lime}
            strokeWidth={4}
          />
          <line x1={SA.x + 40} y1={SA.y + SA.h - 50} x2={SA.x + SA.w - 40} y2={SA.y + SA.h - 50} stroke={C.muted} strokeWidth={2} />
          {[50, 55, 60].map((f) => (
            <text key={f} x={fO(f)} y={SA.y + SA.h - 22} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} fill={C.muted}>
              {f}
            </text>
          ))}
          {CH.map((c, i) => {
            const f = Number(c.f.replace(',', '.'));
            const col = interpolateColors(i / (CH.length - 1), [0, 1], [C.coral, C.violet]);
            return <line key={c.f} x1={fO(f)} y1={SA.y + SA.h - 50} x2={fO(f)} y2={SA.y + SA.h - 50 - 40 - 20 * layerT(i)} stroke={col} strokeWidth={5} strokeLinecap="round" opacity={0.3 + 0.7 * layerT(i)} />;
          })}
          <text x={SA.x + SA.w - 24} y={SA.y + 80} textAnchor="end" fontFamily={FONT.sans} fontSize={20} fill={C.muted}>
            makin dekat pusat pita → lapisan makin tinggi
          </text>
        </g>

        {/* ===== kartu H₂O ===== */}
        <g opacity={hum}>
          <rect x={SB.x} y={SB.y} width={SB.w} height={SB.h} rx={18} fill="#fff" stroke={C.ink} strokeWidth={3} />
          <rect x={SB.x} y={SB.y} width={SB.w} height={10} rx={5} fill={C.sky} />
          <text x={SB.x + 24} y={SB.y + 44} fontFamily={FONT.sans} fontWeight={800} fontSize={26} fill={C.ink}>
            H₂O · 183,31 GHz → kelembapan
          </text>
          <path
            d={smoothPath(Array.from({length: 120}, (_, i) => {
              const f = 170 + (i / 119) * 26;
              const g = 1 / (1 + ((f - 183.31) / 1.6) ** 2);
              return [fH(f), SB.y + SB.h - 50 - g * 130 * hum] as [number, number];
            }))}
            fill={PASTEL.sky}
            stroke={C.sky}
            strokeWidth={4}
          />
          <line x1={SB.x + 40} y1={SB.y + SB.h - 50} x2={SB.x + SB.w - 40} y2={SB.y + SB.h - 50} stroke={C.muted} strokeWidth={2} />
          {[175, 183.31, 190].map((f) => (
            <text key={f} x={fH(f)} y={SB.y + SB.h - 22} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} fill={f === 183.31 ? C.sky : C.muted}>
              {String(f).replace('.', ',')}
            </text>
          ))}
        </g>
      </Stage>
      <Badge x={1455} y={526} text="O₂ tanpa dipol listrik, tetapi punya dipol magnetik" color={C.violet} opacity={mag} size={22} />
      <Badge x={1640} y={200} text="menembus sebagian besar awan" color={C.ink} opacity={cloud * (1 - fc)} size={22} />
      <Badge x={1660} y={200} text="→ prakiraan cuaca harian" color={C.aqua} opacity={fc} size={24} />
    </AbsoluteFill>
  );
};
