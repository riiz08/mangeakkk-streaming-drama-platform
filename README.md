# 🎬 Mangeakkk — Streaming Drama & Film Platform

<div align="center">
  <img src="/public/logo/logo.svg" alt="Mangeakkk Logo" width="100" height="100" />
  <h3>Platform Nonton Streaming Drama dan Film Modern Berbasis Next.js</h3>
</div>

---

## 📌 Gambaran Umum
**Mangeakkk** adalah platform streaming web modern untuk menonton serial drama Korea, Asia, dan film bioskop dengan pengalaman visual berkualitas tinggi. Proyek ini dibangun menggunakan **Next.js 15 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## ✨ Fitur Utama

- 🏠 **Halaman Beranda Interaktif**:
  - Hero banner unggulan beresolusi tinggi dengan tombol *Tonton Sekarang* dan detail info.
  - Horizontal carousels: *Sedang Trending*, *Drama Terbaru*, dan *Film Pilihan*.
  - Pemilihan tipe tontonan (*TV Series* vs *Film Bioskop*).
- 🧭 **Struktur Routing SEO-Friendly**:
  - **Serial Drama**: Nonton langsung di `/[slug-drama]/[slug-episode]` (contoh: `/queen-of-tears/episode-1`).
  - **Film Bioskop**: Detail dan pemutar film langsung di `/[slug-film]` (contoh: `/dune-part-two`).
  - **Katalog**: `/drama` (TV Series) dan `/film` (Film Bioskop).
- 🏷️ **Sistem Badge Visual (Pengganti Rating)**:
  - 🔥 **HOT**: Ditampilkan pada serial drama yang sedang trending.
  - 🆕 **NEW**: Menandai serial drama yang memiliki episode baru.
  - ⭐ **Pilihan**: Kurasi film bioskop rekomendasi editor.
  - 🎬 **Drama Unggulan**: Badge eksklusif pada banner hero utama.
- 📢 **Ads Placement (Slot Iklan Komprehensif)**:
  - Slot iklan banner responsif (`AdBanner`) di Header, Footer, Hero, dan di antara setiap baris konten.
  - Box iklan inline/sidebar (`AdSlot`) di samping pemutar video dan di dalam grid katalog setiap 8 item.
- ▶️ **Pemutar Video (Video Player)**:
  - Pemutar video responsif dengan tombol play/pause, seekbar/timeline, pengaturan volume, mute, dan mode fullscreen.
  - Navigasi episode cepat (*Episode Sebelumnya* / *Episode Selanjutnya*) serta daftar pilihan episode di samping player.
  - Fitur simpan ke bookmark dan bagikan tautan.
- 🔍 **Pencarian Cepat**:
  - Halaman `/search?q=...` dengan pencarian judul, sinopsis, sutradara, dan negara.
- 📱 **Desain Responsif & Tema Gelap (Dark Mode)**:
  - Tampilan elegan, responsif untuk layar smartphone, tablet, maupun desktop.
- 🚀 **SEO & Performance**:
  - Metadata OpenGraph dinamis di setiap halaman konten dan episode.
  - Otomatis membuat `sitemap.xml` dan `robots.txt`.

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
│   ├── layout.tsx            # Root layout + metadata + header/footer ad banner
│   ├── page.tsx              # Beranda (Hero, Trending, Rekomendasi)
│   ├── globals.css           # Styling Tailwind & scrollbar
│   ├── robots.ts             # Robots.txt generator
│   ├── sitemap.ts            # Sitemap.xml generator
│   ├── [slug]/
│   │   ├── page.tsx          # Detail drama / Detail & player film bioskop
│   │   └── [episode]/
│   │       └── page.tsx      # Pemutar video episode serial drama
│   ├── drama/
│   │   └── page.tsx          # Katalog serial drama
│   ├── film/
│   │   └── page.tsx          # Katalog film bioskop
│   └── search/
│       └── page.tsx          # Pencarian tayangan
├── components/
│   ├── ads/                  # AdBanner (Leaderboard) & AdSlot (Sidebar/Grid)
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
