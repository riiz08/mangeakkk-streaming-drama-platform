# Skeleton Loading, Redesign Hero Banner, Admin Dashboard & Integrasi Ads

## Ringkasan

Iterasi ini mencakup 4 perbaikan utama:
1. Tambahkan skeleton/shimmer loading untuk semua elemen UI
2. Redesign hero banner agar lebih clean dan profesional
3. Buat admin dashboard untuk input konten drama/film dan monitoring traffic
4. Integrasikan ad network yang sesungguhnya (ganti placeholder ads)

---

## 1. Skeleton Loading untuk Semua Elemen

Tambahkan skeleton/shimmer loading state di semua komponen dan halaman. Gunakan komponen `Skeleton.tsx` yang sudah ada sebagai base.

**Komponen yang perlu skeleton:**
- `ContentCard` — placeholder kartu dengan shimmer untuk poster, judul, badge
- `HeroSection` — skeleton full-width untuk banner utama
- `ContentRow` — skeleton horizontal scroll row (4-6 kartu placeholder)
- `EpisodeList` — skeleton list item untuk daftar episode
- `ContentDetailView` — skeleton untuk halaman detail (poster, info, sinopsis)
- `WatchView` — skeleton untuk area video player dan info episode
- `CatalogView` — skeleton grid untuk halaman katalog drama/film
- `SearchView` — skeleton untuk hasil pencarian
- `Navbar` — loading state ringan jika perlu
- `FilterBar` — skeleton untuk filter options

**Panduan:**
- Gunakan animasi pulse/shimmer dengan warna `bg-zinc-800` dan `bg-zinc-700`
- Setiap komponen yang fetch data harus menampilkan skeleton selama loading
- Skeleton harus match layout asli komponen agar tidak ada layout shift

---

## 2. Redesign Hero Banner

Ubah desain `HeroSection` agar terlihat lebih clean, modern, dan profesional.

**Arahan desain:**
- Gunakan gradient overlay yang lebih halus (dari bawah ke atas, gelap ke transparan)
- Tampilkan judul drama dengan typography besar dan bold
- Tambahkan sinopsis singkat (max 2-3 baris, truncate sisanya)
- Badge "Drama Unggulan" tampil prominent
- Tombol "Tonton Sekarang" dan "Lihat Detail" dengan desain yang jelas
- Gambar poster/backdrop full-width dengan aspect ratio 16:9 atau 21:9
- Pastikan teks tetap terbaca di atas gambar apapun (gunakan overlay gelap)
- Responsif: di mobile tampilkan layout yang lebih compact
- Inspirasi: hero section Netflix/Disney+ (gambar besar, gradient, info overlay di kiri bawah)

---

## 3. Admin Dashboard

Buat halaman admin di route `/admin` dengan dua fitur utama:

### 3a. Input Konten Drama/Film
- Form untuk menambah drama/film baru dengan field:
  - Judul, slug, tipe (tv-series/film), poster URL, backdrop URL
  - Sinopsis, tahun, badge (NEW/HOT/Pilihan/Drama Unggulan)
  - Untuk drama: input daftar episode (judul episode, nomor, video URL)
- Tabel daftar konten yang sudah ada dengan aksi edit/hapus
- Simpan data ke state/local storage (mock, belum perlu backend)

### 3b. Monitoring Traffic
- Dashboard tampilkan statistik traffic harian dan mingguan
- Gunakan chart/grafik sederhana (bisa pakai library seperti recharts atau chart.js)
- Tampilkan: total views hari ini, views 7 hari terakhir (line chart), halaman terpopuler
- Data mock untuk saat ini, struktur siap untuk integrasi analytics nanti

### 3c. Proteksi Admin
- Tambahkan proteksi sederhana (password check atau basic auth mock)
- Halaman login admin sederhana sebelum bisa akses dashboard

---

## 4. Integrasi Ad Network

Ganti semua komponen placeholder ads (`AdBanner.tsx`, `AdSlot.tsx`) dengan script iklan sesungguhnya. Buat komponen wrapper untuk setiap tipe iklan.

### Daftar Script Iklan

