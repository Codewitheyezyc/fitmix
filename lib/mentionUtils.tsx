'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile, NotificationItem } from './types';

/**
 * Extracts all @username tokens from a text string.
 */
export function extractMentions(text?: string): string[] {
  if (!text) return [];
  const matches = text.match(/@([a-zA-Z0-9_]+)/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map(m => m.slice(1).toLowerCase())));
}

/**
 * Parses text and renders @username tokens as interactive clickable links to their closet.
 */
export function renderMentionText(text?: string, className: string = ''): React.ReactNode {
  if (!text) return null;

  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          const username = part.slice(1);
          return (
            <Link
              key={`${part}_${index}`}
              href={`/closet/${username}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline"
            >
              {part}
            </Link>
          );
        }
        return part;
      })}
    </span>
  );
}

/**
 * Creates notification items for all mentioned users found in text.
 */
export function createMentionNotifications({
  text,
  sender,
  users,
  contextType,
  targetMixId,
  targetPieceId,
  targetStoryId,
  targetTitle
}: {
  text?: string;
  sender: UserProfile;
  users: UserProfile[];
  contextType: 'piece' | 'mix' | 'story' | 'comment';
  targetMixId?: string;
  targetPieceId?: string;
  targetStoryId?: string;
  targetTitle?: string;
}): NotificationItem[] {
  const mentionedUsernames = extractMentions(text);
  if (mentionedUsernames.length === 0) return [];

  const notifications: NotificationItem[] = [];

  mentionedUsernames.forEach(username => {
    // Avoid notifying self
    if (username.toLowerCase() === sender.username.toLowerCase()) return;

    const targetUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (targetUser) {
      let message = `@${sender.username} mentioned you in their look!`;
      if (contextType === 'piece') {
        message = `@${sender.username} mentioned you in their piece "${targetTitle || 'New Piece'}"`;
      } else if (contextType === 'mix') {
        message = `@${sender.username} mentioned you in their look "${targetTitle || 'Outfit Mix'}"`;
      } else if (contextType === 'story') {
        message = `@${sender.username} mentioned you in their 24h story!`;
      } else if (contextType === 'comment') {
        message = `@${sender.username} mentioned you in a comment on "${targetTitle || 'Outfit Mix'}"`;
      }

      notifications.push({
        id: `notif_mention_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: targetUser.id,
        actorId: sender.id,
        actorUsername: sender.username,
        actorAvatar: sender.avatarUrl,
        type: 'mention',
        targetMixId,
        targetPieceId,
        targetStoryId,
        pieceTitle: contextType === 'piece' ? targetTitle : undefined,
        mixTitle: contextType === 'mix' || contextType === 'comment' ? targetTitle : undefined,
        message,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  return notifications;
}
