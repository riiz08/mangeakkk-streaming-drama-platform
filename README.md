# StreamFlow - Streaming Platform

StreamFlow adalah platform web streaming modern berbasis **Next.js (App Router)** dan **Tailwind CSS**, dilengkapi dengan UI bertema bioskop gelap (*dark cinema mode*), navigasi responsif, katalog video multi-kategori, dan pemutar video interaktif beresolusi HD.

## Fitur Utama

- ⚡ **Next.js App Router**: Arsitektur modular dengan Server-side Rendering & Server Components.
- 🎨 **Modern Dark UI**: Tampilan sinematik menggunakan Tailwind CSS dan ikon Lucide React.
- 🎬 **Hero Highlight Banner**: Menampilkan konten unggulan dengan visual sinematik dan tombol akses cepat.
- 📺 **Katalog Multi-Kategori**: Pengelompokan video berdasarkan *Trending*, *Movies*, *Series*, *Documentary*, dan *Live Streams*.
- 🍿 **Halaman Nonton Interaktif (`/watch/[id]`)**:
  - Custom HTML5 Video Player dengan controls lengkap (Play/Pause, Seekbar, Volume slider, Mute, Playback speed 0.5x–2x, Fullscreen).
  - Tampilan rating, total views, kreator, sinopsis, dan tag.
  - Rekomendasi video terkait di samping player.
- 📱 **Mobile & Desktop Responsive**: Dilengkapi drawer navigation untuk perangkat mobile.

## Menjalankan Proyek Secara Lokal

1. **Instal dependensi**:
   ```bash
   bun install
   # atau
   npm install
   ```

2. **Jalankan server pengembangan**:
   ```bash
   bun run dev
   # atau
   npm run dev
   ```

3. Buka browser di [http://localhost:3000](http://localhost:3000).

## Build Produksi

```bash
bun run build
# atau
npm run build
```

