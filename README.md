# Gasing Kuantum — Kimia Kuantum Gerak Rotasi

Video edukasi **≈ 21,5 menit** (2K, 30 FPS) karya **Chika Aura Felicia** untuk Tugas Pengganti UTS Kimia Kuantum (kajian: *Kimia Kuantum Gerak Rotasi*). Dibuat dengan [Remotion](https://remotion.dev).

Gaya visual: **buku catatan sains** dengan latar kertas berkisi milimeter, ilustrasi datar bergaris tinta, kartu rumus putih berpita warna, subtitle kata-per-kata dengan stabilo pada kata kunci, dan transisi berputar.

## Isi (tiga bagian wajib tugas)

| Waktu | Bagian | Bab |
|---|---|---|
| 00:00 | Pembuka | Oven microwave & teleskop radio · judul · peta video |
| 01:28 | 1 · Prinsip & teori dasar | 01 Momen inersia & massa tereduksi · 02 Partikel pada cincin (kondisi batas periodik) · 03 Momentum sudut, degenerasi, tanpa energi titik nol · 04 Rotor kaku 3D, E = ħ²J(J+1)/2I · 05 Harmonik sferis · 06 Model vektor (kerucut) · 07 Aturan seleksi (dipol permanen, ΔJ = ±1) · 08 Tangga energi & garis berjarak 2B̃ · 09 Populasi & suhu |
| 10:45 | 2 · Implementasi dalam kimia | 10 Panjang ikatan CO dari garis 115,27 GHz · 11 Isotop ¹³CO · 12 Distorsi sentrifugal & pita P/R · 13 Spektrometer gelombang mikro (chirped pulse, FT) · 14 Air sebagai rotor asimetris |
| 15:59 | 3 · Penerapan di industri | 15 Mitos oven microwave, pita ISM & pemanasan dielektrik industri · 16 Satelit cuaca (O₂ ≈ 60 GHz, H₂O 183 GHz) · 17 Astrokimia (CO penanda H₂, ALMA) · 18 Spektroskopi MRR di farmasi |
| 20:20 | Penutup | Rangkuman · 16 rujukan |

Daftar bab bertimecode untuk deskripsi YouTube/LMS ada di `naskah/BAB_YOUTUBE.txt`. Naskah teleprompter ada di `naskah/NASKAH_VOICEOVER.md`, subtitle di `naskah/narasi.srt`, dan teks yang benar-benar dibacakan TTS di `naskah/naskah-tts.txt`. Timecode di atas masih estimasi; setelah suara dibuat, workflow memperbarui semuanya sesuai durasi rekaman asli.

## Unggah ke GitHub (sekali saja)

1. Buat repo baru, mis. `video-gasing-kuantum`, dengan centang **Add a README file** (Codespace butuh minimal satu commit; README-nya nanti tertimpa).
2. Buka **Code → Codespaces → Create codespace**, lalu seret `video-gasing-kuantum.zip` ke panel file.
3. Di terminal Codespace:

   ```bash
   unzip -o video-gasing-kuantum.zip -d /tmp/vgk && cp -a /tmp/vgk/video-gasing-kuantum/. . && rm -rf /tmp/vgk video-gasing-kuantum.zip
   git add -A && git commit -m "Video Gasing Kuantum" && git push origin HEAD:main
   ```

## Render (tombol ditekan sendiri)

Isi secret di **Settings → Secrets and variables → Actions → New repository secret**:

- `ELEVENLABS_API_KEY`: kunci API ElevenLabs.
- `ELEVENLABS_VOICE_ID`: voice ID suara klon. Bisa juga diisi langsung di form workflow; tidak ada suara bawaan.

Lalu dari tab **Actions**:

1. **Buat voice-over ElevenLabs (suara klon) + render 2K → Run workflow**. Workflow membuat suara per baris, menyesuaikan timeline/subtitle/musik dengan durasi suara asli, menyimpannya ke repo, lalu merender **dua versi 2K**:
   - `gasing-kuantum-dengan-narasi-2k-30fps`
   - `gasing-kuantum-tanpa-narasi-2k-30fps` (musik + subtitle saja, untuk dubbing sendiri)
2. (Disarankan) **Cek pengucapan narasi (Whisper) → Run workflow** setelah suara jadi. Hasilnya: laporan `cek-pengucapan-*` berisi baris yang kemungkinan salah ucap (huruf J/B/M, angka, istilah). Hapus mp3 baris itu, ubah `tts` di `src/script.ts` bila perlu, lalu jalankan langkah 1 lagi (hanya baris yang hilang yang dibuat ulang).
3. Hanya perlu versi tanpa narasi? Jalankan **Render Gasing Kuantum 2K 30FPS** dengan isian bawaan.
4. Setelah ±30–60 menit, unduh artefak di halaman run. Di iPad: tekan lama nama artefak, lalu pilih *Unduh Tautan Tertaut*.

Baris yang teksnya diubah: hapus `public/voiceover/<kode>.mp3`-nya agar dibuat ulang. Workflow hanya membuat baris yang belum ada.

## Pengucapan TTS

Subtitle memakai simbol (J, B̃, φ, θ), tetapi ElevenLabs menerima teks khusus dari `src/tts.ts`: huruf tunggal dieja nama hurufnya dalam bahasa Indonesia (J → "je", B → "be", M → "em", q → "ki"), `phi` → "fi", `theta` → "teta", `Schrödinger` → "Syrodinger". Baris yang butuh ejaan khusus bisa diberi `tts: '...'` di `src/script.ts`.

## Menjalankan sendiri

```bash
npm ci
npm run dev                # Remotion Studio: "GasingKuantum", "GasingKuantum2K", atau folder "Adegan"
npm run render:preview     # pratinjau 960×540
npm run timeline           # perbarui naskah VO, SRT, BAB_YOUTUBE, teks TTS, peta musik
npm run music              # sintesis ulang musik (python3 + numpy + ffmpeg)
npm run check              # cek penanda kata animasi ↔ naskah
npm run lint               # cek tipe TypeScript
```

Props: `showCaptions`, `musicVolume` (0–1), `voiceover` (true = putar `public/voiceover/*.mp3`). Nama penulis & judul ada di `src/brand.ts`.

## Struktur

```
src/script.ts           naskah per adegan (teks, kata kunci, jeda, ejaan TTS opsional)
src/tts.ts              teks ramah-TTS (ejaan huruf & simbol)
src/timeline.ts         waktu baris & kata (estimasi suku kata, atau durasi rekaman asli)
src/components/         latar kertas berkisi, subtitle stabilo, heading bab, primitif (atom, rumus), viz 3D, ilustrasi
src/scenes/             23 adegan
scripts/                voice-over, musik orisinal (numpy), cek pengucapan (Whisper), render potongan & gabung, QA still
naskah/AUDIT.md         hasil audit polish (akurasi, tata letak, kejelasan, teknis)
```

## Polish terakhir

Semua temuan ada di `naskah/AUDIT.md`. Ringkasnya:

- **Akurasi:** arah Doppler (menjauh = frekuensi turun), arah gelombang cincin, sumbu inersia H₂O (b = sumbu C₂), pita ISM 2,45 GHz, arah vektor dipol (δ− → δ+), D̃ pada rumus distorsi, "≈" untuk perkiraan (bukan "±"), dan kurva Boltzmann yang ikut suhu.
- **Visual baru:** cincin 3D miring dengan gelombang yang harus menyambung plus panel "cincin dibuka menjadi garis" (bab 02), gasing berputar di rangkuman, pembantu kiral pada enansiomer (bab 18), kotak gas CO yang berputar sesuai J dan melambat saat didinginkan (bab 09), penampang atmosfer dengan kanal O₂ yang menyala lapis demi lapis (bab 16), zoom teleskop dari antena ALMA ke awan molekul ke molekul CO (bab 17), dan oven pembuka yang terbang ke sumbu frekuensi (bab 15).
- **Tata letak & kelancaran:** semua rumus ≥ 56 px, tanda akar digambar ulang agar rapi, zona subtitle bebas, label tidak saling menimpa, subtitle tidak berkedip saat ganti halaman, dan tidak ada lagi layar kosong lebih dari sekejap (dicek dengan `scripts/qa-sweep.mjs`).

## Catatan angka & sumber

Angka utama: garis ¹²CO J 0→1 = 115,271 GHz, ¹³CO = 110,201 GHz, garis CO J 5→6 = 691,473 GHz, B̃ₑ(CO) = 1,931 cm⁻¹, rₑ = 112,8 pm, garis uap air 22,235 GHz & 183,31 GHz, kanal O₂ AMSU-A 50–58 GHz, oven 2,45 GHz (pita ISM), relaksasi dielektrik air ≈ 19 GHz (25 °C). Sumbernya katalog dan rujukan baku (CDMS/JPL, Huber–Herzberg via NIST WebBook, CODATA, Kaatze 1989, Ulaby & Long 2014, NOAA KLM User's Guide, Dame dkk. 2001, Domingos dkk. 2018); daftar lengkapnya ada di layar penutup. Hitungan turunan (μ, I, r, prediksi ¹³CO, J puncak) dihitung ulang dari konstanta CODATA. **Sebaiknya angka-angka ini dicek sekali lagi ke sumbernya sebelum narasi direkam**, karena mengubahnya belakangan berarti merekam ulang baris. Ilustrasi spektrum dan alat bersifat skematis.
