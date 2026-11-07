"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export type AdBannerType =
  | "728x90"
  | "468x60"
  | "320x50"
  | "300x250"
  | "160x300"
  | "160x600";

interface AdConfig {
  key: string;
  width: number;
  height: number;
  scriptUrl: string;
}

const AD_CONFIGS: Record<AdBannerType, AdConfig> = {
  "728x90": {
    key: "cabaf73ee59c135e3a9bcab5edf35b47",
    width: 728,
    height: 90,
    scriptUrl: "https://www.highrevenueformat.com/cabaf73ee59c135e3a9bcab5edf35b47/invoke.js",
  },
  "468x60": {
    key: "570956abb47838f8c2ac5aca6af959ef",
    width: 468,
    height: 60,
    scriptUrl: "https://www.highrevenueformat.com/570956abb47838f8c2ac5aca6af959ef/invoke.js",
  },
  "320x50": {
    key: "b4fafb58436579971aecf4bfd65c105c",
    width: 320,
    height: 50,
    scriptUrl: "https://www.highrevenueformat.com/b4fafb58436579971aecf4bfd65c105c/invoke.js",
  },
  "300x250": {
    key: "eed91600433761384f36f499540649ff",
    width: 300,
    height: 250,
    scriptUrl: "https://bancadeltempoidea.org/22/eed91600433761384f36f499540649ff",
  },
  "160x300": {
    key: "5365f43eb28d2e588cf4078bfedfe94b",
    width: 160,
    height: 300,
    scriptUrl: "https://bancadeltempoidea.org/22/5365f43eb28d2e588cf4078bfedfe94b",
  },
  "160x600": {
    key: "6292755035e166c1f0ad7a844c5d9eea",
    width: 160,
    height: 600,
    scriptUrl: "https://bancadeltempoidea.org/22/6292755035e166c1f0ad7a844c5d9eea",
  },
};

interface AdIframeBannerProps {
  type: AdBannerType;
  priority?: boolean;
  className?: string;
}

export default function AdIframeBanner({
  type,
  priority = false,
  className = "",
}: AdIframeBannerProps) {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading optimization using Intersection Observer
  useEffect(() => {
    if (priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px" } // Pre-load 250px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const config = AD_CONFIGS[type];
  if (!config) return null;

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${config.key}',
      'format' : 'iframe',
      'height' : ${config.height},
      'width' : ${config.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="${config.scriptUrl}"></script>
</body>
</html>`;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center mx-auto overflow-hidden ${className}`}
      style={{
        maxWidth: "100%",
        width: `${config.width}px`,
        minHeight: `${config.height + 18}px`, // Fixed dimensions prevents CLS
      }}
    >
      <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1 select-none">
        Advertisement
      </span>

      {shouldLoad ? (
        <iframe
          title={`ad-${type}`}
          srcDoc={srcDoc}
          width={config.width}
          height={config.height}
          scrolling="no"
          frameBorder="0"
          className="rounded-lg shadow-sm border border-gray-800/60 max-w-full"
          style={{
            border: 0,
            overflow: "hidden",
            width: `${config.width}px`,
            height: `${config.height}px`,
          }}
        />
      ) : (
        <div
          className="rounded-lg bg-gray-900/40 border border-gray-800/40 animate-pulse"
          style={{
            width: `${config.width}px`,
            maxWidth: "100%",
            height: `${config.height}px`,
          }}
        />
      )}
    </div>
  );
}
