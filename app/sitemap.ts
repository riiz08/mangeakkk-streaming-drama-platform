import { MetadataRoute } from "next";
import { getAllContents, GENRES } from "@/lib/data/mock";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mangeakkk.vercel.app";
  const allContents = getAllContents();

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
    {
      url: `${baseUrl}/genre`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Content routes
  const contentRoutes: MetadataRoute.Sitemap = allContents.map((content) => ({
    url: `${baseUrl}/${content.type}/${content.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Watch routes
  const watchRoutes: MetadataRoute.Sitemap = allContents.map((content) => ({
    url: `${baseUrl}/watch/${content.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Genre routes
  const genreRoutes: MetadataRoute.Sitemap = GENRES.map((g) => ({
    url: `${baseUrl}/genre/${g.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...contentRoutes, ...watchRoutes, ...genreRoutes];
}
