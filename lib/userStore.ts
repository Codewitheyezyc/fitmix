'use client';

import { useSyncExternalStore } from 'react';
import { UserProfile } from './types';

// Internal canonical entity map: userId -> UserProfile
const usersMap = new Map<string, UserProfile>();

// Fine-grained per-userId subscriber map
const userListeners = new Map<string, Set<() => void>>();
const globalListeners = new Set<() => void>();

function notifyUserListeners(userId: string) {
  const listeners = userListeners.get(userId);
  if (listeners) {
    listeners.forEach(fn => fn());
  }
  globalListeners.forEach(fn => fn());
}

/**
 * Set or update a single user profile in the canonical store.
 */
export function setUserProfile(profile: UserProfile): void {
  if (!profile || !profile.id) return;
  
  const existing = usersMap.get(profile.id);
  // Check if profile values actually changed to prevent redundant updates
  if (
    existing &&
    existing.username === profile.username &&
    existing.displayName === profile.displayName &&
    existing.avatarUrl === profile.avatarUrl &&
    existing.bio === profile.bio &&
    existing.followersCount === profile.followersCount &&
    existing.followingCount === profile.followingCount &&
    existing.hasCompletedOnboarding === profile.hasCompletedOnboarding
  ) {
    return;
  }

  const updated: UserProfile = { ...existing, ...profile };
  usersMap.set(profile.id, updated);
  notifyUserListeners(profile.id);
}

/**
 * Bulk set multiple profiles (e.g. on initial hydration or sync).
 */
export function setUsersMap(profiles: UserProfile[]): void {
  if (!Array.isArray(profiles)) return;
  profiles.forEach(p => setUserProfile(p));
}

/**
 * Get current snapshot of a user profile.
 */
export function getUserProfileSnapshot(userId: string): UserProfile | undefined {
  return usersMap.get(userId);
}

// Cache fallback objects to maintain referential stability for useSyncExternalStore
const fallbackCacheMap = new Map<string, UserProfile>();

export function getFallbackProfile(userId: string, usernameHint?: string): UserProfile {
  const cacheKey = `${userId || 'guest'}_${usernameHint || ''}`;
  const existing = fallbackCacheMap.get(cacheKey);
  if (existing) return existing;

  const fallback: UserProfile = {
    id: userId || 'usr_unknown',
    username: usernameHint || 'stylist',
    displayName: usernameHint ? `@${usernameHint}` : 'Stylist',
    avatarUrl: '',
    bio: 'Fashion lover & outfit mixer.',
    location: '',
    styleInterests: ['Streetwear', 'Vintage'],
    totalRemixesReceived: 0,
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
    hasCompletedOnboarding: true,
    createdAt: '2026-01-01T00:00:00Z'
  };

  fallbackCacheMap.set(cacheKey, fallback);
  return fallback;
}

/**
 * Fine-grained hook: Subscribes ONLY to changes for `userId`.
 * Re-renders ONLY when `usersMap[userId]` changes.
 */
export function useUserProfile(userId: string, usernameHint?: string): UserProfile {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!userId) return () => {};
      let set = userListeners.get(userId);
      if (!set) {
        set = new Set();
        userListeners.set(userId, set);
      }
      set.add(onStoreChange);
      return () => {
        set?.delete(onStoreChange);
        if (set?.size === 0) {
          userListeners.delete(userId);
        }
      };
    },
    () => usersMap.get(userId) || getFallbackProfile(userId, usernameHint),
    () => usersMap.get(userId) || getFallbackProfile(userId, usernameHint)
  );
}

/**
 * Export full map for iterations (e.g. Featured Stylists list).
 */
export function getAllUsersSnapshot(): UserProfile[] {
  return Array.from(usersMap.values());
}
