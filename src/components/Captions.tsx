import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {ALL_LINES, type TWord} from '../timeline.ts';

type Page = {words: TWord[]; start: number; end: number; contIn?: boolean; contOut?: boolean};

const MAX_WORDS = 8;
const MAX_CHARS = 48;

// Pecah setiap baris narasi menjadi "halaman" subtitle (satu–dua baris layar).
const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  for (const line of ALL_LINES) {
    let cur: TWord[] = [];
    const flush = () => {
      if (cur.length) pages.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
      cur = [];
    };
    line.words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((s, x) => s + x.text.length + 1, 0);
      const remaining = line.words.length - i - 1;
      const punct = /[,;:.]$/.test(w.text);
      if (remaining === 0) return;
      if (cur.length >= MAX_WORDS || chars >= MAX_CHARS || (punct && cur.length >= 3 && remaining >= 3)) flush();
    });
    flush();
  }
  const out: Page[] = pages.map((p, i) => {
    const next = pages[i + 1];
    const hold = p.end + 1.2;
    // halaman berikutnya langsung menyambung → kotak tidak berkedip (tanpa fade keluar/masuk)
    const contOut = !!next && next.start - p.end < 0.5;
    return {...p, start: p.start - 0.12, end: next ? Math.min(hold, next.start - 0.12) : hold, contOut};
  });
  out.forEach((p, i) => {
    if (i > 0) p.contIn = out[i - 1].contOut;
  });
  return out;
})();

/** Subtitle kata-per-kata: kata yang sedang diucapkan diberi sorotan pil, kata kunci berwarna akuamarin. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = PAGES.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const pin = page.contIn ? 1 : ramp(t, page.start, page.start + 0.22);
  const pout = page.contOut ? 1 : 1 - ramp(t, page.end - 0.2, page.end);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1500,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.32,
          letterSpacing: -0.2,
          opacity: pin * pout,
          translate: `0px ${(1 - pin) * 12}px`,
          padding: '10px 26px',
          borderRadius: 16,
          background: '#ffffff',
          boxShadow: `5px 6px 0 ${C.ink}1a`,
          border: `2px solid ${C.ink}`,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = ramp(t, w.start - 0.04, w.start + 0.12);
          const active = Math.min(ramp(t, w.start - 0.06, w.start + 0.06), 1 - ramp(t, w.end, w.end + 0.16));
          const appear = ramp(t, page.start + i * 0.02, page.start + i * 0.02 + 0.28);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                position: 'relative',
                marginRight: '0.26em',
                padding: '0 0.08em',
                opacity: appear * (0.5 + 0.5 * spoken),
                translate: `0px ${(1 - appear) * 8}px`,
                color: w.hl ? interpolateColors(spoken, [0, 1], [C.ink, '#0a7f6e']) : C.ink,
                fontWeight: w.hl ? 800 : 600,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: w.hl ? '0.52em -0.08em 0.04em' : 'auto -0.04em -0.02em',
                  height: w.hl ? undefined : 4,
                  borderRadius: 4,
                  background: w.hl ? '#ffdf7e' : C.violet,
                  opacity: w.hl ? Math.max(spoken, 0) : active,
                  zIndex: -1,
                }}
              />
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
