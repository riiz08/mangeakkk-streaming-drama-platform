import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, Calendar, Clock, Tv, Film, Sparkles, Star } from "lucide-react";
import { Content } from "@/lib/data/mock";
import BadgeLabel from "./BadgeLabel";

interface HeroSectionProps {
  content: Content;
}

export default function HeroSection({ content }: HeroSectionProps) {
  // Route logic: drama -> /[slug]/[episode-1], film -> /[slug]
  const watchUrl =
    content.type === "tv-series"
      ? `/${content.slug}/${content.episodes?.[0]?.slug || "episode-1"}`
      : `/${content.slug}`;

  const detailUrl = `/${content.slug}`;

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] -mt-16 overflow-hidden select-none">
      {/* 1. Backdrop Cinematic Image */}
      <div className="absolute inset-0">
        <Image
          src={content.backdrop}
          alt={content.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />

        {/* Cinematic Multi-Stop Gradients */}
        {/* Dark bottom blend into page background #0b0f19 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent via-35%" />
        {/* Dark left blend for crisp typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent sm:max-w-3xl lg:max-w-4xl" />
        {/* Subtle top shade for navbar contrast */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0b0f19]/90 to-transparent" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
          {/* Top Badges & Highlights Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Prominent Featured Badge */}
            {content.isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/20 border border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>Drama Unggulan</span>
              </span>
            )}

            {/* Content Type Pill */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-black/60 backdrop-blur-md text-brand-400 border border-brand-500/30">
              {content.type === "tv-series" ? (
                <Tv className="w-3.5 h-3.5" />
              ) : (
                <Film className="w-3.5 h-3.5" />
              )}
              <span>{content.type === "tv-series" ? "TV Series" : "Film Bioskop"}</span>
            </span>

            {/* Dynamic Status Badges */}
            {content.isTrending && <BadgeLabel type="hot" size="md" />}
            {content.hasNewEpisode && <BadgeLabel type="new" size="md" />}
            {content.isPilihan && <BadgeLabel type="pilihan" size="md" />}

            {/* Quality badge */}
            <span className="px-2 py-0.5 text-[10px] font-black tracking-widest text-zinc-300 uppercase rounded bg-zinc-800/80 border border-zinc-700/80">
              4K Ultra HD
            </span>

            {/* Year & Duration */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-300/90 ml-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{content.year}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{content.duration}</span>
              </span>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            {content.title}
          </h1>

          {/* Synopsis (Clean, 2-3 lines max) */}
          <p className="text-gray-200/90 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-2xl drop-shadow font-normal">
            {content.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-3">
            {/* Primary Watch Button */}
            <Link
              href={watchUrl}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-brand-600/35 hover:shadow-brand-500/50 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>Tonton Sekarang</span>
            </Link>

            {/* Secondary Detail Button */}
            <Link
              href={detailUrl}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 font-semibold text-sm sm:text-base transition-all backdrop-blur-md hover:border-zinc-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Detail Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
