import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
