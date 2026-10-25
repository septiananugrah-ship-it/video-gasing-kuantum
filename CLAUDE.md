# Konteks repo (untuk asisten AI)

- Video "Gasing Kuantum" (Kimia Kuantum Gerak Rotasi) milik **Chika Aura Felicia**, dibuat dengan bantuan Yayan (lihat repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md` untuk aturan umum & pelajaran teknis).
- Gaya wajib **berbeda** dari video Yayan: tema terang "buku catatan sains" (kertas berkisi, ilustrasi datar bergaris tinta, kartu putih berpita warna, stabilo pada subtitle). Jangan kembali ke gaya gelap/angkasa; tidak memakai branding SCIENTIAN.
- Narasi: ElevenLabs **suara klon** (voice ID dari secret `ELEVENLABS_VOICE_ID` atau input workflow), bukan Bagas. Selalu sediakan versi tanpa narasi.
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, berhenti dan minta pengguna menekan *Run workflow* sendiri; beri link & isian.
- Alur: branch → PR → merge → (pengguna menekan workflow).

## Aturan konten & tata letak

- Rumus utama ≥ 56 px (kartu `Formula` / baris turunan), satu kartu per momen; zona subtitle (bawah layar) selalu bebas.
- "≈" untuk perkiraan, "±" hanya untuk plus-minus/ketidakpastian.
- Angka & konvensi yang sudah dicek ada di `naskah/AUDIT.md`; ubah angka = rekam ulang baris, jadi cek dulu ke sumber.
- Teks TTS terpisah dari subtitle (`src/tts.ts`, `tts:` per baris di `src/script.ts`). Setelah suara dibuat, minta pengguna menekan workflow **Cek pengucapan narasi (Whisper)**.

## Pelajaran

- `selectComposition` juga butuh `browserExecutable` (bukan hanya `renderStill`/`renderMedia`), kalau tidak Remotion mencoba mengunduh Chrome dan gagal di sandbox.
- Di tema terang jangan pakai filter neon `url(#glow)`: garis lurus vertikal/horizontal ikut hilang (kotak filter berukuran nol). Pakai cakram pastel (`Glow`).
- Sumbu y layar terbalik: φ naik = berlawanan jarum jam bila titik digambar dengan `y = cy − r sin φ`. Cocokkan arah gelombang/fase dengan panah.
- Doppler: sumber menjauh → frekuensi turun (merah), mendekat → naik (biru).
- H₂O: sumbu b = sumbu C₂, a sejajar H···H (di bidang), c tegak lurus bidang; I_a < I_b < I_c. Sumbu menempel ke pusat massa, bukan ke atom O.
- Vektor momen dipol (IUPAC) menunjuk dari δ− ke δ+.
- 2,45 GHz = pita ISM (industri, ilmiah, medis), bukan resonansi air.
- Tanda akar: jangan `borderTop` pada span inline (garis melayang di atas glif). Pakai `Sqrt` (SVG + inline-block).
- Untuk adegan "wah": beri benda yang bergerak sesuai fisika (molekul berputar sesuai J, lapisan atmosfer per kanal, zoom bertingkat), bukan grafik statis saja.
- Cowork: web search & koneksi GitHub dinonaktifkan organisasi; hasil dikirim sebagai zip/patch, pengguna mengunggah lewat Codespaces.
