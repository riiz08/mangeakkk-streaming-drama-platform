import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchView from "@/components/player/WatchView";
import { getContentBySlug, getEpisodeBySlug } from "@/lib/data/db";

interface PageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export const revalidate = 86400; // Revalidate setiap 24 jam (file HLS tidak berubah setelah upload)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, episode } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    return {
      title: "Episode Tidak Ditemukan — Mangeakkk",
    };
  }

  const ep = getEpisodeBySlug(content, episode);
  const epTitle = ep ? ` - ${ep.title}` : ` - ${episode}`;

  return {
    title: `Nonton ${content.title}${epTitle} Sub Indo — Mangeakkk`,
    description: ep?.synopsis || `Nonton serial drama ${content.title} ${episode} subtitle Indonesia di Mangeakkk.`,
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

  if (!content || content.type !== "tv-series") {
    notFound();
  }

  const ep = getEpisodeBySlug(content, episode);
  if (!ep) {
    notFound();
  }

  return <WatchView content={content} currentEpisodeSlug={episode} />;
}
