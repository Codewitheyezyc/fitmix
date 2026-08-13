'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mix, Piece, Comment } from '@/lib/types';
import { renderMentionText } from '@/lib/mentionUtils';
import { useStore } from '@/lib/store';
import { 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Repeat, 
  Share2, 
  Sparkles, 
  Info, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import MixCommentsModal from '@/components/feed/MixCommentsModal';
import UserAvatar from '@/components/ui/UserAvatar';

interface MixCardProps {
  mix: Mix;
}

export default function MixCard({ mix }: MixCardProps) {
  const { toggleLikeMix, toggleSaveMix, toggleFollowUser, users, currentUser } = useStore();
  const [showWhyItWorks, setShowWhyItWorks] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [showPieceDrawer, setShowPieceDrawer] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?mix=${mix.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const creator = users.find(u => u.id === mix.creatorId) || {
    id: mix.creatorId,
    username: mix.creatorUsername,
    displayName: mix.creatorName,
    avatarUrl: mix.creatorAvatar,
    isFollowing: false
  };

  const isOwner = currentUser.id === mix.creatorId;

  return (
    <>
      <article className="w-full rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 overflow-hidden shadow-xl transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 mb-8">
        
        {/* Card Header: Creator Info */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5">
          <Link 
            href={`/closet/${mix.creatorUsername}`}
            className="flex items-center gap-3 group min-w-0"
          >
            <UserAvatar 
              src={mix.creatorAvatar} 
              name={mix.creatorName || mix.creatorUsername} 
              size="md" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-sm text-[#0D0E12] dark:text-white group-hover:text-[#B5DB10] dark:group-hover:text-[#E2FF66] transition-colors truncate">
                  {mix.creatorName}
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#8E95A5] truncate">@{mix.creatorUsername}</span>
              </div>
              
              {/* Lineage indicator */}
              {mix.parentMixCreatorUsername ? (
                <div className="flex items-center gap-1 text-[11px] text-[#7B9600] dark:text-[#E2FF66] font-medium truncate">
                  <Repeat className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    Remixed from <strong className="text-[#0D0E12] dark:text-white">@{mix.parentMixCreatorUsername}</strong>
                    {mix.parentMixTitle ? ` • "${mix.parentMixTitle}"` : ''}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-[#94A3B8] dark:text-[#6B7280] block truncate">
                  {mix.techniqueTags?.[0] || 'Stylist'}
                </span>
              )}
            </div>
          </Link>

          {!isOwner && (
            <button
              onClick={() => toggleFollowUser(creator.id)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full border transition-all flex-shrink-0 ${
                creator.isFollowing
                  ? 'bg-transparent text-[#64748B] dark:text-[#8E95A5] border-black/10 dark:border-white/15 hover:text-black dark:hover:text-white'
                  : 'bg-black/5 dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border-black/10 dark:border-white/20 hover:border-[#E2FF66] hover:text-[#B5DB10] dark:hover:text-[#E2FF66]'
              }`}
            >
              {creator.isFollowing ? 'Following' : '+ Follow'}
            </button>
          )}
        </div>

        {/* Flat-Lay Collage Canvas Viewport */}
        <div className={`relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden ${
          mix.canvasBackground === 'paper' ? 'canvas-bg-paper' :
          mix.canvasBackground === 'velvet' ? 'canvas-bg-velvet' :
          mix.canvasBackground === 'grid' ? 'canvas-bg-grid' :
          mix.canvasBackground === 'warm' ? 'canvas-bg-warm' :
          'canvas-bg-obsidian'
        }`}>
          
          {/* Render Layers */}
          {mix.layers.map((layer, idx) => {
            const piece = layer.pieceData;
            if (!piece) return null;

            return (
              <div
                key={`${layer.pieceId}_${idx}`}
                onClick={() => setSelectedPiece(piece)}
                className="absolute cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50 group"
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg) ${layer.flipX ? 'scaleX(-1)' : ''}`,
                  zIndex: layer.zIndex,
                }}
                title={`${piece.title} by @${piece.ownerUsername}`}
              >
                <img
                  src={piece.cutoutImageUrl}
                  alt={piece.title}
                  className="max-w-[140px] sm:max-w-[190px] max-h-[140px] sm:max-h-[190px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  draggable={false}
                />
              </div>
            );
          })}

          {/* Quick Remix Button */}
          <Link
            href={`/remix?remixMixId=${mix.id}`}
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.4)] hover:bg-[#d5f356] hover:scale-105 active:scale-95 transition-all"
          >
            <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Remix Look</span>
          </Link>
        </div>

        {/* Community Styling Advice Request Banner */}
        {mix.techniqueTags?.includes('Help Me Style This') && (
          <div className="mx-4 sm:mx-5 mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#E2FF66]/20 via-[#E2FF66]/10 to-transparent border border-[#E2FF66]/40 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E2FF66] animate-ping" />
              <div>
                <p className="text-xs font-bold text-[#0D0E12] dark:text-white">
                  Styling Advice Requested
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                  @{mix.creatorUsername} is looking for piece swaps & makeover ideas!
                </p>
              </div>
            </div>
            <Link
              href={`/remix?remixMixId=${mix.id}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Give Makeover</span>
            </Link>
          </div>
        )}

        {/* Card Body: Technique Tags, Title & Fashion Education breakdown */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Technique Badges */}
          {mix.techniqueTags && mix.techniqueTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {mix.techniqueTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    tag === 'Help Me Style This'
                      ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] shadow-sm'
                      : 'bg-black/5 dark:bg-[#1F222A] text-[#7B9600] dark:text-[#E2FF66] border-black/5 dark:border-white/5'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white">
              {mix.title}
            </h3>
            {mix.description && (
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] mt-1 leading-relaxed">
                {renderMentionText(mix.description)}
              </p>
            )}
          </div>

          {/* "Why This Mix Works" Fashion Literacy Accordion */}
          {mix.whyItWorks && (
            <div className="rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A]/70 border border-black/5 dark:border-white/5 p-3">
              <button
                onClick={() => setShowWhyItWorks(!showWhyItWorks)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#7B9600] dark:text-[#E2FF66] hover:underline"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Why this mix works (Fashion Breakdown)
                </span>
                {showWhyItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showWhyItWorks && (
                <div className="text-xs text-[#4B5563] dark:text-[#B0B7C6] mt-2 pt-2 border-t border-black/5 dark:border-white/5 leading-relaxed italic">
                  &ldquo;{renderMentionText(mix.whyItWorks)}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Tagged Pieces Drawer */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E95A5] flex items-center gap-1.5">
                <Info className="w-3 h-3" />
                Featured Pieces ({mix.layers.length})
              </span>
              <button
                onClick={() => setShowPieceDrawer(!showPieceDrawer)}
                className="text-[10px] text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white"
              >
                {showPieceDrawer ? 'Collapse' : 'Show All'}
              </button>
            </div>

            {showPieceDrawer && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {mix.layers.map((layer, idx) => {
                  const piece = layer.pieceData;
                  if (!piece) return null;

                  return (
                    <div
                      key={`drawer_${piece.id}_${idx}`}
                      onClick={() => setSelectedPiece(piece)}
                      className="flex-shrink-0 w-36 p-2 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <div className="w-full h-16 rounded-lg bg-black/5 dark:bg-black/40 flex items-center justify-center p-1 overflow-hidden mb-1.5">
                        <img
                          src={piece.cutoutImageUrl}
                          alt={piece.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h6 className="text-[11px] font-semibold text-[#0D0E12] dark:text-white truncate">
                        {piece.title}
                      </h6>
                      <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">
                        by <span className="text-[#7B9600] dark:text-[#E2FF66] font-semibold">@{piece.ownerUsername}</span>
                      </p>
                      <div className="mt-1 pt-1 border-t border-black/5 dark:border-white/5">
                        <Link
                          href={`/remix?remixMixId=${mix.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline flex items-center gap-1"
                        >
                          <Repeat className="w-2.5 h-2.5 stroke-[2.5]" />
                          <span>Swap in Studio</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card Action Bar */}
          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#64748B] dark:text-[#8E95A5]">
            <div className="flex items-center gap-4">
              
              {/* Like Button */}
              <button
                onClick={() => toggleLikeMix(mix.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  mix.isLiked ? 'text-rose-500 font-bold' : 'hover:text-black dark:hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${mix.isLiked ? 'fill-rose-500' : ''}`} />
                <span>{mix.likesCount}</span>
              </button>

              {/* Comments */}
              <button
                onClick={() => setIsCommentsOpen(true)}
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{mix.commentsCount || 0}</span>
              </button>

              {/* Save/Bookmark */}
              <button
                onClick={() => toggleSaveMix(mix.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  mix.isSaved ? 'text-[#7B9600] dark:text-[#E2FF66] font-bold' : 'hover:text-black dark:hover:text-white'
                }`}
                title={mix.isSaved ? 'Saved to Closet' : 'Save to Closet'}
              >
                <Bookmark className={`w-4 h-4 ${mix.isSaved ? 'fill-[#E2FF66]' : ''}`} />
              </button>

              {/* Share to Clipboard Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[#7B9600] dark:hover:text-[#E2FF66] transition-colors"
                title="Share Mix link"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="text-[11px]">Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Remix Counter & Direct Link */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                {mix.remixCount || 0} remixes
              </span>
              <Link
                href={`/remix?remixMixId=${mix.id}`}
                className="text-[#7B9600] dark:text-[#E2FF66] hover:underline font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>Remix</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </article>

      {/* Piece Detail Modal when clicking any item */}
      {selectedPiece && (
        <PieceDetailModal
          piece={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}

      {/* Mix Comments Modal */}
      {isCommentsOpen && (
        <MixCommentsModal
          mix={mix}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
}
