'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Piece } from '@/lib/types';
import { useStore } from '@/lib/store';
import { 
  X, 
  Repeat, 
  Sparkles, 
  ExternalLink, 
  Shirt, 
  Info, 
  Heart, 
  Share2, 
  Check,
  Tag,
  Palette
} from 'lucide-react';

interface PieceDetailModalProps {
  piece: Piece;
  onClose: () => void;
}

export default function PieceDetailModal({ piece, onClose }: PieceDetailModalProps) {
  const { getMixesByPiece } = useStore();
  const [isCopied, setIsCopied] = useState(false);
  const remixedMixes = getMixesByPiece(piece.id);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/discover?piece=${piece.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Bottom Sheet / Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 transition-colors">
        
        {/* Mobile Pull Drag Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden flex-shrink-0" />

        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3 bg-white/90 dark:bg-[#16181E]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          
          <Link 
            href={`/closet/${piece.ownerUsername}`} 
            onClick={onClose}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/15 group-hover:border-[#E2FF66] flex-shrink-0">
              <img src={piece.ownerAvatar} alt={piece.ownerName} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate">
                  {piece.ownerName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-[#8E95A5]">
                  Owner
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block truncate">
                @{piece.ownerUsername} • View Closet ↗
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* Garment Studio Showcase Viewport */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#F4F5F8] to-[#E5E7EB] dark:from-[#1F222A] dark:to-[#12141A] flex items-center justify-center p-6 border border-black/5 dark:border-white/10 overflow-hidden shadow-inner">
            
            {/* Ambient Garment Glow */}
            <div className="absolute inset-0 bg-radial from-[#E2FF66]/10 to-transparent pointer-events-none" />

            <img
              src={piece.cutoutImageUrl}
              alt={piece.title}
              className="max-h-full max-w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
            />

            {/* Brand & Category Badges */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#0D0E12]/80 backdrop-blur-md text-[#0D0E12] dark:text-[#E2FF66] border border-black/10 dark:border-white/10 shadow-sm">
                {piece.brandName || 'Independent'}
              </span>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#0D0E12]/80 backdrop-blur-md text-[#64748B] dark:text-[#8E95A5] border border-black/10 dark:border-white/10 shadow-sm capitalize">
                {piece.category}
              </span>
            </div>
          </div>

          {/* Piece Metadata */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66]">
                Isolated Wardrobe Item
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0D0E12] dark:text-white mt-0.5">
                {piece.title}
              </h2>
            </div>

            {piece.description && (
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed">
                {piece.description}
              </p>
            )}

            {/* Styling Education / Notes */}
            {piece.stylingNotes && (
              <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A]/80 border border-black/5 dark:border-white/5 space-y-1">
                <span className="font-semibold text-xs text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Styling Recommendation
                </span>
                <p className="text-xs text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed">
                  {piece.stylingNotes}
                </p>
              </div>
            )}
          </div>

          {/* Remix & Share CTA Bar */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              href={`/remix?preloadPieceId=${piece.id}`}
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.35)] transition-all hover:scale-102 active:scale-95"
            >
              <Repeat className="w-4 h-4 stroke-[2.5]" />
              <span>Remix This Piece in Studio</span>
            </Link>

            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-full border border-black/10 dark:border-white/10 hover:border-[#E2FF66] text-xs font-semibold flex items-center gap-1.5 transition-colors bg-white dark:bg-[#1F222A] text-[#0D0E12] dark:text-white"
              title="Share piece link"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#64748B] dark:text-[#8E95A5]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* "Remixed In Community Looks" Section */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>Featured in Community Looks</span>
              </h4>
              <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] font-semibold">
                {piece.remixCount || remixedMixes.length} remixes
              </span>
            </div>

            {remixedMixes.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A]/40 border border-dashed border-black/10 dark:border-white/10 text-center">
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">
                  Be the first to feature this piece in a flat-lay lookboard!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {remixedMixes.map(mix => (
                  <Link
                    key={mix.id}
                    href={`/remix?remixMixId=${mix.id}`}
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-all flex items-center gap-3 group"
                  >
                    {/* Compact Lookboard Flat-Lay Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden canvas-bg-obsidian relative flex-shrink-0 flex items-center justify-center border border-black/10 dark:border-white/10">
                      {mix.layers.map((l, i) => (
                        l.pieceData && (
                          <img
                            key={i}
                            src={l.pieceData.cutoutImageUrl}
                            alt={l.pieceData.title}
                            className="absolute max-w-[28px] max-h-[28px] object-contain drop-shadow"
                            style={{
                              left: `${l.x}%`,
                              top: `${l.y}%`,
                              transform: `translate(-50%, -50%) scale(${l.scale * 0.45}) rotate(${l.rotation}deg)`,
                              zIndex: l.zIndex
                            }}
                          />
                        )
                      ))}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate">
                        {mix.title}
                      </h6>
                      <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate mt-0.5">
                        styled by <span className="font-semibold text-[#0D0E12] dark:text-white">@{mix.creatorUsername}</span>
                      </p>
                      <span className="text-[10px] font-bold text-[#7B9600] dark:text-[#E2FF66] inline-flex items-center gap-1 mt-1">
                        <span>Remix Look</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
