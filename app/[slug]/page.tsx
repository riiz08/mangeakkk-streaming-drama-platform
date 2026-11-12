import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetailView from "@/components/detail/ContentDetailView";
import { getContentBySlug, getRelatedContents } from "@/lib/data/db";
import Script from "next/script";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 2592000; // Revalidate setiap 30 hari (metadata konten jarang berubah, on-demand revalidation via server actions)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    return {
      title: "Konten Tidak Ditemukan — Mangeakkk",
    };
  }

  const typeLabel = content.type === "tv-series" ? "Drama Sub Indo" : "Film Bioskop";

  return {
    title: `${content.title} (${content.year}) — Nonton ${typeLabel} | Mangeakkk`,
    description: content.synopsis,
    openGraph: {
      title: `${content.title} — Mangeakkk`,
      description: content.synopsis,
      images: [{ url: content.poster }],
    },
  };
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const related = await getRelatedContents(content);

  return (
    <>
      <ContentDetailView content={content} related={related} />
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="309368"
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </>
  )
}
