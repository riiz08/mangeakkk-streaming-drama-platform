"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MOCK_CONTENTS } from "@/lib/data/mock";
import { getSignedPosterUrl, getSignedVideoUrl } from "@/lib/signed-url";
import { purgeCloudflare } from "@/lib/cache/purge";

export interface ContentFormData {
  title: string;
  slug: string;
  type: "tv-series" | "film";
  poster?: string;
  backdrop?: string;
  synopsis: string;
  year: number;
  country: string;
  director?: string;
  duration: string;
  videoUrl?: string;
  isTrending?: boolean;
  hasNewEpisode?: boolean;
  isPilihan?: boolean;
  isFeatured?: boolean;
  episodes?: {
    number: number;
    slug: string;
    title: string;
    thumbnail?: string;
    duration?: string;
    synopsis?: string;
    videoUrl: string;
  }[];
  cast?: {
    name: string;
    photo?: string;
  }[];
}

export async function createContentAction(data: ContentFormData) {
  try {
    const cleanContentSlug = data.slug.trim();
    const defaultPoster =
      data.poster?.trim() || getSignedPosterUrl(cleanContentSlug, "poster.jpg");
    const defaultBackdrop =
      data.backdrop?.trim() || defaultPoster;
    const filmVideoUrl =
      data.type === "film"
        ? data.videoUrl?.trim() || getSignedVideoUrl(cleanContentSlug, "index.m3u8")
        : null;

    const content = await prisma.content.create({
      data: {
        title: data.title.trim(),
        slug: cleanContentSlug,
        type: data.type,
        poster: defaultPoster,
        backdrop: defaultBackdrop,
        synopsis: data.synopsis.trim() || `Sinopsis untuk ${data.title}.`,
        year: Number(data.year) || new Date().getFullYear(),
        country: data.country.trim() || "Korea Selatan",
        director: data.director?.trim() || "Sutradara Pilihan",
        duration: data.duration.trim() || (data.type === "film" ? "120 min" : "60 min/ep"),
        totalEpisodes: data.type === "tv-series" ? data.episodes?.length || 0 : null,
        videoUrl: filmVideoUrl,
        isTrending: Boolean(data.isTrending),
        hasNewEpisode: Boolean(data.hasNewEpisode),
        isPilihan: Boolean(data.isPilihan),
        isFeatured: Boolean(data.isFeatured),
        cast: {
          create:
            data.cast && data.cast.length > 0
              ? data.cast.map((c) => ({
                name: c.name,
                photo: c.photo || "/images/avatar.jpg",
              }))
              : [
                {
                  name: "Pemeran Utama",
                  photo: "/images/avatar.jpg",
                },
              ],
        },
        episodes:
          data.type === "tv-series" && data.episodes && data.episodes.length > 0
            ? {
              create: data.episodes.map((ep) => {
                const epSlug = ep.slug || `episode-${ep.number}`;
                const epPath = `${cleanContentSlug}/${epSlug}`;
                return {
                  number: ep.number,
                  slug: epSlug,
                  title: ep.title || `Episode ${ep.number}`,
                  thumbnail: ep.thumbnail || defaultPoster,
                  duration: ep.duration || "60m",
                  synopsis: ep.synopsis || `Episode ${ep.number} serial ${data.title}.`,
                  videoUrl:
                    ep.videoUrl?.trim() || getSignedVideoUrl(epPath, "index.m3u8"),
                };
              }),
            }
            : undefined,
      },
    });

    // 1. Revalidasi data cache tags (lapisan Next.js unstable_cache)
    revalidateTag("contents");
    revalidateTag(`content:${content.slug}`);
    revalidateTag("featured");
    if (data.type === "tv-series") revalidateTag("list:drama");
    if (data.type === "film") revalidateTag("list:film");
    if (data.isTrending) revalidateTag("list:trending");

    // 2. Revalidasi route paths (lapisan Next.js ISR)
    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath("/api/contents");
    revalidatePath(`/api/contents/${content.slug}`);
    revalidatePath(`/${content.slug}`);

    const purgeUrls = [
      "/",
      "/drama",
      "/film",
      "/api/contents",
      `/api/contents/${content.slug}`,
      `/${content.slug}`,
    ];

    if (data.type === "film") {
      revalidatePath(`/${content.slug}`);
    } else if (data.episodes) {
      for (const ep of data.episodes) {
        const epPath = `/${content.slug}/${ep.slug || `episode-${ep.number}`}`;
        revalidatePath(epPath);
        purgeUrls.push(epPath);
      }
    }

    // 3. Purge Cloudflare Edge Cache otomatis
    purgeCloudflare(purgeUrls).catch((e) => console.warn("Cloudflare purge error:", e));

    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error creating content in DB:", error);
    return { success: false, error: error.message || "Gagal membuat konten di database." };
  }
}

