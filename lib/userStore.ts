'use client';

import { useSyncExternalStore } from 'react';
import { UserProfile } from './types';

// Internal canonical entity map: userId -> UserProfile
const usersMap = new Map<string, UserProfile>();

// Set of user IDs followed by the currently authenticated user session
const followingUserIdsSet = new Set<string>();

// Fine-grained per-userId subscriber map
const userListeners = new Map<string, Set<() => void>>();
const globalListeners = new Set<() => void>();

function notifyUserListeners(userId?: string) {
  if (userId) {
    const listeners = userListeners.get(userId);
    if (listeners) {
      listeners.forEach(fn => fn());
    }
  }
  globalListeners.forEach(fn => fn());
}

/**
 * Set or update the active user's followed user IDs set.
 */
export function setFollowingUserIds(ids: string[]): void {
  followingUserIdsSet.clear();
  if (Array.isArray(ids)) {
    ids.forEach(id => {
      if (id) followingUserIdsSet.add(id);
    });
  }
  // Notify all user subscribers so follow buttons update instantly
  usersMap.forEach((_, userId) => notifyUserListeners(userId));
  globalListeners.forEach(fn => fn());
}

export function toggleFollowingUserId(userId: string, isFollowing: boolean): void {
  if (!userId) return;
  if (isFollowing) {
    followingUserIdsSet.add(userId);
  } else {
    followingUserIdsSet.delete(userId);
  }

  // Update followersCount on cached target user profile if present
  const existing = usersMap.get(userId);
  if (existing) {
    const newCount = isFollowing ? existing.followersCount + 1 : Math.max(0, existing.followersCount - 1);
    usersMap.set(userId, { ...existing, isFollowing, followersCount: newCount });
  }

  notifyUserListeners(userId);
}

export function isUserFollowing(userId: string): boolean {
  return followingUserIdsSet.has(userId);
}

/**
 * Set or update a single user profile in the canonical store.
 */
export function setUserProfile(profile: UserProfile): void {
  if (!profile || !profile.id) return;
  
  const existing = usersMap.get(profile.id);
  const computedIsFollowing = followingUserIdsSet.has(profile.id);

  if (
    existing &&
    existing.username === profile.username &&
    existing.displayName === profile.displayName &&
    existing.avatarUrl === profile.avatarUrl &&
    existing.bio === profile.bio &&
    existing.followersCount === profile.followersCount &&
    existing.followingCount === profile.followingCount &&
    existing.isFollowing === computedIsFollowing &&
    existing.hasCompletedOnboarding === profile.hasCompletedOnboarding
  ) {
    return;
  }

  const updated: UserProfile = { 
    ...existing, 
    ...profile,
    isFollowing: computedIsFollowing 
  };

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
  const p = usersMap.get(userId);
  if (!p) return undefined;
  return { ...p, isFollowing: followingUserIdsSet.has(userId) };
}

// Cache fallback objects to maintain referential stability for useSyncExternalStore
const fallbackCacheMap = new Map<string, UserProfile>();

export function getFallbackProfile(userId: string, usernameHint?: string): UserProfile {
  const cacheKey = `${userId || 'guest'}_${usernameHint || ''}`;
  const existing = fallbackCacheMap.get(cacheKey);
  const isFollowing = followingUserIdsSet.has(userId);

  if (existing) {
    if (existing.isFollowing !== isFollowing) {
      const updated = { ...existing, isFollowing };
      fallbackCacheMap.set(cacheKey, updated);
      return updated;
    }
    return existing;
  }

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
    isFollowing,
    hasCompletedOnboarding: true,
    createdAt: '2026-01-01T00:00:00Z'
  };

  fallbackCacheMap.set(cacheKey, fallback);
  return fallback;
}

/**
 * Fine-grained hook: Subscribes ONLY to changes for `userId`.
 * Re-renders ONLY when `usersMap[userId]` or follow status changes.
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
    () => {
      const u = usersMap.get(userId);
      if (u) {
        return { ...u, isFollowing: followingUserIdsSet.has(userId) };
      }
      return getFallbackProfile(userId, usernameHint);
    },
    () => {
      const u = usersMap.get(userId);
      if (u) {
        return { ...u, isFollowing: followingUserIdsSet.has(userId) };
      }
      return getFallbackProfile(userId, usernameHint);
    }
  );
}

/**
 * Export full list of users with active follow status.
 */
export function getAllUsersSnapshot(): UserProfile[] {
  return Array.from(usersMap.values()).map(u => ({
    ...u,
    isFollowing: followingUserIdsSet.has(u.id)
  }));
}
