"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import ContentCard from "@/components/ui/ContentCard";
import AdBanner from "@/components/ads/AdBanner";
import { Content } from "@/lib/data/db";

interface SearchViewProps {
  query?: string;
  results?: Content[];
}

export default function SearchView({ query = "", results = [] }: SearchViewProps) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState(query);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
          Pencarian Tontonan
        </h1>

        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ketik judul drama, film, atau sutradara..."
            className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-2xl pl-12 pr-28 py-3.5 border border-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm sm:text-base shadow-xl"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Top Stacked Banners (2 di Desktop, 1 di Mobile) */}
      <div className="space-y-2 mb-6">
        <AdBanner priority={true} slotName="Search Top Banner 1" className="!my-1" />
        <div className="hidden md:block">
          <AdBanner priority={true} specificType="728x90" slotName="Search Top Banner 2 Desktop" className="!my-1" />
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-6">
          {query ? (
            <p>
              Hasil pencarian untuk &quot;<strong className="text-white">{query}</strong>&quot;:{" "}
              <span className="text-brand-400 font-semibold">{results.length} ditemukan</span>
            </p>
          ) : (
            <p>Ketik kata kunci untuk mulai mencari.</p>
          )}
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {results.slice(0, 5).map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>

            {results.length > 5 && (
              <>
                {/* Mid In-Feed Banner 468x60 (Desktop) / 320x50 (Mobile) */}
                <AdBanner variant="compact" slotName="Search Mid In-Feed Banner" className="my-6" />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {results.slice(5).map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : query ? (
          <div className="py-20 text-center bg-gray-900/30 rounded-2xl border border-gray-800 max-w-lg mx-auto p-6">
            <AlertCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-white font-semibold text-lg mb-1">Tidak Ditemukan</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Maaf, tidak ada drama atau film yang cocok dengan kata kunci &quot;{query}&quot;. Cobalah kata kunci lain seperti &quot;Squid&quot;, &quot;Korea&quot;, atau &quot;Nolan&quot;.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
