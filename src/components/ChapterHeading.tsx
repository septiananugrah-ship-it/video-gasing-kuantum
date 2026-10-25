import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {C, FONT, PASTEL} from '../theme';
import {TIMELINE} from '../timeline.ts';

const TOTAL_CHAPTERS = TIMELINE.scenes.filter((s) => s.chapter).length;

// Tiga bagian wajib tugas.
export const PARTS: Record<number, {label: string; color: string; pastel: string}> = {
  1: {label: 'Bagian 1 · Prinsip & teori dasar', color: C.aqua, pastel: PASTEL.aqua},
  2: {label: 'Bagian 2 · Implementasi dalam kimia', color: C.violet, pastel: PASTEL.violet},
  3: {label: 'Bagian 3 · Penerapan di industri', color: C.coral, pastel: PASTEL.coral},
};

/** Heading bab ala label buku catatan: nomor dalam lingkaran berwarna + pil bagian + judul. */
export const ChapterHeading: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scene = TIMELINE.scenes.find((s) => t >= s.start && t < s.end);
  if (!scene || !scene.chapter) return null;
  const lt = t - scene.start;
  const out = 1 - ramp(lt, scene.duration - 0.9, scene.duration - 0.2, EASE_IN_OUT);
  const part = scene.part ? PARTS[scene.part] : {label: 'Penutup', color: C.sun, pastel: PASTEL.sun};
  const pin = ramp(lt, 0, 0.6, BACK);
  const prog = Number(scene.chapter) / TOTAL_CHAPTERS;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <div style={{position: 'absolute', left: 80, top: 56, display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            background: part.color,
            border: `2.5px solid ${C.ink}`,
            boxShadow: `4px 4px 0 ${C.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: 26,
            color: '#fff',
            scale: String(pin),
            rotate: `${(1 - pin) * -90}deg`,
          }}
        >
          {scene.chapter}
        </div>
        <div style={{opacity: ramp(lt, 0.2, 0.8)}}>
          <div
            style={{
              display: 'inline-block',
              padding: '3px 14px',
              borderRadius: 999,
              background: part.pastel,
              color: C.ink,
              fontFamily: FONT.sans,
              fontSize: 19,
              fontWeight: 700,
              border: `1.5px solid ${part.color}`,
            }}
          >
            {part.label}
          </div>
          <div style={{fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.ink, display: 'flex', letterSpacing: -0.3, marginTop: 4}}>
            {scene.title.split('').map((ch, i) => {
              const p = ramp(lt, 0.25 + i * 0.016, 0.6 + i * 0.016);
              return (
                <span key={i} style={{opacity: p, translate: `0px ${(1 - p) * 10}px`, whiteSpace: 'pre', display: 'inline-block'}}>
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      {/* bilah progres bab di kanan atas */}
      <div style={{position: 'absolute', right: 84, top: 74, width: 220, height: 10, borderRadius: 5, background: '#fff', border: `2px solid ${C.ink}`, overflow: 'hidden', opacity: ramp(lt, 0.3, 0.9)}}>
        <div style={{width: `${100 * prog * ramp(lt, 0.3, 1.4)}%`, height: '100%', background: part.color}} />
      </div>
    </AbsoluteFill>
  );
};
