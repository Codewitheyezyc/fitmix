'use client';

import React from 'react';

export default function MixCardSkeleton() {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 p-5 shadow-xl animate-pulse space-y-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex-shrink-0" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3.5 w-32 bg-black/10 dark:bg-white/10 rounded-md" />
          <div className="h-2.5 w-20 bg-black/5 dark:bg-white/5 rounded-md" />
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="w-full h-80 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10" />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
          <div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
        </div>
        <div className="h-6 w-24 bg-[#E2FF66]/30 rounded-full" />
      </div>
    </div>
  );
}
