# 🎬 Mangeakkk — Streaming Drama & Film Platform

## Deskripsi Project

Bangun website streaming (menonton) drama dan film menggunakan **Next.js (App Router)**. Website ini menampilkan katalog drama/film, halaman detail, dan player untuk menonton. Desain modern, dark-themed, responsif.

> **Catatan:** Asset logo dan favicon sudah tersedia di folder `public/`. Gunakan `public/logo/logo.svg` sebagai logo utama dan `public/favicon.ico` + isi folder `public/favicon/` untuk favicon/metadata.

---

## Issue 1 — Project Setup & Konfigurasi Awal

- Inisialisasi project Next.js (App Router) dengan TypeScript di folder ini
- Gunakan **Tailwind CSS** untuk styling
- Konfigurasi metadata (title, description, favicon, open graph) menggunakan asset dari `public/favicon/`
- Setup layout utama (`app/layout.tsx`) dengan font yang cocok (contoh: Inter atau Plus Jakarta Sans dari Google Fonts)
- Buat file `.env.example` untuk variabel environment yang dibutuhkan nanti (API URL, dsb.)
- Pastikan `public/logo/`, `public/favicon/`, dan `public/images/` tetap ada dan tidak tertimpa

---

## Issue 2 — Komponen Global & Layout

Buat komponen-komponen global yang dipakai di seluruh halaman:

### Navbar
- Logo (`/logo/logo.svg`) di kiri, klik kembali ke home
- Menu navigasi: **Home**, **Drama**, **Film**, **Genre**
- Search bar (input teks, cukup UI dulu, belum perlu fungsional)
- Responsif — hamburger menu di mobile

### Footer
- Logo, copyright, link sosial media (placeholder)
- Link cepat: About, Contact, Privacy Policy, Terms

### Layout Wrapper
- Dark theme sebagai default (background gelap, teks terang)
- Container responsif dengan max-width

---

## Issue 3 — Halaman Home

Halaman utama website (`/`):

- **Hero Section** — Banner besar dengan gambar/poster drama unggulan, judul, deskripsi singkat, tombol "Tonton Sekarang"
- **Trending / Sedang Populer** — Horizontal scroll row berisi card drama/film (poster, judul, rating)
- **Drama Terbaru** — Row card serupa
- **Film Terbaru** — Row card serupa
- **Genre Populer** — Grid atau row berisi badge/card genre (Action, Romance, Thriller, dll.)

> Gunakan data dummy/mock untuk sementara. Buat file `lib/data/mock.ts` berisi array objek drama & film.

---

## Issue 4 — Halaman Katalog (Browse)

Dua halaman katalog terpisah:

### `/drama` — Daftar semua drama
### `/film` — Daftar semua film

Keduanya memiliki layout serupa:
- Grid card (poster, judul, tahun, rating, genre tags)
- Filter sidebar atau top-bar: **Genre**, **Tahun**, **Rating** (cukup UI, logic filter dari data mock)
- Sort: Terbaru, Rating Tertinggi, A-Z
- Pagination atau infinite scroll (pilih salah satu)

---

## Issue 5 — Halaman Detail Drama/Film

Route: `/drama/[slug]` dan `/film/[slug]`

Isi halaman:
- **Backdrop/banner** besar (gambar landscape)
- **Info utama**: poster, judul, sinopsis, genre, tahun rilis, durasi, rating, negara asal, sutradara, cast (nama + foto placeholder)
- **Daftar Episode** (khusus drama) — List episode dengan thumbnail, judul episode, durasi. Klik episode → halaman watch
- **Tombol "Tonton"** (untuk film, langsung ke halaman watch)
- **Rekomendasi** — Row card drama/film serupa di bagian bawah

---

## Issue 6 — Halaman Watch (Player)

Route: `/watch/[slug]` (atau `/watch/[slug]/[episode]` untuk drama)

