"use client";

import React from "react";
import AdBanner from "./AdBanner";

interface ResponsiveAdProps {
  className?: string;
}

/**
 * ResponsiveAd secara otomatis menampilkan:
 * - 728x90 Leaderboard di layar desktop (md ke atas: >= 768px)
 * - 320x50 Banner di layar mobile (< 768px)
 * Dilengkapi placeholder min-height untuk mencegah layout shift (CLS).
 */
export default function ResponsiveAd({ className = "" }: ResponsiveAdProps) {
  return (
    <div className={`responsive-ad-wrapper w-full flex justify-center items-center my-4 ${className}`}>
      {/* Desktop Leaderboard (728x90) */}
      <div className="hidden md:flex justify-center items-center w-[728px] h-[90px] min-h-[90px]">
        <AdBanner type="728x90" className="!my-0" />
      </div>

      {/* Mobile Banner (320x50) */}
      <div className="flex md:hidden justify-center items-center w-[320px] h-[50px] min-h-[50px]">
        <AdBanner type="320x50" className="!my-0" />
      </div>
    </div>
  );
}
