import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetailView from "@/components/detail/ContentDetailView";
import { getContentBySlug, getAllContents } from "@/lib/data/mock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);

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

export async function generateStaticParams() {
  const allContents = getAllContents();
  return allContents.map((c) => ({
    slug: c.slug,
  }));
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  return <ContentDetailView content={content} />;
}
