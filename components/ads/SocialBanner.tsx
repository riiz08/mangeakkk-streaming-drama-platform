"use client";

import React, { useEffect, useRef, useState } from "react";
import { ADSTERRA_CONFIGS } from "@/lib/ads/config";

interface SocialBannerProps {
  className?: string;
}

export default function SocialBanner({ className = "" }: SocialBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const config = ADSTERRA_CONFIGS.social;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !config || !config.isAvailable) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.src = config.scriptUrl;
    script.async = true;

    script.onload = () => {
      setLoaded(true);
    };

    container.appendChild(script);

    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [config]);

  return (
    <div
      className={`social-banner-container relative mx-auto my-4 w-full max-w-5xl overflow-hidden min-h-[60px] sm:min-h-[80px] ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 border border-gray-800/40 rounded-xl animate-pulse text-[11px] text-gray-500 font-medium tracking-wider uppercase select-none pointer-events-none">
          <span>Advertisement</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex justify-center items-center" />
    </div>
  );
}
