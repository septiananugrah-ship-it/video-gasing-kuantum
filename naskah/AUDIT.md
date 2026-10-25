# Audit polish — Gasing Kuantum

Metode: still tiap adegan (awal, tengah, akhir) + 3 still di setiap transisi (−0,3 / 0 / +0,3 dtk), 135 gambar (`scripts/qa-audit.mjs` → `scripts/contact-scenes.py`), ditambah pemeriksaan naskah, rumus, angka, dan satuan baris per baris. Diurutkan dari yang paling penting.

## A. Akurasi (wajib diperbaiki)

| # | Adegan | Temuan | Perbaikan |
|---|---|---|---|
| A1 | 17 Kimia di antara bintang | Arah Doppler terbalik: garis yang bergeser ke frekuensi **lebih tinggi** diberi label "menjauh". Sumber yang menjauh justru menurunkan frekuensi (pergeseran merah). | Label & warna ditukar: frekuensi naik = mendekat (biru), turun = menjauh (merah). |
| A2 | 03 Arah putaran | Panah melingkar q = +2 berlawanan jarum jam, tetapi gelombang & titik fasenya bergerak **searah** jarum jam (sumbu y layar terbalik). Visual bertentangan dengan narasi. | Gelombang & titik fase dibalik agar searah panah. |
| A3 | 14 Air | Sumbu inersia salah label: sumbu C₂ diberi label *a*, padahal untuk H₂O sumbu C₂ adalah sumbu **b** (a di bidang molekul, c tegak lurus bidang). Sumbu juga tidak ikut berputar bersama molekul. | Sumbu b = C₂, a = di bidang, c = tegak lurus; sumbu menempel ke molekul. |
| A4 | 15 Oven | Narasi menyebut 2,45 GHz "pita untuk industri dan rumah tangga". Nama resminya pita **ISM** (*industrial, scientific, medical*). | Teks narasi & layar diperbaiki ("pita ISM: industri, ilmiah, dan medis"). |
| A5 | 16 Satelit | "Gelombang mikro menembus awan" terlalu mutlak; hujan lebat tetap menyerap/menghamburkan. | "dapat menembus sebagian besar awan". |
| A6 | 07 Aturan seleksi | Panah momen dipol digambar dari δ+ ke δ− (konvensi lama kimia). IUPAC: vektor momen dipol menunjuk dari muatan negatif ke positif. | Panah dibalik (δ− → δ+) dan diberi keterangan. |
| A7 | 12 Ketika ikatan meregang | Rumus menulis *D* biasa, padahal suku distorsi dalam bilangan gelombang adalah *D̃* (keterangannya sudah *D̃*). | Rumus memakai *D̃*. |
| A8 | Beberapa adegan | Tanda "±" dipakai untuk "kira-kira" (±115 GHz, ±60 GHz, ±4,6 %, ±2008). Dalam sains ± berarti plus-minus/ketidakpastian. | Diganti "≈" atau "sekitar". |
| A9 | 09 Populasi | Saat gas didinginkan ke 77 K, batang populasi berubah tetapi kurva faktor Boltzmann tetap kurva 300 K. | Kurva Boltzmann ikut suhu. |
| A10 | 18 Farmasi | Kerangka propanol hanya menggambar C & O tetapi berlabel C₃H₈O. | Keterangan "atom H tidak digambar". |

Angka yang sudah dicek ulang dan **benar**: garis ¹²CO J 0→1 115,271 GHz; ¹³CO 110,201 GHz; prediksi ¹³CO 110,19 GHz (dari rasio μ, 0,95591); B = 57,64 GHz; I = 1,456 × 10⁻⁴⁶ kg m²; μ = 6,856 u; r₀ = 113,1 pm; rₑ = 112,8 pm; garis J 5→6 terukur 691,473 GHz vs rotor kaku 691,627 GHz (selisih 154 MHz); J puncak CO ≈ 7 (300 K) dan ≈ 3 (77 K); λ = 2,60 mm; H₂O 22,235 & 183,31 GHz; 2,45 GHz ≈ 1/9 dari 22 GHz; puncak rugi dielektrik air ≈ 19 GHz (25 °C). Rumus Eq = q²ħ²/2I, Lz = qħ, EJ = ħ²J(J+1)/2I, |L| = √(J(J+1)) ħ, B̃ = h/8π²cI, ν̃ = 2B̃(J+1), NJ ∝ (2J+1)exp(−hcB̃J(J+1)/kBT), ΔJ = ±1 sesuai Modul 5 (pers. 5.5, 5.18, 5.33–5.37, 5.40, 5.42, 5.44).

## B. Tata letak

