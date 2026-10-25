import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/source-serif-4/400-italic.css';
import '@fontsource/source-serif-4/600-italic.css';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';

export const W = 1920;
export const H = 1080;

// Palet "Gasing Kuantum" (tema terang): kertas putih gading, tinta ungu tua,
// aksen hijau toska (kata kunci) dan koral yang cukup pekat agar kontras di latar terang.
export const C = {
  bg: '#fbfaf6',
  bg2: '#f3f0fa',
  ink: '#23203f',
  muted: '#625d7d',
  faint: '#d3cee3',
  aqua: '#0e9f8a',
  coral: '#e8506f',
  violet: '#6c4ee0',
  sun: '#d68f00',
  sky: '#2b8fd6',
  lime: '#5a9c16',
  red: '#d6324f',
  paper: '#ffffff',
  grid: '#c9dcef',
};

/** Warna pastel pasangan tiap aksen (untuk blok, pil, dan stabilo). */
export const PASTEL: Record<string, string> = {
  aqua: '#d8f3ec',
  coral: '#fde2e8',
  violet: '#e9e3fd',
  sun: '#fdefcf',
  sky: '#dceefb',
  lime: '#e6f4d4',
  red: '#fbdde2',
  ink: '#e8e6f0',
  muted: '#ecebf2',
};

export type Hue = 'aqua' | 'coral' | 'violet' | 'sun' | 'sky' | 'lime' | 'red' | 'ink' | 'muted';

export const FONT = {
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  serif: '"Source Serif 4", Georgia, serif',
};

// Warna atom (konvensi CPK, disesuaikan untuk latar terang)
export const ATOM: Record<string, {fill: string; glow: string; r: number}> = {
  H: {fill: '#ffffff', glow: '#b8b0e6', r: 30},
  D: {fill: '#b9a6ff', glow: '#8f74f0', r: 34},
  C: {fill: '#4b4766', glow: '#8d88b3', r: 42},
  C13: {fill: '#8a6fd6', glow: '#a48ae6', r: 44},
  O: {fill: '#e8506f', glow: '#ff9aac', r: 42},
  N: {fill: '#2b8fd6', glow: '#8faaf5', r: 42},
};

export const MOOD_TINT: Record<string, string> = {
  mystery: '#e7e2fb',
  title: '#fbe3ec',
  wonder: '#dff3f7',
  build: '#e4e7fb',
  quantum: '#ece2fb',
  tension: '#fbe4ea',
  bright: '#def5ee',
  resolve: '#e0f4ef',
  outro: '#e9e5fa',
};
