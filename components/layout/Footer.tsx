import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080b12] border-t border-gray-800/80 mt-16 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo/logo.svg"
                  alt="Mangeakkk Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Mangeak<span className="text-brand-500">kk</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Platform streaming modern untuk menonton TV Series, drama Korea, Asia, dan film bioskop pilihan berkualitas tinggi.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-brand-600 hover:text-white transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-brand-600 hover:text-white transition-colors" aria-label="Komunitas">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-brand-600 hover:text-white transition-colors" aria-label="Bagikan">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Jelajahi</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-brand-500 transition-colors">Beranda</Link></li>
              <li><Link href="/drama" className="hover:text-brand-500 transition-colors">Drama & TV Series</Link></li>
              <li><Link href="/film" className="hover:text-brand-500 transition-colors">Film Bioskop</Link></li>
              <li><Link href="/search" className="hover:text-brand-500 transition-colors">Pencarian</Link></li>
            </ul>
          </div>

          {/* Tipe Konten */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Kategori</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/drama" className="hover:text-brand-500 transition-colors">Serial Drama Korea</Link></li>
              <li><Link href="/drama" className="hover:text-brand-500 transition-colors">TV Series Trending</Link></li>
              <li><Link href="/film" className="hover:text-brand-500 transition-colors">Film Pilihan</Link></li>
              <li><Link href="/film" className="hover:text-brand-500 transition-colors">Film Blockbuster</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Bantuan & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-brand-500 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Ketentuan Layanan</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Pasang Iklan</a></li>
              <li><Link href="/admin" className="text-zinc-500 hover:text-brand-400 transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} Mangeakkk. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500 inline" /> untuk pecinta streaming.
          </p>
        </div>
      </div>
    </footer>
  );
}
