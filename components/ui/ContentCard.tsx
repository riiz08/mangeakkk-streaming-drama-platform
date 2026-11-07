import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Content } from "@/lib/data/mock";
import BadgeLabel from "./BadgeLabel";

interface ContentCardProps {
  content: Content;
  priority?: boolean;
}

export default function ContentCard({ content, priority = false }: ContentCardProps) {
  // New route: /[slug]
  const detailUrl = `/${content.slug}`;

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1">
      {/* Poster Image Container */}
      <Link href={detailUrl} className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
        <Image
          src={content.poster}
          alt={content.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with play icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-brand-600/40">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges (Left: Type) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-black/75 backdrop-blur-md text-brand-400 border border-brand-500/30">
            {content.type === "tv-series" ? "TV Series" : "Film"}
          </span>
        </div>

        {/* Top Badges (Right: HOT, NEW, Pilihan) */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          {content.isTrending && <BadgeLabel type="hot" size="sm" />}
          {content.hasNewEpisode && <BadgeLabel type="new" size="sm" />}
          {content.isPilihan && <BadgeLabel type="pilihan" size="sm" />}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={detailUrl}>
          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
            {content.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{content.year}</span>
          <span className="text-gray-500">
            {content.type === "tv-series" ? `${content.totalEpisodes || content.episodes?.length || 0} Ep` : content.duration}
          </span>
        </div>
      </div>
    </div>
  );
}
