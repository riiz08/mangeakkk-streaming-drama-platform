import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mangeakkk.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/search",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

