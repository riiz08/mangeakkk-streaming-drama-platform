import React from 'react';
import { Video } from '../../types/video';
import { VideoCard } from './VideoCard';

interface CategoryRowProps {
  id?: string;
  title: string;
  subtitle?: string;
  videos: Video[];
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ id, title, subtitle, videos }) => {
  if (videos.length === 0) return null;

  return (
    <section id={id} className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <span className="text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer transition-colors">
          Lihat Semua →
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
};

