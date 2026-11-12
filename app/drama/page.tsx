import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getDramaList } from "@/lib/data/db";
import Script from "next/script";

export const revalidate = 86400; // Revalidate setiap 24 jam (1 hari), on-demand revalidation via server actions

export const metadata: Metadata = {
  title: "Katalog Serial Drama Korea & TV Series — Mangeakkk",
  description: "Nonton drama Korea dan serial TV Asia terlengkap dengan subtitle Indonesia.",
};

export default async function DramaPage() {
  const dramas = await getDramaList();

  return (
    <>
      <CatalogView
        type="tv-series"
        initialItems={dramas}
        title="Katalog Drama & TV Series"
        description="Jelajahi dan nikmati serial drama terbaik dengan episode terlengkap dan kualitas visual prima."
      />
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="309368"
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </>
  );
}
