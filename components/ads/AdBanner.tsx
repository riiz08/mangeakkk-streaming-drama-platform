import React from "react";

interface AdBannerProps {
  slotName?: string;
  variant?: "leaderboard" | "compact" | "slim";
  className?: string;
}

export default function AdBanner({
  slotName = "Banner Sponsor",
  variant = "leaderboard",
  className = "",
}: AdBannerProps) {
  const heightClass =
    variant === "slim"
      ? "h-12 sm:h-14"
      : variant === "compact"
      ? "h-16 sm:h-20"
      : "h-20 sm:h-24 md:h-28";

  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full ${heightClass} my-6 rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900 border border-dashed border-gray-700/80 flex flex-col items-center justify-center p-3 text-center transition-all hover:border-gray-600 ${className}`}
    >
      <span className="absolute top-1.5 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-gray-950/80 rounded border border-gray-800">
        Advertisement
      </span>

      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-xs sm:text-sm font-semibold text-gray-400 tracking-wide">
          {slotName}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 max-w-md hidden sm:block">
          Pasang iklan banner Anda di sini untuk menjangkau ribuan penonton setiap hari.
        </p>
      </div>
    </aside>
  );
}
