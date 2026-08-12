'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Piece } from '@/lib/types';
import { X, ChevronLeft, ChevronRight, Repeat, Send, Heart, Sparkles } from 'lucide-react';

export interface StoryItem {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  imageUrl: string;
  title: string;
  category: string;
  caption: string;
  pieceId?: string;
  timeAgo: string;
}

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewerModal({ stories, initialIndex, onClose }: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplySent, setIsReplySent] = useState(false);

  const currentStory = stories[currentIndex];

  // Auto-advance progress timer
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsReplySent(true);
    setReplyText('');
    setTimeout(() => setIsReplySent(false), 3000);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Left Arrow */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Right Arrow */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Phone Card Container */}
      <div className="relative w-full max-w-sm aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden bg-[#0D0E12] border border-white/15 shadow-2xl flex flex-col justify-between">
        
        {/* Top Segmented Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((story, idx) => (
            <div key={story.id} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Author Header */}
        <div className="relative z-30 p-4 pt-6 flex items-center justify-between">
          <Link
            href={`/closet/${currentStory.username}`}
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E2FF66]">
              <img src={currentStory.avatarUrl} alt={currentStory.displayName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#E2FF66] transition-colors">
                  {currentStory.displayName}
                </span>
                <span className="text-[10px] text-[#A8A8A8]">{currentStory.timeAgo}</span>
              </div>
              <span className="text-[10px] text-[#E2FF66]">@{currentStory.username}</span>
            </div>
          </Link>
        </div>

        {/* Story Main Image & Content */}
        <div className="relative flex-1 flex items-center justify-center p-6">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
          
          <img
            src={currentStory.imageUrl}
            alt={currentStory.title}
            className="max-h-[75%] max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300"
          />

          {/* Tagged Piece Badge */}
          <div className="absolute bottom-16 left-4 right-4 z-30">
            <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2FF66] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentStory.category}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white">Cutout Ready</span>
              </div>
              <h5 className="text-xs font-bold text-white truncate">{currentStory.title}</h5>
              <p className="text-[11px] text-[#C4C8D4] mt-0.5 italic">&ldquo;{currentStory.caption}&rdquo;</p>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Action Bar */}
        <div className="relative z-30 p-4 border-t border-white/10 bg-black/60 backdrop-blur-md">
          {currentStory.pieceId && (
            <Link
              href={`/remix?preloadPieceId=${currentStory.pieceId}`}
              onClick={onClose}
              className="w-full mb-3 py-2.5 rounded-full bg-[#E2FF66] text-[#0D0E12] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all"
            >
              <Repeat className="w-4 h-4 stroke-[2.5]" />
              <span>Remix This Piece in Studio</span>
            </Link>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={isReplySent ? 'Reply sent!' : `Reply to @${currentStory.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-full bg-white/10 text-white placeholder-white/50 text-xs border border-white/15 focus:outline-none focus:border-[#E2FF66]"
            />
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full border border-white/15 transition-colors ${
                isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 rounded-full bg-[#E2FF66] text-[#0D0E12] disabled:opacity-40 hover:bg-[#d5f356]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
