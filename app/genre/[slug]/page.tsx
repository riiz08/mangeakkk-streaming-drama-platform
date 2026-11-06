import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentCard from "@/components/ui/ContentCard";
import { GENRES, getContentsByGenre } from "@/lib/data/mock";
import { ArrowLeft, Compass } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const matchedGenre = GENRES.find(
    (g) => g.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!matchedGenre) {
    return {
      title: "Genre Tidak Ditemukan — Mangeakkk",
    };
  }

  return {
    title: `Nonton Drama & Film Genre ${matchedGenre} — Mangeakkk`,
    description: `Koleksi drama dan film terbaik dengan genre ${matchedGenre} subtitle Indonesia di Mangeakkk.`,
  };
}

export async function generateStaticParams() {
  return GENRES.map((g) => ({
    slug: g.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function GenreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const matchedGenre = GENRES.find(
    (g) => g.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!matchedGenre) {
    notFound();
  }

  const items = getContentsByGenre(matchedGenre);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/genre"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Semua Genre</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Genre: {matchedGenre}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-400">
          Menampilkan {items.length} drama dan film dengan genre {matchedGenre}.
        </p>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-900/30 rounded-2xl border border-gray-800">
          <p className="text-gray-400">Belum ada tayangan untuk genre {matchedGenre}.</p>
        </div>
      )}
    </div>
  );
}
