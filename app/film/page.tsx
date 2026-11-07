import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getFilmList } from "@/lib/data/mock";

export const metadata: Metadata = {
  title: "Katalog Film Bioskop — Mangeakkk",
  description: "Nonton film bioskop blockbuster dan mahakarya sinema dengan subtitle Indonesia.",
};

export default function FilmPage() {
  const films = getFilmList();

  return (
    <CatalogView
      type="film"
      initialItems={films}
      title="Katalog Film Bioskop"
      description="Koleksi film bioskop, pemenang penghargaan, dan film terpopuler dengan resolusi tinggi."
    />
  );
}
