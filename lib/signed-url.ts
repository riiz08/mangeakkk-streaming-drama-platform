import crypto from "crypto";

/**
 * Default fallback secret key for HMAC SHA256 signing (preserved for legacy signature support)
 */
const DEFAULT_SECRET = "riizadminmangeakkk";
const DEFAULT_MEDIA_BASE = "https://media.tengokfull.web.id";

/**
 * Get configured Media base URL without trailing slash
 */
export function getMediaBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
    process.env.MEDIA_BASE_URL ||
    process.env.NEXT_PUBLIC_VIDEO_WORKER_BASE_URL ||
    process.env.VIDEO_WORKER_BASE_URL ||
    DEFAULT_MEDIA_BASE;
  return base.replace(/\/+$/, "");
}

/**
 * Alias for backward compatibility
 */
export const getWorkerBaseUrl = getMediaBaseUrl;

/**
 * Get configured secret key for HMAC SHA256 signing
 * Checks both VIDEO_SECRET and SECRET environment variables
 */
export function getVideoSecret(): string {
  return process.env.VIDEO_SECRET || process.env.SECRET || DEFAULT_SECRET;
}

/**
 * Compute HMAC-SHA256 signature for a given videoId / content slug
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
 * Helper to clean/sanitize a content slug or path
 * Removes domain, signature hex, and folder prefixes (videos/, posters/)
 */
export function cleanSlug(rawSlugOrPath: string): string {
  if (!rawSlugOrPath) return "";
  let s = rawSlugOrPath.trim();

  // If full URL, parse pathname
  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const url = new URL(s);
      s = url.pathname;
    } catch {
      // ignore
    }
  }

  // Remove leading and trailing slashes
  s = s.replace(/^\/+|\/+$/g, "");

  // If starts with hex sig (64 chars) from old URLs
  const segments = s.split("/");
  if (segments[0] && /^[0-9a-f]{64}$/i.test(segments[0])) {
    segments.shift(); // remove sig
  }

  // Remove "videos/" or "posters/" if present
  if (segments[0] === "videos") {
    segments.shift();
  } else if (segments[0] === "posters") {
    segments.shift();
  }

  return segments.join("/").replace(/\/+$/, "");
}

/**
 * Check if a URL or path is associated with Cloudflare Worker or R2 / Media bucket
 */
export function isWorkerOrR2Url(url: string): boolean {
  if (!url) return false;
  const mediaBase = getMediaBaseUrl();
  return (
    url.includes("media.tengokfull.web.id") ||
    url.includes("hls-worker") ||
    (Boolean(mediaBase) && url.startsWith(mediaBase)) ||
    url.includes(".r2.dev") ||
    url.startsWith("videos/") ||
    url.startsWith("posters/")
  );
}

/**
 * Generate direct media HLS video URL:
 * Format: {BASE}/videos/{slug}/index.m3u8
 * Format Episode: {BASE}/videos/{drama-slug}/{episode-slug}/index.m3u8
 *
 * Contoh:
 * - film: https://media.tengokfull.web.id/videos/polong-2026/index.m3u8
 * - episode: https://media.tengokfull.web.id/videos/queen-of-tears/episode-1/index.m3u8
 */
export function getSignedVideoUrl(
  slugOrPath: string,
  filename = "index.m3u8"
): string {
  if (!slugOrPath) return "";
  const base = getMediaBaseUrl();
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  if (!clean) return "";

  // Jika slugOrPath sudah berakhiran .m3u8 atau .mp4
  if (clean.endsWith(".m3u8") || clean.endsWith(".mp4")) {
    return `${base}/videos/${clean}`;
  }

  return `${base}/videos/${clean}/${cleanFilename}`;
}

/**
 * Generate direct media poster/backdrop image URL:
 * Format: {BASE}/videos/{slug}/poster.(jpg|jpeg|png|webp)
 *
 * Contoh:
 * - https://media.tengokfull.web.id/videos/polong-2026/poster.jpg
 * - https://media.tengokfull.web.id/videos/queen-of-tears/poster.jpg
 */
