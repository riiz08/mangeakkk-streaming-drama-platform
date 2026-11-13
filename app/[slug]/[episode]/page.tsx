import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchView from "@/components/player/WatchView";
import {
  getContentBySlug,
  getEpisodeBySlug,
  getRelatedContents,
} from "@/lib/data/db";
import Script from "next/script";

interface PageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export const revalidate = 2592000; // Revalidate setiap 30 hari (file HLS tidak berubah setelah upload, on-demand revalidation via server actions)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, episode } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    return {
      title: "Halaman Tidak Ditemukan — Mangeakkk",
    };
  }

  if (content.type === "film") {
    return {
      title: `Nonton Film ${content.title} Sub Indo — Mangeakkk`,
      description:
        content.synopsis ||
        `Nonton film bioskop ${content.title} subtitle Indonesia kualitas HD di Mangeakkk.`,
      openGraph: {
        title: `${content.title} — Mangeakkk`,
        description: content.synopsis,
        images: [{ url: content.backdrop || content.poster }],
      },
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

export default async function WatchPage({ params }: PageProps) {
  const { slug, episode } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  // Jika tipe FILM
  if (content.type === "film") {
    const related = await getRelatedContents(content);
    return (
      <>
        <WatchView content={content} related={related} />
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="309368"
          data-cfasync="false"
          strategy="afterInteractive"
        />
      </>
    );
  }

  // Jika tipe TV-SERIES
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
