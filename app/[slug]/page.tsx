import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetailView from "@/components/detail/ContentDetailView";
import { getContentBySlug, getRelatedContents } from "@/lib/data/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // Revalidate setiap 24 jam (metadata konten jarang berubah)

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

  return <ContentDetailView content={content} related={related} />;
}
