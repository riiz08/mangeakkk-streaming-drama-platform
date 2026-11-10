import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getFilmList } from "@/lib/data/db";

export const revalidate = 3600; // Revalidate setiap 1 jam

export const metadata: Metadata = {
  title: "Katalog Film Bioskop — Mangeakkk",
  description: "Nonton film bioskop blockbuster dan mahakarya sinema dengan subtitle Indonesia.",
};

export default async function FilmPage() {
  const films = await getFilmList();

  return (
    <CatalogView
      type="film"
      initialItems={films}
      title="Katalog Film Bioskop"
      description="Koleksi film bioskop, pemenang penghargaan, dan film terpopuler dengan resolusi tinggi."
    />
  );
}
