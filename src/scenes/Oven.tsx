import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, smoothPath, win} from '../anim';
import {Badge, Glow, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {Oven as OvenIllus} from '../components/illus';
import {EASE_IN_OUT} from '../anim';
import {C} from '../theme';

// sumbu frekuensi logaritmik 0,5 – 300 GHz
const LX0 = 260;
const LX1 = 1660;
const lf = (f: number) => LX0 + ((Math.log10(f) - Math.log10(0.5)) / (Math.log10(300) - Math.log10(0.5))) * (LX1 - LX0);
const SY = 700;

// kurva rugi dielektrik air cair (bentuk Debye, puncak ≈ 19 GHz pada 25 °C) — skematis
const debye = (f: number) => {
  const x = f / 19;
  return (2 * x) / (1 + x * x);
};

const DIP = Array.from({length: 18}, (_, i) => ({x: 1180 + (i % 6) * 100, y: 330 + Math.floor(i / 6) * 120, ph: rand(i * 3.1) * 6}));

export const Oven: React.FC = () => {
  const {t, cue} = useScene();
  const pA = win(t, -1, cue(6) - 0.4, 0.5, 0.6);
  const pB = win(t, cue(6) - 0.2, cue(10) - 0.4, 0.7, 0.6);
  const pC = ramp(t, cue(10) - 0.2, cue(10) + 0.8);

  const axis = ramp(t, cue(1) - 0.2, cue(1) + 0.8);
  const myth = ramp(t, cue(2), cue(2) + 0.8, BACK);
  const wrong = ramp(t, cue(3), cue(3) + 0.5, BACK);
  const gasLine = ramp(t, cue(4), cue(4) + 0.8, BACK);
  const liquid = ramp(t, cue(5), cue(5) + 1);
  const field = ramp(t, cue(7) - 0.2, cue(7) + 0.6);
  const heat = ramp(t, cue(8), cue(8) + 1.5);
  const band = ramp(t, cue(9), cue(9) + 0.8, BACK);

  const E = Math.sin(t * 4.5);
  // oven: muncul besar di tengah ("Kembali ke dapur"), lalu terbang menjadi ikon di atas garis 2,45 GHz
  const ovIn = ramp(t, 0.1, 0.9, BACK);
  const fly = ramp(t, cue(1) - 0.3, cue(1) + 1.0, EASE_IN_OUT);
  const ovX = 960 + (lf(2.45) - 960) * fly;
  const ovY = 480 + (215 - 480) * fly;
  const ovS = 1.25 + (0.3 - 1.25) * fly;
  return (
    <AbsoluteFill>
      <Stage>
        {/* oven pembuka */}
        <g opacity={ovIn * pA} transform={`translate(${ovX} ${ovY}) scale(${ovS})`}>
          <OvenIllus x={0} y={0} t={t} glow={1} />
        </g>
        <g opacity={ovIn * (1 - fly)}>
          <Label x={960} y={720} size={34} weight={700} color={C.sun}>
            2,45 GHz
          </Label>
        </g>
        {/* A: sumbu frekuensi */}
        <g opacity={pA * axis}>
          <line x1={LX0} y1={SY} x2={LX1} y2={SY} stroke={C.muted} strokeWidth={2} />
          {[0.5, 1, 2, 5, 10, 20, 50, 100, 200].map((f) => (
            <g key={f}>
              <line x1={lf(f)} y1={SY} x2={lf(f)} y2={SY + 10} stroke={C.muted} strokeWidth={2} />
              <Label x={lf(f)} y={SY + 32} size={22} color={C.muted} font="mono">
                {String(f).replace('.', ',')}
              </Label>
            </g>
          ))}
          <Label x={(LX0 + LX1) / 2} y={SY + 66} size={22} color={C.muted}>
            frekuensi (GHz, skala log)
          </Label>
          {/* oven 2,45 GHz */}
          <line x1={lf(2.45)} y1={SY} x2={lf(2.45)} y2={SY - 330} stroke={C.sun} strokeWidth={6} />
          <Label x={lf(2.45)} y={SY - 360} size={30} weight={700} color={C.sun}>
            oven 2,45 GHz
          </Label>
          <g opacity={myth}>
            <Label x={lf(2.45) + 30} y={SY - 270} size={26} color={C.ink} anchor="start">
              "resonansi molekul air"?
            </Label>
            <g opacity={wrong}>
              <line x1={lf(2.45) + 26} y1={SY - 268} x2={lf(2.45) + 330} y2={SY - 272} stroke={C.red} strokeWidth={5} />
              <Label x={lf(2.45) + 345} y={SY - 270} size={30} weight={800} color={C.red} anchor="start">
                tidak tepat ✗
              </Label>
            </g>
          </g>
          <g opacity={gasLine}>
            <line x1={lf(22.235)} y1={SY} x2={lf(22.235)} y2={SY - 200} stroke={C.sky} strokeWidth={8} strokeLinecap="round" />
            <line x1={lf(183.31)} y1={SY} x2={lf(183.31)} y2={SY - 240} stroke={C.sky} strokeWidth={8} strokeLinecap="round" />
            <Label x={lf(22.235)} y={SY - 225} size={26} weight={700} color={C.sky}>
              uap air 22 GHz
            </Label>
            <path d={`M${lf(2.45) + 10},${SY - 120} Q${(lf(2.45) + lf(22)) / 2},${SY - 170} ${lf(22) - 14},${SY - 130}`} fill="none" stroke={C.muted} strokeWidth={2.5} markerEnd="url(#arrow-muted)" />
            <Label x={(lf(2.45) + lf(22)) / 2} y={SY - 185} size={24} color={C.muted}>
              ≈ 9 ×
            </Label>
          </g>
          <g opacity={liquid}>
            <path
              d={smoothPath(Array.from({length: 120}, (_, i) => {
                const f = 0.5 * Math.pow(600, i / 119);
                return [lf(f), SY - debye(f) * 150 * liquid] as [number, number];
              }))}
              fill="rgba(255,107,139,0.12)"
              stroke={C.coral}
              strokeWidth={4}
            />
            <Label x={LX0 + 10} y={SY - 60} size={24} color={C.coral} anchor="start">
              air cair: serapan lebar, tanpa garis tajam
            </Label>
          </g>
        </g>

        {/* B: pemanasan dielektrik */}
        <g opacity={pB}>
          <Glow x={1480} y={450} r={360} color="coral" opacity={0.25 * heat} />
          {/* pelat medan */}
          <rect x={1070} y={250} width={820} height={12} rx={6} fill={E > 0 ? C.coral : C.sky} opacity={field * 0.8} />
          <rect x={1070} y={640} width={820} height={12} rx={6} fill={E > 0 ? C.sky : C.coral} opacity={field * 0.8} />
          <Label x={1480} y={690} size={26} color={C.muted} opacity={field}>
            medan listrik bolak-balik
          </Label>
          {DIP.map((d, i) => {
            const target = (E > 0 ? -Math.PI / 2 : Math.PI / 2) * field;
            const ang = d.ph * (1 - field) + target * 0.55 + 0.6 * Math.sin(t * 7 + d.ph) * field;
            const dx = Math.cos(ang) * 26;
            const dy = Math.sin(ang) * 26;
            return (
              <g key={i}>
                <line x1={d.x - dx} y1={d.y - dy} x2={d.x + dx} y2={d.y + dy} stroke="#8a84ad" strokeWidth={5} />
                <circle cx={d.x + dx} cy={d.y + dy} r={11} fill={C.coral} />
                <circle cx={d.x - dx} cy={d.y - dy} r={8} fill="#ffffff" stroke="#8a84ad" strokeWidth={2} />
              </g>
            );
          })}
          {/* teks kiri */}
          <Label x={540} y={380} size={44} weight={800} color={C.coral}>
            pemanasan dielektrik
          </Label>
          <Label x={540} y={450} size={28} color={C.ink} opacity={field}>
            dipol ditarik berbalik arah
          </Label>
          <Label x={540} y={500} size={28} color={C.ink} opacity={field}>
            jaringan ikatan hidrogen menahan
          </Label>
          <Label x={540} y={570} size={32} weight={700} color={C.sun} opacity={heat}>
            gesekan antarmolekul → panas
          </Label>
          <g opacity={band}>
            <Label x={540} y={660} size={26} color={C.muted}>
              2,45 GHz: pita ISM (industri, ilmiah, medis),
            </Label>
            <Label x={540} y={700} size={26} color={C.muted}>
              cukup dalam menembus makanan
            </Label>
          </g>
          {/* uap panas */}
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${1250 + k * 150},230 q-14,-30 0,-55 q14,-25 0,-50`} fill="none" stroke={C.coral} strokeOpacity={0.5 * heat * (0.5 + 0.5 * Math.sin(t * 2 + k))} strokeWidth={4} />
          ))}
        </g>

        {/* C: aplikasi industri */}
        <g opacity={pC}>
          {[
            {x: 420, title: 'Pengeringan', sub: 'kayu, kertas, tekstil', icon: 0},
            {x: 960, title: 'Pencairan pangan beku', sub: 'blok daging & ikan', icon: 1},
            {x: 1500, title: 'Sintesis kimia', sub: 'reaksi lebih cepat', icon: 2},
          ].map((a, i) => {
            const p = ramp(t, cue(10) + i * 0.8, cue(10) + i * 0.8 + 0.7, BACK);
            return (
              <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
                <circle cx={a.x} cy={430} r={130} fill="rgba(255,107,139,0.08)" stroke={C.coral} strokeWidth={3} />
                {a.icon === 0 ? (
                  <g>
                    {[0, 1, 2].map((k) => (
                      <rect key={k} x={a.x - 80} y={380 + k * 34} width={160} height={22} rx={4} fill="#a07a52" />
                    ))}
                    {[0, 1, 2].map((k) => (
                      <path key={k} d={`M${a.x - 50 + k * 50},370 q-10,-22 0,-40 q10,-18 0,-36`} fill="none" stroke={C.ink} strokeOpacity={0.5} strokeWidth={4} />
                    ))}
                  </g>
                ) : a.icon === 1 ? (
                  <g>
                    <rect x={a.x - 75} y={370} width={150} height={110} rx={14} fill={C.sky} opacity={0.6} />
                    {[0, 1, 2, 3].map((k) => (
                      <line key={k} x1={a.x - 60 + k * 40} y1={385} x2={a.x - 60 + k * 40} y2={465} stroke="#fff" strokeOpacity={0.5} strokeWidth={3} />
                    ))}
                  </g>
                ) : (
                  <g>
                    <path d={`M${a.x - 30},350 L${a.x - 30},400 L${a.x - 80},480 L${a.x + 80},480 L${a.x + 30},400 L${a.x + 30},350 Z`} fill="rgba(54,241,205,0.25)" stroke={C.aqua} strokeWidth={4} />
                    <circle cx={a.x - 20} cy={450} r={9} fill={C.aqua} />
                    <circle cx={a.x + 22} cy={440} r={6} fill={C.aqua} />
                  </g>
                )}
                <Label x={a.x} y={620} size={34} weight={700} color={C.ink}>
                  {a.title}
                </Label>
                <Label x={a.x} y={668} size={26} color={C.muted}>
                  {a.sub}
                </Label>
              </g>
            );
          })}
        </g>
      </Stage>
      <Badge x={960} y={215} text="Di industri: prinsip pemanasan dielektrik yang sama" color={C.coral} opacity={pC} size={28} />
    </AbsoluteFill>
  );
};
