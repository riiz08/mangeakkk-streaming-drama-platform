"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdIframeBanner, { AdBannerType } from "./AdIframeBanner";

interface AdBannerProps {
  slotName?: string;
  variant?: "leaderboard" | "compact" | "slim";
  specificType?: AdBannerType;
  priority?: boolean;
  className?: string;
}

export default function AdBanner({
  slotName = "Banner Sponsor",
  variant = "leaderboard",
  specificType,
  priority = false,
  className = "",
}: AdBannerProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // If a specific type is requested
  if (specificType) {
    return (
      <aside aria-label={slotName} className={`my-2 sm:my-3 flex justify-center ${className}`}>
        <AdIframeBanner type={specificType} priority={priority} />
      </aside>
    );
  }

  // Responsive defaults based on variant:
  // - leaderboard: 728x90 on md+ screen, 320x50 on mobile
  // - compact: 468x60 on sm+ screen, 320x50 on mobile
  // - slim: 320x50
  return (
    <aside
      aria-label={slotName}
      className={`relative w-full my-2 sm:my-3 flex flex-col items-center justify-center ${className}`}
    >
      {variant === "leaderboard" && (
        <>
          <div className="hidden md:block">
            <AdIframeBanner type="728x90" priority={priority} />
          </div>
          <div className="block md:hidden">
            <AdIframeBanner type="320x50" priority={priority} />
          </div>
        </>
      )}

      {variant === "compact" && (
        <>
          <div className="hidden sm:block">
            <AdIframeBanner type="468x60" priority={priority} />
          </div>
          <div className="block sm:hidden">
            <AdIframeBanner type="320x50" priority={priority} />
          </div>
        </>
      )}

      {variant === "slim" && (
        <div>
          <AdIframeBanner type="320x50" priority={priority} />
        </div>
      )}
    </aside>
  );
}
