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
  Check
} from 'lucide-react';

interface PieceDetailModalProps {
  piece: Piece;
  onClose: () => void;
}

export default function PieceDetailModal({ piece, onClose }: PieceDetailModalProps) {
  const { getMixesByPiece } = useStore();
  const [isCopied, setIsCopied] = useState(false);
  const remixedMixes = getMixesByPiece(piece.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 p-6 shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Link 
              href={`/closet/${piece.ownerUsername}`} 
              onClick={onClose}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/15 group-hover:border-[#E2FF66]">
                <img src={piece.ownerAvatar} alt={piece.ownerName} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66]">
                  {piece.ownerName}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block">@{piece.ownerUsername}</span>
              </div>
            </Link>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Piece Hero Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Isolated Cutout Display */}
          <div className="w-full h-72 rounded-2xl transparency-grid flex items-center justify-center p-6 border border-black/10 dark:border-white/10 relative overflow-hidden bg-white dark:bg-black/40">
            <img
              src={piece.cutoutImageUrl}
              alt={piece.title}
              className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500"
            />
            {piece.brandName && (
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#0D0E12]/80 backdrop-blur-md text-[#0D0E12] dark:text-[#E2FF66] border border-black/10 dark:border-[#E2FF66]/30">
                {piece.brandName}
              </span>
            )}
          </div>

          {/* Piece Metadata & Action */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E95A5]">
                {piece.category} • Posted in Closet
              </span>
              <h2 className="text-xl font-bold text-[#0D0E12] dark:text-white mt-1">
                {piece.title}
              </h2>

              {piece.description && (
                <p className="text-xs text-[#4B5563] dark:text-[#B0B7C6] mt-2 leading-relaxed">
                  {piece.description}
                </p>
              )}

              {/* Styling Notes / Education */}
              {piece.stylingNotes && (
                <div className="mt-4 p-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A]/80 border border-black/5 dark:border-white/5 text-xs text-[#4B5563] dark:text-[#B0B7C6]">
                  <span className="font-semibold text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    How to Style This Piece
                  </span>
                  {piece.stylingNotes}
                </div>
              )}
            </div>

            {/* Remix & Share CTA Buttons */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center gap-3">
              <Link
                href={`/remix?preloadPieceId=${piece.id}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] hover:scale-102 transition-all"
              >
                <Repeat className="w-4 h-4 stroke-[2.5]" />
                <span>Remix This Piece in Studio</span>
              </Link>

              <button
                onClick={async () => {
                  try {
                    const shareUrl = `${window.location.origin}/discover?piece=${piece.id}`;
                    await navigator.clipboard.writeText(shareUrl);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2500);
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="px-4 py-3 rounded-full border border-black/10 dark:border-white/10 hover:border-[#E2FF66] text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

          </div>

        </div>

        {/* "Remixed By (N)" Community Stream */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              Remixed in {remixedMixes.length} Community Looks
            </h4>
            <span className="text-xs text-[#64748B] dark:text-[#8E95A5]">
              {piece.remixCount || remixedMixes.length} total remixes
            </span>
          </div>

          {remixedMixes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A]/40 border border-dashed border-black/10 dark:border-white/10 text-center">
              <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">
                Be the first to remix this piece! Tap &quot;Remix This Piece in Studio&quot; above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {remixedMixes.map(mix => (
                <Link
                  key={mix.id}
                  href={`/remix?remixMixId=${mix.id}`}
                  onClick={onClose}
                  className="p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-all group"
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden canvas-bg-obsidian relative mb-2 flex items-center justify-center">
                    {mix.layers.slice(0, 3).map((l, i) => (
                      l.pieceData && (
                        <img
                          key={i}
                          src={l.pieceData.cutoutImageUrl}
                          alt={l.pieceData.title}
                          className="absolute max-w-[50px] max-h-[50px] object-contain drop-shadow"
                          style={{
                            left: `${l.x}%`,
                            top: `${l.y}%`,
                            transform: `translate(-50%, -50%) scale(${l.scale * 0.5})`,
                          }}
                        />
                      )
                    ))}
                  </div>
                  <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate">
                    {mix.title}
                  </h6>
                  <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5]">
                    by @{mix.creatorUsername}
                  </p>
                </Link>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
