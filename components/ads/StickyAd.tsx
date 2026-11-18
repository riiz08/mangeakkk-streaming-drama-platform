"use client";

import React, { useState, useEffect } from "react";
import AdBanner from "./AdBanner";
import { X } from "lucide-react";

interface StickyAdProps {
  delayMs?: number;
}

export default function StickyAd({ delayMs = 5000 }: StickyAdProps) {
  const [closed, setClosed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (closed || !visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md border-t border-gray-800/80 py-2 px-3 shadow-2xl transition-all duration-300">
      <div className="relative w-fit flex items-center justify-center">
        <button
          onClick={() => setClosed(true)}
          aria-label="Tutup iklan"
          className="absolute -top-4 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110 flex items-center justify-center z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex justify-center items-center overflow-hidden">
          <AdBanner type="320x50" className="!my-0" />
        </div>
      </div>
    </div>
  );
}
