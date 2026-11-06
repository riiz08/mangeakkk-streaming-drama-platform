'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Info, Sparkles } from 'lucide-react';
import { Video } from '../../types/video';

interface HeroBannerProps {
  featuredVideo: Video;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredVideo }) => {
  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[500px] max-h-[750px] overflow-hidden rounded-b-3xl">
      {/* Background Image / Poster */}
      <img
        src={featuredVideo.thumbnailUrl}
        alt={featuredVideo.title}
        className="w-full h-full object-cover object-center scale-105 filter brightness-[0.75] contrast-[1.05]"
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

      {/* Banner Content */}
      <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>KONTEN UNGGULAN MINGGU INI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {featuredVideo.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
            {featuredVideo.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/watch/${featuredVideo.id}`}
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Putar Sekarang</span>
            </Link>

            <Link
              href={`/watch/${featuredVideo.id}`}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/80 backdrop-blur-md transition-colors"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span>Detail & Info</span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 ml-4 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-semibold text-slate-300">
                {featuredVideo.rating} ★
              </span>
              <span>•</span>
              <span>{featuredVideo.releaseYear}</span>
              <span>•</span>
              <span>{featuredVideo.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

