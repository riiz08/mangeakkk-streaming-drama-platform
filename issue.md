# Migrasi Video Player ke HLS.js & Fallback "Belum Tersedia"

## Ringkasan

Dua perubahan utama:
1. **Ganti video player** — migrasi dari `<video src="">` biasa ke **HLS.js** agar mendukung streaming adaptif (.m3u8). Jika browser sudah native support HLS (Safari), gunakan native. Jika tidak, gunakan library `hls.js`.
2. **Tambahkan fallback "Belum Tersedia"** — pada section **Sedang Trending**, **Drama & TV Series Terbaru**, dan **Film Pilihan** di halaman utama. Karena saat ini belum ada data real, hapus penggunaan data dummy/mock dan ganti dengan tampilan placeholder bertuliskan **"Belum Tersedia"**.

---

## 1. Migrasi Video Player ke HLS.js

### Yang Perlu Dilakukan:
- Install package `hls.js` sebagai dependency
- Modifikasi komponen `components/ui/VideoPlayer.tsx`:
  - Deteksi apakah `videoUrl` berupa URL HLS (berakhiran `.m3u8`) atau URL video biasa (`.mp4`, dll)
  - Jika HLS: cek `Hls.isSupported()` → attach HLS.js ke elemen `<video>`. Jika browser native support (Safari), langsung set `src` pada `<video>`
  - Jika bukan HLS: gunakan `<video src="">` seperti saat ini (backward-compatible)
  - Cleanup: destroy instance HLS saat component unmount atau saat `videoUrl` berubah
- Pertahankan seluruh UI kontrol player yang sudah ada (play/pause, seek, volume, fullscreen, prev/next episode) — **tidak ada perubahan tampilan**, hanya cara load sumber video yang berubah
- VideoPlayer props `videoUrl` tetap bertipe `string`, bisa menerima `.m3u8` maupun `.mp4`

---

## 2. Fallback "Belum Tersedia" pada Section Konten

### Yang Perlu Dilakukan:
- Modifikasi komponen `components/ui/ContentRow.tsx`:
  - Tambahkan pengecekan: jika `items` kosong (array kosong atau length === 0), tampilkan placeholder **"Belum Tersedia"** sebagai gantinya — bukan kartu konten
  - Placeholder berupa teks sederhana yang ter-center, dengan styling yang konsisten terhadap tema gelap (text abu-abu, mungkin ikon kecil)
  - Sembunyikan tombol scroll kiri/kanan dan link "Lihat Semua" jika items kosong
- Pada halaman utama `app/page.tsx`:
  - Hapus import dan pemanggilan data mock (`getTrendingList`, `getDramaList`, `getFilmList`)
  - Ganti dengan array kosong `[]` sehingga ContentRow otomatis menampilkan fallback "Belum Tersedia"
  - Untuk `getFeaturedContent` di HeroSection, sesuaikan juga — jika tidak ada featured, tampilkan hero default/kosong atau sembunyikan
- Pada halaman `/drama` dan `/film` (catalog pages), lakukan hal yang sama — jika data masih kosong, tampilkan "Belum Tersedia"

---

## Catatan Teknis
- `hls.js` harus di-import secara dynamic (`import('hls.js')`) atau menggunakan `next/dynamic` karena hanya berjalan di client-side
- Pastikan `bun run build` berhasil tanpa error
- Jangan ubah komponen ads, layout, atau halaman admin
- Pertahankan semua tipe TypeScript yang sudah ada

