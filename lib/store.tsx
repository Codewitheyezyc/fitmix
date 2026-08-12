'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Piece, 
  Mix, 
  UserProfile, 
  NotificationItem, 
  DirectMessage, 
  CategoryType,
  MixPieceTransform,
  CanvasBackground,
  Comment,
  Story,
  UserStoryGroup
} from './types';
import { 
  CURRENT_USER, 
  INITIAL_USERS, 
  INITIAL_PIECES, 
  INITIAL_MIXES, 
  INITIAL_NOTIFICATIONS,
  INITIAL_STORIES
} from './seedData';
import { createMentionNotifications } from './mentionUtils';
import { supabase } from './supabase';

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cmt_1',
    mixId: 'mix_1',
    userId: 'usr_1',
    username: 'elena_v',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    content: 'The lime mohair knit cuts through that vintage Burberrys trench coat so well! Love the contrast.',
    createdAt: '2026-02-10T20:15:00Z'
  },
  {
    id: 'cmt_2',
    mixId: 'mix_1',
    userId: 'usr_2',
    username: 'kai_upcycle',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    content: 'Need to try styling those Sambas with wide pleated pants this weekend.',
    createdAt: '2026-02-10T21:40:00Z'
  },
  {
    id: 'cmt_3',
    mixId: 'mix_2',
    userId: 'usr_3',
    username: 'sophie_thrift',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    content: 'The bottle-cap texture looks like metallic embroidery against the dark trousers.',
    createdAt: '2026-02-09T16:00:00Z'
  }
];

