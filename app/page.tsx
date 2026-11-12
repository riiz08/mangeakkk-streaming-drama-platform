import React from "react";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContentRow from "@/components/ui/ContentRow";
import AdBanner from "@/components/ads/AdBanner";
import AdSlot from "@/components/ads/AdSlot";
import AdNativeBanner from "@/components/ads/AdNativeBanner";
import AdGridBlock from "@/components/ads/AdGridBlock";
import {
  getFeaturedContent,
  getTrendingList,
  getDramaList,
  getFilmList,
} from "@/lib/data/db";
import { Tv, Film, Sparkles } from "lucide-react";

export const revalidate = 86400; // Revalidate setiap 24 jam (1 hari), on-demand revalidation via server actions

export default async function HomePage() {
  const featured = await getFeaturedContent();
  const trending = await getTrendingList();
  const dramas = await getDramaList();
  const films = await getFilmList();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Top Ad Grid Block (8 iklan, 2 kolom desktop / 1 kolom mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <AdGridBlock />
      </div>

      {/* 2. Hero Section */}
      {featured && <HeroSection content={featured} />}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-12">
        {/* 3. Trending Section */}
        <ContentRow
          title="Sedang Trending 🔥"
          subtitle="Tontonan paling ramai dibicarakan minggu ini"
          items={trending}
          viewAllHref="/drama"
        />

        {/* Ads: Native Banner 4:1 #1 di antara row konten 1 dan 2 */}
        <AdNativeBanner className="my-6" />

        {/* 4. Drama Terbaru */}
        <ContentRow
          title="Drama & TV Series Terbaru"
          subtitle="Episode terbaru dari serial drama pilihan"
          items={dramas}
          viewAllHref="/drama"
        />

        {/* Ads: Banner 300x250 Inline #1 (Desktop Only) */}
        <div className="hidden md:flex justify-center my-4">
          <AdSlot type="300x250" slotName="Home Inline 300x250 #1" />
        </div>

        {/* Ads: Native Banner 4:1 #2 di antara row konten 2 dan 3 */}
        <AdNativeBanner className="my-6" />

        {/* 5. Film Terbaru */}
        <ContentRow
          title="Film Pilihan ⭐"
          subtitle="Koleksi film bioskop blockbuster dan terpopuler"
          items={films}
          viewAllHref="/film"
        />

        {/* Ads: Banner 300x250 Inline #2 (Desktop Only) */}
        <div className="hidden md:flex justify-center my-4">
          <AdSlot type="300x250" slotName="Home Inline 300x250 #2" />
        </div>

        {/* 6. Tipe Tayangan Section */}
        <section className="bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/90 border border-gray-800/80 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pilih Tipe Tontonan
            </h2>
          </div>
          <p className="text-sm text-gray-400 mb-6 max-w-xl">
            Pilih apakah Anda ingin menonton serial drama bersambung atau film bioskop sekali tamat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/drama"
              className="group p-6 rounded-2xl bg-gray-950/70 border border-gray-800 hover:border-brand-500/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30 group-hover:scale-110 transition-transform">
                  <Tv className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    TV Series & Drama
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {dramas.length > 0 ? `${dramas.length} Judul Serial dengan episode lengkap` : "Belum Tersedia"}
                  </p>
                </div>
              </div>
              <span className="text-brand-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <Link
              href="/film"
              className="group p-6 rounded-2xl bg-gray-950/70 border border-gray-800 hover:border-brand-500/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Film className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    Film Bioskop
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {films.length > 0 ? `${films.length} Judul Film berkualitas HD` : "Belum Tersedia"}
                  </p>
                </div>
              </div>
              <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Ads: Banner 468x60 (Desktop) / 320x50 (Mobile) di antara section */}
        <AdBanner slotName="Home In-Feed Mid Banner" variant="compact" className="my-6" />
      </div>
    </div>
  );
}
