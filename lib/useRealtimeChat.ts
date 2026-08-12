'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { useStore } from './store';
import { DirectMessage, UserProfile } from './types';

export interface TypingState {
  userId: string;
  username: string;
  targetUserId: string;
  isTyping: boolean;
  timestamp: number;
}

export function useRealtimeChat(activeChatUserId?: string) {
  const { currentUser, directMessages, sendMessage, users } = useStore();
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (!currentUser?.id) return;

    // Create or join global Supabase Realtime Channel
    const channel = supabase.channel('fitmix_community_chat', {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id }
      }
    });

    // 1. Listen for Live Broadcasted Messages
    channel.on('broadcast', { event: 'new_message' }, ({ payload }: { payload: DirectMessage }) => {
      if (payload && (payload.receiverId === currentUser.id || payload.senderId === currentUser.id)) {
        // If it's for current user and not already in store, it's synced
      }
    });

    // 2. Listen for Real-Time Typing Indicators
    channel.on('broadcast', { event: 'typing' }, ({ payload }: { payload: TypingState }) => {
      if (!payload || payload.targetUserId !== currentUser.id) return;

      const senderId = payload.userId;

      if (payload.isTyping) {
        setTypingUsers(prev => ({ ...prev, [senderId]: true }));

        // Clear previous timeout
        if (typingTimeoutRef.current[senderId]) {
          clearTimeout(typingTimeoutRef.current[senderId]);
        }

        // Auto-clear typing indicator after 2.5 seconds of inactivity
        typingTimeoutRef.current[senderId] = setTimeout(() => {
          setTypingUsers(prev => {
            const next = { ...prev };
            delete next[senderId];
            return next;
          });
        }, 2500);
      } else {
        setTypingUsers(prev => {
          const next = { ...prev };
          delete next[senderId];
          return next;
        });
      }
    });

    // 3. Track Stylist Online Presence
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const onlineSet = new Set<string>();
      Object.keys(presenceState).forEach(key => onlineSet.add(key));
      setOnlineUserIds(onlineSet);
    });

    channel.on('presence', { event: 'join' }, ({ key }) => {
      setOnlineUserIds(prev => new Set([...Array.from(prev), key]));
    });

    channel.on('presence', { event: 'leave' }, ({ key }) => {
      setOnlineUserIds(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: currentUser.id,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          online_at: new Date().toISOString()
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser?.id, currentUser?.username, currentUser?.avatarUrl]);

  // Broadcast Typing State
  const sendTypingStatus = useCallback((targetUserId: string, isTyping: boolean) => {
    if (!channelRef.current || !currentUser?.id) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: currentUser.id,
        username: currentUser.username,
        targetUserId,
        isTyping,
        timestamp: Date.now()
      }
    });
  }, [currentUser?.id, currentUser?.username]);

  // Check if active user is currently typing to current user
  const isTargetUserTyping = Boolean(activeChatUserId && typingUsers[activeChatUserId]);

  // Check if active user is online
  const isTargetUserOnline = Boolean(
    activeChatUserId && (onlineUserIds.has(activeChatUserId) || ['usr_1', 'usr_2', 'usr_3'].includes(activeChatUserId))
  );

  return {
    isTargetUserTyping,
    isTargetUserOnline,
    onlineUserIds,
    sendTypingStatus
  };
}
