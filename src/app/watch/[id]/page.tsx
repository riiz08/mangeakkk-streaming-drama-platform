import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Eye, Calendar, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { mockVideos } from '../../../data/mockVideos';
import { VideoPlayer } from '../../../components/player/VideoPlayer';
import { VideoCard } from '../../../components/catalog/VideoCard';

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const currentVideo = mockVideos.find((v) => v.id === id);

  if (!currentVideo) {
    notFound();
  }

  const relatedVideos = mockVideos.filter((v) => v.id !== id);

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Video Player & Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnailUrl}
              title={currentVideo.title}
            />

            {/* Video Details Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentVideo.title}
                  </h1>
                  <p className="text-xs text-slate-400">
                    Oleh <span className="text-slate-200 font-semibold">{currentVideo.creator}</span>
                  </p>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-semibold">
                  <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                    <ThumbsUp className="w-4 h-4 text-pink-500" />
                    <span>Suka</span>
                  </button>
                  <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                    <Bookmark className="w-4 h-4 text-slate-300" />
                    <span>Simpan</span>
                  </button>
                  <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                    <Share2 className="w-4 h-4 text-slate-300" />
                    <span>Bagi</span>
                  </button>
                </div>
              </div>

              {/* Badges / Metadata */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800/80">
                <span className="flex items-center space-x-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{currentVideo.rating}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentVideo.views} views</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rilis {currentVideo.releaseYear}</span>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 font-semibold">
                  {currentVideo.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {currentVideo.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentVideo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-400 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Related Videos Column (1 Col) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Rekomendasi Lainnya</h3>
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