interface StoreContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email?: string) => void;
  logout: () => void;
  signup: (userData: { username: string; displayName: string; styleInterests: string[]; avatarUrl?: string }) => void;
  
  pieces: Piece[];
  mixes: Mix[];
  users: UserProfile[];
  notifications: NotificationItem[];
  directMessages: DirectMessage[];
  comments: Comment[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
  
  // Piece Actions
  addPiece: (pieceData: Omit<Piece, 'id' | 'createdAt' | 'remixCount' | 'likesCount' | 'ownerId' | 'ownerUsername' | 'ownerName' | 'ownerAvatar'>) => Piece;
  getPieceById: (id: string) => Piece | undefined;
  getPiecesByOwner: (username: string) => Piece[];
  getPiecesByCategory: (category: CategoryType) => Piece[];

  // Mix Actions
  createMix: (mixData: {
    title: string;
    description?: string;
    canvasBackground?: CanvasBackground;
    layers: MixPieceTransform[];
    techniqueTags: string[];
    whyItWorks?: string;
    remixChainParentId?: string;
  }) => Mix;
  getMixById: (id: string) => Mix | undefined;
  getMixesByPiece: (pieceId: string) => Mix[];
  getMixesByCreator: (username: string) => Mix[];
  toggleLikeMix: (mixId: string) => void;
  toggleSaveMix: (mixId: string) => void;
  
  // Comment Actions
  addComment: (mixId: string, content: string) => Comment;
  getCommentsByMix: (mixId: string) => Comment[];
  
  // Story Actions
  stories: Story[];
  addStory: (storyData: { imageUrl: string; caption?: string; pieceId?: string; title?: string; category?: string }) => Story;
  deleteStory: (storyId: string) => void;
  toggleLikeStory: (storyId: string) => void;
  getUserStoryGroups: () => UserStoryGroup[];
  
  // Social Actions
  toggleFollowUser: (userId: string) => void;
  sendMessage: (receiverId: string, content: string, attachedMixId?: string, attachedPieceId?: string) => DirectMessage;
  getMessagesBetween: (userId1: string, userId2: string) => DirectMessage[];
  markNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PIECES: 'fitmix_pieces_v3',
  MIXES: 'fitmix_mixes_v3',
  USERS: 'fitmix_users_v3',
  NOTIFICATIONS: 'fitmix_notifications_v3',
  DMS: 'fitmix_dms_v3',
  COMMENTS: 'fitmix_comments_v3',
  STORIES: 'fitmix_stories_v3',
  THEME: 'fitmix_theme_v3',
  AUTH: 'fitmix_auth_v3',
  USER: 'fitmix_current_user_v3'
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [mixes, setMixes] = useState<Mix[]>(INITIAL_MIXES);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme to document
  const applyTheme = (mode: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  };

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setTheme(initialTheme);
      applyTheme(initialTheme);

      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth) setIsAuthenticated(JSON.parse(savedAuth));

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedPieces = localStorage.getItem(STORAGE_KEYS.PIECES);
      if (savedPieces) setPieces(JSON.parse(savedPieces));

      const savedMixes = localStorage.getItem(STORAGE_KEYS.MIXES);
      if (savedMixes) setMixes(JSON.parse(savedMixes));

      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedDms = localStorage.getItem(STORAGE_KEYS.DMS);
      if (savedDms) setDirectMessages(JSON.parse(savedDms));

      const savedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (savedComments) setComments(JSON.parse(savedComments));

      // Listen to live Supabase Auth
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          persist(STORAGE_KEYS.AUTH, true);
          
          // Sync profile if available
          const meta = session.user.user_metadata;
          if (meta?.username || session.user.email) {
            const syncedUser: UserProfile = {
              id: session.user.id,
              username: meta?.username || (session.user.email ? session.user.email.split('@')[0] : 'stylist'),
              displayName: meta?.full_name || meta?.display_name || 'Stylist',
              avatarUrl: meta?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              bio: 'Fashion lover & outfit mixer.',
              styleInterests: meta?.style_interests || ['Streetwear', 'Vintage'],
              totalRemixesReceived: 0,
              followersCount: 0,
              followingCount: 0,
              createdAt: session.user.created_at || new Date().toISOString()
            };
            setCurrentUser(syncedUser);
            persist(STORAGE_KEYS.USER, syncedUser);
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch (e) {
      console.error('Error hydrating store:', e);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const persist = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Storage quota error:', e);
      }
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
    }
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setTheme(mode);
    applyTheme(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    }
  };

  const login = (email?: string) => {
    setIsAuthenticated(true);
    persist(STORAGE_KEYS.AUTH, true);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    }
    setIsAuthenticated(false);
    persist(STORAGE_KEYS.AUTH, false);
  };

  const signup = (userData: { username: string; displayName: string; styleInterests: string[]; avatarUrl?: string }) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: userData.username,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Fashion lover & outfit mixer.',
      styleInterests: userData.styleInterests,
      totalRemixesReceived: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    persist(STORAGE_KEYS.USER, newUser);
    persist(STORAGE_KEYS.AUTH, true);
    persist(STORAGE_KEYS.USERS, updatedUsers);
  };

  // Add Piece
  const addPiece = (pieceData: Omit<Piece, 'id' | 'createdAt' | 'remixCount' | 'likesCount' | 'ownerId' | 'ownerUsername' | 'ownerName' | 'ownerAvatar'>): Piece => {
    const newPiece: Piece = {
      ...pieceData,
      id: `pc_${Date.now()}`,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      ownerName: currentUser.displayName,
      ownerAvatar: currentUser.avatarUrl,
      remixCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedPieces = [newPiece, ...pieces];
    setPieces(updatedPieces);
    persist(STORAGE_KEYS.PIECES, updatedPieces);

    // Dispatch mention notifications if any @username in piece description
    const mentionNotifs = createMentionNotifications({
      text: `${newPiece.title} ${newPiece.description || ''} ${newPiece.stylingNotes || ''}`,
      sender: currentUser,
      users,
      contextType: 'piece',
      targetPieceId: newPiece.id,
      targetTitle: newPiece.title
    });
    if (mentionNotifs.length > 0) {
      const updatedAllNotifs = [...mentionNotifs, ...notifications];
      setNotifications(updatedAllNotifs);
      persist(STORAGE_KEYS.NOTIFICATIONS, updatedAllNotifs);
    }

    return newPiece;
  };

  const getPieceById = (id: string) => pieces.find(p => p.id === id);
  const getPiecesByOwner = (username: string) => pieces.filter(p => p.ownerUsername.toLowerCase() === username.toLowerCase());
  const getPiecesByCategory = (category: CategoryType) => pieces.filter(p => p.category === category);

  // Create Mix
  const createMix = (mixData: {
    title: string;
    description?: string;
    canvasBackground?: CanvasBackground;
    layers: MixPieceTransform[];
    techniqueTags: string[];
    whyItWorks?: string;
    remixChainParentId?: string;
  }): Mix => {
    const newMix: Mix = {
      id: `mix_${Date.now()}`,
      creatorId: currentUser.id,
      creatorUsername: currentUser.username,
      creatorName: currentUser.displayName,
      creatorAvatar: currentUser.avatarUrl,
      title: mixData.title,
      description: mixData.description,
      canvasBackground: mixData.canvasBackground || 'obsidian',
      layers: mixData.layers,
      techniqueTags: mixData.techniqueTags,
      whyItWorks: mixData.whyItWorks,
      likesCount: 0,
      commentsCount: 0,
      remixCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
      remixChainParentId: mixData.remixChainParentId
    };

    const usedPieceIds = new Set(mixData.layers.map(l => l.pieceId));
    const updatedPieces = pieces.map(p => {
      if (usedPieceIds.has(p.id)) {
        return { ...p, remixCount: (p.remixCount || 0) + 1 };
      }
      return p;
    });

    const newNotifs: NotificationItem[] = [];
    usedPieceIds.forEach(pieceId => {
      const piece = pieces.find(p => p.id === pieceId);
      if (piece && piece.ownerId !== currentUser.id) {
        newNotifs.push({
          id: `notif_${Date.now()}_${piece.id}`,
          userId: piece.ownerId,
          actorId: currentUser.id,
          actorUsername: currentUser.username,
          actorAvatar: currentUser.avatarUrl,
          type: 'remix',
          targetMixId: newMix.id,
          targetPieceId: piece.id,
          pieceTitle: piece.title,
          mixTitle: newMix.title,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    // Mention notifications in mix
    const mentionNotifs = createMentionNotifications({
      text: `${newMix.title} ${newMix.description || ''} ${newMix.whyItWorks || ''}`,
      sender: currentUser,
      users,
      contextType: 'mix',
      targetMixId: newMix.id,
      targetTitle: newMix.title
    });

    const updatedMixes = [newMix, ...mixes];
    const updatedAllNotifs = [...newNotifs, ...mentionNotifs, ...notifications];

    setPieces(updatedPieces);
    setMixes(updatedMixes);
    setNotifications(updatedAllNotifs);

    persist(STORAGE_KEYS.PIECES, updatedPieces);
    persist(STORAGE_KEYS.MIXES, updatedMixes);
    persist(STORAGE_KEYS.NOTIFICATIONS, updatedAllNotifs);

    return newMix;
  };

  const getMixById = (id: string) => mixes.find(m => m.id === id);
  const getMixesByPiece = (pieceId: string) => mixes.filter(m => m.layers.some(l => l.pieceId === pieceId));
  const getMixesByCreator = (username: string) => mixes.filter(m => m.creatorUsername.toLowerCase() === username.toLowerCase());

  const toggleLikeMix = (mixId: string) => {
    const updatedMixes = mixes.map(m => {
      if (m.id === mixId) {
        const isLiked = !m.isLiked;
        return {
          ...m,
          isLiked,
          likesCount: isLiked ? m.likesCount + 1 : Math.max(0, m.likesCount - 1)
        };
      }
      return m;
    });
    setMixes(updatedMixes);
    persist(STORAGE_KEYS.MIXES, updatedMixes);
  };

  const toggleSaveMix = (mixId: string) => {
    const updatedMixes = mixes.map(m => {
      if (m.id === mixId) {
        return { ...m, isSaved: !m.isSaved };
      }
      return m;
    });
    setMixes(updatedMixes);
    persist(STORAGE_KEYS.MIXES, updatedMixes);
  };

  const toggleFollowUser = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const isFollowing = !u.isFollowing;
        return {
          ...u,
          isFollowing,
          followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    persist(STORAGE_KEYS.USERS, updatedUsers);
  };

  const sendMessage = (receiverId: string, content: string, attachedMixId?: string, attachedPieceId?: string): DirectMessage => {
    const newMsg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      attachedMixId,
      attachedPieceId,
      createdAt: new Date().toISOString()
    };
    const updatedDms = [...directMessages, newMsg];
    setDirectMessages(updatedDms);
    persist(STORAGE_KEYS.DMS, updatedDms);
    return newMsg;
  };

  const getMessagesBetween = (userId1: string, userId2: string) => {
    return directMessages.filter(
      d => (d.senderId === userId1 && d.receiverId === userId2) ||
           (d.senderId === userId2 && d.receiverId === userId1)
    );
  };

  const addComment = (mixId: string, content: string): Comment => {
    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      mixId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    persist(STORAGE_KEYS.COMMENTS, updatedComments);

    // Increment commentsCount on target mix
    const updatedMixes = mixes.map(m => {
      if (m.id === mixId) {
        return { ...m, commentsCount: (m.commentsCount || 0) + 1 };
      }
      return m;
    });
    setMixes(updatedMixes);
    persist(STORAGE_KEYS.MIXES, updatedMixes);

    // Dispatch mention notifications in comment
    const mentionNotifs = createMentionNotifications({
      text: content,
      sender: currentUser,
      users,
      contextType: 'comment',
      targetMixId: mixId,
      targetTitle: mixes.find(m => m.id === mixId)?.title || 'Outfit Mix'
    });
    if (mentionNotifs.length > 0) {
      const updatedAllNotifs = [...mentionNotifs, ...notifications];
      setNotifications(updatedAllNotifs);
      persist(STORAGE_KEYS.NOTIFICATIONS, updatedAllNotifs);
    }

    return newComment;
  };

  const getCommentsByMix = (mixId: string) => {
    return comments.filter(c => c.mixId === mixId);
  };

  // Story Actions
  const addStory = (storyData: { imageUrl: string; caption?: string; pieceId?: string; title?: string; category?: string }): Story => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      imageUrl: storyData.imageUrl,
      title: storyData.title || 'Styling Story',
      category: storyData.category || 'Look',
      caption: storyData.caption || '',
      pieceId: storyData.pieceId,
      likesCount: 0,
      isLiked: false,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    persist(STORAGE_KEYS.STORIES, updated);

    // Dispatch mention notifications in story caption
    const mentionNotifs = createMentionNotifications({
      text: newStory.caption || '',
      sender: currentUser,
      users,
      contextType: 'story',
      targetStoryId: newStory.id,
      targetPieceId: newStory.pieceId,
      targetTitle: newStory.title
    });
    if (mentionNotifs.length > 0) {
      const updatedAllNotifs = [...mentionNotifs, ...notifications];
      setNotifications(updatedAllNotifs);
      persist(STORAGE_KEYS.NOTIFICATIONS, updatedAllNotifs);
    }

    return newStory;
  };

  const deleteStory = (storyId: string) => {
    const updated = stories.filter(s => s.id !== storyId);
    setStories(updated);
    persist(STORAGE_KEYS.STORIES, updated);
  };

  const toggleLikeStory = (storyId: string) => {
    const updated = stories.map(s => {
      if (s.id === storyId) {
        const isLiked = !s.isLiked;
        return {
          ...s,
          isLiked,
          likesCount: (s.likesCount || 0) + (isLiked ? 1 : -1)
        };
      }
      return s;
    });
    setStories(updated);
    persist(STORAGE_KEYS.STORIES, updated);
  };

  const getUserStoryGroups = (): UserStoryGroup[] => {
    // Auto-discard stories older than 24 hours
    const active = stories.filter(s => new Date(s.expiresAt).getTime() > Date.now());
    const groupsMap = new Map<string, UserStoryGroup>();

    active.forEach(story => {
      if (!groupsMap.has(story.userId)) {
        groupsMap.set(story.userId, {
          userId: story.userId,
          username: story.username,
          displayName: story.displayName,
          avatarUrl: story.avatarUrl,
          hasUnseen: true,
          stories: []
        });
      }
      groupsMap.get(story.userId)!.stories.push(story);
    });

    const result: UserStoryGroup[] = [];
    if (groupsMap.has(currentUser.id)) {
      result.push(groupsMap.get(currentUser.id)!);
      groupsMap.delete(currentUser.id);
    }
    groupsMap.forEach(group => result.push(group));
    return result;
  };

  const markNotificationsAsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifs);
    persist(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider value={{
      currentUser,
      isAuthenticated,
      isAuthReady,
      login,
      logout,
      signup,
      pieces,
      mixes,
      users,
      notifications,
      directMessages,
      comments,
      stories,
      theme,
      toggleTheme,
      setThemeMode,
      addPiece,
      getPieceById,
      getPiecesByOwner,
      getPiecesByCategory,
      createMix,
      getMixById,
      getMixesByPiece,
      getMixesByCreator,
      toggleLikeMix,
      toggleSaveMix,
      addComment,
      getCommentsByMix,
      addStory,
      deleteStory,
      toggleLikeStory,
      getUserStoryGroups,
      toggleFollowUser,
      sendMessage,
      getMessagesBetween,
      markNotificationsAsRead,
      unreadNotificationsCount
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