export function getSignedPosterUrl(
  slugOrPath: string,
  filename = "poster.jpg"
): string {
  if (!slugOrPath) return "";
  const base = getMediaBaseUrl();
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  if (!clean) return "";

  // Jika clean sudah berakhiran ekstensi gambar
  if (/\.(jpg|jpeg|png|webp|avif)$/i.test(clean)) {
    return `${base}/videos/${clean}`;
  }

  return `${base}/videos/${clean}/${cleanFilename}`;
}

/**
 * Generate direct media URL for arbitrary storage key
 * Format: {BASE}/videos/{key}
 */
export function getSignedUrlForKey(storageKey: string): string {
  if (!storageKey) return "";
  const base = getMediaBaseUrl();
  let cleanKey = storageKey.replace(/^\/+/, "");
  if (cleanKey.startsWith("videos/")) {
    cleanKey = cleanKey.slice("videos/".length);
  }

  return `${base}/videos/${cleanKey}`;
}

/**
 * Smart resolver for poster / backdrop image URLs.
 * - If already a valid direct media URL, return as is.
 * - If legacy signed Worker URL, convert to new format.
 * - If external third-party URL (e.g. Unsplash, TMDB), return as is.
 * - If R2 storage URL, storage key, or slug, return media poster URL.
 */
export function resolvePosterUrl(
  posterUrlOrId?: string,
  fallbackSlug?: string
): string {
  if (!posterUrlOrId && !fallbackSlug) return "";
  const target = (posterUrlOrId || fallbackSlug || "").trim();
  if (!target) return "";

  const mediaBase = getMediaBaseUrl();

  // If already a valid direct media URL with /videos/
  if (target.startsWith(mediaBase) && target.includes("/videos/")) {
    return target;
  }

  // If legacy signed Worker URL, convert to new format
  if (target.includes("hls-worker.riskimhmmd0.workers.dev") || target.includes("workers.dev")) {
    const clean = cleanSlug(target);
    const extMatch = target.match(/([^/]+\.(?:jpg|jpeg|png|webp|avif))$/i);
    const filename = extMatch ? extMatch[1] : "poster.jpg";
    return getSignedPosterUrl(clean, filename);
  }

  // If external non-R2 URL (Unsplash, TMDB, etc.), preserve original URL
  if (
    (target.startsWith("http://") || target.startsWith("https://")) &&
    !isWorkerOrR2Url(target)
  ) {
    return target;
  }

  const targetSlug = fallbackSlug || target;
  const extMatch = target.match(/([^/]+\.(?:jpg|jpeg|png|webp|avif))$/i);
  const filename = extMatch ? extMatch[1] : "poster.jpg";

  return getSignedPosterUrl(targetSlug, filename);
}

/**
 * Smart resolver for video stream URLs (.m3u8).
 * - If already a valid direct media URL, return as is.
 * - If legacy signed Worker URL, convert to new format.
 * - If external third-party stream, return as is.
 * - If R2 storage URL, storage key, or slug, return media HLS URL.
 */
export function resolveVideoUrl(
  videoUrlOrId?: string,
  fallbackSlug?: string
): string {
  if (!videoUrlOrId && !fallbackSlug) return "";
  const target = (videoUrlOrId || fallbackSlug || "").trim();
  if (!target) return "";

  const mediaBase = getMediaBaseUrl();

  // If already a valid direct media URL with /videos/
  if (target.startsWith(mediaBase) && target.includes("/videos/")) {
    return target;
  }

  // If legacy signed Worker URL, convert to new format
  if (target.includes("hls-worker.riskimhmmd0.workers.dev") || target.includes("workers.dev")) {
    const clean = cleanSlug(target);
    return getSignedVideoUrl(clean);
  }

  // If external non-R2 URL, preserve original URL
  if (
    (target.startsWith("http://") || target.startsWith("https://")) &&
    !isWorkerOrR2Url(target)
  ) {
    return target;
  }

  const targetSlug = fallbackSlug || target;
  return getSignedVideoUrl(targetSlug);
}
