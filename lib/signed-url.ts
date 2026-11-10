import crypto from "crypto";

/**
 * Default fallback secret key for HMAC SHA256 signing
 * Shared between Next.js server and Cloudflare Worker
 */
const DEFAULT_SECRET = "riizadminmangeakkk";
const DEFAULT_WORKER_BASE = "https://hls-worker.riskimhmmd0.workers.dev";

/**
 * Get configured Worker base URL without trailing slash
 */
export function getWorkerBaseUrl(): string {
  const base =
    process.env.VIDEO_WORKER_BASE_URL ||
    process.env.R2_PUBLIC_URL ||
    DEFAULT_WORKER_BASE;
  return base.replace(/\/+$/, "");
}

/**
 * Get configured secret key for HMAC SHA256 signing
 * Checks both VIDEO_SECRET and SECRET environment variables
 */
export function getVideoSecret(): string {
  return process.env.VIDEO_SECRET || process.env.SECRET || DEFAULT_SECRET;
}

/**
 * Compute HMAC-SHA256 signature for a given videoId
 * Formula: sig = crypto.createHmac('sha256', SECRET).update(videoId).digest('hex')
 * Expiration is removed per caching strategy requirements.
 */
export function signVideoId(videoId: string): string {
  if (!videoId) return "";
  const secret = getVideoSecret();
  return crypto.createHmac("sha256", secret).update(videoId).digest("hex");
}

/**
 * Verify whether an incoming signature matches the videoId
 */
