'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Search, Bell, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
          : 'bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-400 bg-clip-text text-transparent">
                StreamFlow
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <Link href="/#trending" className="hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/#movies" className="hover:text-white transition-colors">
                Film
              </Link>
              <Link href="/#series" className="hover:text-white transition-colors">
                Series
              </Link>
              <Link href="/#live" className="hover:text-white transition-colors flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Live</span>
              </Link>
            </div>
          </div>

          {/* Search Bar & Actions */}
          <div className="hidden sm:flex items-center space-x-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari film, serial, kreator..."
                className="w-52 md:w-64 pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              aria-label="Notifikasi"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>

            <button
              aria-label="Profil Pengguna"
              className="flex items-center space-x-2 p-1.5 pl-2 pr-3 rounded-full bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                R
              </div>
              <span className="text-xs font-medium text-slate-200">Riiz</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Cari video..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Beranda
          </Link>
          <Link
            href="/#trending"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Trending
          </Link>
          <Link
            href="/#movies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Film
          </Link>
          <Link
            href="/#series"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Series
          </Link>
          <Link
            href="/#live"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
          >
            Live Streams
          </Link>
        </div>
      )}
    </nav>
  );
};

