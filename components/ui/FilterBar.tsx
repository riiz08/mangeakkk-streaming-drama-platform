"use client";

import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { GENRES } from "@/lib/data/mock";

interface FilterBarProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  selectedSort,
  onSortChange,
}: FilterBarProps) {
  const years = ["Semua", "2024", "2023", "2021", "2019", "2014"];

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-brand-500" />
            <span>Filter:</span>
          </div>

          {/* Genre select */}
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="bg-gray-800/90 text-sm text-gray-200 border border-gray-700/80 rounded-xl px-3 py-1.5 focus:border-brand-500 focus:outline-none"
          >
            <option value="Semua">Semua Genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Year select */}
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-gray-800/90 text-sm text-gray-200 border border-gray-700/80 rounded-xl px-3 py-1.5 focus:border-brand-500 focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "Semua" ? "Semua Tahun" : y}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-500" />
            <span>Urutkan:</span>
          </div>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-gray-800/90 text-sm text-gray-200 border border-gray-700/80 rounded-xl px-3 py-1.5 focus:border-brand-500 focus:outline-none"
          >
            <option value="latest">Terbaru</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
