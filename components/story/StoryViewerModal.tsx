'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { UserStoryGroup, Story } from '@/lib/types';
import { renderMentionText } from '@/lib/mentionUtils';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Send, 
  MessageCircle, 
  Share2, 
  Trash2, 
  MoreHorizontal, 
  Sparkles,
  Repeat,
  Eye,
  Check
} from 'lucide-react';

interface StoryViewerModalProps {
  storyGroups: UserStoryGroup[];
  initialGroupIndex: number;
  initialStoryIndex?: number;
  onClose: () => void;
}

export default function StoryViewerModal({ 
  storyGroups, 
  initialGroupIndex, 
  initialStoryIndex = 0, 
  onClose 
}: StoryViewerModalProps) {
  const { currentUser, deleteStory, toggleLikeStory, sendMessage } = useStore();

  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isLikeHeartAnimating, setIsLikeHeartAnimating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentGroup = storyGroups[groupIndex];
  const currentStories = currentGroup?.stories || [];
  const currentStory: Story | undefined = currentStories[storyIndex];
  const isMyStory = currentGroup?.userId === currentUser.id;

  // Auto-advance timer (5 seconds per slide)
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const durationMs = 5000;
    const intervalMs = 50;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [groupIndex, storyIndex, isPaused, currentStory]);

  // Navigate to Next Story
  const handleNext = () => {
    setProgress(0);
    setShowOptionsMenu(false);

    if (storyIndex < currentStories.length - 1) {
      // Next story in current group
      setStoryIndex(storyIndex + 1);
    } else if (groupIndex < storyGroups.length - 1) {
      // Next user group
      setGroupIndex(groupIndex + 1);
      setStoryIndex(0);
    } else {
      // End of all stories
      onClose();
    }
  };

  // Navigate to Previous Story
  const handlePrev = () => {
    setProgress(0);
    setShowOptionsMenu(false);

    if (storyIndex > 0) {
      // Previous story in current group
      setStoryIndex(storyIndex - 1);
    } else if (groupIndex > 0) {
      // Previous user group (go to their last story)
      const prevGroupStories = storyGroups[groupIndex - 1].stories;
      setGroupIndex(groupIndex - 1);
      setStoryIndex(Math.max(0, prevGroupStories.length - 1));
    }
  };

  // Like Action
  const handleLike = () => {
    if (!currentStory) return;
    toggleLikeStory(currentStory.id);
    setIsLikeHeartAnimating(true);
    setTimeout(() => setIsLikeHeartAnimating(false), 900);
  };

  // Send Direct Message Reply
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !currentGroup) return;

    sendMessage(
      currentGroup.userId, 
      `Replied to story: "${replyMessage.trim()}"`,
      undefined,
      currentStory?.pieceId
    );

    setIsSent(true);
    setReplyMessage('');
    setIsPaused(false);
    setTimeout(() => setIsSent(false), 2500);
  };

  // Delete current story
  const handleDeleteCurrentStory = () => {
    if (!currentStory) return;
    deleteStory(currentStory.id);
    setShowOptionsMenu(false);
    
    if (currentStories.length <= 1) {
      onClose();
    } else {
      handleNext();
    }
  };

  // Calculate time ago
  const getTimeAgo = (isoString?: string) => {
    if (!isoString) return '1h';
    const diffHours = Math.max(1, Math.round((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60)));
    return `${diffHours}h`;
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none animate-in fade-in duration-200">
      
      {/* Background backdrop blur */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-3xl scale-125 pointer-events-none"
        style={{
          backgroundImage: `url(${currentStory.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Desktop Previous Button */}
      {(groupIndex > 0 || storyIndex > 0) && (
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hidden md:flex items-center justify-center"
          title="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Desktop Next Button */}
      {(groupIndex < storyGroups.length - 1 || storyIndex < currentStories.length - 1) && (
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hidden md:flex items-center justify-center"
          title="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Phone Card Container (Full Screen on Mobile / 9:16 Frame on Desktop) */}
      <div 
        className="relative w-full sm:max-w-[420px] h-full sm:h-[92vh] sm:max-h-[860px] sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl border border-white/10"
        onPointerDown={(e) => {
          // If clicking input or buttons, don't pause
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && !target.closest('button')) {
            setIsPaused(true);
          }
        }}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
      >
        
        {/* Story Media (Full Screen) */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
          <img
            src={currentStory.imageUrl}
            alt={currentStory.caption || 'Story'}
            className="w-full h-full object-cover sm:object-contain"
          />
          {/* Subtle Dark Vignette Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Floating Animated Heart on Double-Tap/Like */}
        {isLikeHeartAnimating && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
            <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)] animate-bounce" />
          </div>
        )}

        {/* Touch Zones for Left / Right Navigation */}
        <div className="absolute inset-0 z-10 grid grid-cols-12 pointer-events-auto">
          {/* Left 35% Tap Area */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="col-span-4 h-full cursor-pointer"
          />
          {/* Middle 20% Area (Clicking pauses/unpauses) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(p => !p);
            }}
            className="col-span-4 h-full"
          />
          {/* Right 45% Tap Area */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="col-span-4 h-full cursor-pointer"
          />
        </div>

        {/* TOP LAYER: Segmented Progress Bars + Header */}
        <div className="relative z-20 p-3 sm:p-4 space-y-3 pointer-events-none">
          
          {/* Segmented Progress Bars */}
          <div className="flex gap-1 w-full pointer-events-auto">
            {currentStories.map((_, idx) => {
              let width = '0%';
              if (idx < storyIndex) width = '100%';
              else if (idx === storyIndex) width = `${progress}%`;

              return (
                <div key={`progress_${idx}`} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Profile Header */}
          <div className="flex items-center justify-between pointer-events-auto">
            
            <Link 
              href={`/closet/${currentGroup.username}`}
              onClick={onClose}
              className="flex items-center gap-2.5 group min-w-0"
            >
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#E2FF66] via-[#B5DB10] to-[#E2FF66]">
                <img 
                  src={currentGroup.avatarUrl} 
                  alt={currentGroup.displayName} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="min-w-0 flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white drop-shadow truncate">
                  {currentGroup.username}
                </span>
                <span className="text-[11px] text-white/70 font-medium">
                  {getTimeAgo(currentStory.createdAt)}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {/* Three-dots menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsPaused(true);
                    setShowOptionsMenu(!showOptionsMenu);
                  }}
                  className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 top-10 w-44 rounded-2xl bg-[#16181E] border border-white/15 p-1.5 shadow-2xl z-50 text-xs animate-in fade-in">
                    {isMyStory ? (
                      <button
                        onClick={handleDeleteCurrentStory}
                        className="w-full p-2 rounded-xl text-rose-400 hover:bg-rose-500/15 flex items-center gap-2 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Story</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setIsPaused(false);
                        }}
                        className="w-full p-2 rounded-xl text-white/80 hover:bg-white/10 flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share Story Link</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Garment Tag Pill (if attached) */}
          {currentStory.pieceId && (
            <Link
              href={`/remix?preloadPieceId=${currentStory.pieceId}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#E2FF66]/50 text-white text-xs font-semibold shadow-lg hover:border-[#E2FF66] hover:scale-105 transition-all pointer-events-auto"
            >
              <Repeat className="w-3.5 h-3.5 text-[#E2FF66]" />
              <span className="truncate max-w-[220px]">
                Remix: <strong>{currentStory.title || 'Attached Garment'}</strong>
              </span>
            </Link>
          )}

        </div>

        {/* BOTTOM LAYER: Caption & Instagram-Exact Action Bar */}
        <div className="relative z-20 p-3 sm:p-4 space-y-3 pointer-events-none">
          
          {/* Caption Overlay */}
          {currentStory.caption && (
            <div className="pointer-events-auto">
              <div className="text-xs sm:text-sm text-white font-medium drop-shadow-md bg-black/40 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 max-w-full leading-relaxed">
                {renderMentionText(currentStory.caption)}
              </div>
            </div>
          )}

          {/* Bottom Bar: Matching User's Screenshot Exactly */}
          <div className="flex items-center gap-3 pt-1 pointer-events-auto">
            
            {/* Left: "Send message" input pill */}
            <form 
              onSubmit={handleSendMessage}
              className="flex-1 relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                placeholder={isSent ? 'Message sent!' : `Send message...`}
                className="w-full px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:border-[#E2FF66] transition-all pr-9"
              />
              {replyMessage.trim() && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#E2FF66] hover:scale-110 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Right: Instagram-Exact Action Icons (Heart Like, Chat Comment, Share/Paper-Plane) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              
              {/* Like Button */}
              <button
                type="button"
                onClick={handleLike}
                className="p-1 rounded-full text-white hover:scale-110 active:scale-90 transition-transform"
                title="Like story"
              >
                <Heart 
                  className={`w-6 h-6 stroke-[1.8] ${
                    currentStory.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                  }`} 
                />
              </button>

              {/* Chat Bubble Comment Icon */}
              <button
                type="button"
                onClick={() => {
                  inputRef.current?.focus();
                  setIsPaused(true);
                }}
                className="p-1 rounded-full text-white hover:scale-110 active:scale-90 transition-transform"
                title="Comment"
              >
                <MessageCircle className="w-6 h-6 stroke-[1.8]" />
              </button>

              {/* Share Paper-Plane Icon */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setIsSent(true);
                    setTimeout(() => setIsSent(false), 2000);
                  } catch (e) {
                    console.log('Share notice:', e);
                  }
                }}
                className="p-1 rounded-full text-white hover:scale-110 active:scale-90 transition-transform"
                title="Share story"
              >
                <Share2 className="w-6 h-6 stroke-[1.8]" />
              </button>

            </div>

          </div>

          {/* Owner view indicator & Delete trigger */}
          {isMyStory && (
            <div className="flex items-center justify-between text-[11px] text-white/70 pt-1 pointer-events-auto">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#E2FF66]" />
                <span>Seen by {currentStory.viewsCount || 1} stylists</span>
              </span>
              <button
                onClick={handleDeleteCurrentStory}
                className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
