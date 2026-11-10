import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    accountId === "sample_account_id"
  ) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL &&
      process.env.R2_ACCOUNT_ID !== "sample_account_id"
  );
}

export function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "m3u8":
      return "application/vnd.apple.mpegurl";
    case "ts":
      return "video/mp2t";
    case "mp4":
      return "video/mp4";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "key":
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}

export async function uploadToR2({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
}): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || "mangeakkk";
  let publicUrl = process.env.R2_PUBLIC_URL || "";
  if (publicUrl.endsWith("/")) {
    publicUrl = publicUrl.slice(0, -1);
  }

  if (!client || !isR2Configured()) {
    throw new Error(
      "Cloudflare R2 belum dikonfigurasi. Harap lengkapi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, dan R2_PUBLIC_URL di file .env."
    );
  }

  const cleanKey = key.startsWith("/") ? key.slice(1) : key;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${publicUrl}/${cleanKey}`;
}

