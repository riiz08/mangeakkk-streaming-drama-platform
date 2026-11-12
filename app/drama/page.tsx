import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getDramaList } from "@/lib/data/db";

export const revalidate = 86400; // Revalidate setiap 24 jam (1 hari), on-demand revalidation via server actions

export const metadata: Metadata = {
  title: "Katalog Serial Drama Korea & TV Series — Mangeakkk",
  description: "Nonton drama Korea dan serial TV Asia terlengkap dengan subtitle Indonesia.",
};

export default async function DramaPage() {
  const dramas = await getDramaList();

  return (
    <CatalogView
      type="tv-series"
      initialItems={dramas}
      title="Katalog Drama & TV Series"
      description="Jelajahi dan nikmati serial drama terbaik dengan episode terlengkap dan kualitas visual prima."
    />
  );
}
