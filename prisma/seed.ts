import { PrismaClient } from "@prisma/client";
import { MOCK_CONTENTS } from "../lib/data/mock";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with initial contents...");

  for (const item of MOCK_CONTENTS) {
    const existing = await prisma.content.findUnique({
      where: { slug: item.slug },
    });

    if (existing) {
      await prisma.content.update({
        where: { id: existing.id },
        data: {
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
          isTrending: item.isTrending ?? false,
          hasNewEpisode: item.hasNewEpisode ?? false,
          isPilihan: item.isPilihan ?? false,
          isFeatured: item.isFeatured ?? false,
          releaseDate: item.releaseDate,
        },
      });
      console.log(`Updated content: ${item.title}`);
    } else {
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
          isTrending: item.isTrending ?? false,
          hasNewEpisode: item.hasNewEpisode ?? false,
          isPilihan: item.isPilihan ?? false,
          isFeatured: item.isFeatured ?? false,
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
      console.log(`Created content: ${item.title}`);
    }
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

