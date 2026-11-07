# 🔧 Refactor: Perbaikan Route, Sistem Badge, & Penambahan Ads Placement

## Gambaran Umum

Refactor platform streaming Mangeakkk untuk memperbaiki struktur routing agar SEO-friendly, mengganti sistem rating dengan sistem badge, menghapus fitur genre dan menggantinya dengan tipe konten, serta menambahkan slot iklan (ads placement) di seluruh halaman.

---

## Issue 1 — Restructure Routing (SEO-Friendly)

### Masalah
Route `/watch/[slug]` saat ini tidak memiliki halaman listing sendiri, sehingga dianggap buruk oleh SEO. Route terasa "terpisah" dari konten utama.

### Perubahan

**Hapus seluruh route `/watch/`** dan pindahkan logika menonton langsung ke slug konten:

| Sebelum | Sesudah | Keterangan |
|---|---|---|
| `/watch/queen-of-tears?ep=1` | `/queen-of-tears/episode-1` | Nonton drama episode tertentu |
| `/watch/dune-part-two` | `/dune-part-two` | Nonton film langsung dari slug |
| `/drama/queen-of-tears` | `/queen-of-tears` | Detail drama (tetap ada, sekaligus jadi landing page) |
| `/film/dune-part-two` | `/dune-part-two` | Detail film (tetap ada, langsung bisa tonton) |

### Struktur Route Baru

```
app/
├── page.tsx                        # Home / Beranda
├── [slug]/
│   ├── page.tsx                    # Detail konten (drama detail + tombol episode / film langsung player)
│   └── [episode]/
│       └── page.tsx                # Halaman nonton episode drama (player + navigasi episode)
├── drama/
│   └── page.tsx                    # Katalog daftar semua drama (listing page)
├── film/
│   └── page.tsx                    # Katalog daftar semua film (listing page)
├── search/
│   └── page.tsx                    # Hasil pencarian
├── layout.tsx
├── sitemap.ts
└── robots.ts
```

### Catatan Implementasi
- Halaman `[slug]/page.tsx`: Deteksi tipe konten dari mock data — jika **film**, tampilkan detail + player langsung di halaman ini. Jika **drama**, tampilkan detail + daftar episode.
- Halaman `[slug]/[episode]/page.tsx`: Khusus drama, menampilkan video player + navigasi episode (prev/next). Slug episode gunakan format `episode-1`, `episode-2`, dst.
- Hapus folder `app/watch/`, `app/genre/`, `app/drama/[slug]/`, dan `app/film/[slug]/`.
- Update semua internal link di Navbar, Footer, ContentCard, EpisodeList, HeroSection, dan komponen lainnya agar menggunakan route baru.
- Update `sitemap.ts` sesuai struktur route baru.

---

## Issue 2 — Hapus Genre, Ganti dengan Tipe Konten

### Perubahan
- **Hapus seluruh fitur Genre** — hapus route `/genre`, `/genre/[slug]`, komponen `GenreBadge.tsx`, dan filter genre di `FilterBar.tsx`.
- **Ganti dengan Tipe konten** — hanya ada 2 tipe: **TV Series** dan **Film**.
- Field `genre: string[]` di mock data **diganti** menjadi `type: "tv-series" | "film"`.
- Di halaman katalog (`/drama` dan `/film`), filter genre dihapus. Cukup filter berdasarkan **Tahun** dan **Sort** saja.
- Di Navbar, ganti menu **Genre** menjadi menu lain yang relevan (cukup Home, Drama, Film).

---

## Issue 3 — Sistem Badge (Ganti Rating)

### Perubahan
Hapus tampilan **rating bintang/angka** dari semua komponen (ContentCard, HeroSection, ContentDetailView, WatchView, dll). Ganti dengan **sistem badge visual** berikut:

| Badge | Warna / Style | Ditampilkan Pada | Kondisi |
|---|---|---|---|
| 🔥 **HOT** | Merah / oranye, bold | ContentCard, daftar konten | Drama yang sedang trending (`isTrending: true`) |
| 🆕 **NEW** | Hijau / biru cerah | ContentCard, daftar konten | Drama yang punya episode baru (`hasNewEpisode: true` di mock data) |
| ⭐ **Pilihan** | Emas / kuning | ContentCard, daftar konten | Film yang menjadi pilihan editor (`isPilihan: true` di mock data) |
| 🎬 **Drama Unggulan** | Gradient merah-pink, lebih besar | Hanya di Hero Banner | Konten yang ditampilkan di hero section (`isFeatured: true`) |

---

## Issue 4 — Tambahkan Ads Placement di Seluruh Halaman

Tambahkan komponen `AdBanner` dan `AdSlot` yang reusable, lalu tempatkan di semua halaman dengan strategi berikut:

### Komponen Ads
Buat 2 komponen di `components/ads/`:
- **`AdBanner.tsx`** — Banner horizontal full-width (biasa untuk leaderboard 728x90 atau responsive).
- **`AdSlot.tsx`** — Box iklan berukuran lebih kecil (sidebar/inline, misalnya 300x250).

### Penempatan Ads Per Halaman

#### Halaman Home (`/`)
- 1x `AdBanner` di **bawah Hero Section**
- 1x `AdBanner` di **antara setiap content row**
- 1x `AdBanner` di **sebelum Footer**

#### Halaman Katalog (`/drama`, `/film`)
- 1x `AdBanner` di **atas grid konten** (bawah filter bar)
- 1x `AdSlot` setiap **8 card** di dalam grid (inline/sisipan di antara card)
- 1x `AdBanner` di **bawah grid**, sebelum Footer

#### Halaman Detail Konten (`/[slug]`)
- 1x `AdBanner` di **bawah info sinopsis**
- 1x `AdSlot` di **sidebar**
- 1x `AdBanner` di **bawah rekomendasi**

#### Halaman Nonton Episode (`/[slug]/[episode]`)
- 1x `AdBanner` di **atas video player**
- 1x `AdBanner` di **bawah video player**
- 1x `AdSlot` di **sidebar** (samping daftar episode)
- 1x `AdBanner` di **bawah daftar episode**, sebelum Footer

#### Halaman Search (`/search`)
- 1x `AdBanner` di **atas hasil pencarian**
- 1x `AdBanner` di **bawah hasil pencarian**

#### Global (Layout)
- 1x `AdBanner` kecil/sticky di **bawah Navbar**
- 1x `AdBanner` di **atas Footer**

---

## Issue 5 — Update Mock Data & Cleanup

- Update `lib/data/mock.ts`:
  - Ganti `type: "drama"` → `type: "tv-series"`.
  - Hapus field `rating` dari semua item.
  - Tambah field `hasNewEpisode: boolean` dan `isPilihan: boolean`.
  - Hapus field `genre` dari semua item.
  - Update episode slug menjadi format `episode-1`, `episode-2`, dst.
- Hapus file/komponen yang tidak terpakai: `GenreBadge.tsx`, folder `app/genre/`, folder `app/watch/`, folder `app/drama/[slug]/`, folder `app/film/[slug]/`.
- Update `lib/utils.ts` — hapus `formatRating()`.
- Update semua komponen agar tidak lagi mereferensikan genre atau rating.
- Pastikan `sitemap.ts` dan `robots.ts` terupdate sesuai route baru.
