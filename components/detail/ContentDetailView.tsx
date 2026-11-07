import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Play, Star, Calendar, Clock, Globe, User, Film as FilmIcon } from "lucide-react";
import { Content, getRelatedContents } from "@/lib/data/mock";
import GenreBadge from "@/components/ui/GenreBadge";
import EpisodeList from "@/components/ui/EpisodeList";
import ContentCard from "@/components/ui/ContentCard";

interface ContentDetailViewProps {
  content: Content;
}

export default function ContentDetailView({ content }: ContentDetailViewProps) {
  if (!content) notFound();

  const related = getRelatedContents(content);
  const watchUrl = `/watch/${content.slug}${content.type === "drama" && content.episodes && content.episodes.length > 0 ? "?ep=1" : ""}`;

  return (
    <div className="pb-16">
      {/* 1. Backdrop Banner */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] -mt-16 overflow-hidden">
        <Image
          src={content.backdrop}
          alt={content.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
      </div>

      {/* 2. Main Content Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: Poster & Watch Button */}
          <div className="w-52 sm:w-64 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 bg-gray-900">
              <Image
                src={content.poster}
                alt={content.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <Link
              href={watchUrl}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all shadow-xl shadow-brand-600/30 hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{content.type === "drama" ? "Mulai Menonton (Ep 1)" : "Tonton Film"}</span>
            </Link>
          </div>

          {/* Right: Info Details */}
          <div className="flex-1 space-y-6">
            <div>
              {/* Type & Rating */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded bg-brand-600/20 text-brand-500 border border-brand-500/30">
                  {content.type === "drama" ? "Drama Series" : "Movie"}
                </span>

                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-amber-400 text-xs font-semibold border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{content.rating} / 10</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {content.title}
              </h1>

              {/* Quick specs */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300 mt-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {content.year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {content.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  {content.country}
                </span>
                {content.totalEpisodes && (
                  <>
                    <span>•</span>
                    <span className="text-brand-400 font-medium">
                      {content.totalEpisodes} Episode
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {content.genre.map((g) => (
                <GenreBadge key={g} genre={g} size="md" />
              ))}
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Sinopsis</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {content.synopsis}
              </p>
            </div>

            {/* Director & Cast */}
            <div className="pt-2 border-t border-gray-800/80 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Sutradara
                </span>
                <span className="text-sm text-gray-200 font-medium">{content.director}</span>
              </div>

              {content.cast && content.cast.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-3">
                    Pemeran Utama
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {content.cast.map((actor) => (
                      <div key={actor.name} className="flex items-center gap-2.5 bg-gray-900/60 border border-gray-800 rounded-full pr-4 p-1">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                          <Image
                            src={actor.photo}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-200">{actor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Episodes (Specifically for Drama) */}
        {content.type === "drama" && content.episodes && content.episodes.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-800/80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
                Daftar Episode
              </h2>
              <span className="text-xs text-gray-400">
                {content.episodes.length} Episode Tersedia
              </span>
            </div>
            <EpisodeList slug={content.slug} episodes={content.episodes} />
          </div>
        )}

        {/* 4. Rekomendasi Terkait */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-800/80">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
              Rekomendasi Serupa
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {related.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
