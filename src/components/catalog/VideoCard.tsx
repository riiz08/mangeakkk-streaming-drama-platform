'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star, Clock } from 'lucide-react';
import { Video } from '../../types/video';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link href={`/watch/${video.id}`} className="group block relative">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:border-pink-500/50 group-hover:shadow-pink-500/10">
        {/* Thumbnail Image */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration / Live Badge */}
        <div className="absolute bottom-2.5 right-2.5">
          {video.duration === 'LIVE' ? (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-600 text-white shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-950/80 backdrop-blur-sm text-slate-200 border border-slate-800">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{video.duration}</span>
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-slate-900/80 backdrop-blur-sm text-pink-400 border border-pink-500/30">
            {video.category}
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-sm text-slate-100 group-hover:text-pink-400 transition-colors line-clamp-1">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{video.creator}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-300">{video.rating}</span>
            <span>•</span>
            <span>{video.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

