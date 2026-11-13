"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { Content, Episode } from "@/lib/data/mock";
import VideoPlayer from "@/components/ui/VideoPlayer";
import EpisodeList from "@/components/ui/EpisodeList";
import ContentCard from "@/components/ui/ContentCard";
import BadgeLabel from "@/components/ui/BadgeLabel";

interface WatchViewProps {
  content: Content;
  currentEpisodeSlug?: string;
  related?: Content[];
}

export default function WatchView({
  content,
  currentEpisodeSlug,
  related = [],
}: WatchViewProps) {
  const router = useRouter();
  const isFilm = content.type === "film";
  const episodes = content.episodes || [];
  const [bookmarked, setBookmarked] = useState(false);

  // Active episode (khusus tv-series)
  const currentEpisode: Episode | undefined = isFilm
    ? undefined
    : episodes.find((ep) => ep.slug === currentEpisodeSlug) || episodes[0];

  const currentVideoUrl = isFilm
    ? content.videoUrl || ""
    : currentEpisode
      ? currentEpisode.videoUrl
      : "";

  const currentIndex = isFilm
    ? -1
    : episodes.findIndex((ep) => ep.slug === currentEpisodeSlug);
  const hasPrev = !isFilm && currentIndex > 0;
  const hasNext = !isFilm && currentIndex < episodes.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      router.push(`/${content.slug}/${episodes[currentIndex - 1].slug}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/${content.slug}/${episodes[currentIndex + 1].slug}`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      alert(
        isFilm
          ? "Tautan film berhasil disalin ke clipboard!"
          : "Tautan episode berhasil disalin ke clipboard!"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back button & Title header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/${content.slug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail {content.title}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${bookmarked
                ? "bg-brand-600/20 border-brand-500/50 text-brand-400"
                : "bg-gray-900 border-gray-800 text-gray-300 hover:text-white"
              }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-brand-400" : ""}`} />
            <span className="hidden sm:inline">{bookmarked ? "Tersimpan" : "Simpan"}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
        {/* Left Column: Player & Info (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={currentVideoUrl}
            poster={
              isFilm
                ? content.backdrop || content.poster
                : currentEpisode?.thumbnail || content.backdrop
            }
            title={
              isFilm
                ? content.title
                : `${content.title} ${currentEpisode ? `- ${currentEpisode.title}` : ""}`
            }
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrevEpisode={handlePrev}
            onNextEpisode={handleNext}
          />

          {/* Under player info */}
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {content.title}
                </h1>
                {!isFilm && currentEpisode && (
                  <p className="text-brand-400 font-semibold text-sm mt-0.5">
                    {currentEpisode.title}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                {content.isTrending && <BadgeLabel type="hot" size="sm" />}
                {content.hasNewEpisode && <BadgeLabel type="new" size="sm" />}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {content.year}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isFilm ? content.duration : currentEpisode?.duration || content.duration}
              </span>
              <span>•</span>
              <span>{content.country}</span>
              {content.director && (
                <>
                  <span>•</span>
                  <span>Sutradara: {content.director}</span>
                </>
              )}
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pt-2 border-t border-gray-800">
              {isFilm ? content.synopsis : currentEpisode?.synopsis || content.synopsis}
            </p>
          </div>
        </div>

        {/* Right Column: Episode selector (TV Series) ATAU Rekomendasi (Film) */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>{isFilm ? "Rekomendasi Tontonan" : "Pilih Episode"}</span>
              <span className="text-xs font-normal text-gray-400">
                {isFilm
                  ? `${related.length} Pilihan`
                  : `${episodes.length} Episode`}
              </span>
            </h2>

            {isFilm ? (
              <div className="max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
                {related && related.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {related.map((item) => (
                      <ContentCard key={item.id} content={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-6 text-center">
                    Belum ada rekomendasi pilihan.
                  </p>
                )}
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto pr-1 no-scrollbar space-y-2">
                <EpisodeList
                  slug={content.slug}
                  episodes={episodes}
                  currentEpisodeSlug={currentEpisode?.slug}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