- **Video Player** — Gunakan komponen player HTML5 atau library seperti `react-player` / `vidstack`. Untuk saat ini cukup embed placeholder video (bisa pakai sample video URL atau dummy)
- Judul episode / film yang sedang ditonton
- **Navigasi episode** (khusus drama): tombol prev/next episode, dropdown pilih episode
- **Info singkat** di bawah player: sinopsis episode, rating
- Light/minimal UI agar fokus ke player

---

## Issue 7 — Halaman Genre

Route: `/genre` — Grid semua genre yang tersedia
Route: `/genre/[slug]` — List drama/film yang termasuk genre tersebut (layout sama seperti halaman katalog)

---

## Issue 8 — Search

- Halaman `/search?q=...`
- Tampilkan hasil pencarian berupa grid card
- Pencarian dari data mock berdasarkan judul

---

## Issue 9 — UI Polish & Responsiveness

- Pastikan semua halaman responsif (mobile, tablet, desktop)
- Tambahkan loading skeleton/shimmer pada card dan halaman detail
- Hover effects pada card (scale, shadow, overlay info)
- Smooth scroll dan transisi antar halaman
- Scroll-to-top button
- Pastikan dark theme konsisten di semua halaman

---

## Issue 10 — SEO & Performance

- Metadata per halaman (title, description, og:image) menggunakan Next.js `generateMetadata`
- Sitemap (`sitemap.ts`)
- Konfigurasi `robots.txt`
- Optimasi gambar menggunakan `next/image`
- Pastikan favicon dan web manifest terkonfigurasi dengan benar dari asset di `public/favicon/`

---

## Struktur Data Mock (Referensi)

Berikut contoh struktur data yang digunakan untuk mock. Simpan di `lib/data/mock.ts`:

```ts
type Content = {
  id: string;
  slug: string;
  title: string;
  type: "drama" | "film";
  poster: string;       // path gambar poster
  backdrop: string;     // path gambar landscape
  synopsis: string;
  genre: string[];
  year: number;
  rating: number;       // 1-10
  country: string;
  director: string;
  cast: { name: string; photo: string }[];
  duration: string;     // "45 min/ep" atau "2h 15m"
  totalEpisodes?: number;
  episodes?: Episode[];
};

type Episode = {
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  synopsis: string;
  videoUrl: string;     // placeholder URL
};
```

---

## Tech Stack

| Kategori | Pilihan |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Video Player | Custom HTML5 Video Player |
| Icons | `lucide-react` |
| State / Data | Mock data lokal (`lib/data/mock.ts`) |

---

## Struktur Folder (Target)

```
├── app/
│   ├── layout.tsx            # Root layout + metadata + font
│   ├── page.tsx              # Home
│   ├── drama/
│   │   ├── page.tsx          # Katalog drama
│   │   └── [slug]/page.tsx   # Detail drama
│   ├── film/
│   │   ├── page.tsx          # Katalog film
│   │   └── [slug]/page.tsx   # Detail film
│   ├── watch/
│   │   └── [slug]/page.tsx   # Player page
│   ├── genre/
│   │   ├── page.tsx          # Semua genre
│   │   └── [slug]/page.tsx   # Drama/film per genre
│   └── search/
│       └── page.tsx          # Hasil pencarian
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── ContentCard.tsx   # Card poster drama/film
│   │   ├── HeroSection.tsx
│   │   ├── ContentRow.tsx    # Horizontal scroll row
│   │   ├── GenreBadge.tsx
│   │   ├── EpisodeList.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   └── Skeleton.tsx
├── lib/
│   ├── data/
│   │   └── mock.ts           # Data dummy
│   └── utils.ts              # Utility functions
├── public/
│   ├── favicon.ico
│   ├── favicon/              # (sudah ada)
│   ├── logo/                 # (sudah ada - logo.svg, logo.png, mangeakkk.png)
│   └── images/               # Poster & backdrop placeholder
└── tailwind.config.ts
```
