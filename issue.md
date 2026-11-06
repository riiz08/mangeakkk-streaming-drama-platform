# Planning: Inisialisasi Proyek Streaming Platform Berbasis Next.js

## 1. Overview & Tujuan
Membangun fondasi web aplikasi *streaming platform* modern dan responsif menggunakan **Next.js (App Router)**. Dokumen ini dirancang sebagai panduan tingkat tinggi (*high-level blueprint*) untuk dipahami dan dieksekusi oleh programmer atau model AI pelaksana.

---

## 2. Tech Stack & Dependensi Utama
- **Core Framework**: [Next.js](https://nextjs.org/) (versi terbaru dengan **App Router**)
- **Language**: TypeScript / JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React / React Icons (opsional)
- **Video Playback**: HTML5 Video Player dengan dukungan HLS/streaming (misal: HLS.js, Video.js, atau React Player)
- **Aset Existing**: Memanfaatkan aset ikon yang sudah ada di direktori `favicon/`

---

## 3. Rencana Arsitektur & Struktur Direktori (High-Level)
Rekomendasi struktur folder berbasis Next.js App Router:
```text
streaming-platform/
├── favicon/              # Aset favicon yang sudah ada (dipindah/ditautkan ke app/public)
├── public/               # Asset statis, gambar poster, dan thumbnail
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout (Navbar, Footer, Font, Metadata)
│   │   ├── page.tsx      # Beranda / Katalog video
│   │   ├── watch/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Halaman pemutar video
│   │   └── globals.css   # Konfigurasi Tailwind & styling global
│   ├── components/       # Komponen UI modular
│   │   ├── common/       # Navbar, Footer, Button, dsb.
│   │   ├── catalog/      # VideoCard, VideoGrid, HeroBanner
│   │   └── player/       # VideoPlayer (Client Component)
│   ├── data/             # Mock data video / streaming list
│   └── types/            # Tipe data TypeScript (Video, Category, dsb.)
├── next.config.mjs
├── package.json
└── README.md
```

---

## 4. Tahapan Pengerjaan (Milestones)

### Fase 1: Setup & Inisialisasi Proyek
- [ ] Inisialisasi proyek Next.js dengan App Router dan Tailwind CSS di direktori saat ini.
- [ ] Pindahkan/integrasikan file dari folder `favicon/` ke dalam konfigurasi metadata atau folder `public/` / `app/`.
- [ ] Pastikan file `.gitignore` standar Next.js sudah aktif.

### Fase 2: Layout Utama & Navigasi
- [ ] Setup `RootLayout` dengan tema gelap (*dark theme default* khas platform streaming).
- [ ] Buat komponen **Navbar**:
  - Logo platform
  - Menu navigasi dasar (Home, Movies, Series, Live)
  - Fitur input pencarian (search bar)
- [ ] Buat **Footer** sederhana dan responsif (desktop & mobile).

### Fase 3: Halaman Beranda (Catalog & Discovery)
- [ ] **Hero Banner**: Bagian atas halaman yang menampilkan highlight konten video utama lengkap dengan tombol *Play* dan sinopsis singkat.
- [ ] **Katalog Video (Grid / Carousel)**: Menampilkan daftar video yang dikelompokkan per kategori/genre (Trending, Baru Dirilis, Populer).
- [ ] **Video Card**: Menampilkan poster/thumbnail, judul, durasi/rating, dan efek transisi saat di-hover.

### Fase 4: Halaman Tontonan (Watch Page)
- [ ] Buat halaman dinamis `app/watch/[id]/page.tsx`.
- [ ] Integrasikan komponen pemutar video (`VideoPlayer`):
  - Menandai komponen dengan `'use client'`.
  - Kontrol standar: Play/Pause, Timeline/Seekbar, Pengaturan Volume, dan Mode Layar Penuh (*Fullscreen*).
  - Dukungan pemutaran video streaming (URL MP4 publik atau HLS `.m3u8` test stream).
- [ ] Tampilkan detail informasi video (judul, sinopsis, genre, tanggal rilis) serta daftar rekomendasi video terkait di samping atau bawah pemutar.

### Fase 5: Mock Data & Integrasi State
- [ ] Buat file data dummy (JSON / TypeScript) yang berisi daftar item video contoh dengan struktur:
  - `id`, `title`, `description`, `thumbnailUrl`, `videoUrl`, `duration`, `genre`.
- [ ] Hubungkan mock data ke halaman katalog utama dan halaman tontonan dinamis.

### Fase 6: Build Check & Dokumentasi
- [ ] Jalankan pengujian build (`npm run build` / `pnpm build`) untuk memastikan tidak ada error TypeScript maupun sintaks.
- [ ] Siapkan file `README.md` dengan instruksi singkat cara menjalankan proyek di lingkungan lokal.

---

## 5. Catatan Implementasi untuk Developer / Model Pelaksana
1. **Pemisahan Server & Client Components**:
   - Gunakan Server Components secara default untuk layout, halaman katalog, dan data fetching.
   - Gunakan Client Component (`'use client'`) hanya pada elemen interaktif seperti `VideoPlayer` dan dropdown navigasi.
2. **Kerapian & Modularitas**:
   - Pisahkan logika pemutar video ke dalam komponen tersendiri agar mudah diganti atau dihubungkan ke backend streaming di masa mendatang.
3. **Desain Mobile-Friendly**:
   - Pastikan layout grid video dan ukuran video player beradaptasi dengan baik di berbagai ukuran layar.

