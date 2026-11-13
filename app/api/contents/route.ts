import { NextResponse } from "next/server";
import {
  getAllContents,
  getDramaList,
  getFilmList,
  getTrendingList,
  getFeaturedContent,
  searchContents,
} from "@/lib/data/db";

export const revalidate = 86400; // 24 jam cache di edge

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "tv-series" | "film"
    const filter = searchParams.get("filter"); // "trending" | "featured"
    const q = searchParams.get("q"); // search query

    let data;

    if (q) {
      data = await searchContents(q);
    } else if (filter === "featured") {
      data = await getFeaturedContent();
    } else if (filter === "trending") {
      data = await getTrendingList();
    } else if (type === "tv-series") {
      data = await getDramaList();
    } else if (type === "film") {
      data = await getFilmList();
    } else {
      data = await getAllContents();
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch contents" },
      { status: 500 }
    );
  }
}

