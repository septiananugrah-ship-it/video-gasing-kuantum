import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {Diatomic} from '../components/viz';
import {BRAND} from '../brand';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'Modul 5 Kimia Kuantum — Teori Kuantum pada Gerak Rotasi (bahan kuliah IGMA Sanjaya, UNESA)',
  'P. Atkins, J. de Paula & J. Keeler, Atkins\u2019 Physical Chemistry, Oxford Univ. Press',
  'I. N. Levine, Quantum Chemistry, Pearson',
  'P. F. Bernath, Spectra of Atoms and Molecules, Oxford Univ. Press',
  'W. Gordy & R. L. Cook, Microwave Molecular Spectra, Wiley',
  'K. P. Huber & G. Herzberg, Constants of Diatomic Molecules (NIST Chemistry WebBook)',
  'CDMS — Cologne Database for Molecular Spectroscopy (garis CO & H₂O)',
  'CODATA 2018 (NIST): h, c, kB, u',
  'U. Kaatze, J. Chem. Eng. Data 34, 371 (1989) — permitivitas dielektrik air',
  'C. O. Kappe, Angew. Chem. Int. Ed. 43, 6250 (2004) — sintesis berbantuan gelombang mikro',
  'F. T. Ulaby & D. G. Long, Microwave Radar and Radiometric Remote Sensing (2014)',
  'NOAA KLM User\u2019s Guide — kanal AMSU-A (50–58 GHz) & MHS (183 GHz)',
  'T. M. Dame, D. Hartmann & P. Thaddeus, Astrophys. J. 547, 792 (2001) — survei CO Bima Sakti',
  'A. D. Bolatto, M. Wolfire & A. K. Leroy, Annu. Rev. Astron. Astrophys. 51, 207 (2013)',
  'G. G. Brown et al., Rev. Sci. Instrum. 79, 053103 (2008) — spektrometer chirped pulse',
  'S. R. Domingos, C. Pérez & M. Schnell, Annu. Rev. Phys. Chem. 69, 499 (2018) — kiralitas',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.4);
  const refs = ramp(t, 2.2, 3.2);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={150} r={200} color="violet" opacity={0.22} />
        <Diatomic cx={960} cy={150} theta={Math.PI / 2 - 0.12} phi={t * 1.1} len={170} rA={28} rB={30} massRatio={0.43} pitch={0.4} opacity={a * 0.9} />
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 262}}>
        <div style={{fontFamily: FONT.sans, fontSize: 26, letterSpacing: 10, color: C.aqua, fontWeight: 600, opacity: a}}>{BRAND.subtitle.toUpperCase()}</div>
        <div style={{fontFamily: FONT.sans, fontSize: 96, fontWeight: 800, color: C.ink, lineHeight: 1.05, opacity: a, textShadow: '5px 5px 0 #e9e3fd'}}>
          {BRAND.title.toUpperCase()}
        </div>
        <div style={{marginTop: 14, fontFamily: FONT.sans, fontSize: 32, color: C.ink, opacity: ramp(t, 1, 2)}}>
          Terima kasih telah menonton · <span style={{color: C.coral, fontWeight: 700}}>{BRAND.author}</span>
        </div>
        <div style={{marginTop: 36, opacity: refs}}>
          <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 4, color: C.muted, marginBottom: 12, textAlign: 'center'}}>RUJUKAN</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50, rowGap: 6, width: 1720}}>
            {REFS.map((r, i) => (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 19, color: C.muted, lineHeight: 1.35, opacity: ramp(t, 2.2 + i * 0.08, 3 + i * 0.08)}}>
                {r}
              </div>
            ))}
          </div>
          <div style={{marginTop: 18, fontFamily: FONT.sans, fontSize: 19, color: C.muted, textAlign: 'center'}}>
            Spektrum & ilustrasi alat bersifat skematis · angka garis CO dan H₂O dari katalog spektroskopi
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
