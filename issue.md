# Issue: Hapus Fitur Upload R2, Auto-Generate Signed URL, dan Perbaiki Strategi Caching

## Latar Belakang

Fitur upload file/folder ke Cloudflare R2 di dashboard admin tidak diperlukan lagi. File poster dan video HLS akan diupload secara manual langsung ke R2 melalui Cloudflare Dashboard / Wrangler CLI.

Di sisi admin dashboard, URL poster dan video cukup di-generate otomatis berdasarkan slug konten yang dihasilkan dari judul.

Selain itu, struktur URL signed menggunakan format: **`{base}/{sig}/videos/{slug}/{file}`** (sig di depan).

Strategi caching juga diperbaiki dengan mengkombinasikan SSG/ISR time-based revalidation dengan on-demand revalidation via Server Actions.

---

## Referensi: Kode Cloudflare Worker

```js
// URL: /{sig}/{videoId}/{file...}
const url = new URL(request.url);
const [sig, videoId, ...rest] = url.pathname.slice(1).split('/');

let file;
try {
  file = decodeURIComponent(rest.join('/'));
} catch {
  return reply('Bad Request', 400);
}

if (!videoId || !file || !/^[0-9a-f]{64}$/.test(sig || '') || file.includes('..')) {
  return reply('Forbidden', 403);
}

const hmacKey = await crypto.subtle.importKey(
  'raw', enc.encode(env.SECRET),
  { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
);
const ok = await crypto.subtle.verify(
  'HMAC', hmacKey, hexToBytes(sig), enc.encode(videoId)
);
if (!ok) return reply('Forbidden', 403);

const obj = await env.BUCKET.get(`${videoId}/${file}`);
if (!obj) return reply('Not found', 404);
```

### Poin Penting:
1. **Urutan URL:** `/{sig}/{videoId}/{file...}` — sig PERTAMA.
2. **videoId** pada URL = literal `"videos"`. Slug konten menjadi bagian dari `file`.
3. **Signature:** `HMAC-SHA256(SECRET, "videos")` — yang di-sign adalah string `"videos"`.
4. **Secret:** env variable `SECRET` di Worker dan `VIDEO_SECRET` di Next.js — harus sama nilainya.
5. **R2 key mapping:** `${videoId}/${file}` langsung menjadi key di R2 tanpa prefix berulang:
   - Poster: `videos/{slug}/poster.jpg`
   - Backdrop: `videos/{slug}/backdrop.jpg`
   - Film HLS: `videos/{slug}/index.m3u8`
   - Drama Ep HLS: `videos/{slug}/episode-{number}/index.m3u8`

---

## Bagian 1 — Hapus Fitur Upload R2 dari Admin

### Yang Dihapus:
- Komponen `R2Uploader.tsx` dari semua penggunaan di `AdminDashboard.tsx`
- File `components/admin/R2Uploader.tsx`
- File `app/api/upload/route.ts`
- File `lib/r2.ts`
- Dependency `@aws-sdk/client-s3` dari `package.json`
- Env variables terkait R2 upload (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`) dari `.env.example`
- R2 Status pill & guide card di admin dashboard

### Yang Tetap Dipertahankan:
- `lib/signed-url.ts` — generate signed URL
- `VIDEO_SECRET` dan `VIDEO_WORKER_BASE_URL` di `.env`

---

## Bagian 2 — Auto-Generate URL Berdasarkan Slug

### Format URL Baru:
```
Poster:  {BASE}/{sig}/videos/{slug}/poster.(jpg|jpeg|png|webp)
Video:   {BASE}/{sig}/videos/{slug}/index.m3u8
Segment: {BASE}/{sig}/videos/{slug}/segment0.ts
```

Contoh untuk film dengan slug `film-badut-gendong`:
```
Poster:  https://hls-worker.xxx.dev/{sig}/videos/film-badut-gendong/poster.jpg
Video:   https://hls-worker.xxx.dev/{sig}/videos/film-badut-gendong/index.m3u8
```

Contoh untuk drama dengan slug `queen-of-tears`, episode 1:
```
Poster:  https://hls-worker.xxx.dev/{sig}/videos/queen-of-tears/poster.jpg
Ep HLS:  https://hls-worker.xxx.dev/{sig}/videos/queen-of-tears/episode-1/index.m3u8
```

---

## Bagian 3 — Strategi Caching yang Optimal

### Konfigurasi Per Halaman:

| Halaman | `revalidate` | On-Demand Trigger | Alasan |
|---|---|---|---|
| Homepage `/` | `86400` (1 hari) | ✅ Saat create/update/delete konten | Konten featured/trending stabil, langsung fresh saat ada perubahan |
| Katalog `/drama`, `/film` | `86400` (1 hari) | ✅ Saat create/update/delete konten | Daftar konten stabil, dipicu fresh saat ada penambahan |
| Detail `/[slug]` | `2592000` (30 hari) | ✅ Saat update konten yang bersangkutan | Metadata sangat jarang berubah |
| Streaming `/[slug]/[episode]` | `2592000` (30 hari) | ✅ Saat update episode/konten | File HLS tidak berubah setelah upload |
| Search `/search` | `86400` (1 hari) | ✅ Saat create/delete konten | Cukup fresh per hari + dipicu saat data berubah |
| Admin `/admin` | `force-dynamic` | - | Selalu realtime dari DB |

---

## Checklist Implementasi

- [x] Hapus `R2Uploader.tsx`, `lib/r2.ts`, `app/api/upload/route.ts`
- [x] Hapus `@aws-sdk/client-s3` dari dependencies
- [x] Bersihkan env R2 upload dari `.env.example`
- [x] Update `lib/signed-url.ts`: ubah urutan URL ke `{base}/{sig}/videos/{slug}/{file}`, sign `"videos"` sebagai videoId
- [x] Update `AdminDashboard.tsx`: auto-generate URL poster & video dari slug, hapus semua referensi R2Uploader
- [x] Update `lib/data/db.ts`: pastikan `formatContent` menggunakan signed URL baru
- [x] Update timer `revalidate` di setiap halaman sesuai tabel di atas
- [x] Pastikan `revalidatePath()` di server actions sudah mencakup semua halaman yang terpengaruh, termasuk path episode
- [x] Update Worker: R2 key = `${videoId}/${file}` (tanpa conditional prefix, agar tidak double `videos/videos/`)
- [x] Sinkronkan `cloudflare-worker/worker.js` dengan kode terbaru
- [x] Verifikasi build berhasil setelah semua perubahan
