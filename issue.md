# Perbaiki Penempatan Iklan Sesuai Referensi & Optimasi Loading

## Referensi Screenshot

Berikut screenshot referensi penempatan iklan yang harus diikuti:

![Desktop](ref_desktop.jpg)
![Mobile](ref_mobile.png)

---

## Ringkasan

Perbaiki penempatan iklan agar sesuai persis dengan referensi screenshot. **Pertahankan layout halaman saat ini** (full-width tanpa sidebar tambahan). Hanya ubah posisi, jumlah, dan jenis iklan. Tambahkan 1 floating ad. Halaman lain mengikuti pola halaman utama yang disesuaikan.

---

## Hasil Analisis Screenshot — Hitungan Iklan

### Desktop (Halaman Utama) — Total: 12 unit iklan

Dari atas ke bawah pada screenshot desktop:

| No | Posisi | Jenis Iklan | Keterangan |
|----|--------|-------------|------------|
| 1 | Paling atas (row 1) | Banner 728x90 | Baris banner pertama di atas semua konten |
| 2 | Paling atas (row 2) | Banner 728x90 | Baris banner kedua, di bawah row 1 |
| 3 | Paling atas (row 3) | Banner 728x90 | Baris banner ketiga, di bawah row 2 |
| 4 | Paling atas (row 4) | Banner 728x90 | Baris banner keempat, di bawah row 3 (area "MODAL RECEH" dst) |
| 5 | Di antara grid konten baris 1 dan baris 2 | Native Banner 4:1 | Native ad disisipkan di antara row konten pertama dan kedua |
| 6 | Di antara grid konten baris 2 dan baris 3 | Native Banner 4:1 | Native ad disisipkan di antara row konten kedua dan ketiga |
| 7 | Di antara section konten dan section bawah | Banner 468x60 | Banner horizontal antara section konten utama dan section "Anime Terbaru" |
| 8 | Area sidebar / inline (posisi 1) | Banner 300x250 | Karena layout kita full-width, taruh inline setelah section konten pertama (kanan di ref = setelah section di layout kita) |
| 9 | Area sidebar / inline (posisi 2) | Banner 300x250 | Inline setelah section konten kedua |
| 10 | Sebelum footer | Banner 728x90 | Satu banner leaderboard terakhir sebelum footer |
| 11 | **Floating (sticky bottom)** | Banner 468x60 | Floating banner di bawah layar, tetap terlihat saat scroll. Berisi banner gambar seperti pada referensi. Position: fixed di bottom. |
| 12 | Global (background) | Pop Under | Pop under script, dimuat sekali |

**+ Social Bar dimuat global sebagai overlay (tidak dihitung sebagai unit penempatan visual)**

### Mobile (Halaman Utama) — Total: 9 unit iklan

Dari atas ke bawah pada screenshot mobile:

| No | Posisi | Jenis Iklan | Keterangan |
|----|--------|-------------|------------|
| 1 | Paling atas (row 1) | Banner 320x50 | Banner mobile pertama di atas konten |
| 2 | Paling atas (row 2) | Banner 320x50 | Banner mobile kedua |
| 3 | Paling atas (row 3) | Banner 320x50 | Banner mobile ketiga |
| 4 | Di antara grid konten baris 1 dan baris 2 | Banner 320x50 | Di antara row konten |
| 5 | Di antara grid konten baris 2 dan baris 3 | Banner 320x50 | Di antara row konten |
| 6 | Di antara section bawah | Banner 320x50 | Di antara section konten bawah |
| 7 | Sebelum footer | Banner 320x50 | Banner terakhir sebelum footer |
| 8 | **Floating (sticky bottom)** | Banner 320x50 | Floating banner sticky di bawah layar |
| 9 | Global (background) | Pop Under | Pop under script, dimuat sekali |

---

## Implementasi per Halaman

### Halaman Utama (`/`)

Ikuti tabel di atas persis. Penempatan:
1. 4 banner 728x90 bertumpuk sebelum hero section (desktop) / 3 banner 320x50 bertumpuk (mobile)
2. Native 4:1 di antara `ContentRow` pertama dan kedua
3. Native 4:1 di antara `ContentRow` kedua dan ketiga
4. Banner 468x60 di antara section "Tipe Tayangan" dan content row (desktop) / 320x50 (mobile)
5. 2x Banner 300x250 disisipkan inline setelah beberapa section konten (desktop only, di mobile sembunyikan)
6. 1x Banner 728x90 sebelum footer (desktop) / 320x50 (mobile)
7. 1x Floating banner sticky bottom — selalu tampil, bisa ditutup user (tombol X kecil)

