import React from "react";
import { SkeletonHero, SkeletonRow } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <SkeletonHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}

