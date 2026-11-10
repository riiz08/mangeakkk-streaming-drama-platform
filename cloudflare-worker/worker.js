/**
 * Cloudflare Worker: HLS & Media Proxy with HMAC-SHA256 Signature Verification
 * 
 * URL Format:
 *   GET /{videoId}/{sig}/index.m3u8
 *   GET /{videoId}/{sig}/poster.jpg
 *   GET /{videoId}/{sig}/{any_hls_segment}.ts
 *
 * Environment / Bindings:
 *   - VIDEO_SECRET: Secret HMAC SHA256 (harus sama dengan Next.js)
 *   - R2_BUCKET: R2 Bucket Binding (nama binding bucket R2 di Cloudflare Worker)
 */

export default {
  async fetch(request, env) {
    // Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\/+/, "");
    const parts = pathname.split("/");

    // Minimal 3 bagian: [videoId, sig, file...]
    if (parts.length < 3) {
      return new Response(
        JSON.stringify({ error: "Invalid URL format. Expected /{videoId}/{sig}/{file}" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [videoId, sig, ...fileParts] = parts;
    const filePath = fileParts.join("/");

    // Verifikasi HMAC-SHA256 signature
    const secret = env.VIDEO_SECRET || "mangeakkk-secret-key-2026";
    const isValid = await verifyHmacSha256(secret, videoId, sig);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "403 Forbidden: Invalid or unauthorized token signature." }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Cari objek di Cloudflare R2
    if (!env.R2_BUCKET) {
      return new Response(
        JSON.stringify({ error: "R2_BUCKET binding is not configured in this Worker." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Coba berbagai kemungkinan prefix key di R2
    const candidateKeys = [
      `videos/${videoId}/${filePath}`,
      `posters/${videoId}/${filePath}`,
      `${videoId}/${filePath}`,
      `videos/${filePath}`,
      `posters/${filePath}`,
      filePath,
    ];

    let object = null;
    for (const key of candidateKeys) {
      object = await env.R2_BUCKET.get(key);
      if (object) break;
    }

    if (!object) {
      return new Response("404 File Not Found in R2 Storage", {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // Bangun Response dengan headers optimal
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Access-Control-Allow-Origin": "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

    // Tipe MIME otomatis
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (ext === "m3u8") {
      headers.set("Content-Type", "application/vnd.apple.mpegurl");
      headers.set("Cache-Control", "public, max-age=3600");
    } else if (ext === "ts") {
      headers.set("Content-Type", "video/mp2t");
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (ext === "jpg" || ext === "jpeg") {
      headers.set("Content-Type", "image/jpeg");
      headers.set("Cache-Control", "public, max-age=86400");
    } else if (ext === "png") {
      headers.set("Content-Type", "image/png");
      headers.set("Cache-Control", "public, max-age=86400");
    }

    return new Response(object.body, {
      status: 200,
      headers,
    });
  },
};

/**
 * Validasi HMAC-SHA256 menggunakan Web Crypto API
 */
async function verifyHmacSha256(secret, data, receivedHexSig) {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    const expectedHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedHex.toLowerCase() === receivedHexSig.toLowerCase();
  } catch (err) {
    return false;
  }
}