**Pop Under** (load sekali, global di layout):
```html
<script src="https://pl32245018.profitableratecpmnetwork.com/5e/d9/65/5ed965a8eca7e10ddb8a7695b1a403d6.js"></script>
```

**Native Banner 4:1** (di antara row konten):
```html
<script async="async" data-cfasync="false" src="https://pl32245019.profitableratecpmnetwork.com/4e7f9cf9b069462c8d8926d8cfb6605e/invoke.js"></script>
<div id="container-4e7f9cf9b069462c8d8926d8cfb6605e"></div>
```

**Social Bar** (global overlay di layout):
```html
<script src="https://pl32245020.profitableratecpmnetwork.com/df/93/2e/df932e42b9f0b6120f52b2d8801f428a.js"></script>
```

**Banner 468x60** (desktop, di antara konten):
```html
<script>
  atOptions = {
    'key' : '570956abb47838f8c2ac5aca6af959ef',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/570956abb47838f8c2ac5aca6af959ef/invoke.js"></script>
```

**Banner 300x250** (sidebar / inline di grid konten):
```html
<script>
  atOptions = {
    'key' : 'eed91600433761384f36f499540649ff',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://bancadeltempoidea.org/22/eed91600433761384f36f499540649ff"></script>
```

**Banner 160x300** (sidebar):
```html
<script>
  atOptions = {
    'key' : '5365f43eb28d2e588cf4078bfedfe94b',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://bancadeltempoidea.org/22/5365f43eb28d2e588cf4078bfedfe94b"></script>
```

**Banner 160x600** (sidebar tall):
```html
<script>
  atOptions = {
    'key' : '6292755035e166c1f0ad7a844c5d9eea',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://bancadeltempoidea.org/22/6292755035e166c1f0ad7a844c5d9eea"></script>
```

**Banner 320x50** (mobile, bottom/inline):
```html
<script>
  atOptions = {
    'key' : 'b4fafb58436579971aecf4bfd65c105c',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/b4fafb58436579971aecf4bfd65c105c/invoke.js"></script>
```

**Banner 728x90** (desktop leaderboard, atas/bawah konten):
```html
<script>
  atOptions = {
    'key' : 'cabaf73ee59c135e3a9bcab5edf35b47',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/cabaf73ee59c135e3a9bcab5edf35b47/invoke.js"></script>
```

### Strategi Penempatan Ads

| Tipe Iklan | Penempatan |
|---|---|
| Pop Under | `layout.tsx` — load sekali secara global |
| Social Bar | `layout.tsx` — overlay global |
| Native Banner 4:1 | Di antara `ContentRow` di halaman Home |
| Banner 728x90 | Header/footer area di halaman Home, Catalog, Detail |
| Banner 468x60 | Di antara konten di halaman Detail dan Watch (desktop) |
| Banner 300x250 | Sidebar halaman Detail dan Watch, inline di Catalog grid |
| Banner 160x300 | Sidebar halaman Detail (desktop) |
| Banner 160x600 | Sidebar halaman Home dan Catalog (desktop) |
| Banner 320x50 | Sticky bottom atau inline di semua halaman (mobile) |

### Panduan Implementasi Ads
- Buat komponen Next.js wrapper menggunakan `next/script` atau `useEffect` + `dangerouslySetInnerHTML` untuk inject script
- Script global (pop under, social bar) cukup dimuat sekali di root layout
- Banner dengan `atOptions` perlu komponen client-side yang inject script saat mount
- Pastikan responsive: tampilkan banner sesuai ukuran viewport (320x50 untuk mobile, 728x90 untuk desktop, dll)
- Jangan tampilkan ads di halaman `/admin`

---

## Prioritas Pengerjaan

1. **Skeleton Loading** — kerjakan pertama karena improve UX dasar
2. **Redesign Hero Banner** — visual improvement utama
3. **Integrasi Ads** — monetisasi
4. **Admin Dashboard** — fitur management konten

---

## Catatan
- Pastikan build (`bun run build`) berhasil tanpa error setelah semua perubahan
- Tidak perlu backend/database untuk saat ini, gunakan mock data dan local storage
- Semua halaman publik harus memiliki minimal 1 ad placement
- Admin dashboard tidak perlu ad placement
