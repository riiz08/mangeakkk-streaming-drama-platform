import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getFilmList } from "@/lib/data/mock";

export const metadata: Metadata = {
  title: "Katalog Film — Mangeakkk",
  description: "Nonton film bioskop blockbuster dan mahakarya sinema dengan subtitle Indonesia.",
};

export default function FilmPage() {
  const films = getFilmList();

  return (
    <CatalogView
      type="film"
      initialItems={films}
      title="Katalog Film"
      description="Koleksi film bioskop, pemenang festival internasional, dan film populer dengan resolusi tinggi."
    />
  );
}
