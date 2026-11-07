# Perbaikan Iklan: 8 Ads Variasi 2 Kolom + Floating Banner

## Ringkasan

Tiga perubahan pada sistem iklan:
1. Bagian iklan di atas hero dan di atas video player diubah menjadi **8 unit dengan berbagai variasi ukuran**, ditampilkan dalam **flexbox 2 kolom di desktop dan 1 kolom di mobile**
2. Floating Ad Banner dengan tombol close (sudah ada `FloatingAdBanner.tsx`, pastikan aktif dan tampil di semua halaman publik)
3. Variasi tipe iklan yang digunakan bebas, tidak harus seragam 728x90

---

## 1. Blok 8 Iklan di Atas Hero (Halaman Utama)

Ganti blok banner yang ada di atas hero section dengan komponen baru **`AdGridBlock`** (8 slot iklan).

**Layout:**
- Gunakan `flex flex-wrap` dengan 2 kolom di desktop (`md:w-1/2`) dan 1 kolom di mobile (`w-full`)
- Total 8 unit iklan dalam satu blok

**Variasi iklan yang digunakan (8 slot, kombinasi bebas):**

| Slot | Ukuran | Keterangan |
|------|--------|------------|
| 1 | 728x90 | Leaderboard — ditampilkan satu baris di desktop, full-width di mobile |
| 2 | 728x90 | Leaderboard — col 2 di desktop |
| 3 | 300x250 | Medium Rectangle — col 1 |
| 4 | 300x250 | Medium Rectangle — col 2 |
| 5 | 468x60 | Banner — col 1 |
| 6 | 468x60 | Banner — col 2 |
| 7 | 320x50 | Mobile Banner — col 1 |
| 8 | 320x50 | Mobile Banner — col 2 |

**Catatan:**
- Di dalam tiap kolom, iklan di-`center` secara horizontal
- Padding/gap antar slot iklan minimal agar tampak padat seperti referensi

---

## 2. Blok 8 Iklan di Atas Video Player (Halaman Streaming & Film)

Terapkan blok **`AdGridBlock`** yang sama (8 slot, 2 kolom desktop / 1 kolom mobile) tepat di atas video player di:
- Halaman watch drama: `WatchView.tsx` — di atas elemen `VideoPlayer`
- Halaman film: `ContentDetailView.tsx` — di atas elemen `VideoPlayer` di section "Putar Film"

Gunakan iklan dengan variasi ukuran yang sama seperti di atas (kombinasi 728x90, 300x250, 468x60, 320x50).

---

## 3. Buat Komponen `AdGridBlock`

Buat komponen reusable `components/ads/AdGridBlock.tsx`:
- Menerima array konfigurasi 8 slot iklan
- Render dengan `flex flex-wrap` — tiap item `w-full md:w-1/2`
- Tiap slot berisi satu unit `AdIframeBanner` dengan ukuran yang telah ditentukan
- Semua slot dimuat dengan `priority={true}` agar langsung tampil tanpa lazy load
- Tidak tampil di halaman `/admin`

---

## 4. Floating Ad Banner dengan Tombol Close

Komponen `FloatingAdBanner.tsx` sudah ada. Pastikan:
- Aktif dan dimount di `app/layout.tsx` agar tampil di semua halaman publik
- Memiliki tombol **X (Close)** yang terlihat jelas di pojok kanan atas
- Setelah ditutup, state tersimpan di `sessionStorage` sehingga tidak muncul lagi dalam sesi yang sama
- Tidak tampil di halaman `/admin`
- Tambahkan variasi iklan di floating juga (468x60 desktop / 320x50 mobile)

---

## Catatan Teknis
- Gunakan key/script iklan yang sudah ada di `AdIframeBanner.tsx`, tidak perlu key baru
- Pastikan `bun run build` berhasil tanpa error
- Halaman `/admin` tetap bersih tanpa iklan apapun
- Jangan ubah komponen atau halaman lain di luar scope ini