export function verifySignature(videoId: string, signature: string): boolean {
  if (!videoId || !signature) return false;
  const expected = signVideoId(videoId);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Helper to extract or sanitize a clean videoId from an id, path, or URL.
 * Examples:
 * - "video-001" -> "video-001"
 * - "videos/video-001/index.m3u8" -> "video-001"
 * - "posters/video-001/poster.jpg" -> "video-001"
 * - "https://hls-worker.riskimhmmd0.workers.dev/video-001/..." -> "video-001"
 */
export function cleanVideoId(rawIdOrPath: string): string {
  if (!rawIdOrPath) return "";
  let id = rawIdOrPath.trim();

  // If it's a full URL, parse the pathname
  if (id.startsWith("http://") || id.startsWith("https://")) {
    try {
      const url = new URL(id);
      id = url.pathname;
    } catch {
      // ignore
    }
  }

  // Remove leading and trailing slashes
  id = id.replace(/^\/+|\/+$/g, "");

  // If path starts with videos/ or posters/
  if (id.startsWith("videos/")) {
    const parts = id.replace(/^videos\//, "").split("/");
    return parts[0] || id;
  }
  if (id.startsWith("posters/")) {
    const parts = id.replace(/^posters\//, "").split("/");
    return parts[0] || id;
  }

  // If path has segments (e.g. videoId/sig/index.m3u8)
  const parts = id.split("/");
  if (parts.length > 1) {
    return parts[0];
  }

  return id;
}

/**
 * Check if a URL or path is associated with our Cloudflare Worker or R2 bucket
 */
export function isWorkerOrR2Url(url: string): boolean {
  if (!url) return false;
  const workerBase = getWorkerBaseUrl();
  const r2Public = process.env.R2_PUBLIC_URL || "";
  return (
    url.includes("hls-worker.riskimhmmd0.workers.dev") ||
    (Boolean(workerBase) && url.startsWith(workerBase)) ||
    (Boolean(r2Public) && url.startsWith(r2Public)) ||
    url.includes(".r2.dev") ||
    url.startsWith("videos/") ||
    url.startsWith("posters/")
  );
}

/**
 * Generate signed HLS video URL:
 * Format: {BASE}/{videoId}/{sig}/index.m3u8
 *
 * @param videoId Identifier or folder of the video (e.g. "video-001")
 * @param filename File to serve (default "index.m3u8")
 */
export function getSignedVideoUrl(
  videoId: string,
  filename = "index.m3u8"
): string {
  if (!videoId) return "";
  const cleanId = cleanVideoId(videoId);
  const base = getWorkerBaseUrl();
  const sig = signVideoId(cleanId);
  const cleanFilename = filename.replace(/^\/+/, "");
  return `${base}/${cleanId}/${sig}/${cleanFilename}`;
}

/**
 * Generate signed URL for any arbitrary R2 file key:
 * Format: {BASE}/{videoId}/{sig}/{r2Key}
 *
 * For poster files:
 * - Worker checks: `const r2Key = file.startsWith('posters/') ? file : videos/{videoId}/{file}`
 * - So when `r2Key` starts with `posters/` (e.g. `posters/1234-name.jpg`), the Worker
 *   directly fetches `posters/1234-name.jpg` from the R2 bucket.
 *
 * @param videoId Content identifier or folder used for the HMAC signature
 * @param r2Key The exact R2 storage key path (e.g. "posters/1234-img.jpg" or "index.m3u8")
 */
export function getSignedUrlForKey(
  videoId: string,
  r2Key: string
): string {
  if (!r2Key) return "";
  const cleanId = cleanVideoId(videoId) || "media";
  const base = getWorkerBaseUrl();
  const sig = signVideoId(cleanId);
  const cleanKey = r2Key.replace(/^\/+/, "");
  return `${base}/${cleanId}/${sig}/${cleanKey}`;
}

/**
 * Generate signed poster image URL:
 * Format: {BASE}/{videoId}/{sig}/{posterKey}
 *
 * @param videoId Identifier of the content
 * @param posterKey Optional specific R2 poster key (e.g. "posters/1234-name.jpg").
 *                  If not provided, defaults to "posters/{cleanId}.jpg".
 */
export function getSignedPosterUrl(
  videoId: string,
  posterKey?: string
): string {
  if (!videoId && !posterKey) return "";
  const cleanId = cleanVideoId(videoId) || "media";

  if (posterKey) {
    const cleanKey = posterKey.replace(/^\/+/, "");
    const fullKey = cleanKey.startsWith("posters/") ? cleanKey : `posters/${cleanKey}`;
    return getSignedUrlForKey(cleanId, fullKey);
  }

  return getSignedUrlForKey(cleanId, `posters/${cleanId}.jpg`);
}

/**
 * Smart resolver for poster / backdrop image URLs.
 * - If already a signed Worker URL with valid segment structure, return as is.
 * - If external third-party URL (e.g. Unsplash, TMDB, Google), return as is.
 * - If R2 storage URL, storage key, or raw video ID, return signed poster URL.
 */
export function resolvePosterUrl(
  posterUrlOrId?: string,
  fallbackId?: string
): string {
  if (!posterUrlOrId && !fallbackId) return "";
  const target = (posterUrlOrId || fallbackId || "").trim();
  if (!target) return "";

  const workerBase = getWorkerBaseUrl();

  // If already a signed worker URL (contains worker base and at least 3 parts: videoId/sig/file)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    if (parts.length >= 3) {
      return target;
    }
  }

  // If external non-R2 URL, preserve original URL
  if (
    (target.startsWith("http://") || target.startsWith("https://")) &&
    !isWorkerOrR2Url(target)
  ) {
    return target;
  }

  // Extract path if it was a full R2 URL
  let r2Key = target;
  if (target.startsWith("http://") || target.startsWith("https://")) {
    try {
      const parsed = new URL(target);
      r2Key = parsed.pathname.replace(/^\/+/, "");
    } catch {
      // ignore
    }
  }

  const videoId = fallbackId ? cleanVideoId(fallbackId) : "media";
  if (r2Key.startsWith("posters/")) {
    return getSignedUrlForKey(videoId, r2Key);
  }

  const cleanId = cleanVideoId(target) || videoId;
  return getSignedPosterUrl(cleanId);
}

/**
 * Smart resolver for video stream URLs (.m3u8).
 * - If already a signed Worker URL with valid segment structure, return as is.
 * - If external third-party stream (e.g. Mux test stream, Google Storage), return as is.
 * - If R2 storage URL, storage key, or raw video ID, return signed HLS URL.
 */
export function resolveVideoUrl(
  videoUrlOrId?: string,
  fallbackId?: string
): string {
  if (!videoUrlOrId && !fallbackId) return "";
  const target = (videoUrlOrId || fallbackId || "").trim();
  if (!target) return "";

  const workerBase = getWorkerBaseUrl();

  // If already a signed worker URL (contains worker base and at least 3 parts: videoId/sig/file)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    if (parts.length >= 3) {
      return target;
    }
  }

  // If external non-R2 URL, preserve original URL
  if (
    (target.startsWith("http://") || target.startsWith("https://")) &&
    !isWorkerOrR2Url(target)
  ) {
    return target;
  }

  const videoId =
    cleanVideoId(target) || (fallbackId ? cleanVideoId(fallbackId) : "video");
  return getSignedVideoUrl(videoId);
}

