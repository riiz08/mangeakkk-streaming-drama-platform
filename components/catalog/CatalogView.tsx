"use client";

import React, { useState, useMemo } from "react";
import ContentCard from "@/components/ui/ContentCard";
import FilterBar from "@/components/ui/FilterBar";
import AdBanner from "@/components/ads/AdBanner";
import AdSlot from "@/components/ads/AdSlot";
import AdNativeBanner from "@/components/ads/AdNativeBanner";
import { Content } from "@/lib/data/mock";
import { Film, Tv } from "lucide-react";

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

      {/* Top Stacked Banners (3 di Desktop, 2 di Mobile) */}
      <div className="space-y-2 mb-6">
        <AdBanner priority={true} slotName={`Katalog ${title} - Top Banner 1`} className="!my-1" />
        <AdBanner priority={true} slotName={`Katalog ${title} - Top Banner 2`} className="!my-1" />
        <div className="hidden md:block">
          <AdBanner priority={true} specificType="728x90" slotName={`Katalog ${title} - Top Banner 3 Desktop`} className="!my-1" />
        </div>
      </div>

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

      {/* Grid Content with inline Native & 300x250 AdSlot */}
      {filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredItems.slice(0, 5).map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          {/* In-Grid Native Banner 4:1 #1 */}
          <AdNativeBanner className="my-6" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredItems.slice(5, 10).map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          {/* In-Grid 300x250 AdSlot #1 (Desktop Only) */}
          <div className="hidden md:flex justify-center my-6">
            <AdSlot type="300x250" slotName={`Katalog ${title} Inline 300x250`} />
          </div>

          {filteredItems.length > 10 && (
            <>
              {/* In-Grid Native Banner 4:1 #2 */}
              <AdNativeBanner className="my-6" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredItems.slice(10).map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            </>
          )}
        </>
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

      {/* Mid Banner 468x60 (Desktop) / 320x50 (Mobile) */}
      <AdBanner slotName={`Katalog ${title} - In-Feed Mid Banner`} variant="compact" className="my-6" />
    </div>
  );
}
