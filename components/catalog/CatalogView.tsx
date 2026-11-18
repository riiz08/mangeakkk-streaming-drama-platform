"use client";

import React, { useState, useMemo } from "react";
import ContentCard from "@/components/ui/ContentCard";
import FilterBar from "@/components/ui/FilterBar";
import { Content } from "@/lib/data/mock";
import { Film, Tv } from "lucide-react";
import AdBanner from "../ads/AdBanner";
import ResponsiveAd from "../ads/ResponsiveAd";

interface CatalogViewProps {
  type: "tv-series" | "film";
  initialItems: Content[];
  title: string;
  description: string;
}

export default function CatalogView({
  type,
  initialItems,
  title,
  description,
}: CatalogViewProps) {
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("latest");

  const filteredItems = useMemo(() => {
    let result = [...initialItems];

    if (selectedYear !== "Semua") {
      result = result.filter((item) => item.year.toString() === selectedYear);
    }

    if (selectedSort === "latest") {
      result.sort((a, b) => b.year - a.year);
    } else if (selectedSort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialItems, selectedYear, selectedSort]);

  const Icon = type === "tv-series" ? Tv : Film;

  const firstBatch = filteredItems.slice(0, 8);
  const secondBatch = filteredItems.slice(8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
          {description}
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <FilterBar
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      {/* 1. Native Banner 4:1 di atas daftar konten */}
      <AdBanner type="native-4:1" className="max-w-5xl my-6" />

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-6">
        <span>
          Menampilkan <strong className="text-white">{filteredItems.length}</strong> judul
        </span>
        {selectedYear !== "Semua" && (
          <button
            onClick={() => setSelectedYear("Semua")}
            className="text-brand-500 hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Grid Content dengan ResponsiveAd di tengah */}
      {filteredItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {firstBatch.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          {/* 2. Responsive Ad (728x90 Desktop / 320x50 Mobile) di sela konten */}
          <ResponsiveAd />

          {secondBatch.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {secondBatch.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-900/30 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-base">Tidak ada judul yang sesuai dengan filter.</p>
          <button
            onClick={() => setSelectedYear("Semua")}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500 transition-colors"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
    </div>
  );
}
