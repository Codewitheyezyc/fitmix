'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Sparkles, Trophy, Repeat, ArrowRight, Eye } from 'lucide-react';

export default function MixOfTheWeek() {
  const { mixes } = useStore();
  const spotlightMix = mixes[0]; // Featured standout mix

  if (!spotlightMix) return null;

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#F8F9FA] to-[#ECEEF3] dark:from-[#1F222A] dark:via-[#16181E] dark:to-[#0D0E12] border border-[#E2FF66]/40 shadow-[0_0_40px_rgba(226,255,102,0.12)] overflow-hidden mb-12 transition-colors">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E2FF66]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
        
        {/* Left Editorial Text */}
        <div className="flex-1 space-y-4 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/50 text-[#0D0E12] dark:text-[#E2FF66] text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mix of the Week Spotlight</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0E12] dark:text-white leading-tight">
            {spotlightMix.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed max-w-xl">
            {spotlightMix.description || 'A masterful combination demonstrating color harmony, textural contrast, and balanced proportions.'}
          </p>

          {/* Educational Breakdown */}
          {spotlightMix.whyItWorks && (
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-[#0D0E12]/80 border border-black/5 dark:border-white/10 space-y-1">
              <span className="text-xs font-bold text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Why This Mix Works (Stylist Insight)
              </span>
              <p className="text-xs text-[#0D0E12] dark:text-[#F8F9FA] italic leading-relaxed">
                &ldquo;{spotlightMix.whyItWorks}&rdquo;
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/remix?remixMixId=${spotlightMix.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all hover:scale-105"
            >
              <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Remix This Look</span>
            </Link>

            <Link
              href={`/closet/${spotlightMix.creatorUsername}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-[#0D0E12] dark:text-white bg-black/5 dark:bg-[#1F222A] hover:bg-black/10 dark:hover:bg-[#282C37] border border-black/10 dark:border-white/10 transition-colors"
            >
              <span>View @{spotlightMix.creatorUsername}&apos;s Closet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Right Flat-Lay Mini Preview */}
        <div className="w-full lg:w-80 aspect-square rounded-2xl canvas-bg-obsidian border border-black/10 dark:border-white/10 relative overflow-hidden flex items-center justify-center p-4 shadow-xl">
          {spotlightMix.layers.map((l, idx) => (
            l.pieceData && (
              <img
                key={idx}
                src={l.pieceData.cutoutImageUrl}
                alt={l.pieceData.title}
                className="absolute max-w-[90px] max-h-[90px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  transform: `translate(-50%, -50%) scale(${l.scale * 0.9}) rotate(${l.rotation}deg)`,
                  zIndex: l.zIndex,
                }}
              />
            )
          ))}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white">
            {spotlightMix.layers.length} Pieces
          </div>
        </div>

      </div>

    </div>
  );
}
