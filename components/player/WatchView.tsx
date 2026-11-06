"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { Content, Episode } from "@/lib/data/mock";
import VideoPlayer from "@/components/ui/VideoPlayer";
import EpisodeList from "@/components/ui/EpisodeList";
import GenreBadge from "@/components/ui/GenreBadge";

interface WatchViewProps {
  content: Content;
  initialEpisode?: number;
}

export default function WatchView({ content, initialEpisode = 1 }: WatchViewProps) {
  const episodes = content.episodes || [];
  const [currentEpNum, setCurrentEpNum] = useState<number>(initialEpisode);
  const [bookmarked, setBookmarked] = useState(false);

  // Active episode object
  const currentEpisode: Episode | undefined =
    episodes.find((ep) => ep.number === currentEpNum) || episodes[0];

  const currentVideoUrl = currentEpisode ? currentEpisode.videoUrl : "";
  const currentIndex = episodes.findIndex((ep) => ep.number === currentEpNum);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentEpNum(episodes[currentIndex - 1].number);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentEpNum(episodes[currentIndex + 1].number);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      alert("Tautan tontonan berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back button & Title header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/${content.type}/${content.slug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail {content.type === "drama" ? "Drama" : "Film"}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              bookmarked
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player & Info (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={currentVideoUrl}
            poster={currentEpisode?.thumbnail || content.backdrop}
            title={`${content.title} ${
              content.type === "drama" && currentEpisode
                ? `- ${currentEpisode.title}`
                : ""
            }`}
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
                {content.type === "drama" && currentEpisode && (
                  <p className="text-brand-400 font-semibold text-sm mt-0.5">
                    {currentEpisode.title}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 text-amber-400 text-xs font-semibold border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{content.rating}</span>
                </div>
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
                {currentEpisode?.duration || content.duration}
              </span>
              <span>•</span>
              <span>{content.country}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {content.genre.map((g) => (
                <GenreBadge key={g} genre={g} />
              ))}
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pt-2 border-t border-gray-800">
              {currentEpisode?.synopsis || content.synopsis}
            </p>
          </div>
        </div>

        {/* Right Column: Episode selector (or drama list) */}
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>{content.type === "drama" ? "Pilih Episode" : "Tentang Film"}</span>
              {content.type === "drama" && (
                <span className="text-xs font-normal text-gray-400">
                  {episodes.length} Episode
                </span>
              )}
            </h2>

            {content.type === "drama" && episodes.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto pr-1 no-scrollbar space-y-2">
                <EpisodeList
                  slug={content.slug}
                  episodes={episodes}
                  currentEpisode={currentEpNum}
                  onSelectEpisode={(epNum) => setCurrentEpNum(epNum)}
                />
              </div>
            ) : (
              <div className="space-y-3 text-xs text-gray-300">
                <p>{content.synopsis}</p>
                <div className="pt-3 border-t border-gray-800 space-y-1.5">
                  <p><strong className="text-gray-400">Sutradara:</strong> {content.director}</p>
                  <p><strong className="text-gray-400">Durasi:</strong> {content.duration}</p>
                  <p><strong className="text-gray-400">Rilis:</strong> {content.releaseDate || content.year}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