### Halaman Katalog (`/drama`, `/film`)

Mengikuti pola halaman utama:
- 3 banner 728x90 bertumpuk di atas (desktop) / 2 banner 320x50 (mobile)
- 2x Native 4:1 atau 468x60 di antara grid konten
- 1x 300x250 inline di grid (desktop)
- 1x 728x90 sebelum footer (desktop) / 320x50 (mobile)
- Floating banner tetap tampil

### Halaman Detail (`/[slug]`)

- 2 banner 728x90 di atas (desktop) / 1 banner 320x50 (mobile)
- 1x 468x60 di antara info sinopsis dan daftar episode
- 1x 300x250 inline di bawah episode list (desktop)
- 1x 728x90 sebelum footer (desktop) / 320x50 (mobile)
- Floating banner tetap tampil

### Halaman Watch/Nonton (`/[slug]/[episode]`)

- 1 banner 728x90 di atas player (desktop) / 1 banner 320x50 (mobile)
- 1x 468x60 di bawah video player
- 1x 300x250 inline setelah info episode (desktop)
- 1x 728x90 sebelum footer (desktop) / 320x50 (mobile)
- Floating banner tetap tampil

### Halaman Search (`/search`)

- 2 banner 728x90 di atas (desktop) / 1 banner 320x50 (mobile)
- 1x 468x60 di antara hasil pencarian
- 1x 728x90 sebelum footer (desktop) / 320x50 (mobile)
- Floating banner tetap tampil

### Halaman Admin (`/admin`)

- **Tidak ada iklan sama sekali** — termasuk floating banner tidak tampil di admin

---

## Floating Banner (BARU)

Buat komponen **baru** `FloatingAdBanner`:
- Position: `fixed`, bottom: `0`, full width, z-index tinggi
- Tampilkan banner 468x60 (desktop) / 320x50 (mobile) di tengah
- Ada tombol **X (close)** kecil di pojok kanan atas banner untuk menutup
- Setelah ditutup, tidak muncul lagi selama sesi tersebut (simpan state di `sessionStorage`)
- Tidak tampil di halaman `/admin`
- Background semi-transparan gelap di belakang banner

---

## Optimasi Loading Iklan

Agar iklan cepat di-load dan tidak menghambat rendering halaman:

1. **Preconnect ke domain ad network**: Tambahkan di `<head>` layout:
   - `<link rel="preconnect" href="https://pl32245018.profitableratecpmnetwork.com">`
   - `<link rel="preconnect" href="https://pl32245019.profitableratecpmnetwork.com">`
   - `<link rel="preconnect" href="https://pl32245020.profitableratecpmnetwork.com">`
   - `<link rel="preconnect" href="https://www.highrevenueformat.com">`
   - `<link rel="preconnect" href="https://bancadeltempoidea.org">`

2. **Lazy load iklan bawah**: Iklan yang ada di bawah fold (tidak terlihat saat pertama load) dimuat hanya saat mendekati viewport menggunakan **Intersection Observer**

3. **Prioritaskan iklan atas**: 4 banner teratas (above the fold) dimuat langsung tanpa lazy load

4. **Set dimensi tetap pada container iklan**: Setiap container iklan harus punya `width` dan `height` atau `min-height` yang tetap agar tidak terjadi layout shift (CLS) saat iklan dimuat

5. **Script global (Pop Under & Social Bar)**: Tetap gunakan `strategy="afterInteractive"` di Next.js agar tidak memblokir initial render

---

## Catatan Penting
- **Pertahankan layout halaman saat ini** — jangan ubah struktur layout menjadi 2 kolom atau tambah sidebar
- Jangan ubah script/key iklan yang sudah ada, hanya ubah penempatan dan jumlahnya
- Pastikan responsive: desktop tampilkan 728x90/468x60/300x250, mobile tampilkan 320x50
- Pastikan `bun run build` berhasil tanpa error setelah perubahan

