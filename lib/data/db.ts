import { prisma } from "@/lib/prisma";
import { MOCK_CONTENTS } from "@/lib/data/mock";
import { resolvePosterUrl, resolveVideoUrl } from "@/lib/signed-url";
import { unstable_cache } from "next/cache";

export interface CastMember {
  id?: string;
  name: string;
  photo: string;
}

export interface Episode {
  id?: string;
  number: number;
  slug: string;
  title: string;
  thumbnail: string;
  duration: string;
  synopsis: string;
  videoUrl: string;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  type: "tv-series" | "film";
  poster: string;
  backdrop: string;
  synopsis: string;
  year: number;
  country: string;
  director: string;
  cast: CastMember[];
  duration: string;
  totalEpisodes?: number;
  episodes?: Episode[];
  videoUrl?: string;
  isTrending?: boolean;
  hasNewEpisode?: boolean;
  isPilihan?: boolean;
  isFeatured?: boolean;
  releaseDate?: string;
}

// Helper to format Prisma model output to match the application Content interface
export function formatContent(item: any): Content {
  const posterUrl = resolvePosterUrl(item.poster, item.slug);
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    type: item.type as "tv-series" | "film",
    poster: posterUrl,
    backdrop: item.backdrop ? resolvePosterUrl(item.backdrop, item.slug) : posterUrl,
    synopsis: item.synopsis,
    year: Number(item.year),
    country: item.country,
    director: item.director,
    duration: item.duration,
    totalEpisodes: item.totalEpisodes ?? (item.episodes ? item.episodes.length : undefined),
    videoUrl: item.videoUrl ? resolveVideoUrl(item.videoUrl, item.slug) : undefined,
    isTrending: Boolean(item.isTrending),
    hasNewEpisode: Boolean(item.hasNewEpisode),
    isPilihan: Boolean(item.isPilihan),
    isFeatured: Boolean(item.isFeatured),
    releaseDate: item.releaseDate || undefined,
    cast: item.cast ? item.cast.map((c: any) => ({ id: c.id, name: c.name, photo: c.photo })) : [],
    episodes: item.episodes
      ? item.episodes.map((ep: any) => {
          const epSlug = ep.slug || `episode-${ep.number}`;
          const epPath = `${item.slug}/${epSlug}`;
          return {
            id: ep.id,
            number: ep.number,
            slug: epSlug,
            title: ep.title,
            thumbnail: ep.thumbnail ? resolvePosterUrl(ep.thumbnail, epPath) : posterUrl,
            duration: ep.duration,
            synopsis: ep.synopsis,
            videoUrl: resolveVideoUrl(ep.videoUrl, epPath),
          };
        })
      : [],
  };
}

// ==========================================
// UNCACHED INTERNAL QUERIES
// ==========================================

async function _rawGetAllContents(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getAllContents failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS;
}

async function _rawGetContentBySlug(slug: string): Promise<Content | null> {
  try {
    const item = await prisma.content.findUnique({
      where: { slug },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
    });
    if (item) {
      return formatContent(item);
    }
  } catch (error) {
    console.warn(`[DB] getContentBySlug("${slug}") failed, falling back to mock:`, error);
  }
  const fallback = MOCK_CONTENTS.find((c) => c.slug === slug);
  return fallback || null;
}

async function _rawGetDramaList(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: { type: "tv-series" },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getDramaList failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.filter((c) => c.type === "tv-series");
}

async function _rawGetFilmList(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: { type: "film" },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getFilmList failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.filter((c) => c.type === "film");
}

async function _rawGetTrendingList(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: { isTrending: true },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getTrendingList failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.filter((c) => c.isTrending);
}

async function _rawGetNewEpisodesList(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: { hasNewEpisode: true },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getNewEpisodesList failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.filter((c) => c.hasNewEpisode);
}

async function _rawGetPilihanList(): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: { isPilihan: true },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getPilihanList failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.filter((c) => c.isPilihan);
}

