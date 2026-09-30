import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-[#E8E6DD] dark:bg-[#1E3326] rounded-md ${className}`}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#14221A] border border-[#E7E5DC] dark:border-[#253D2E] rounded-2xl p-6 space-y-4 shadow-sm">
      {/* Image box placeholder */}
      <div className="h-64 w-full bg-[#F3F2EB] dark:bg-[#1A2C21] rounded-xl relative overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
      </div>
      
      {/* Category tag */}
      <Skeleton className="h-4 w-28 rounded-full" />
      
      {/* Title */}
      <Skeleton className="h-7 w-3/4 rounded-lg" />
      
      {/* Description */}
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
      
      {/* Specs row */}
      <div className="pt-3 border-t border-stone-100 dark:border-[#22382A] flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
};
