# Issue: Perbaikan Upload Poster & Folder HLS ke Cloudflare R2

## Latar Belakang

Terdapat dua bug kritis di fitur upload admin:

1. **Upload poster → URL hasil selalu 404**, meski file terbukti sudah masuk ke R2.
2. **Upload folder HLS → error** `Unexpected token 'R', "Request En"... is not valid JSON`.

---

## Referensi: Kode Cloudflare Worker (`index.js`)

Ini kode Worker aktual yang menentukan bagaimana Worker memetakan URL ke key R2:

```js
const enc = new TextEncoder();
const hexToBytes = (h) => new Uint8Array(h.match(/../g).map((b) => parseInt(b, 16)));

const TYPES = {
  m3u8: 'application/vnd.apple.mpegurl',
  ts: 'video/mp2t',
  m4s: 'video/iso.segment',
  mp4: 'video/mp4',
  aac: 'audio/aac',
  vtt: 'text/vtt',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const ALLOWED_ORIGINS = [
  'https://tengokfull.web.id',
  'https://www.tengokfull.web.id',
];
const isAllowed = (origin) =>
  ALLOWED_ORIGINS.includes(origin) ||
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const cors = isAllowed(origin)
      ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
      : {};
    const reply = (body, status) => new Response(body, { status, headers: cors });

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Max-Age': '86400' },
      });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return reply('Method Not Allowed', 405);
    }

    // URL: /{videoId}/{sig}/{file...}
    const url = new URL(request.url);
    const [videoId, sig, ...rest] = url.pathname.slice(1).split('/');

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

    // ⚠️ Mapping URL ke Key R2:
    //   Jika file diawali 'posters/' → R2 key = file (contoh: posters/1234-nama.jpg)
    //   Selain itu               → R2 key = videos/{videoId}/{file}
    const r2Key = file.startsWith('posters/')
      ? file
      : `videos/${videoId}/${file}`;

    const obj = await env.BUCKET.get(r2Key);
    if (!obj) return reply('Not found', 404);

    const ext = (file.split('.').pop() || '').toLowerCase();
    const contentType =
      TYPES[ext] || obj.httpMetadata?.contentType || 'application/octet-stream';

    return new Response(request.method === 'HEAD' ? null : obj.body, {
      headers: {
        ...cors,
        'Content-Type': contentType,
        'Cache-Control': ext === 'm3u8' ? 'private, max-age=10' : 'private, max-age=3600',
      },
    });
  },
};
```

### Pemetaan URL ↔ R2 Key dari Worker:

| URL yang diminta | R2 Key yang dicari Worker |
|---|---|
| `/{videoId}/{sig}/index.m3u8` | `videos/{videoId}/index.m3u8` |
| `/{videoId}/{sig}/segment0.ts` | `videos/{videoId}/segment0.ts` |
| `/{videoId}/{sig}/posters/1234-nama.jpg` | `posters/1234-nama.jpg` |

---

## Bug 1: Poster URL Selalu 404

### Root Cause

Alur saat ini di `app/api/upload/route.ts`:
1. File poster diupload ke R2 dengan key: `posters/{timestamp}-{filename}` ✓ (upload berhasil)
2. Signed URL yang dibuat: `getSignedPosterUrl(cleanFolder)` → `{BASE}/{cleanFolder}/{sig}/poster.jpg`
   - `cleanFolder` = `"posters"` → URL = `{BASE}/posters/{sig}/poster.jpg`
   - Worker melihat: `videoId="posters"`, `sig=...`, `file="poster.jpg"`
   - `file` TIDAK diawali `posters/` → Worker cari R2 key: `videos/posters/poster.jpg` → **tidak ada** → 404

### Solusi

Signed URL untuk poster harus menyertakan path lengkap file di R2 sebagai bagian `{file}` dalam URL, bukan hanya `poster.jpg`:

