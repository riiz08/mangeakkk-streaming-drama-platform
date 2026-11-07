"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface AdNativeBannerProps {
  className?: string;
}

export default function AdNativeBanner({ className = "" }: AdNativeBannerProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 100px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #container-4e7f9cf9b069462c8d8926d8cfb6605e {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="container-4e7f9cf9b069462c8d8926d8cfb6605e"></div>
  <script async="async" data-cfasync="false" src="https://pl32245019.profitableratecpmnetwork.com/4e7f9cf9b069462c8d8926d8cfb6605e/invoke.js"></script>
</body>
</html>`;

  return (
    <aside
      aria-label="Native Advertisement"
      className={`relative w-full max-w-4xl mx-auto my-6 p-2 rounded-xl bg-gray-900/40 border border-gray-800/80 flex flex-col items-center justify-center ${className}`}
    >
      <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1.5 self-center select-none">
        Sponsored Content (Native 4:1)
      </span>
      <iframe
        title="ad-native-4-1"
        srcDoc={srcDoc}
        width="100%"
        height="120"
        scrolling="no"
        frameBorder="0"
        className="w-full rounded-lg max-w-3xl"
        style={{ border: 0, overflow: "hidden", minHeight: "100px" }}
      />
    </aside>
  );
}

