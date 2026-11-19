import { PrismaClient } from "@prisma/client";
import { resolvePosterUrl, resolveVideoUrl } from "../lib/signed-url";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Memulai Migrasi URL Media di Database ===");

  // 1. Migrasi Content (Film & TV Series)
  const contents = await prisma.content.findMany();
  let updatedContentsCount = 0;

  for (const item of contents) {
    let needsUpdate = false;
    let newPoster = item.poster;
    let newBackdrop = item.backdrop;
    let newVideoUrl = item.videoUrl;

    if (
      item.poster &&
      (item.poster.includes("hls-worker") || item.poster.includes("workers.dev"))
    ) {
      newPoster = resolvePosterUrl(item.poster, item.slug);
      needsUpdate = true;
    }

    if (
      item.backdrop &&
      (item.backdrop.includes("hls-worker") || item.backdrop.includes("workers.dev"))
    ) {
      newBackdrop = resolvePosterUrl(item.backdrop, item.slug);
      needsUpdate = true;
    }

    if (
      item.videoUrl &&
      (item.videoUrl.includes("hls-worker") || item.videoUrl.includes("workers.dev"))
    ) {
      newVideoUrl = resolveVideoUrl(item.videoUrl, item.slug);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.content.update({
        where: { id: item.id },
        data: {
          poster: newPoster,
          backdrop: newBackdrop,
          videoUrl: newVideoUrl,
        },
      });
      updatedContentsCount++;
      console.log(`[Content] Updated "${item.title}" (${item.slug})`);
    }
  }

  // 2. Migrasi Episodes
  const episodes = await prisma.episode.findMany({
    include: { content: true },
  });
  let updatedEpisodesCount = 0;

  for (const ep of episodes) {
    let needsUpdate = false;
    let newThumbnail = ep.thumbnail;
    let newVideoUrl = ep.videoUrl;
    const fallbackEpisodePath = `${ep.content.slug}/${ep.slug || `episode-${ep.number}`}`;

    if (
      ep.thumbnail &&
      (ep.thumbnail.includes("hls-worker") || ep.thumbnail.includes("workers.dev"))
    ) {
      newThumbnail = resolvePosterUrl(ep.thumbnail, fallbackEpisodePath);
      needsUpdate = true;
    }

    if (
      ep.videoUrl &&
      (ep.videoUrl.includes("hls-worker") || ep.videoUrl.includes("workers.dev"))
    ) {
      newVideoUrl = resolveVideoUrl(ep.videoUrl, fallbackEpisodePath);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.episode.update({
        where: { id: ep.id },
        data: {
          thumbnail: newThumbnail,
          videoUrl: newVideoUrl,
        },
      });
      updatedEpisodesCount++;
      console.log(
        `[Episode] Updated "${ep.title}" (${ep.content.slug} - ep ${ep.number})`
      );
    }
  }

  console.log("=== Selesai Migrasi ===");
  console.log(`Total Content diupdate: ${updatedContentsCount}`);
  console.log(`Total Episode diupdate: ${updatedEpisodesCount}`);
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan migrasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
