"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { Content, Episode } from "@/lib/data/mock";
import VideoPlayer from "@/components/ui/VideoPlayer";
import EpisodeList from "@/components/ui/EpisodeList";
import BadgeLabel from "@/components/ui/BadgeLabel";
import AdBanner from "@/components/ads/AdBanner";
import AdSlot from "@/components/ads/AdSlot";

interface WatchViewProps {
  content: Content;
  currentEpisodeSlug: string;
}

export default function WatchView({ content, currentEpisodeSlug }: WatchViewProps) {
  const router = useRouter();
  const episodes = content.episodes || [];
  const [bookmarked, setBookmarked] = useState(false);

  // Active episode
  const currentEpisode: Episode | undefined =
    episodes.find((ep) => ep.slug === currentEpisodeSlug) || episodes[0];

  const currentVideoUrl = currentEpisode ? currentEpisode.videoUrl : "";
  const currentIndex = episodes.findIndex((ep) => ep.slug === currentEpisodeSlug);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;

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
      alert("Tautan episode berhasil disalin ke clipboard!");
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

      {/* Ads: 1x AdBanner (728x90 Desktop / 320x50 Mobile) di atas video player */}
      <AdBanner priority={true} slotName="Player Top Leaderboard" variant="leaderboard" className="my-2" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
        {/* Left Column: Player & Info (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={currentVideoUrl}
            poster={currentEpisode?.thumbnail || content.backdrop}
            title={`${content.title} ${currentEpisode ? `- ${currentEpisode.title}` : ""}`}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrevEpisode={handlePrev}
            onNextEpisode={handleNext}
          />

          {/* Ads: 1x AdBanner di bawah video player */}
          <AdBanner slotName="Player Mid In-Feed Banner" variant="compact" className="my-4" />

          {/* Under player info */}
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {content.title}
                </h1>
                {currentEpisode && (
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
                {currentEpisode?.duration || content.duration}
              </span>
              <span>•</span>
              <span>{content.country}</span>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pt-2 border-t border-gray-800">
              {currentEpisode?.synopsis || content.synopsis}
            </p>
          </div>
        </div>

        {/* Right Column: Episode selector & Sidebar Ad */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Pilih Episode</span>
              <span className="text-xs font-normal text-gray-400">
                {episodes.length} Episode
              </span>
            </h2>

            <div className="max-h-[500px] overflow-y-auto pr-1 no-scrollbar space-y-2">
              <EpisodeList
                slug={content.slug}
                episodes={episodes}
                currentEpisodeSlug={currentEpisode?.slug}
              />
            </div>
          </div>

          {/* Ads: 1x AdSlot 300x250 di sidebar */}
          <AdSlot type="300x250" slotName="Player Sidebar Sponsor" />
        </div>
      </div>
    </div>
  );
}
