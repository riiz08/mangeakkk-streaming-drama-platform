import { NextResponse } from "next/server";
import { getContentBySlug, getRelatedContents } from "@/lib/data/db";

export const revalidate = 86400; // 24 jam cache di edge

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const content = await getContentBySlug(slug);

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    const related = await getRelatedContents(content);

    return NextResponse.json(
      { content, related },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch content" },
      { status: 500 }
    );
  }
}

