'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Bell, 
  Repeat, 
  Heart, 
  UserPlus, 
  Sparkles, 
  CheckCheck,
  ArrowRight,
  MessageCircle,
  Clock,
  Shirt
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useStore();
  const [filter, setFilter] = useState<'all' | 'mentions' | 'remixes' | 'likes'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'mentions') return n.type === 'mention';
    if (filter === 'remixes') return n.type === 'remix';
    if (filter === 'likes') return n.type === 'like';
    return true;
  });

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 pb-32">
      
      {/* Header with Title & Fixed Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E2FF66]/20 text-[#7B9600] dark:text-[#E2FF66] flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D0E12] dark:text-white">
                Remix Activity & Alerts
              </h1>
              <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">
                Stylist interactions, closet remixes, and outfit mentions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={markNotificationsAsRead}
          className="whitespace-nowrap self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#16181E] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(['all', 'mentions', 'remixes', 'likes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all flex-shrink-0 flex items-center gap-1.5 ${
              filter === tab
                ? 'bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_15px_rgba(226,255,102,0.25)]'
                : 'bg-white dark:bg-[#16181E] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white border border-black/5 dark:border-white/5'
            }`}
          >
            <span>{tab === 'all' ? 'All Activity' : tab}</span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#16181E] border border-dashed border-black/10 dark:border-white/10 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#7B9600] dark:text-[#E2FF66] mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white">No notifications in this filter</h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E95A5] max-w-xs mx-auto">
              When other creators remix your wardrobe items or mention you in looks, they will appear here.
            </p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.read
                  ? 'bg-white dark:bg-[#1A1D24] border-[#E2FF66]/60 shadow-[0_0_18px_rgba(226,255,102,0.08)]'
                  : 'bg-white dark:bg-[#16181E] border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                
                {/* Actor Avatar with Icon Status Badge */}
                <div className="relative flex-shrink-0">
                  <Link
                    href={`/closet/${n.actorUsername}`}
                    className="relative w-12 h-12 rounded-full overflow-hidden border border-black/10 dark:border-white/15 block"
                  >
                    <img src={n.actorAvatar} alt={n.actorUsername} className="w-full h-full object-cover" />
                  </Link>

                  {/* Overlaid Type Badge */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-[#16181E] ${
                    n.type === 'remix' ? 'bg-[#E2FF66] text-[#0D0E12]' :
                    n.type === 'like' ? 'bg-rose-500 text-white' :
                    n.type === 'mention' ? 'bg-[#38BDF8] text-[#0D0E12]' :
                    n.type === 'comment' ? 'bg-purple-500 text-white' :
                    'bg-emerald-500 text-white'
                  }`}>
                    {n.type === 'remix' ? <Repeat className="w-2.5 h-2.5 stroke-[3]" /> :
                     n.type === 'like' ? <Heart className="w-2.5 h-2.5 fill-current" /> :
                     n.type === 'mention' ? <Sparkles className="w-2.5 h-2.5 stroke-[2.5]" /> :
                     n.type === 'comment' ? <MessageCircle className="w-2.5 h-2.5" /> :
                     <UserPlus className="w-2.5 h-2.5" />}
                  </div>
                </div>

                {/* Notification Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[#0D0E12] dark:text-[#E2E8F0] leading-relaxed">
                    <Link href={`/closet/${n.actorUsername}`} className="font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline">
                      @{n.actorUsername}
                    </Link>{' '}
                    {n.type === 'mention' && (n.message || `mentioned you in their look!`)}
                    {n.type === 'remix' && `remixed your `}
                    {n.type === 'remix' && (
                      <span className="font-semibold text-[#0D0E12] dark:text-white">
                        {n.pieceTitle || 'piece'}
                      </span>
                    )}
                    {n.type === 'remix' && ` into a new look!`}
                    {n.type === 'like' && `liked your mix `}
                    {n.type === 'like' && (
                      <span className="font-semibold text-[#0D0E12] dark:text-white">
                        &ldquo;{n.mixTitle}&rdquo;
                      </span>
                    )}
                    {n.type === 'follow' && `started following your wardrobe closet.`}
                    {n.type === 'comment' && `commented on your mix `}
                    {n.type === 'comment' && (
                      <span className="font-semibold text-[#0D0E12] dark:text-white">
                        &ldquo;{n.mixTitle}&rdquo;
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#94A3B8] dark:text-[#737373]">
                    <Clock className="w-3 h-3" />
                    <span>{getRelativeTime(n.createdAt)}</span>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E2FF66] shadow-[0_0_6px_#E2FF66]" />
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0">
                {n.targetMixId && (
                  <Link
                    href={`/remix?remixMixId=${n.targetMixId}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F4F5F8] dark:bg-[#252932] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/10 hover:border-[#E2FF66] hover:bg-[#E2FF66] hover:text-[#0D0E12] dark:hover:bg-[#E2FF66] dark:hover:text-[#0D0E12] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>View Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {n.targetPieceId && !n.targetMixId && (
                  <Link
                    href={`/remix?preloadPieceId=${n.targetPieceId}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] flex items-center gap-1.5 transition-all shadow-sm hover:scale-102"
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Remix Piece</span>
                  </Link>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