async function _rawGetFeaturedContent(): Promise<Content | null> {
  try {
    const item = await prisma.content.findFirst({
      where: { isFeatured: true },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
    });
    if (item) {
      return formatContent(item);
    }

    const first = await prisma.content.findFirst({
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (first) {
      return formatContent(first);
    }
  } catch (error) {
    console.warn("[DB] getFeaturedContent failed, falling back to mock data:", error);
  }
  return MOCK_CONTENTS.find((c) => c.isFeatured) || MOCK_CONTENTS[0] || null;
}

async function _rawSearchContents(query: string): Promise<Content[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const list = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { synopsis: { contains: q, mode: "insensitive" } },
          { director: { contains: q, mode: "insensitive" } },
          { country: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (list) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn(`[DB] searchContents("${q}") failed, falling back to mock search:`, error);
  }

  const lower = q.toLowerCase();
  return MOCK_CONTENTS.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.synopsis.toLowerCase().includes(lower) ||
      c.director.toLowerCase().includes(lower) ||
      c.country.toLowerCase().includes(lower)
  );
}

async function _rawGetRelatedContents(content: Content): Promise<Content[]> {
  try {
    const list = await prisma.content.findMany({
      where: {
        type: content.type,
        NOT: { id: content.id },
      },
      include: {
        episodes: { orderBy: { number: "asc" } },
        cast: true,
      },
      take: 10,
    });
    if (list && list.length > 0) {
      return list.map(formatContent);
    }
  } catch (error) {
    console.warn("[DB] getRelatedContents failed, falling back to mock:", error);
  }

  return MOCK_CONTENTS.filter((c) => c.id !== content.id && c.type === content.type);
}

// ==========================================
// CACHED DATA LAYER (unstable_cache with tags)
// ==========================================

export const getAllContents = unstable_cache(
  _rawGetAllContents,
  ["all-contents"],
  { revalidate: 86400, tags: ["contents"] }
);

export const getContentBySlug = (slug: string) =>
  unstable_cache(
    () => _rawGetContentBySlug(slug),
    [`content-by-slug-${slug}`],
    { revalidate: 86400 * 30, tags: ["contents", `content:${slug}`] }
  )();

export const getDramaList = unstable_cache(
  _rawGetDramaList,
  ["drama-list"],
  { revalidate: 86400, tags: ["contents", "list:drama"] }
);

export const getFilmList = unstable_cache(
  _rawGetFilmList,
  ["film-list"],
  { revalidate: 86400, tags: ["contents", "list:film"] }
);

export const getTrendingList = unstable_cache(
  _rawGetTrendingList,
  ["trending-list"],
  { revalidate: 86400, tags: ["contents", "list:trending"] }
);

export const getNewEpisodesList = unstable_cache(
  _rawGetNewEpisodesList,
  ["new-episodes-list"],
  { revalidate: 86400, tags: ["contents", "list:new-episodes"] }
);

export const getPilihanList = unstable_cache(
  _rawGetPilihanList,
  ["pilihan-list"],
  { revalidate: 86400, tags: ["contents", "list:pilihan"] }
);

export const getFeaturedContent = unstable_cache(
  _rawGetFeaturedContent,
  ["featured-content"],
  { revalidate: 86400, tags: ["contents", "featured"] }
);

export const searchContents = (query: string) =>
  unstable_cache(
    () => _rawSearchContents(query),
    [`search-contents-${query.toLowerCase().trim()}`],
    { revalidate: 300, tags: ["search"] }
  )();

export const getRelatedContents = (content: Content) =>
  unstable_cache(
    () => _rawGetRelatedContents(content),
    [`related-contents-${content.id}`],
    { revalidate: 86400 * 7, tags: ["contents", `content:${content.slug}`] }
  )();

export function getEpisodeBySlug(content: Content, episodeSlug: string): Episode | undefined {
  if (!content.episodes) return undefined;
  return content.episodes.find((ep) => ep.slug === episodeSlug);
}

export interface AdminStats {
  totalContents: number;
  totalDramas: number;
  totalFilms: number;
  totalEpisodes: number;
  totalTrending: number;
  totalFeatured: number;
  totalPilihan: number;
  recentContents: Content[];
  popularContents: Content[];
}

/**
 * Fetch realtime statistics for the admin dashboard (uncached or short-lived)
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [
      totalContents,
      totalDramas,
      totalFilms,
      totalEpisodes,
      totalTrending,
      totalFeatured,
      totalPilihan,
      recentItems,
      popularItems,
    ] = await Promise.all([
      prisma.content.count(),
      prisma.content.count({ where: { type: "tv-series" } }),
      prisma.content.count({ where: { type: "film" } }),
      prisma.episode.count(),
      prisma.content.count({ where: { isTrending: true } }),
      prisma.content.count({ where: { isFeatured: true } }),
      prisma.content.count({ where: { isPilihan: true } }),
      prisma.content.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { episodes: true, cast: true },
      }),
      prisma.content.findMany({
        where: { OR: [{ isTrending: true }, { isPilihan: true }] },
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { episodes: true, cast: true },
      }),
    ]);

    return {
      totalContents,
      totalDramas,
      totalFilms,
      totalEpisodes,
      totalTrending,
      totalFeatured,
      totalPilihan,
      recentContents: recentItems.map(formatContent),
      popularContents: popularItems.map(formatContent),
    };
  } catch (error) {
    console.warn("[DB] getAdminStats failed, calculating fallback from mock:", error);
    const mockDramas = MOCK_CONTENTS.filter((c) => c.type === "tv-series");
    const mockFilms = MOCK_CONTENTS.filter((c) => c.type === "film");
    const totalEpisodes = MOCK_CONTENTS.reduce(
      (sum, c) => sum + (c.episodes?.length || c.totalEpisodes || 0),
      0
    );

    return {
      totalContents: MOCK_CONTENTS.length,
      totalDramas: mockDramas.length,
      totalFilms: mockFilms.length,
      totalEpisodes,
      totalTrending: MOCK_CONTENTS.filter((c) => c.isTrending).length,
      totalFeatured: MOCK_CONTENTS.filter((c) => c.isFeatured).length,
      totalPilihan: MOCK_CONTENTS.filter((c) => c.isPilihan).length,
      recentContents: MOCK_CONTENTS.slice(0, 8),
      popularContents: MOCK_CONTENTS.filter((c) => c.isTrending || c.isPilihan).slice(0, 6),
    };
  }
}
