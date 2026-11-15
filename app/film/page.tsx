import React from "react";
import { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getFilmList } from "@/lib/data/db";

export const revalidate = 86400; // Revalidate setiap 24 jam (1 hari), on-demand revalidation via server actions

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
