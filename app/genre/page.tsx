import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { GENRES, getContentsByGenre } from "@/lib/data/mock";
import { Compass, Film, Tv } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Genre — Mangeakkk",
  description: "Jelajahi drama dan film berdasarkan genre pilihan Anda.",
};

export default function GenreListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-500 border border-brand-500/30 mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Kategori & Genre
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          Pilih genre tontonan favoritmu untuk menemukan rekomendasi drama dan film yang paling pas.
        </p>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {GENRES.map((genre) => {
          const slug = genre.toLowerCase().replace(/\s+/g, "-");
          const items = getContentsByGenre(genre);

          return (
            <Link
              key={genre}
              href={`/genre/${slug}`}
              className="group p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-brand-500/60 hover:bg-gray-800/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 flex flex-col justify-between"
            >
              <div>
                <span className="w-2 h-2 rounded-full bg-brand-500 inline-block mb-3 group-hover:scale-150 transition-transform" />
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                  {genre}
                </h3>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/80 pt-3">
                <span>{items.length} Judul</span>
                <span className="text-brand-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
