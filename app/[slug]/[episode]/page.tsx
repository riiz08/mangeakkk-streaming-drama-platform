import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchView from "@/components/player/WatchView";
import { getContentBySlug, getEpisodeBySlug, getDramaList } from "@/lib/data/db";
import Script from "next/script";

interface PageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export const revalidate = 2592000; // Revalidate setiap 30 hari
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const dramas = await getDramaList();
    const paramsList: { slug: string; episode: string }[] = [];

    // Pre-render popular dramas' first few episodes
    for (const drama of dramas.slice(0, 10)) {
      if (drama.episodes) {
        for (const ep of drama.episodes.slice(0, 3)) {
          paramsList.push({
            slug: drama.slug,
            episode: ep.slug,
          });
        }
      }
    }
    return paramsList;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, episode } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    return {
      title: "Episode Tidak Ditemukan — Mangeakkk",
    };
  }

  // Jika film, tidak seharusnya mengakses sub-path episode
  if (content.type === "film") {
    return {
      title: `${content.title} — Mangeakkk`,
    };
  }

  const ep = getEpisodeBySlug(content, episode);
  const epTitle = ep ? ` - ${ep.title}` : ` - ${episode}`;

  return {
    title: `Nonton ${content.title}${epTitle} Sub Indo — Mangeakkk`,
    description:
      ep?.synopsis ||
      `Nonton serial drama ${content.title} ${episode} subtitle Indonesia di Mangeakkk.`,
    openGraph: {
      title: `${content.title}${epTitle} — Mangeakkk`,
      description: ep?.synopsis || content.synopsis,
      images: [{ url: ep?.thumbnail || content.backdrop }],
    },
  };
}

export default async function DramaEpisodeWatchPage({ params }: PageProps) {
  const { slug, episode } = await params;
  const content = await getContentBySlug(slug);

  // Jika bukan tv-series atau konten tidak ditemukan, 404 (karena film ditonton di /[slug])
  if (!content || content.type !== "tv-series") {
    notFound();
  }

  const ep = getEpisodeBySlug(content, episode);
  if (!ep) {
    notFound();
  }

  return (
    <>
      <WatchView content={content} currentEpisodeSlug={episode} />
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="309368"
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </>
  );
}
