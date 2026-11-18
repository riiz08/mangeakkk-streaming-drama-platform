"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { ADSTERRA_CONFIGS, AdBannerType } from "@/lib/ads/config";

export interface AdBannerProps {
  type: AdBannerType;
  className?: string;
}

export default function AdBanner({ type, className = "" }: AdBannerProps) {
  const config = ADSTERRA_CONFIGS[type];
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !config || !config.isAvailable) return;

    const container = containerRef.current;
    if (!container) return;

    // Bersihkan isi container jika ada rerender
    container.innerHTML = "";

    if (config.format === "iframe") {
      // Isolasi iframe untuk mencegah benturan global atOptions antar slot
      const iframe = document.createElement("iframe");
      iframe.style.width = `${config.width}px`;
      iframe.style.height = `${config.height}px`;
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.scrolling = "no";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("loading", "lazy");
      iframe.title = `Advertisement ${config.label}`;

      iframe.onload = () => {
        setLoaded(true);
      };

      container.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  background: transparent;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key': '${config.key}',
                  'format': 'iframe',
                  'height': ${config.height},
                  'width': ${config.width},
                  'params': {}
                };
              </script>
              <script type="text/javascript" src="${config.scriptUrl}"></script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    } else if (config.format === "native") {
      // Native banner format: sediakan div container dan script async
      const nativeContainer = document.createElement("div");
      nativeContainer.id = config.containerId || `container-${config.key}`;
      container.appendChild(nativeContainer);

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = config.scriptUrl;
      script.onload = () => {
        setLoaded(true);
      };
      container.appendChild(script);

      // Fallback timer jika script native tidak memicu onload
      const timer = setTimeout(() => {
        setLoaded(true);
      }, 1500);

      return () => {
        clearTimeout(timer);
        if (container) {
          container.innerHTML = "";
        }
      };
    } else if (config.format === "script") {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = config.scriptUrl;
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
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [mounted, config]);

  if (!config) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[AdBanner] Tipe iklan "${type}" tidak ditemukan.`);
    }
    return null;
  }

  // Jika format belum tersedia
  if (!config.isAvailable) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`flex items-center justify-center border border-dashed border-yellow-600/50 bg-yellow-950/20 text-yellow-500 text-xs p-2 text-center rounded-lg ${config.containerClassName || ""} ${className}`}
        >
          <span>[Adsterra {config.label} - Belum Tersedia]</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`adsterra-banner relative overflow-hidden mx-auto my-3 ${config.containerClassName || ""} ${className}`}
      data-ad-type={type}
      id={`adsterra-${type}-${uniqueId}`}
      style={{
        minHeight: config.height ? `${config.height}px` : undefined,
        minWidth: config.width ? `${config.width}px` : undefined,
      }}
    >
      {/* Visual placeholder untuk anti-layout shift (CLS) saat menunggu data iklan */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 border border-gray-800/40 rounded-lg animate-pulse text-[10px] text-gray-500 font-medium tracking-wider uppercase select-none pointer-events-none">
          <span>Advertisement</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex justify-center items-center" />
    </div>
  );
}
