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
  ArrowRight
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useStore();
  const [filter, setFilter] = useState<'all' | 'remixes' | 'likes'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'remixes') return n.type === 'remix';
    if (filter === 'likes') return n.type === 'like';
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0E12] dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#7B9600] dark:text-[#E2FF66]" />
            Remix Activity & Alerts
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1">
            Real-time updates when stylists remix your closet pieces, like your looks, or follow you.
          </p>
        </div>

        <button
          onClick={markNotificationsAsRead}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#16181E] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white border border-black/10 dark:border-white/10 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'remixes', 'likes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_15px_rgba(226,255,102,0.25)]'
                : 'bg-white dark:bg-[#16181E] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white border border-black/5 dark:border-white/5'
            }`}
          >
            {tab === 'all' ? 'All Activity' : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#16181E] border border-dashed border-black/10 dark:border-white/10 text-center text-xs text-[#64748B] dark:text-[#8E95A5]">
            No notifications in this filter.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                !n.read
                  ? 'bg-white dark:bg-[#1F222A] border-[#E2FF66] shadow-md'
                  : 'bg-white dark:bg-[#16181E] border-black/5 dark:border-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                
                {/* Actor Avatar */}
                <Link
                  href={`/closet/${n.actorUsername}`}
                  className="relative w-11 h-11 rounded-full overflow-hidden border border-black/10 dark:border-white/15 flex-shrink-0"
                >
                  <img src={n.actorAvatar} alt={n.actorUsername} className="w-full h-full object-cover" />
                </Link>

                {/* Message text */}
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#0D0E12] dark:text-white leading-snug">
                    <Link href={`/closet/${n.actorUsername}`} className="font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline">
                      @{n.actorUsername}
                    </Link>{' '}
                    {n.type === 'remix' && `remixed your ${n.pieceTitle || 'piece'} into a new look!`}
                    {n.type === 'like' && `liked your mix "${n.mixTitle}"`}
                    {n.type === 'follow' && `started following your wardrobe closet`}
                  </p>
                  <span className="text-[10px] text-[#94A3B8] dark:text-[#6B7280] block mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>

              {/* Action Link */}
              {n.targetMixId && (
                <Link
                  href={`/remix?remixMixId=${n.targetMixId}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-[#E2FF66] border border-black/10 dark:border-[#E2FF66]/30 hover:bg-[#E2FF66] hover:text-[#0D0E12] flex items-center gap-1 flex-shrink-0 transition-all"
                >
                  <span>View Look</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
