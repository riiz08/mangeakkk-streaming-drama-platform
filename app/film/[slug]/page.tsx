import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetailView from "@/components/detail/ContentDetailView";
import { getContentBySlug, getFilmList } from "@/lib/data/mock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: "Film Tidak Ditemukan — Mangeakkk",
    };
  }

  return {
    title: `${content.title} (${content.year}) — Nonton Film Sub Indo | Mangeakkk`,
    description: content.synopsis,
    openGraph: {
      title: `${content.title} — Mangeakkk`,
      description: content.synopsis,
      images: [{ url: content.poster }],
    },
  };
}

export async function generateStaticParams() {
  const films = getFilmList();
  return films.map((f) => ({
    slug: f.slug,
  }));
}

export default async function FilmDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content || content.type !== "film") {
    notFound();
  }

  return <ContentDetailView content={content} />;
}
