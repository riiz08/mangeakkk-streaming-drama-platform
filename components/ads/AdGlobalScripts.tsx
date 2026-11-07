"use client";

import React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdGlobalScripts() {
  const pathname = usePathname();

  // Do not load ads on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* 1. Pop Under Script */}
      <Script
        id="ad-pop-under"
        src="https://pl32245018.profitableratecpmnetwork.com/5e/d9/65/5ed965a8eca7e10ddb8a7695b1a403d6.js"
        strategy="afterInteractive"
      />

      {/* 2. Social Bar Script */}
      <Script
        id="ad-social-bar"
        src="https://pl32245020.profitableratecpmnetwork.com/df/93/2e/df932e42b9f0b6120f52b2d8801f428a.js"
        strategy="afterInteractive"
      />
    </>
  );
}

