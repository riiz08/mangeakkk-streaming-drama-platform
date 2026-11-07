import React, { Suspense } from "react";
import { Metadata } from "next";
import SearchView from "@/components/search/SearchView";
import { SkeletonRow } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Cari Drama & Film — Mangeakkk",
  description: "Cari drama Korea dan film favoritmu dengan mudah di Mangeakkk.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonRow />
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}

