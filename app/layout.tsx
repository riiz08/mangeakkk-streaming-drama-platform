import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";
import AdGlobalScripts from "@/components/ads/AdGlobalScripts";
import FloatingAdBanner from "@/components/ads/FloatingAdBanner";

export const metadata: Metadata = {
  title: "Mangeakkk — Nonton Streaming Drama & Film Subtitle Indonesia",
  description:
    "Platform streaming drama Korea, serial TV, dan film bioskop pilihan dengan kualitas tinggi dan pengalaman menonton terbaik.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Mangeakkk — Nonton Streaming Drama & Film",
    description: "Nonton streaming drama dan film favoritmu dengan gratis dan lancar di Mangeakkk.",
    url: "https://mangeakkk.vercel.app",
    siteName: "Mangeakkk",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        {/* Ad Network DNS & Connection Optimization */}
        <link rel="preconnect" href="https://pl32245018.profitableratecpmnetwork.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pl32245019.profitableratecpmnetwork.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pl32245020.profitableratecpmnetwork.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.highrevenueformat.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://bancadeltempoidea.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pl32245018.profitableratecpmnetwork.com" />
        <link rel="dns-prefetch" href="https://pl32245019.profitableratecpmnetwork.com" />
        <link rel="dns-prefetch" href="https://pl32245020.profitableratecpmnetwork.com" />
        <link rel="dns-prefetch" href="https://www.highrevenueformat.com" />
        <link rel="dns-prefetch" href="https://bancadeltempoidea.org" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 antialiased selection:bg-brand-500 selection:text-white pb-16 sm:pb-20">
        {/* Global Ad Network Scripts (Pop Under & Social Bar) */}
        <AdGlobalScripts />

        <Navbar />

        <main className="flex-1 w-full">{children}</main>

        {/* Global Pre-Footer Ad Banner (728x90 on Desktop, 320x50 on Mobile) */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <AdBanner slotName="Pre-Footer Global Sponsor" />
        </div>

        {/* Sticky Floating Bottom Ad Banner (468x60 Desktop / 320x50 Mobile with Close Button) */}
        <FloatingAdBanner />

        <Footer />
      </body>
    </html>
  );
}
