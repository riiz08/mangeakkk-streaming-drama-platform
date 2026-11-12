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
 * Compute HMAC-SHA256 signature for a given videoId / content slug
 * Worker verifies: HMAC-SHA256(SECRET, videoId) where videoId = content slug
 * URL structure: /{sig}/{videoId}/{file...}
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

  // Remove legacy "videos/" or "posters/" if present
  if (segments[0] === "videos") {
    segments.shift();
  } else if (segments[0] === "posters") {
    segments.shift();
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
 * Format: {BASE}/{sig}/{slug}/index.m3u8
 * Format Episode: {BASE}/{sig}/{drama-slug}/{episode-slug}/index.m3u8
 *
 * Contoh:
 * - film: {BASE}/{sig}/film-badut-gendong/index.m3u8
 * - episode: {BASE}/{sig}/queen-of-tears/episode-1/index.m3u8
 */
export function getSignedVideoUrl(
  slugOrPath: string,
  filename = "index.m3u8"
): string {
  if (!slugOrPath) return "";
  const base = getWorkerBaseUrl();
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  // Pisahkan contentSlug (videoId utama yang di-sign) dan sisa path file
  const segments = clean.split("/");
  const contentSlug = segments[0];
  if (!contentSlug) return "";

  const sig = signVideoId(contentSlug);
  const remainingPath = segments.slice(1).join("/");

  // Jika slugOrPath sudah berakhiran .m3u8 atau .mp4
  if (clean.endsWith(".m3u8") || clean.endsWith(".mp4")) {
    return `${base}/${sig}/${clean}`;
  }

  if (remainingPath) {
    return `${base}/${sig}/${contentSlug}/${remainingPath}/${cleanFilename}`;
  }

  return `${base}/${sig}/${contentSlug}/${cleanFilename}`;
}

/**
 * Generate signed poster/backdrop image URL:
 * Format: {BASE}/{sig}/{slug}/poster.(jpg|jpeg|png|webp)
 *
 * Contoh:
 * - {BASE}/{sig}/film-badut-gendong/poster.jpg
 * - {BASE}/{sig}/queen-of-tears/poster.jpg
 */
export function getSignedPosterUrl(
  slugOrPath: string,
  filename = "poster.jpg"
): string {
  if (!slugOrPath) return "";
  const base = getWorkerBaseUrl();
  const clean = cleanSlug(slugOrPath);
  const cleanFilename = filename.replace(/^\/+/, "");

  const segments = clean.split("/");
  const contentSlug = segments[0];
  if (!contentSlug) return "";

  const sig = signVideoId(contentSlug);

  // Jika clean sudah berakhiran ekstensi gambar
  if (/\.(jpg|jpeg|png|webp|avif)$/i.test(clean)) {
    return `${base}/${sig}/${clean}`;
  }

  const remainingPath = segments.slice(1).join("/");
  if (remainingPath) {
    return `${base}/${sig}/${contentSlug}/${remainingPath}/${cleanFilename}`;
  }

  return `${base}/${sig}/${contentSlug}/${cleanFilename}`;
}

/**
 * Generate signed URL for any arbitrary R2 file key
 * Format: {BASE}/{sig}/{r2Key}
 */
export function getSignedUrlForKey(storageKey: string): string {
  if (!storageKey) return "";
  const base = getWorkerBaseUrl();
  let cleanKey = storageKey.replace(/^\/+/, "");
  if (cleanKey.startsWith("videos/")) {
    cleanKey = cleanKey.slice("videos/".length);
  }

  const segments = cleanKey.split("/");
  const contentSlug = segments[0];
  if (!contentSlug) return "";

  const sig = signVideoId(contentSlug);
  return `${base}/${sig}/${cleanKey}`;
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

  // If already a signed worker URL (contains worker base and valid /{sig}/{slug}/ structure)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    // Format: {sig}/{slug}/... (parts[0] is 64 hex sig)
    if (parts.length >= 2 && /^[0-9a-f]{64}$/i.test(parts[0])) {
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

  // If already a signed worker URL (contains worker base and valid /{sig}/{slug}/ structure)
  if (target.startsWith(workerBase)) {
    const afterBase = target.replace(workerBase, "").replace(/^\/+/, "");
    const parts = afterBase.split("/");
    if (parts.length >= 2 && /^[0-9a-f]{64}$/i.test(parts[0])) {
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
