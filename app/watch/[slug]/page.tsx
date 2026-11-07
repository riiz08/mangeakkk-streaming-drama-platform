import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchView from "@/components/player/WatchView";
import { getContentBySlug, getAllContents } from "@/lib/data/mock";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { ep } = await searchParams;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: "Tontonan Tidak Ditemukan — Mangeakkk",
    };
  }

  const epTitle = content.type === "drama" && ep ? ` - Episode ${ep}` : "";

  return {
    title: `Nonton ${content.title}${epTitle} Sub Indo — Mangeakkk`,
    description: `Nonton streaming online ${content.title}${epTitle} subtitle Indonesia resolusi HD gratis di Mangeakkk.`,
  };
}

export async function generateStaticParams() {
  const all = getAllContents();
  return all.map((c) => ({
    slug: c.slug,
  }));
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ep } = await searchParams;
  const content = getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const episodeNumber = ep ? parseInt(ep, 10) : 1;

  return <WatchView content={content} initialEpisode={isNaN(episodeNumber) ? 1 : episodeNumber} />;
}
