"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MOCK_CONTENTS } from "@/lib/data/mock";

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
    const defaultPoster =
      data.poster?.trim() ||
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80";
    const defaultBackdrop =
      data.backdrop?.trim() ||
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1600&auto=format&fit=crop&q=80";

    const content = await prisma.content.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        type: data.type,
        poster: defaultPoster,
        backdrop: defaultBackdrop,
        synopsis: data.synopsis.trim() || `Sinopsis untuk ${data.title}.`,
        year: Number(data.year) || new Date().getFullYear(),
        country: data.country.trim() || "Korea Selatan",
        director: data.director?.trim() || "Sutradara Pilihan",
        duration: data.duration.trim() || (data.type === "film" ? "120 min" : "60 min/ep"),
        totalEpisodes: data.type === "tv-series" ? data.episodes?.length || 0 : null,
        videoUrl: data.type === "film" ? data.videoUrl?.trim() || null : null,
        isTrending: Boolean(data.isTrending),
        hasNewEpisode: Boolean(data.hasNewEpisode),
        isPilihan: Boolean(data.isPilihan),
        isFeatured: Boolean(data.isFeatured),
        cast: {
          create:
            data.cast && data.cast.length > 0
              ? data.cast.map((c) => ({
                  name: c.name,
                  photo: c.photo || defaultPoster,
                }))
              : [
                  {
                    name: "Pemeran Utama",
                    photo: defaultPoster,
                  },
                ],
        },
        episodes:
          data.type === "tv-series" && data.episodes && data.episodes.length > 0
            ? {
                create: data.episodes.map((ep) => ({
                  number: ep.number,
                  slug: ep.slug || `episode-${ep.number}`,
                  title: ep.title || `Episode ${ep.number}`,
                  thumbnail: ep.thumbnail || defaultBackdrop,
                  duration: ep.duration || "60m",
                  synopsis: ep.synopsis || `Episode ${ep.number} serial ${data.title}.`,
                  videoUrl:
                    ep.videoUrl ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath(`/${content.slug}`);

    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error creating content in DB:", error);
    return { success: false, error: error.message || "Gagal membuat konten di database." };
  }
}

export async function updateContentAction(id: string, data: ContentFormData) {
  try {
    const defaultPoster =
      data.poster?.trim() ||
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80";
    const defaultBackdrop =
      data.backdrop?.trim() ||
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1600&auto=format&fit=crop&q=80";

    // Delete existing episodes and re-create to maintain sync
    if (data.type === "tv-series") {
      await prisma.episode.deleteMany({
        where: { contentId: id },
      });
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        type: data.type,
        poster: defaultPoster,
        backdrop: defaultBackdrop,
        synopsis: data.synopsis.trim() || `Sinopsis untuk ${data.title}.`,
        year: Number(data.year) || new Date().getFullYear(),
        country: data.country.trim() || "Korea Selatan",
        director: data.director?.trim() || "Sutradara Pilihan",
        duration: data.duration.trim() || (data.type === "film" ? "120 min" : "60 min/ep"),
        totalEpisodes: data.type === "tv-series" ? data.episodes?.length || 0 : null,
        videoUrl: data.type === "film" ? data.videoUrl?.trim() || null : null,
        isTrending: Boolean(data.isTrending),
        hasNewEpisode: Boolean(data.hasNewEpisode),
        isPilihan: Boolean(data.isPilihan),
        isFeatured: Boolean(data.isFeatured),
        episodes:
          data.type === "tv-series" && data.episodes && data.episodes.length > 0
            ? {
                create: data.episodes.map((ep) => ({
                  number: ep.number,
                  slug: ep.slug || `episode-${ep.number}`,
                  title: ep.title || `Episode ${ep.number}`,
                  thumbnail: ep.thumbnail || defaultBackdrop,
                  duration: ep.duration || "60m",
                  synopsis: ep.synopsis || `Episode ${ep.number} serial ${data.title}.`,
                  videoUrl:
                    ep.videoUrl ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath(`/${content.slug}`);

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

    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/search");
    revalidatePath("/admin");

    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error deleting content from DB:", error);
    return { success: false, error: error.message || "Gagal menghapus konten dari database." };
  }
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

    revalidatePath("/");
    revalidatePath("/drama");
    revalidatePath("/film");
    revalidatePath("/admin");

    return { success: true, message: "Data bawaan berhasil disinkronkan ke database!" };
  } catch (error: any) {
    console.error("Error seeding default contents:", error);
    return { success: false, error: error.message || "Gagal mengisi data bawaan." };
  }
}

