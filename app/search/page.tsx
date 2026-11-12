import React, { Suspense } from "react";
import { Metadata } from "next";
import SearchView from "@/components/search/SearchView";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { searchContents } from "@/lib/data/db";

export const revalidate = 86400; // Revalidate setiap 24 jam (1 hari), on-demand revalidation via server actions

export const metadata: Metadata = {
  title: "Cari Drama & Film — Mangeakkk",
  description: "Cari drama Korea dan film favoritmu dengan mudah di Mangeakkk.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const results = query ? await searchContents(query) : [];

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonRow />
        </div>
      }
    >
      <SearchView query={query} results={results} />
    </Suspense>
  );
}
