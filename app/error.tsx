'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Page Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#FAFAFC] dark:bg-[#0D0E12] transition-colors">
      <div className="w-16 h-16 rounded-3xl bg-[#E2FF66]/15 border border-[#E2FF66]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(226,255,102,0.2)]">
        <span className="text-2xl font-black text-[#7B9600] dark:text-[#E2FF66]">F.</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0E12] dark:text-white mb-2">
        Something unexpected happened
      </h2>

      <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8E95A5] max-w-md mb-8 leading-relaxed">
        The application encountered a temporary error loading this view. You can reload the page or return to the feed.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.35)] hover:scale-105 transition-all"
        >
          Reload Page
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-full text-xs font-semibold bg-black/5 dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:bg-black/10 dark:hover:bg-[#282C37] border border-black/5 dark:border-white/10 transition-colors"
        >
          Return to Feed
        </Link>
      </div>
    </div>
  );
}