- **Format URL yang benar:** `{BASE}/{videoId}/{sig}/posters/{timestamp}-{filename}`
  - Worker: `file = "posters/{timestamp}-{filename}"` → starts with `posters/` → R2 key = `posters/{timestamp}-{filename}` ✓
- `{videoId}` di sini bisa diisi dengan content slug yang dikirim dari frontend, atau nilai konstan seperti `"media"`.
- `sig` = HMAC-SHA256(`VIDEO_SECRET`, `videoId`).

**Yang harus diubah:**
- Di `app/api/upload/route.ts`: setelah poster berhasil diupload, generate signed URL dengan `file` = key R2 poster (misalnya `posters/{timestamp}-{filename}`), bukan `poster.jpg` saja.
- Update atau tambahkan fungsi di `lib/signed-url.ts` untuk membuat signed URL dengan path file arbitrer: `getSignedUrlForKey(videoId, r2Key)` → `{BASE}/{videoId}/{sig}/{r2Key}`.
- Frontend `R2Uploader.tsx` perlu mengirim `videoId` (content slug) ke API route sebagai bagian form data.

---

## Bug 2: Folder HLS Gagal — Error JSON Parse

### Root Cause

Saat upload folder HLS (index.m3u8 + banyak file `.ts`):
- File `.ts` video bisa berukuran beberapa MB per file.
- Next.js App Router membatasi ukuran body request secara default (\~4MB).
- Ketika file melebihi batas ini, Next.js langsung mengembalikan response error berupa teks plain (bukan JSON), misalnya `"Request Entity Too Large"`.
- Kode di `R2Uploader.tsx` memanggil `res.json()` tanpa cek `Content-Type` terlebih dahulu → crash: `Unexpected token 'R'`.

### Solusi

**A. Naikkan batas body request di Next.js:**
- Di `next.config.ts`, tambahkan konfigurasi untuk menonaktifkan atau menaikkan batas ukuran body pada route `/api/upload`.

**B. Perbaiki error handling di frontend (`R2Uploader.tsx`):**
- Sebelum `res.json()`, cek apakah `res.headers.get('content-type')` mengandung `application/json`.
- Jika bukan JSON, tampilkan pesan error yang informatif dari `res.text()` (misal: "File terlalu besar, coba upload segmen lebih sedikit").

**C. Pastikan struktur key R2 untuk HLS sudah benar:**
Saat ini upload HLS menyimpan ke: `videos/{cleanFolder}/{cleanRelativePath}`.
Worker mencari: `videos/{videoId}/{file}`.
Agar cocok: `cleanFolder` yang dipakai saat upload harus sama persis dengan `videoId` yang dipakai saat generate signed URL — keduanya harus berupa content slug yang dikirim dari frontend.

---

## Penting: Secret Key

Worker menggunakan `env.SECRET`. Pastikan nilai `VIDEO_SECRET` di `.env` Next.js **sama persis** dengan nilai `SECRET` yang dikonfigurasi di Cloudflare Worker environment variables. Jika berbeda, semua request akan ditolak dengan 403.

---

## Checklist Implementasi

- [ ] Tambah fungsi `getSignedUrlForKey(videoId, r2KeyPath)` di `lib/signed-url.ts` untuk menghasilkan URL dengan path R2 key arbitrer
- [ ] Perbaiki `app/api/upload/route.ts` untuk poster: signed URL menggunakan full R2 key path (`posters/{timestamp}-{filename}`) sebagai `file` segment dalam URL
- [ ] Tambah field `videoId` (content slug) pada form data yang dikirim `R2Uploader.tsx` ke API
- [ ] Naikkan batas ukuran body request di `next.config.ts` untuk mendukung file `.ts` besar
- [ ] Perbaiki `R2Uploader.tsx`: cek `content-type` sebelum `res.json()`, tangkap non-JSON response sebagai pesan error yang informatif
- [ ] Verifikasi URL poster bisa diakses via Worker setelah upload
- [ ] Verifikasi upload folder HLS dan playback via signed URL berhasil
- [ ] Verifikasi build berhasil setelah semua perubahan

