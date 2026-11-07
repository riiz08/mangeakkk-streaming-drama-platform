import React from "react";

// Base Shimmer / Skeleton primitive
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/80 rounded-lg ${className}`}
    />
  );
}

// 1. Skeleton Card (matches ContentCard.tsx)
export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/80 animate-pulse">
      {/* 2/3 Poster aspect */}
      <div className="relative aspect-[2/3] w-full bg-zinc-800/70">
        {/* Badge shimmer in corner */}
        <div className="absolute top-2 left-2 w-12 h-4 bg-zinc-700/80 rounded" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-zinc-700/80 rounded w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-3 bg-zinc-800 rounded w-1/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

// 2. Skeleton Content Row (matches ContentRow.tsx)
export function SkeletonRow() {
  return (
    <div className="my-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1.5">
          <div className="h-6 bg-zinc-800 rounded-md w-48 animate-pulse" />
          <div className="h-3.5 bg-zinc-800/60 rounded w-64 animate-pulse" />
        </div>
        <div className="h-4 bg-zinc-800/50 rounded w-16" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// 3. Skeleton Hero Section (matches HeroSection.tsx)
export function SkeletonHero() {
  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] -mt-16 overflow-hidden bg-zinc-950 animate-pulse">
      {/* Backdrop shimmer */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-zinc-900/60 to-zinc-900/30" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 space-y-4">
        {/* Badges row */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-28 bg-zinc-800 rounded-md" />
          <div className="h-6 w-20 bg-zinc-800/80 rounded-md" />
          <div className="h-6 w-14 bg-zinc-800/60 rounded-md" />
        </div>
        {/* Title */}
        <div className="h-10 sm:h-14 lg:h-16 bg-zinc-800 rounded-xl w-3/4 max-w-2xl" />
        {/* Synopsis lines */}
        <div className="space-y-2 max-w-xl">
          <div className="h-4 bg-zinc-800/80 rounded w-full" />
          <div className="h-4 bg-zinc-800/80 rounded w-5/6" />
          <div className="h-4 bg-zinc-800/80 rounded w-2/3" />
        </div>
        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <div className="h-12 w-40 bg-zinc-800 rounded-xl" />
          <div className="h-12 w-32 bg-zinc-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 4. Skeleton Filter Bar (matches FilterBar.tsx)
export function SkeletonFilter() {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-8 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-24 bg-zinc-800 rounded" />
        <div className="h-9 w-32 bg-zinc-800 rounded-xl" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="h-9 w-28 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

// 5. Skeleton Episode List (matches EpisodeList.tsx)
export function SkeletonEpisodeList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 animate-pulse"
        >
          <div className="w-28 sm:w-36 aspect-video rounded-lg bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-zinc-700/80 rounded w-3/5" />
            <div className="h-3 bg-zinc-800 rounded w-4/5" />
            <div className="h-3 bg-zinc-800/60 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 6. Skeleton Detail View (matches ContentDetailView.tsx)
export function SkeletonDetail() {
  return (
    <div className="pb-16 animate-pulse">
      {/* Backdrop */}
      <div className="w-full h-[360px] sm:h-[460px] lg:h-[520px] -mt-16 bg-zinc-900/80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster */}
          <div className="w-52 sm:w-64 shrink-0 mx-auto md:mx-0 space-y-4">
            <div className="aspect-[2/3] w-full rounded-2xl bg-zinc-800 border-2 border-zinc-700/80" />
            <div className="h-12 w-full bg-zinc-800 rounded-xl" />
          </div>
          {/* Info */}
          <div className="flex-1 space-y-5 w-full">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-zinc-800 rounded" />
              <div className="h-6 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="h-10 bg-zinc-800 rounded-lg w-3/4" />
            <div className="h-4 bg-zinc-800/70 rounded w-1/2" />
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-zinc-800/80 rounded w-full" />
              <div className="h-4 bg-zinc-800/80 rounded w-5/6" />
              <div className="h-4 bg-zinc-800/80 rounded w-4/6" />
            </div>
            {/* Cast row */}
            <div className="pt-4 flex items-center gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-800" />
                  <div className="h-3 w-16 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Skeleton Watch View (matches WatchView.tsx)
export function SkeletonWatch() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse space-y-6">
      {/* Top back & title */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="h-4 w-24 bg-zinc-800 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video w-full rounded-2xl bg-zinc-800 border border-zinc-700/80" />
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="h-7 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-1/3 bg-zinc-800/70 rounded" />
            <div className="h-16 w-full bg-zinc-800/50 rounded" />
          </div>
        </div>
        {/* Episodes sidebar */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded" />
          <SkeletonEpisodeList count={4} />
        </div>
      </div>
    </div>
  );
}

// 8. Skeleton Catalog View (matches CatalogView.tsx)
export function SkeletonCatalog() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-80 bg-zinc-800/70 rounded" />
      </div>
      <SkeletonFilter />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// 9. Skeleton Search View (matches SearchView.tsx)
export function SkeletonSearch() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg mx-auto" />
        <div className="h-12 w-full bg-zinc-900 border border-zinc-800 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
