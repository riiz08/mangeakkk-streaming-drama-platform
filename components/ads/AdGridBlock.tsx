"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdIframeBanner from "./AdIframeBanner";

/**
 * AdGridBlock — 8 iklan variasi dalam flexbox:
 * - Desktop: 2 kolom (md:w-1/2)
 * - Mobile: 1 kolom (w-full)
 * - Variasi: 300x250 (Medium Rectangle), 468x60 (Banner), 320x50 (Mobile Banner)
 * - Bebas dari teks label / sponsored
 * - priority={true} untuk fast loading
 * - Tidak tampil di halaman /admin
 */
export default function AdGridBlock() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-y-2 py-1">
      {/* Slot 1: 300x250 Medium Rectangle */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="300x250" priority={true} />
      </div>

      {/* Slot 2: 300x250 Medium Rectangle */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="300x250" priority={true} />
      </div>

      {/* Slot 3: 468x60 (Desktop) / 320x50 (Mobile) */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <div className="hidden sm:block">
          <AdIframeBanner type="468x60" priority={true} />
        </div>
        <div className="block sm:hidden">
          <AdIframeBanner type="320x50" priority={true} />
        </div>
      </div>

      {/* Slot 4: 468x60 (Desktop) / 320x50 (Mobile) */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <div className="hidden sm:block">
          <AdIframeBanner type="468x60" priority={true} />
        </div>
        <div className="block sm:hidden">
          <AdIframeBanner type="320x50" priority={true} />
        </div>
      </div>

      {/* Slot 5: 300x250 Medium Rectangle */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="300x250" priority={true} />
      </div>

      {/* Slot 6: 300x250 Medium Rectangle */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="300x250" priority={true} />
      </div>

      {/* Slot 7: 320x50 Mobile Banner */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="320x50" priority={true} />
      </div>

      {/* Slot 8: 320x50 Mobile Banner */}
      <div className="w-full md:w-1/2 flex justify-center py-1">
        <AdIframeBanner type="320x50" priority={true} />
      </div>
    </div>
  );
}
