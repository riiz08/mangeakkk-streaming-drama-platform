"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdIframeBanner, { AdBannerType } from "./AdIframeBanner";

interface AdSlotProps {
  slotName?: string;
  type?: "300x250" | "160x300" | "160x600";
  priority?: boolean;
  className?: string;
}

export default function AdSlot({
  slotName = "Iklan Sponsor",
  type = "300x250",
  priority = false,
  className = "",
}: AdSlotProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      aria-label={slotName}
      className={`relative my-4 flex items-center justify-center ${className}`}
    >
      <AdIframeBanner type={type as AdBannerType} priority={priority} />
    </aside>
  );
}
