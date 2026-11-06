import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetailView from "@/components/detail/ContentDetailView";
import { getContentBySlug, getDramaList } from "@/lib/data/mock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: "Drama Tidak Ditemukan — Mangeakkk",
    };
  }

  return {
    title: `${content.title} (${content.year}) — Nonton Drama Sub Indo | Mangeakkk`,
    description: content.synopsis,
    openGraph: {
      title: `${content.title} — Mangeakkk`,
      description: content.synopsis,
      images: [{ url: content.poster }],
    },
  };
}

export async function generateStaticParams() {
  const dramas = getDramaList();
  return dramas.map((d) => ({
    slug: d.slug,
  }));
}

export default async function DramaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content || content.type !== "drama") {
    notFound();
  }

  return <ContentDetailView content={content} />;
}
