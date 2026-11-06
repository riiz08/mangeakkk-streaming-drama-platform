import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getDramaList } from "@/lib/data/mock";

export const metadata: Metadata = {
  title: "Katalog Drama — Mangeakkk",
  description: "Nonton drama Korea dan Asia terlengkap dengan subtitle Indonesia.",
};

export default function DramaPage() {
  const dramas = getDramaList();

  return (
    <CatalogView
      type="drama"
      initialItems={dramas}
      title="Katalog Drama"
      description="Jelajahi dan nikmati serial drama terbaik dari berbagai genre, mulai dari romantis hingga misteri thriller."
    />
  );
}
