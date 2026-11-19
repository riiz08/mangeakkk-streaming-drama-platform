# Panduan Arsitektur & URL Media Cloudflare R2

Repository ini menggunakan custom domain Cloudflare R2 langsung untuk distribusi video HLS dan gambar poster:
```
https://media.tengokfull.web.id
```

## 1. Format URL Media Langsung

File disimpan di Cloudflare R2 bucket `mangeakkk` dan dapat diakses publik melalui custom domain:

- **Manifest HLS Film**: `https://media.tengokfull.web.id/videos/{slug}/index.m3u8`
- **Manifest HLS Drama (Episode)**: `https://media.tengokfull.web.id/videos/{drama-slug}/{episode-slug}/index.m3u8`
- **Poster Gambar**: `https://media.tengokfull.web.id/videos/{slug}/poster.jpg`
- **Thumbnail Episode**: `https://media.tengokfull.web.id/videos/{drama-slug}/{episode-slug}/poster.jpg`
- **Segment Video (.ts / .m4s)**: `https://media.tengokfull.web.id/videos/{slug}/segment_001.ts`

Struktur folder di R2 bucket:
```text
videos/
  ├── {slug}/
  │     ├── index.m3u8
  │     ├── poster.jpg
  │     └── segment_xxx.ts
  └── {drama-slug}/
        ├── poster.jpg
        ├── episode-1/
        │     ├── index.m3u8
        │     └── segment_xxx.ts
        └── episode-2/
              ├── index.m3u8
              └── segment_xxx.ts
```

## 2. Cloudflare Worker (Legacy / Optional Proxy)

File `worker.js` adalah implementasi Cloudflare Worker opsional jika diperlukan verifikasi signature HMAC-SHA256 untuk URL terbatas/lama.

Format lama yang didukung oleh Worker legacy:
- `https://hls-worker.riskimhmmd0.workers.dev/{sig}/{videoId}/index.m3u8`
- `https://hls-worker.riskimhmmd0.workers.dev/{sig}/{videoId}/poster.jpg`

> **Catatan Kompatibilitas:** Aplikasi Mangeakkk memiliki smart resolver di `lib/signed-url.ts` (`resolveVideoUrl` dan `resolvePosterUrl`) yang secara otomatis mengubah URL worker lama menjadi format `https://media.tengokfull.web.id/videos/{slug}/...` saat runtime.
