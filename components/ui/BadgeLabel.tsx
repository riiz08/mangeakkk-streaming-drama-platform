import React from "react";
import { Flame, Sparkles, Award, Star } from "lucide-react";

export type BadgeType = "hot" | "new" | "pilihan" | "featured";

interface BadgeLabelProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BadgeLabel({ type, size = "sm", className = "" }: BadgeLabelProps) {
  if (type === "hot") {
    const sizeClasses =
      size === "lg"
        ? "text-xs px-3 py-1 gap-1.5"
        : size === "md"
        ? "text-[11px] px-2.5 py-0.5 gap-1"
        : "text-[10px] px-2 py-0.5 gap-1";

    return (
      <span
        className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-red-500/30 border border-red-400/30 ${sizeClasses} ${className}`}
      >
        <Flame className={size === "lg" ? "w-3.5 h-3.5 fill-white" : "w-3 h-3 fill-white"} />
        <span>HOT</span>
      </span>
    );
  }

  if (type === "new") {
    const sizeClasses =
      size === "lg"
        ? "text-xs px-3 py-1 gap-1.5"
        : size === "md"
        ? "text-[11px] px-2.5 py-0.5 gap-1"
        : "text-[10px] px-2 py-0.5 gap-1";

    return (
      <span
        className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/30 ${sizeClasses} ${className}`}
      >
        <Sparkles className={size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"} />
        <span>NEW</span>
      </span>
    );
  }

  if (type === "pilihan") {
    const sizeClasses =
      size === "lg"
        ? "text-xs px-3 py-1 gap-1.5"
        : size === "md"
        ? "text-[11px] px-2.5 py-0.5 gap-1"
        : "text-[10px] px-2 py-0.5 gap-1";

    return (
      <span
        className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-500/30 border border-amber-300/40 ${sizeClasses} ${className}`}
      >
        <Award className={size === "lg" ? "w-3.5 h-3.5 fill-black" : "w-3 h-3 fill-black"} />
        <span>Pilihan</span>
      </span>
    );
  }

  if (type === "featured") {
    return (
      <span
        className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-lg bg-gradient-to-r from-brand-600 via-rose-500 to-pink-600 text-white shadow-lg shadow-brand-500/40 border border-white/20 px-3.5 py-1 text-xs gap-1.5 ${className}`}
      >
        <Star className="w-3.5 h-3.5 fill-white" />
        <span>Drama Unggulan</span>
      </span>
    );
  }

  return null;
}
