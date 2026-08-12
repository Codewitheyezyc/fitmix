import { Piece, Mix, UserProfile, NotificationItem, Story, DirectMessage, Comment } from './types';

// ─── Current User Template ────────────────────────────────────────────────────
// This is a blank placeholder replaced immediately when the real user logs in.
// Do NOT put real personal data here.
export const CURRENT_USER: UserProfile = {
  id: 'guest',
  username: '',
  displayName: 'Stylist',
  avatarUrl: '',
  bio: '',
  location: '',
  styleInterests: [],
  totalRemixesReceived: 0,
  followersCount: 0,
  followingCount: 0,
  createdAt: new Date().toISOString()
};

// ─── Empty Initial State ───────────────────────────────────────────────────────
// All data is loaded from Supabase Cloud on mount.
// Local arrays start empty so no fake/seed data pollutes new users.

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_PIECES: Piece[] = [];

export const INITIAL_MIXES: Mix[] = [];

export const INITIAL_STORIES: Story[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_DMS: DirectMessage[] = [];

export const INITIAL_COMMENTS: Comment[] = [];

export interface FashionTechnique {
  id: string;
  name: string;
  description: string;
  exampleMixId?: string;
}

export const FASHION_TECHNIQUES: FashionTechnique[] = [
  {
    id: 'tech_1',
    name: 'High-Low Mixing',
    description: 'Combining elevated tailoring or luxury staples with relaxed vintage streetwear and casual basics.'
  },
  {
    id: 'tech_2',
    name: 'Proportion Play',
    description: 'Juxtaposing boxy, oversized silhouettes with cropped jackets, slim trousers, or structured footwear.'
  },
  {
    id: 'tech_3',
    name: 'Texture Clashing',
    description: 'Layering tactile contrasts like distressed denim, brushed mohair knitwear, matte nylon, and glazed leather.'
  },
  {
    id: 'tech_4',
    name: 'Color Sandwiching',
    description: 'Balancing your look by echoing matching accent hues between your headwear/top and sneakers, separated by neutral bottoms.'
  },
  {
    id: 'tech_5',
    name: 'Tonal Monochromatic',
    description: 'Curating subtle depth and architectural elegance using varied shades and textures within one single color family.'
  },
  {
    id: 'tech_6',
    name: 'Upcycled Accent',
    description: 'Highlighting 1-of-1 reworked garments, handmade distressing, or artisanal DIY customizations as the statement piece.'
  }
];