export async function updateContentAction(id: string, data: ContentFormData) {
  try {
    const cleanContentSlug = data.slug.trim();
    const defaultPoster =
      data.poster?.trim() || getSignedPosterUrl(cleanContentSlug, "poster.jpg");
    const defaultBackdrop =
      data.backdrop?.trim() || defaultPoster;
    const filmVideoUrl =
      data.type === "film"
        ? data.videoUrl?.trim() || getSignedVideoUrl(cleanContentSlug, "index.m3u8")
        : null;

    // Delete existing episodes and re-create to maintain sync
    if (data.type === "tv-series") {
      await prisma.episode.deleteMany({
        where: { contentId: id },
      });
    }

    // Sync cast if provided
    if (data.cast && data.cast.length > 0) {
      await prisma.castMember.deleteMany({
        where: { contentId: id },
      });
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug: cleanContentSlug,
        type: data.type,
        poster: defaultPoster,
        backdrop: defaultBackdrop,
        synopsis: data.synopsis.trim() || `Sinopsis untuk ${data.title}.`,
        year: Number(data.year) || new Date().getFullYear(),
        country: data.country.trim() || "Korea Selatan",
        director: data.director?.trim() || "Sutradara Pilihan",
        duration: data.duration.trim() || (data.type === "film" ? "120 min" : "60 min/ep"),
        totalEpisodes: data.type === "tv-series" ? data.episodes?.length || 0 : null,
        videoUrl: filmVideoUrl,
        isTrending: Boolean(data.isTrending),
        hasNewEpisode: Boolean(data.hasNewEpisode),
        isPilihan: Boolean(data.isPilihan),
        isFeatured: Boolean(data.isFeatured),
        cast:
          data.cast && data.cast.length > 0
            ? {
              create: data.cast.map((c) => ({
                name: c.name,
                photo: c.photo || "/images/avatar.jpg",
              })),
            }
            : undefined,
        episodes:
          data.type === "tv-series" && data.episodes && data.episodes.length > 0
            ? {
              create: data.episodes.map((ep) => {
                const epSlug = ep.slug || `episode-${ep.number}`;
                const epPath = `${cleanContentSlug}/${epSlug}`;
                return {
                  number: ep.number,
                  slug: epSlug,
                  title: ep.title || `Episode ${ep.number}`,
                  thumbnail: ep.thumbnail || defaultPoster,
                  duration: ep.duration || "60m",
                  synopsis: ep.synopsis || `Episode ${ep.number} serial ${data.title}.`,
                  videoUrl:
                    ep.videoUrl?.trim() || getSignedVideoUrl(epPath, "index.m3u8"),
                };
              }),
            }
            : undefined,
      },
    });

    // 1. Revalidasi data cache tags (lapisan Next.js unstable_cache)
    revalidateTag("contents");
    revalidateTag(`content:${content.slug}`);
    revalidateTag("featured");
    if (data.type === "tv-series") revalidateTag("list:drama");
    if (data.type === "film") revalidateTag("list:film");
    if (data.isTrending) revalidateTag("list:trending");

    // 2. Revalidasi route paths (lapisan Next.js ISR)
    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath("/api/contents");
    revalidatePath(`/api/contents/${content.slug}`);
    revalidatePath(`/${content.slug}`);

    const purgeUrls = [
      "/",
      "/drama",
      "/film",
      "/api/contents",
      `/api/contents/${content.slug}`,
      `/${content.slug}`,
    ];

    if (data.type === "film") {
      revalidatePath(`/${content.slug}`);
    } else if (data.episodes) {
      for (const ep of data.episodes) {
        const epPath = `/${content.slug}/${ep.slug || `episode-${ep.number}`}`;
        revalidatePath(epPath);
        purgeUrls.push(epPath);
      }
    }

    // 3. Purge Cloudflare Edge Cache otomatis
    purgeCloudflare(purgeUrls).catch((e) => console.warn("Cloudflare purge error:", e));

    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error updating content in DB:", error);
    return { success: false, error: error.message || "Gagal memperbarui konten di database." };
  }
}

