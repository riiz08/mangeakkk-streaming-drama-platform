import { MetadataRoute } from "next";
import { getAllContents, getDramaList } from "@/lib/data/mock";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mangeakkk.vercel.app";
  const allContents = getAllContents();
  const dramas = getDramaList();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/drama`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/film`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Content detail routes (/[slug])
  const contentRoutes: MetadataRoute.Sitemap = allContents.map((content) => ({
    url: `${baseUrl}/${content.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Drama episode routes (/[slug]/[episode])
  const episodeRoutes: MetadataRoute.Sitemap = [];
  for (const drama of dramas) {
    if (drama.episodes) {
      for (const ep of drama.episodes) {
        episodeRoutes.push({
          url: `${baseUrl}/${drama.slug}/${ep.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  return [...staticRoutes, ...contentRoutes, ...episodeRoutes];
}
