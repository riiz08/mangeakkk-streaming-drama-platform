import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Episode } from "@/lib/data/mock";

interface EpisodeListProps {
  slug: string;
  episodes: Episode[];
  currentEpisodeSlug?: string;
  onSelectEpisode?: (ep: Episode) => void;
}

export default function EpisodeList({
  slug,
  episodes,
  currentEpisodeSlug,
  onSelectEpisode,
}: EpisodeListProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 text-sm">
        Belum ada episode tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {episodes.map((ep) => {
        const isCurrent = currentEpisodeSlug === ep.slug;
        const watchUrl = `/${slug}/${ep.slug}`;

        const itemContent = (
          <div
            className={`group flex items-start gap-3 sm:gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
              isCurrent
                ? "bg-brand-600/15 border-brand-500/50 shadow-md shadow-brand-500/10"
                : "bg-gray-900/40 border-gray-800/80 hover:bg-gray-800/50 hover:border-gray-700"
            }`}
          >
            {/* Thumbnail */}
            <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-950">
              <Image
                src={ep.thumbnail}
                alt={ep.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent ? "bg-brand-600 text-white" : "bg-black/60 text-white"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] bg-black/80 rounded text-gray-300 font-medium">
                {ep.duration}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h4
                  className={`text-sm font-semibold truncate ${
                    isCurrent ? "text-brand-400" : "text-white group-hover:text-brand-400"
                  }`}
                >
                  {ep.title}
                </h4>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                {ep.synopsis}
              </p>
            </div>
          </div>
        );

        if (onSelectEpisode) {
          return (
            <div key={ep.slug} onClick={() => onSelectEpisode(ep)}>
              {itemContent}
            </div>
          );
        }

        return (
          <Link key={ep.slug} href={watchUrl}>
            {itemContent}
          </Link>
        );
      })}
    </div>
  );
}
