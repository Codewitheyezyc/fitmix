export type CategoryType = 
  | 'tops' 
  | 'bottoms' 
  | 'outerwear' 
  | 'footwear' 
  | 'bags' 
  | 'accessories' 
  | 'upcycled';

export interface Piece {
  id: string;
  ownerId: string;
  ownerUsername: string;
  ownerName: string;
  ownerAvatar: string;
  title: string;
  category: CategoryType;
  cutoutImageUrl: string;
  originalImageUrl?: string;
  brandName?: string;
  dominantColors: string[];
  description?: string;
  stylingNotes?: string;
  remixCount: number;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface MixPieceTransform {
  pieceId: string;
  x: number; // percentage (0-100) or px
  y: number; // percentage (0-100) or px
  scale: number;
  rotation: number; // degrees
  zIndex: number;
  flipX: boolean;
  pieceData?: Piece;
}

export type MixLayer = MixPieceTransform;
export type CanvasBackground = 'obsidian' | 'paper' | 'velvet' | 'grid' | 'warm' | 'dark-grid';

export interface Mix {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description?: string;
  renderedImageUrl?: string;
  canvasBackground?: CanvasBackground;
  layers: MixPieceTransform[];
  techniqueTags: string[]; // e.g. ['Monochrome', 'Streetwear x Formal', 'Color-Blocking']
  whyItWorks?: string;
  likesCount: number;
  commentsCount: number;
  remixCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  remixChainParentId?: string;
  parentMixTitle?: string;
  parentMixCreatorUsername?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  styleInterests: string[];
  totalRemixesReceived: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  hasCompletedOnboarding?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  mixId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // recipient
  actorId: string;
  actorUsername: string;
  actorAvatar: string;
  type: 'remix' | 'like' | 'follow' | 'comment' | 'dm' | 'mention';
  targetMixId?: string;
  targetPieceId?: string;
  targetStoryId?: string;
  pieceTitle?: string;
  mixTitle?: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachedMixId?: string;
  attachedPieceId?: string;
  reactions?: Record<string, string[]>; // e.g. { '❤️': ['usr_1'], '🔥': ['usr_2'] }
  status?: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface Conversation {
  otherUser: UserProfile;
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  imageUrl: string;
  title?: string;
  category?: string;
  caption?: string;
  pieceId?: string;
  likesCount?: number;
  isLiked?: boolean;
  viewsCount?: number;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (24 hours from creation)
}

export interface UserStoryGroup {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  hasUnseen?: boolean;
  stories: Story[];
}

