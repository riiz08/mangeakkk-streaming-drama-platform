# 🎬 Mangeakkk — Streaming Drama & Film Platform

<div align="center">
  <img src="/public/logo/logo.svg" alt="Mangeakkk Logo" width="100" height="100" />
  <h3>Platform Nonton Streaming Drama dan Film Modern Berbasis Next.js</h3>
</div>

---

## 📌 Gambaran Umum
**Mangeakkk** adalah platform streaming web modern untuk menonton drama Korea, Asia, dan film bioskop dengan pengalaman visual berkualitas tinggi. Proyek ini dibangun menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## ✨ Fitur Utama

- 🏠 **Halaman Beranda Interaktif**:
  - Hero banner unggulan beresolusi tinggi dengan tombol *Tonton Sekarang* dan detail info.
  - Horizontal carousels: *Sedang Trending*, *Drama Terbaru*, dan *Film Pilihan*.
  - Eksplorasi kategori dan genre.
- 📺 **Katalog Drama & Film**:
  - Filter interaktif berdasarkan **Genre** dan **Tahun**.
  - Opsi pengurutan (*Terbaru*, *Rating Tertinggi*, *Judul A-Z*).
  - Indikator jumlah tayangan yang ditemukan.
- 📑 **Halaman Detail Komprehensif**:
  - Backdrop banner besar dan poster berkualitas tinggi.
  - Detail sinopsis, rating, tahun, durasi, negara, sutradara, dan daftar aktor pemeran.
  - Daftar episode lengkap dengan durasi dan sinopsis tiap episode (khusus serial drama).
  - Rekomendasi tayangan terkait berdasarkan kesamaan genre.
- ▶️ **Pemutar Video (Video Player)**:
  - Pemutar video responsif dengan tombol play/pause, seekbar/timeline, pengaturan volume, mute, dan mode fullscreen.
  - Navigasi episode cepat (*Episode Sebelumnya* / *Episode Selanjutnya*) serta daftar pilihan episode di samping player.
  - Fitur simpan ke bookmark dan bagikan tautan.
- 🏷️ **Eksplorasi Genre**:
  - Halaman indeks seluruh genre `/genre`.
  - Halaman katalog khusus per genre `/genre/[slug]`.
- 🔍 **Pencarian Cepat**:
  - Halaman `/search?q=...` dengan pencarian judul, sinopsis, sutradara, negara, dan genre.
- 📱 **Desain Responsif & Tema Gelap (Dark Mode)**:
  - Tampilan elegan, responsif untuk layar smartphone, tablet, maupun desktop.
- 🚀 **SEO & Performance**:
  - Metadata OpenGraph dinamis di setiap halaman.
  - Otomatis membuat `sitemap.xml` dan `robots.txt`.
  - Dukungan favicon dan manifest lengkap.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS + Autoprefixer + PostCSS |
| **Ikon** | Lucide React |
| **Data** | Mock data lokal di `lib/data/mock.ts` |

---

## 📂 Struktur Direktori

```text
├── app/
│   ├── layout.tsx            # Root layout + metadata + favicon
│   ├── page.tsx              # Beranda (Hero, Trending, Rekomendasi)
│   ├── globals.css           # Styling Tailwind & scrollbar
│   ├── robots.ts             # Robots.txt generator
│   ├── sitemap.ts            # Sitemap.xml generator
│   ├── drama/
│   │   ├── page.tsx          # Katalog drama
│   │   └── [slug]/page.tsx   # Detail drama & daftar episode
│   ├── film/
│   │   ├── page.tsx          # Katalog film
│   │   └── [slug]/page.tsx   # Detail film
│   ├── watch/
│   │   └── [slug]/page.tsx   # Pemutar video & kontrol episode
│   ├── genre/
│   │   ├── page.tsx          # Direktori genre
│   │   └── [slug]/page.tsx   # Filter tayangan per genre
│   └── search/
│       └── page.tsx          # Pencarian tayangan
├── components/
│   ├── catalog/              # Komponen filter & katalog
│   ├── detail/               # Komponen tampilan detail
│   ├── layout/               # Navbar & Footer
│   ├── player/               # Pemutar video & kontrol tontonan
│   └── ui/                   # Card, badge, skeleton, hero
├── lib/
│   ├── data/mock.ts          # Dataset mock serial & film
│   └── utils.ts              # Fungsi utilitas
└── public/
    ├── favicon.ico
    ├── favicon/              # Icon multi-resolusi & webmanifest
    └── logo/                 # Logo SVG & PNG resmi
```

---

## 🚀 Menjalankan Proyek di Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/riiz08/mangeakkk-streaming-drama-platform.git
   cd mangeakkk-streaming-drama-platform
   ```

2. **Install dependensi:**
   ```bash
   bun install
   # atau
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   bun run dev
   # atau
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:3000`.

5. **Build produksi:**
   ```bash
   bun run build
   # atau
   npm run build
   ```

---

## 📄 Lisensi
MIT License.
