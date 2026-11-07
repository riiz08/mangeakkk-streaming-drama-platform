import React from "react";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContentRow from "@/components/ui/ContentRow";
import GenreBadge from "@/components/ui/GenreBadge";
import {
  getFeaturedContent,
  getTrendingList,
  getDramaList,
  getFilmList,
  GENRES,
} from "@/lib/data/mock";
import { Sparkles, TrendingUp, Tv, Film, Compass } from "lucide-react";

export default function HomePage() {
  const featured = getFeaturedContent();
  const trending = getTrendingList();
  const dramas = getDramaList();
  const films = getFilmList();

  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <HeroSection content={featured} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {/* 2. Trending Section */}
        <ContentRow
          title="Sedang Trending"
          subtitle="Tontonan paling ramai dibicarakan minggu ini"
          items={trending}
          viewAllHref="/drama"
        />

        {/* 3. Drama Terbaru */}
        <ContentRow
          title="Drama Terbaru"
          subtitle="Episode terbaru dari drama Korea dan Asia pilihan"
          items={dramas}
          viewAllHref="/drama"
        />

        {/* 4. Film Terbaru */}
        <ContentRow
          title="Film Pilihan"
          subtitle="Koleksi film blockbuster dan peraih penghargaan"
          items={films}
          viewAllHref="/film"
        />

        {/* 5. Genre Populer */}
        <section className="bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-gray-900/90 border border-gray-800/80 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Eksplorasi Berdasarkan Genre
            </h2>
          </div>
          <p className="text-sm text-gray-400 mb-6 max-w-xl">
            Temukan tontonan seru berdasarkan suasana hati dan genre favoritmu.
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {GENRES.map((genre) => (
              <GenreBadge key={genre} genre={genre} size="md" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
