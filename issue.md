# Tambah Iklan Atas & Halaman Streaming + Hapus Teks "Sponsored"

## Ringkasan

Tiga perubahan utama pada sistem iklan:
1. Perbanyak banner iklan bertumpuk di atas halaman utama (sebelum hero) menjadi **8 banner di desktop** dan **4 banner di mobile**
2. Tambahkan banner iklan bertumpuk di atas video player di halaman streaming menjadi **8 banner di desktop** dan **4 banner di mobile**
3. Hapus seluruh teks label iklan seperti "Advertisement", "Sponsored Content", "Ads", dll dari semua komponen iklan

---

## 1. Banner Atas Halaman Utama (Sebelum Hero)

Ubah jumlah banner yang bertumpuk di paling atas halaman utama (sebelum hero section) menjadi:

- **Desktop**: **8 banner 728x90** ditumpuk vertikal, dimuat dari atas ke bawah secara berurutan
- **Mobile**: **4 banner 320x50** ditumpuk vertikal

Karena hanya ada 1 key untuk 728x90 dan 1 key untuk 320x50, ulangi (duplikat) banner yang sama untuk memenuhi jumlah tersebut — script iklan tetap sama, hanya di-render sebanyak N kali.

Semua 8 banner di atas (di atas fold) dimuat dengan **priority** (tidak lazy load) agar tampil secepat mungkin.

---

## 2. Banner Atas Halaman Streaming / Watch

Di halaman nonton (`/[slug]/[episode]`) dan halaman film (`/[slug]` untuk film), tambahkan banner bertumpuk di atas video player menjadi:

- **Desktop**: **8 banner 728x90** ditumpuk vertikal, di atas video player
- **Mobile**: **4 banner 320x50** ditumpuk vertikal, di atas video player

Semua banner di atas player dimuat dengan **priority** (tidak lazy load).

---

## 3. Hapus Semua Teks Label Iklan

Hapus semua teks label yang menandai konten sebagai iklan dari seluruh komponen ads. Komponen yang perlu dibersihkan:

- `AdIframeBanner.tsx` — hapus teks **"Advertisement"** di atas setiap iframe banner
- `AdNativeBanner.tsx` — hapus teks **"Sponsored Content (Native 4:1)"** di atas native banner
- `AdSlot.tsx` — hapus teks **"Ads"** atau label serupa
- `AdBanner.tsx` — pastikan tidak ada teks label visible

Setelah penghapusan, komponen iklan hanya menampilkan unit iklan itu sendiri tanpa label teks apapun.

---

## Catatan Teknis
- Gunakan key/script iklan yang sudah ada, cukup duplikat render komponen-nya sebanyak yang diperlukan
- Pastikan `bun run build` berhasil tanpa error
- Halaman `/admin` tetap tidak menampilkan iklan apapun
- Jangan ubah komponen atau halaman lain di luar scope ini

