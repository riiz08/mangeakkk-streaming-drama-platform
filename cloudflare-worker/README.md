# Panduan Setup Cloudflare Worker untuk Signed URL R2

File `worker.js` ini adalah implementasi Cloudflare Worker yang memverifikasi signature HMAC-SHA256 untuk mengakses video HLS dan poster dari Cloudflare R2 secara aman tanpa token expiration.

## 1. Setup di Cloudflare Dashboard

1. Buka dashboard Cloudflare: **Workers & Pages** -> Pilih worker Anda (misal `hls-worker`).
2. Masuk ke tab **Settings** -> **Variables and Secrets**:
   - Tambahkan Secret: `VIDEO_SECRET` dengan nilai yang sama persis seperti di `.env` aplikasi Next.js.
3. Masuk ke tab **Settings** -> **R2 Bucket Bindings**:
   - Tambahkan binding dengan Variable Name: `R2_BUCKET`.
   - Pilih R2 bucket yang menyimpan video & poster (`mangeakkk`).
4. Salin kode dari `worker.js` dan paste ke editor Worker, lalu klik **Deploy**.

## 2. Format URL yang Didukung

- Manifest HLS: `https://hls-worker.riskimhmmd0.workers.dev/{videoId}/{signature}/index.m3u8`
- Poster Gambar: `https://hls-worker.riskimhmmd0.workers.dev/{videoId}/{signature}/poster.jpg`
- Segment Video: `https://hls-worker.riskimhmmd0.workers.dev/{videoId}/{signature}/segment_001.ts`

Signature dibuat menggunakan formula:
`sig = HMAC-SHA256(VIDEO_SECRET, videoId)`

