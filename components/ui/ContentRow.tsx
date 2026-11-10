"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import { Content } from "@/lib/data/mock";

interface ContentRowProps {
  title: string;
  items: Content[];
  viewAllHref?: string;
  subtitle?: string;
  emptyText?: string;
}

export default function ContentRow({
  title,
  items,
  viewAllHref,
  subtitle,
  emptyText = "Belum Tersedia",
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasItems = Boolean(items && items.length > 0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative my-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {hasItems && (
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-xs sm:text-sm font-semibold text-brand-500 hover:text-brand-400 mr-2 transition-colors"
              >
                Lihat Semua →
              </Link>
            )}

            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Container or Fallback */}
      {hasItems ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[190px] md:w-[210px] shrink-0">
              <ContentCard content={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-10 px-4 rounded-2xl bg-gray-900/30 border border-gray-800/80 flex flex-col items-center justify-center text-center">
          <p className="text-sm sm:text-base font-medium text-gray-400 tracking-wide">
            {emptyText}
          </p>
        </div>
      )}
    </section>
  );
}

