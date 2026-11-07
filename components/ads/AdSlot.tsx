import React from "react";

interface AdSlotProps {
  slotName?: string;
  className?: string;
}

export default function AdSlot({
  slotName = "Iklan Sponsor",
  className = "",
}: AdSlotProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full aspect-[4/3] sm:aspect-square md:aspect-[3/4] max-h-72 rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 border border-dashed border-gray-700/80 flex flex-col items-center justify-center p-4 text-center transition-all hover:border-gray-600 ${className}`}
    >
      <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-gray-950/80 rounded border border-gray-800">
        Ads
      </span>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold">
          AD
        </div>
        <p className="text-xs sm:text-sm font-semibold text-gray-400">{slotName}</p>
        <p className="text-[10px] text-gray-500">Ruang Iklan Terverifikasi</p>
      </div>
    </aside>
  );
}