export async function deleteContentAction(id: string) {
  try {
    const content = await prisma.content.delete({
      where: { id },
    });

    // 1. Revalidasi data cache tags
    revalidateTag("contents");
    if (content.slug) {
      revalidateTag(`content:${content.slug}`);
    }

    // 2. Revalidasi paths
    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath("/api/contents");

    const purgeUrls = ["/", "/drama", "/film", "/api/contents"];

    if (content.slug) {
      revalidatePath(`/api/contents/${content.slug}`);
      revalidatePath(`/${content.slug}`);
      purgeUrls.push(`/api/contents/${content.slug}`, `/${content.slug}`);
    }

    // 3. Purge Cloudflare Edge Cache otomatis
    purgeCloudflare(purgeUrls).catch((e) => console.warn("Cloudflare purge error:", e));

    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error deleting content from DB:", error);
    return { success: false, error: error.message || "Gagal menghapus konten dari database." };
  }
}

export async function getAutoGeneratedUrlsAction(
  slug: string,
  type: "tv-series" | "film",
  episodesCount = 1
) {
  const clean = slug.trim();
  if (!clean) {
    return {
      poster: "",
      backdrop: "",
      videoUrl: "",
      episodes: [],
    };
  }

  const poster = getSignedPosterUrl(clean, "poster.jpg");
  const backdrop = poster;
  const videoUrl = type === "film" ? getSignedVideoUrl(clean, "index.m3u8") : "";

  const episodes = [];
  for (let i = 1; i <= Math.max(1, episodesCount); i++) {
    const epSlug = `episode-${i}`;
    episodes.push({
      number: i,
      slug: epSlug,
      title: `Episode ${i}`,
      videoUrl: getSignedVideoUrl(`${clean}/${epSlug}`, "index.m3u8"),
      thumbnail: poster,
    });
  }

  return {
    poster,
    backdrop,
    videoUrl,
    episodes,
  };
}

export async function seedDefaultContentsAction() {
  try {
    for (const item of MOCK_CONTENTS) {
      const existing = await prisma.content.findUnique({
        where: { slug: item.slug },
      });

      if (!existing) {
        await prisma.content.create({
          data: {
            id: item.id,
            slug: item.slug,
            title: item.title,
            type: item.type,
            poster: item.poster,
            backdrop: item.backdrop,
            synopsis: item.synopsis,
            year: item.year,
            country: item.country,
            director: item.director,
            duration: item.duration,
            totalEpisodes: item.totalEpisodes,
            videoUrl: item.videoUrl,
            isTrending: Boolean(item.isTrending),
            hasNewEpisode: Boolean(item.hasNewEpisode),
            isPilihan: Boolean(item.isPilihan),
            isFeatured: Boolean(item.isFeatured),
            releaseDate: item.releaseDate,
            cast: {
              create: (item.cast || []).map((c) => ({
                name: c.name,
                photo: c.photo,
              })),
            },
            episodes: item.episodes
              ? {
                create: item.episodes.map((ep) => ({
                  number: ep.number,
                  slug: ep.slug,
                  title: ep.title,
                  thumbnail: ep.thumbnail,
                  duration: ep.duration,
                  synopsis: ep.synopsis,
                  videoUrl: ep.videoUrl,
                })),
              }
              : undefined,
          },
        });
      }
    }

    revalidateTag("contents");
    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/admin");

    purgeCloudflare(["/", "/drama", "/film", "/api/contents"]).catch((e) =>
      console.warn("Cloudflare purge error:", e)
    );

    return { success: true, message: "Data bawaan berhasil disinkronkan ke database!" };
  } catch (error: any) {
    console.error("Error seeding default contents:", error);
    return { success: false, error: error.message || "Gagal mengisi data bawaan." };
  }
}
