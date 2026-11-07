import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, Calendar, Clock, Tv, Film } from "lucide-react";
import { Content } from "@/lib/data/mock";
import BadgeLabel from "./BadgeLabel";

interface HeroSectionProps {
  content: Content;
}

export default function HeroSection({ content }: HeroSectionProps) {
  // New watch route: drama -> /[slug]/[episode-1], film -> /[slug]
  const watchUrl =
    content.type === "tv-series"
      ? `/${content.slug}/${content.episodes?.[0]?.slug || "episode-1"}`
      : `/${content.slug}`;

  const detailUrl = `/${content.slug}`;

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] -mt-16 overflow-hidden">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={content.backdrop}
          alt={content.title}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-2xl space-y-4">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Featured Drama Badge */}
            {content.isFeatured && <BadgeLabel type="featured" />}

            {/* Type badge */}
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-black/60 backdrop-blur-md text-brand-400 border border-brand-500/30 flex items-center gap-1">
              {content.type === "tv-series" ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
              <span>{content.type === "tv-series" ? "TV Series" : "Film"}</span>
            </span>

            {/* Dynamic Badges */}
            {content.isTrending && <BadgeLabel type="hot" size="md" />}
            {content.hasNewEpisode && <BadgeLabel type="new" size="md" />}
            {content.isPilihan && <BadgeLabel type="pilihan" size="md" />}

            <div className="flex items-center gap-1 text-xs text-gray-300 ml-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{content.year}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{content.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
            {content.title}
          </h1>

          {/* Synopsis */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
            {content.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={watchUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Tonton Sekarang</span>
            </Link>

            <Link
              href={detailUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-200 border border-gray-700/80 font-semibold text-sm transition-all backdrop-blur-sm hover:text-white"
            >
              <Info className="w-4 h-4" />
              <span>Detail Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
