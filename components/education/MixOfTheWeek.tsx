'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useUserProfile } from '@/lib/userStore';
import { Sparkles, Trophy, Repeat, ArrowRight, Layers, ExternalLink } from 'lucide-react';

interface MixOfTheWeekProps {
  compact?: boolean;
}

export default function MixOfTheWeek({ compact = false }: MixOfTheWeekProps) {
  const { mixes } = useStore();
  const spotlightMix = mixes[0]; // Featured standout mix
  const creator = useUserProfile(spotlightMix?.creatorId || '', spotlightMix?.creatorUsername);

  if (!spotlightMix) return null;

  return (
    <div className="relative rounded-3xl p-5 bg-gradient-to-b from-white to-[#F4F5F8] dark:from-[#1F222A] dark:to-[#16181E] border border-[#E2FF66]/50 shadow-[0_0_30px_rgba(226,255,102,0.1)] overflow-hidden transition-all">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#E2FF66]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/50 text-[#0D0E12] dark:text-[#E2FF66] text-[10px] font-extrabold uppercase tracking-wider">
            <Trophy className="w-3 h-3 flex-shrink-0" />
            <span>Mix of the Week</span>
          </div>
          <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] font-semibold">
            Featured
          </span>
        </div>

        {/* Visual Flat-Lay Preview Canvas */}
        <div className="w-full aspect-[4/3] rounded-2xl canvas-bg-obsidian border border-black/10 dark:border-white/10 relative overflow-hidden shadow-inner group">
          {spotlightMix.layers.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-white/50">Empty Look</span>
            </div>
          ) : (
            spotlightMix.layers.map((layer, idx) => (
              <div
                key={`${layer.pieceId}_${idx}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) scale(${layer.scale * 0.75}) rotate(${layer.rotation}deg) ${layer.flipX ? 'scaleX(-1)' : ''}`,
                  zIndex: layer.zIndex,
                }}
              >
                <img
                  src={layer.pieceData?.cutoutImageUrl}
                  alt="Piece"
                  className="max-w-[110px] max-h-[110px] object-contain drop-shadow-md"
                />
              </div>
            ))
          )}
          
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 text-[#E2FF66]" />
            <span>{spotlightMix.layers.length} Pieces</span>
          </div>
        </div>

        {/* Mix Title & Stylist Attribution */}
        <div>
          <h3 className="text-base font-extrabold text-[#0D0E12] dark:text-white leading-snug">
            {spotlightMix.title}
          </h3>
          <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] mt-1 leading-relaxed line-clamp-2">
            {spotlightMix.description || 'A standout outfit combination demonstrating high-low layering and proportions.'}
          </p>
        </div>

        {/* Why This Mix Works (Educational Breakdown) */}
        {spotlightMix.whyItWorks && (
          <div className="p-3 rounded-2xl bg-[#F8F9FA] dark:bg-[#0D0E12]/80 border border-black/5 dark:border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Stylist Insight
            </span>
            <p className="text-[11px] text-[#4B5563] dark:text-[#D1D5DB] italic leading-relaxed line-clamp-3">
              &ldquo;{spotlightMix.whyItWorks}&rdquo;
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Link
            href={`/remix?remixMixId=${spotlightMix.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E2FF66] text-[#0D0E12] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d5f356] shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Remix This Look</span>
          </Link>

          <Link
            href={`/closet/${spotlightMix.creatorUsername}`}
            className="w-full py-2 px-3 rounded-xl bg-black/5 dark:bg-[#1F222A] hover:bg-black/10 dark:hover:bg-[#282C37] text-[#0D0E12] dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-black/5 dark:border-white/10"
          >
            <span>View @{spotlightMix.creatorUsername}&apos;s Closet</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

    </div>
  );
}
