'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mix } from '@/lib/types';
import { useStore } from '@/lib/store';
import { X, Send, Heart, MessageSquare, Sparkles } from 'lucide-react';

interface MixCommentsModalProps {
  mix: Mix;
  onClose: () => void;
}

export default function MixCommentsModal({ mix, onClose }: MixCommentsModalProps) {
  const { currentUser, addComment, getCommentsByMix } = useStore();
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const comments = getCommentsByMix(mix.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(mix.id, commentText);
    setCommentText('');
  };

  const toggleLikeComment = (commentId: string) => {
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 p-6 shadow-2xl flex flex-col justify-between transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              Styling Discussion ({comments.length})
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] line-clamp-1 mt-0.5">
              on &ldquo;{mix.title}&rdquo; by @{mix.creatorUsername}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2 pr-1 scrollbar-thin max-h-[50vh]">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-[#64748B] dark:text-[#8E95A5]">
              <Sparkles className="w-8 h-8 text-[#7B9600] dark:text-[#E2FF66] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-[#0D0E12] dark:text-white">No comments yet</p>
              <p className="text-[11px] mt-0.5">Be the first to share styling advice or ask about these pieces!</p>
            </div>
          ) : (
            comments.map(c => {
              const isLiked = Boolean(likedComments[c.id]);
              return (
                <div key={c.id} className="flex items-start gap-3 group">
                  <Link href={`/closet/${c.username}`} onClick={onClose} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/15">
                      <img src={c.userAvatar} alt={c.username} className="w-full h-full object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 bg-[#F4F5F8] dark:bg-[#1F222A] p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Link href={`/closet/${c.username}`} onClick={onClose} className="text-xs font-bold text-[#0D0E12] dark:text-white hover:text-[#7B9600] dark:hover:text-[#E2FF66] transition-colors truncate">
                        @{c.username}
                      </Link>
                      <span className="text-[10px] text-[#94A3B8] dark:text-[#737373]">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B5563] dark:text-[#D1D5DB] leading-relaxed break-words">
                      {c.content}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleLikeComment(c.id)}
                    className={`p-1.5 rounded-full transition-colors flex-shrink-0 mt-1 ${
                      isLiked ? 'text-rose-500' : 'text-[#94A3B8] dark:text-[#737373] hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/15 flex-shrink-0">
            <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
          </div>

          <input
            type="text"
            required
            placeholder="Add a styling tip or comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white text-xs placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66] transition-all"
          />

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2.5 rounded-full bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 shadow-sm transition-all flex-shrink-0"
            title="Post Comment"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </div>
  );
}
