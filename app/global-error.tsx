'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#0D0E12] text-white px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#E2FF66]/15 border border-[#E2FF66]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(226,255,102,0.2)]">
          <span className="text-2xl font-black text-[#E2FF66]">F.</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
          FitMix System Error
        </h1>

        <p className="text-xs sm:text-sm text-[#8E95A5] max-w-md mb-8 leading-relaxed">
          We encountered an issue initializing the application. Please click below to refresh the session.
        </p>

        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.35)] hover:scale-105 transition-all"
        >
          Reset Application
        </button>
      </body>
    </html>
  );
}
