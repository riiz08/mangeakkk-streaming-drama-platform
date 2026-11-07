"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import AdIframeBanner from "./AdIframeBanner";

export default function FloatingAdBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously closed the floating ad in this session
    try {
      const isClosed = sessionStorage.getItem("mangeakkk_floating_ad_closed");
      if (!isClosed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  if (pathname?.startsWith("/admin") || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("mangeakkk_floating_ad_closed", "true");
    } catch {
      // ignore
    }
  };

  return (
    <div
      aria-label="Floating Advertisement"
      className="fixed bottom-0 inset-x-0 z-50 flex justify-center items-center py-2 px-3 bg-[#0b0f19]/95 backdrop-blur-md border-t border-gray-800/90 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)] transition-all duration-300 select-none animate-in fade-in slide-in-from-bottom-2"
    >
      <div className="relative flex items-center justify-center">
        {/* Close Button X */}
        <button
          onClick={handleClose}
          aria-label="Tutup Iklan Melayang"
          title="Tutup Iklan"
          className="absolute -top-3.5 -right-3 sm:-right-4 z-20 flex items-center gap-1 px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-[10px] font-bold shadow-lg border border-red-400/40 transition-transform active:scale-90"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
          <span>CLOSE</span>
        </button>

        {/* Desktop: Banner 468x60 */}
        <div className="hidden sm:block">
          <AdIframeBanner type="468x60" priority={true} />
        </div>

        {/* Mobile: Banner 320x50 */}
        <div className="block sm:hidden">
          <AdIframeBanner type="320x50" priority={true} />
        </div>
      </div>
    </div>
  );
}

