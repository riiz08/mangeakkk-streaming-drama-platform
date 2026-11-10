import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Play, Calendar, Clock, Globe } from "lucide-react";
import { Content, getRelatedContents } from "@/lib/data/mock";
import BadgeLabel from "@/components/ui/BadgeLabel";
import EpisodeList from "@/components/ui/EpisodeList";
import ContentCard from "@/components/ui/ContentCard";
import VideoPlayer from "@/components/ui/VideoPlayer";
import AdBanner from "@/components/ads/AdBanner";
import AdSlot from "@/components/ads/AdSlot";
import AdGridBlock from "@/components/ads/AdGridBlock";

interface ContentDetailViewProps {
  content: Content;
  related?: Content[];
}

export default function ContentDetailView({ content, related: initialRelated }: ContentDetailViewProps) {
  if (!content) notFound();

  const related = initialRelated || getRelatedContents(content);
  // Drama goes to /[slug]/episode-1, Film plays right here or links
  const firstEpisodeSlug = content.episodes?.[0]?.slug || "episode-1";
  const watchUrl =
    content.type === "tv-series"
      ? `/${content.slug}/${firstEpisodeSlug}`
      : `#player`;

  return (
    <div className="pb-16">
      {/* Top Ad Grid Block (8 iklan, 2 kolom desktop / 1 kolom mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <AdGridBlock />
      </div>

      {/* 1. Backdrop Banner */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] overflow-hidden">
        <Image
          src={content.backdrop}
          alt={content.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
      </div>

      {/* 2. Main Content Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: Poster & Action Button */}
          <div className="w-52 sm:w-64 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 bg-gray-900">
              <Image
                src={content.poster}
                alt={content.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <Link
              href={watchUrl}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all shadow-xl shadow-brand-600/30 hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>
                {content.type === "tv-series" ? "Mulai Nonton (Ep 1)" : "Tonton Film Sekarang"}
              </span>
            </Link>

            {/* Ads: 160x600 Skyscraper sponsor di bawah poster */}
            <div className="hidden md:flex justify-center mt-6">
              <AdSlot type="160x600" slotName="Detail Skyscraper Sponsor" />
            </div>
          </div>

          {/* Right: Info Details */}
          <div className="flex-1 space-y-6">
            <div>
              {/* Type & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded bg-brand-600/20 text-brand-500 border border-brand-500/30">
                  {content.type === "tv-series" ? "TV Series" : "Film Bioskop"}
                </span>

                {content.isTrending && <BadgeLabel type="hot" size="md" />}
                {content.hasNewEpisode && <BadgeLabel type="new" size="md" />}
                {content.isPilihan && <BadgeLabel type="pilihan" size="md" />}
                {content.isFeatured && <BadgeLabel type="featured" size="md" />}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {content.title}
              </h1>

              {/* Quick specs */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300 mt-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {content.year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {content.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  {content.country}
                </span>
                {content.totalEpisodes && (
                  <>
                    <span>•</span>
                    <span className="text-brand-400 font-semibold">
                      {content.totalEpisodes} Episode
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Sinopsis</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {content.synopsis}
              </p>
            </div>

            {/* Director & Cast */}
            <div className="pt-2 border-t border-gray-800/80 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Sutradara
                </span>
                <span className="text-sm text-gray-200 font-medium">{content.director}</span>
              </div>

              {content.cast && content.cast.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-3">
                    Pemeran Utama
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {content.cast.map((actor) => (
                      <div
                        key={actor.name}
                        className="flex items-center gap-2.5 bg-gray-900/60 border border-gray-800 rounded-full pr-4 p-1"
                      >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                          <Image
                            src={actor.photo}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-200">{actor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ads: 1x AdBanner (468x60 Desktop / 320x50 Mobile) di bawah info sinopsis */}
        <AdBanner variant="compact" slotName="Detail Info Sponsor" className="mt-8 mb-4" />

        {/* 3. Khusus FILM: Embed Video Player Langsung di Halaman Ini */}
        {content.type === "film" && (
          <div id="player" className="mt-10 pt-8 border-t border-gray-800/80">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
              Putar Film
            </h2>

            {/* Ads: 8 iklan grid 2 kolom (desktop) / 1 kolom (mobile) di atas video player film */}
            <div className="mb-4">
              <AdGridBlock />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <VideoPlayer
                  videoUrl={content.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  poster={content.backdrop}
                  title={content.title}
                />
              </div>
              <div>
                {/* Ads: 1x AdSlot di sidebar */}
                <AdSlot slotName="Film Sidebar Sponsor" />
              </div>
            </div>
          </div>
        )}

        {/* 4. Khusus DRAMA: Daftar Episode */}
        {content.type === "tv-series" && content.episodes && content.episodes.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-800/80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
                Daftar Episode
              </h2>
              <span className="text-xs text-gray-400">
                {content.episodes.length} Episode Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EpisodeList slug={content.slug} episodes={content.episodes} />
              </div>
              <div>
                {/* Ads: 1x AdSlot di sidebar */}
                <AdSlot slotName="Episode Sidebar Sponsor" />
              </div>
            </div>
          </div>
        )}

        {/* 5. Rekomendasi Terkait */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-800/80">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
              Rekomendasi Serupa
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {related.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        )}

        {/* Ads: 1x AdBanner di bawah rekomendasi */}
        <AdBanner slotName="Detail Bottom Sponsor" className="mt-8" />
      </div>
    </div>
  );
}
