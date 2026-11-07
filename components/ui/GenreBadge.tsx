import React from "react";
import Link from "next/link";

interface GenreBadgeProps {
  genre: string;
  size?: "sm" | "md";
  clickable?: boolean;
}

export default function GenreBadge({
  genre,
  size = "sm",
  clickable = true,
}: GenreBadgeProps) {
  const slug = genre.toLowerCase().replace(/\s+/g, "-");
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-0.5"
      : "text-sm px-3.5 py-1";

  const content = (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-gray-800/80 text-gray-300 border border-gray-700/60 hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/10 transition-colors ${sizeClasses}`}
    >
      {genre}
    </span>
  );

  if (clickable) {
    return <Link href={`/genre/${slug}`}>{content}</Link>;
  }

  return content;
}