| # | Adegan | Temuan |
|---|---|---|
| B1 | Judul | Elips orbit berputar penuh sehingga memotong tulisan "GASING KUANTUM". |
| B2 | Penutup | Molekul menimpa tulisan "KIMIA KUANTUM GERAK ROTASI". |
| B3 | 05 Harmonik sferis | Label s/p/d menimpa ujung lobus; lencana "orientasi molekul" terlalu dekat lobus. |
| B4 | 06 Kerucut | Label M = +1/0/−1 tertimpa panah & elips kerucut. |
| B5 | Rumus | Kartu rumus di 06 (50 px), 09 (50 px), 12 (50 px) dan baris turunan di 10 (46 px) di bawah standar ≥ 56 px. |
| B6 | Transisi | Cincin transisi masih tebal di +0,3 dtk dan memotong isi adegan baru. |
| B7 | 08 Tangga | Cakram pastel di belakang tangga terpotong garis, terlihat seperti noda. |
| B8 | 06, 10, 11 | Tanda akar memakai garis atas CSS pada teks inline sehingga garisnya melayang jauh di atas isi akar. Kartu rumus 09 (54 px), 11 (48 px) dan baris turunan 10 (54 px) masih di bawah 56 px. |
| B9 | Subtitle | Setiap ganti halaman di tengah kalimat kotak subtitle memudar lalu muncul lagi (berkedip ±0,4 dtk). |

Zona subtitle bebas di semua still; tidak ada teks terpotong di tepi.

## C. Kejelasan (adegan kosong / statis / lemah)

| # | Adegan | Temuan |
|---|---|---|
| C1 | 17 Kimia di antara bintang (awal) | Awan molekul hampir tak terlihat di tema terang: adegan terlemah. |
| C2 | 16 Satelit (awal) | 2 baris pertama hanya awan; "lapis demi lapis" tidak divisualkan. |
| C3 | 15 Oven (awal) | "Kembali ke dapur" layar kosong. |
| C4 | 05 Harmonik (awal) | ±3 dtk pertama kosong. |
| C5 | 13 Spektrometer (awal) | Hanya tanda "?" di tengah. |
| C6 | 09 Populasi | Grafik saja: hubungan "J tinggi = berputar cepat" tidak terlihat. |
| C7 | 02 Cincin | Cincin datar 2D; syarat "menyambung" kurang terasa. |
| C8 | 02 Cincin (awal) | Separuh kanan layar kosong ±35 dtk. → panel "Kenapa cincin?" (molekul berputar di bidang = massa μ pada cincin, I = μr²) lalu "cincin dibuka menjadi garis" φ = 0 … 2π yang menunjukkan ujung harus bernilai sama (✓) atau tidak (✗). |
| C9 | 18 Farmasi | Saat "molekul pembantu yang kiral" layar hanya berisi garis cermin ±5 dtk. → enansiomer kiri langsung muncul, pembantu kiral menempel, enansiomer kanan keluar dari cermin; keterangan: pembantu yang sama → kompleks tak lagi bercermin → garis berbeda. |
| C10 | 19 Rangkuman | "lain kali kamu memutar sebuah gasing" tanpa gambar gasing (judul video pun belum pernah menampilkan gasing). → ilustrasi gasing berputar & berpresesi, lalu molekul udara berputar di sekitarnya. |
| C11 | 03 Arah putaran | Awal adegan hanya satu cincin; bagian q = 0 hanya elips kecil. → bayangan q = −2 sejak "negatif"; rotor q = 0 besar di tengah dengan gelombang rata tanpa simpul. |
| C12 | Peta video, 06 Kerucut, pembuka | Kartu peta video pudar 5 dtk; awal bab 06 kosong di kanan; layar pembuka memudar terlalu awal. → kartu menyala saat "tiga bagian", label vektor L & keterangan "punya panjang & arah", pudar akhir dipersingkat. |

## D. Teknis

| # | Temuan |
|---|---|
| D1 | Penanda kata animasi ↔ naskah: semua cocok (`npm run check`), hanya `cabang` muncul 2× (yang pertama memang dimaksud). |
| D2 | Subtitle kata-per-kata ada di semua adegan bernarasi. |
| D3 | **Pengucapan**: narasi belum direkam (dibuat oleh workflow ElevenLabs), jadi Whisper belum bisa dijalankan. Risiko terbesar: huruf tunggal (J, B, M, I, q, r, h) dan nama Yunani (phi, theta) dibaca ala Inggris. → Ditambahkan teks khusus TTS otomatis (J → "je", B → "be", phi → "fi", dst.; subtitle tetap memakai simbol) + workflow **Cek pengucapan (Whisper)** yang menghasilkan laporan setelah suara dibuat. |
| D4 | Workflow render & voice-over valid (YAML diparse), tidak dijalankan oleh Claude. |
| D5 | Sapuan seluruh video (`scripts/qa-sweep.mjs`, 866 frame tiap 1,5 dtk): 0 error/peringatan runtime; frame paling "kosong" tinggal momen transisi. |
| D6 | Musik disintesis ulang untuk timeline baru (21:38). Setelah suara asli dibuat, workflow menyesuaikan ulang timeline & musik. |

## E. Struktur tugas

Lengkap: Bagian 1 prinsip & teori dasar (bab 01–09), Bagian 2 implementasi dalam kimia (bab 10–14), Bagian 3 penerapan industri (bab 15–18), rangkuman & rujukan.
