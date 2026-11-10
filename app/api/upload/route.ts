import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, isR2Configured, getMimeType } from "@/lib/r2";
import {
  getSignedVideoUrl,
  getSignedPosterUrl,
  getSignedUrlForKey,
} from "@/lib/signed-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes timeout for large video segment uploads

export async function GET() {
  return NextResponse.json({
    configured: isR2Configured(),
    bucket: process.env.R2_BUCKET_NAME || null,
    publicUrl: process.env.R2_PUBLIC_URL || null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "poster";
    const folder = (formData.get("folder") as string) || "general";
    const relativePath = (formData.get("relativePath") as string) || (file?.name ?? "file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudflare R2 belum dikonfigurasi. Harap lengkapi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, dan R2_PUBLIC_URL di file .env.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || getMimeType(file.name);

    let key = "";
    const cleanRelativePath = relativePath.replace(/\\/g, "/").replace(/^\//, "");

    const videoId =
      (formData.get("videoId") as string) ||
      (formData.get("folder") as string) ||
      "media";
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "_") || "general";
    const cleanVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, "_") || "media";
    let signedUrl = "";

    if (type === "poster") {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      key = `posters/${Date.now()}-${sanitizedName}`;
      // In Worker: file.startsWith('posters/') ? file : videos/${videoId}/${file}
      // Passing key as file segment ensures Worker finds `posters/...` directly in R2
      signedUrl = getSignedUrlForKey(cleanVideoId, key);
    } else {
      // type === "video"
      // Worker maps non-poster file to videos/${videoId}/${file}
      // So key in R2 is videos/${cleanFolder}/${cleanRelativePath}
      key = `videos/${cleanFolder}/${cleanRelativePath}`;
      signedUrl = getSignedVideoUrl(cleanFolder, cleanRelativePath);
    }

    const publicUrl = await uploadToR2({
      key,
      buffer,
      contentType: mimeType,
    });

    const isM3U8 = file.name.toLowerCase().endsWith(".m3u8");

    return NextResponse.json({
      success: true,
      url: signedUrl || publicUrl,
      signedUrl,
      publicUrl,
      key,
      filename: file.name,
      size: file.size,
      mimeType,
      isM3U8,
    });
  } catch (error: any) {
    console.error("Error in upload API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mengunggah file ke Cloudflare R2.",
      },
      { status: 500 }
    );
  }
}

