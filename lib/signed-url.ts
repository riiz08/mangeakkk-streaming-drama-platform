import crypto from "crypto";

/**
 * Default fallback secret key for HMAC SHA256 signing
 * Shared between Next.js server and Cloudflare Worker
 */
const DEFAULT_SECRET = "riizadminmangeakkk";
const DEFAULT_WORKER_BASE = "https://hls-worker.riskimhmmd0.workers.dev";
const DEFAULT_VIDEO_ID = "videos";

/**
 * Get configured Worker base URL without trailing slash
 */
export function getWorkerBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_VIDEO_WORKER_BASE_URL ||
    process.env.VIDEO_WORKER_BASE_URL ||
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
 * Compute HMAC-SHA256 signature for a given videoId (default: "videos")
 * Worker verifies: HMAC-SHA256(SECRET, videoId) where videoId = "videos"
 * URL structure: /{sig}/{videoId}/{file...}
 */
export function signVideoId(videoId = DEFAULT_VIDEO_ID): string {
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
 * Helper to clean/sanitize a content slug
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

  // If starts with hex sig (64 chars)
  const segments = s.split("/");
  if (segments[0] && /^[0-9a-f]{64}$/i.test(segments[0])) {
    segments.shift(); // remove sig
  }

  // If starts with "videos/"
  if (segments[0] === "videos") {
    segments.shift(); // remove "videos"
  } else if (segments[0] === "posters") {
    segments.shift(); // remove legacy "posters"
  }

  return segments.join("/").replace(/\/+$/, "");
}

/**
 * Check if a URL or path is associated with Cloudflare Worker or R2 bucket
 */
export function isWorkerOrR2Url(url: string): boolean {
  if (!url) return false;
  const workerBase = getWorkerBaseUrl();
  return (
    url.includes("hls-worker") ||
    (Boolean(workerBase) && url.startsWith(workerBase)) ||
    url.includes(".r2.dev") ||
    url.startsWith("videos/") ||
    url.startsWith("posters/")
  );
}

/**
 * Generate signed HLS video URL:
 * Format: {BASE}/{sig}/videos/{slug}/index.m3u8
 *
 * Contoh:
 * - film: {BASE}/{sig}/videos/film-badut-gendong/index.m3u8
 * - episode: {BASE}/{sig}/videos/queen-of-tears/episode-1/index.m3u8
 */
export function getSignedVideoUrl(
  slugOrPath: string,
  filename = "index.m3u8"
): string {
  if (!slugOrPath) return "";
  const base = getWorkerBaseUrl();
  const sig = signVideoId(DEFAULT_VIDEO_ID);
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  // If slugOrPath already ends with .m3u8, use it directly
  if (clean.endsWith(".m3u8") || clean.endsWith(".mp4")) {
    return `${base}/${sig}/videos/${clean}`;
  }

  return `${base}/${sig}/videos/${clean}/${cleanFilename}`;
}

/**
 * Generate signed poster/backdrop image URL:
 * Format: {BASE}/{sig}/videos/{slug}/poster.(jpg|jpeg|png|webp)
 *
 * Contoh:
 * - {BASE}/{sig}/videos/film-badut-gendong/poster.jpg
 * - {BASE}/{sig}/videos/queen-of-tears/poster.jpg
 */
export function getSignedPosterUrl(
  slugOrPath: string,
  filename = "poster.jpg"
): string {
  if (!slugOrPath) return "";
  const base = getWorkerBaseUrl();
  const sig = signVideoId(DEFAULT_VIDEO_ID);
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  // If clean already ends with an image extension, use it directly
  if (/\.(jpg|jpeg|png|webp|avif)$/i.test(clean)) {
    return `${base}/${sig}/videos/${clean}`;
  }

  return `${base}/${sig}/videos/${clean}/${cleanFilename}`;
}

/**
 * Generate signed URL for any arbitrary R2 file key under videos/
 * Format: {BASE}/{sig}/videos/{subpath}
 */
export function getSignedUrlForKey(storageKey: string): string {
  if (!storageKey) return "";
  const base = getWorkerBaseUrl();
  const sig = signVideoId(DEFAULT_VIDEO_ID);
  let cleanKey = storageKey.replace(/^\/+/, "");

  // If key starts with "videos/", keep it after sig: {base}/{sig}/videos/...
  if (cleanKey.startsWith("videos/")) {
    return `${base}/${sig}/${cleanKey}`;
  }

  return `${base}/${sig}/videos/${cleanKey}`;
}

/**
 * Smart resolver for poster / backdrop image URLs.
 * - If already a signed Worker URL with valid format, return as is.
 * - If external third-party URL (e.g. Unsplash, TMDB), return as is.
 * - If R2 storage URL, storage key, or slug, return signed poster URL.
 */
export function resolvePosterUrl(
  posterUrlOrId?: string,
  fallbackSlug?: string
): string {
  if (!posterUrlOrId && !fallbackSlug) return "";
  const target = (posterUrlOrId || fallbackSlug || "").trim();
  if (!target) return "";

  const workerBase = getWorkerBaseUrl();

  // If already a signed worker URL (contains worker base and valid /videos/ structure)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    // Format: {sig}/videos/{slug}/... (at least 3 parts)
    if (parts.length >= 3 && /^[0-9a-f]{64}$/i.test(parts[0])) {
      return target;
    }
  }

  // If external non-R2 URL (Unsplash, TMDB, etc.), preserve original URL
  if (
    (target.startsWith("http://") || target.startsWith("https://")) &&
    !isWorkerOrR2Url(target)
  ) {
    return target;
  }

  // Otherwise, generate signed poster URL using target or fallback
  const targetSlug = fallbackSlug || target;
  // If target has a specific image filename (e.g. backdrop.jpg, poster.webp)
  const extMatch = target.match(/([^/]+\.(?:jpg|jpeg|png|webp|avif))$/i);
  const filename = extMatch ? extMatch[1] : "poster.jpg";

  return getSignedPosterUrl(targetSlug, filename);
}

/**
 * Smart resolver for video stream URLs (.m3u8).
 * - If already a signed Worker URL with valid format, return as is.
 * - If external third-party stream, return as is.
 * - If R2 storage URL, storage key, or slug, return signed HLS URL.
 */
export function resolveVideoUrl(
  videoUrlOrId?: string,
  fallbackSlug?: string
): string {
  if (!videoUrlOrId && !fallbackSlug) return "";
  const target = (videoUrlOrId || fallbackSlug || "").trim();
  if (!target) return "";

  const workerBase = getWorkerBaseUrl();

  // If already a signed worker URL (contains worker base and valid /videos/ structure)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    if (parts.length >= 3 && /^[0-9a-f]{64}$/i.test(parts[0])) {
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

  const targetSlug = fallbackSlug || target;
  return getSignedVideoUrl(targetSlug);
}
