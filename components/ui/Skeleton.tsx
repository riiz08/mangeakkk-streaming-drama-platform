import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800 animate-pulse">
      <div className="aspect-[2/3] w-full bg-gray-800/60" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-800 rounded w-1/4" />
          <div className="h-3 bg-gray-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="my-8">
      <div className="h-6 bg-gray-800 rounded w-48 mb-4 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
