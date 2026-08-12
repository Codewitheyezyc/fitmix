import { Piece, Mix, UserProfile, NotificationItem, Story } from './types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_me',
  username: 'alex_creator',
  displayName: 'Alex Rivers',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  bio: 'Stylist & texture mixer. Exploring vintage streetwear, oversized silhouettes & everyday minimalist staples.',
  location: 'Lagos / London',
  styleInterests: ['Streetwear', 'Vintage / Thrift', 'Minimalist', 'Monochrome'],
  totalRemixesReceived: 142,
  followersCount: 1280,
  followingCount: 420,
  createdAt: '2026-01-15T10:00:00Z'
};

export const INITIAL_USERS: UserProfile[] = [
  CURRENT_USER,
  {
    id: 'usr_1',
    username: 'elena_v',
    displayName: 'Elena Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Archival minimalist & daily tailoring. Clean cuts & tonal neutrals.',
    location: 'London',
    styleInterests: ['Minimalist', 'Tailoring', 'High Luxury'],
    totalRemixesReceived: 389,
    followersCount: 4200,
    followingCount: 310,
    isFollowing: true,
    createdAt: '2025-11-20T12:00:00Z'
  },
  {
    id: 'usr_2',
    username: 'kai_upcycle',
    displayName: 'Kai Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Streetwear & upcycled pieces. Boxy silhouettes and graphic denim.',
    location: 'Brooklyn, NY',
    styleInterests: ['Upcycled / DIY', 'Streetwear', 'Avant-Garde'],
    totalRemixesReceived: 512,
    followersCount: 6800,
    followingCount: 540,
    isFollowing: true,
    createdAt: '2025-10-14T09:30:00Z'
  },
  {
    id: 'usr_3',
    username: 'sophie_thrift',
    displayName: 'Sophie Laurent',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Vintage market hunter. Leather jackets, staple jeans, and retro sneakers.',
    location: 'Paris',
    styleInterests: ['Vintage / Thrift', 'Minimalist', 'French Chic'],
    totalRemixesReceived: 275,
    followersCount: 3150,
    followingCount: 290,
    isFollowing: false,
    createdAt: '2026-02-01T15:00:00Z'
  },
  {
    id: 'usr_4',
    username: 'zane_tailor',
    displayName: 'Zane Montgomery',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Modern tailoring & smart-casual loafers. Relaxed trousers & overcoats.',
    location: 'Lagos / Berlin',
    styleInterests: ['Formal', 'Tailoring', 'Smart Casual'],
    totalRemixesReceived: 190,
    followersCount: 2400,
    followingCount: 180,
    isFollowing: false,
    createdAt: '2026-01-08T18:20:00Z'
  }
];

export const INITIAL_PIECES: Piece[] = [
  {
    id: 'pc_1',
    ownerId: 'usr_me',
    ownerUsername: 'alex_creator',
    ownerName: 'Alex Rivers',
    ownerAvatar: CURRENT_USER.avatarUrl,
    title: 'Converse Chuck 70 High Top Classic Black/White',
    category: 'footwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80',
    brandName: 'Converse',
    dominantColors: ['#0D0E12', '#FFFFFF', '#E5E7EB'],
    description: '1970s heritage canvas high-top with glossy egret rubber sole and winged tongue stitching.',
    stylingNotes: 'Pairs effortlessly with wide-leg denim, pleated trousers, or cropped jackets.',
    remixCount: 78,
    likesCount: 340,
    createdAt: '2026-02-10T14:20:00Z'
  },
  {
    id: 'pc_2',
    ownerId: 'usr_3',
    ownerUsername: 'sophie_thrift',
    ownerName: 'Sophie Laurent',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    title: 'Vintage Oversized Black Leather Biker Jacket',
    category: 'outerwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    brandName: 'Thrift Archive',
    dominantColors: ['#0D0E12', '#C0C0C0'],
    description: 'Supple heavyweight grain leather with silver zipper hardware and relaxed dropped shoulders.',
    stylingNotes: 'Layer over a plain white tee or hoodie for an instant classic street look.',
    remixCount: 92,
    likesCount: 460,
    createdAt: '2026-02-08T11:00:00Z'
  },
  {
    id: 'pc_3',
    ownerId: 'usr_1',
    ownerUsername: 'elena_v',
    ownerName: 'Elena Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    title: 'Nike Air Force 1 07 Low Triple White',
    category: 'footwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    brandName: 'Nike',
    dominantColors: ['#FFFFFF'],
    description: 'The definitive all-white street sneaker. Clean stitched leather overlays and thick cushioned sole.',
    stylingNotes: 'Universal foundation piece for literally any flat-lay or outfit remix.',
    remixCount: 115,
    likesCount: 520,
    createdAt: '2026-02-05T09:15:00Z'
  },
  {
    id: 'pc_4',
    ownerId: 'usr_me',
    ownerUsername: 'alex_creator',
    ownerName: 'Alex Rivers',
    ownerAvatar: CURRENT_USER.avatarUrl,
    title: 'Heavyweight Boxy Cotton Tee Off-White',
    category: 'tops',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    brandName: 'Essentials Minimal',
    dominantColors: ['#FAFAFC', '#E5E7EB'],
    description: '280 GSM heavyweight pre-shrunk cotton with drop-shoulder silhouette and thick ribbed collar.',
    stylingNotes: 'The foundational base layer for both casual streetwear and elevated tailoring.',
    remixCount: 84,
    likesCount: 390,
    createdAt: '2026-02-07T16:45:00Z'
  },
  {
    id: 'pc_5',
    ownerId: 'usr_2',
    ownerUsername: 'kai_upcycle',
    ownerName: 'Kai Chen',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    title: "Levi's 501 Wide-Leg Washed Blue Denim",
    category: 'bottoms',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    brandName: "Levi's Vintage",
    dominantColors: ['#2B4C7E', '#7BA4D0'],
    description: 'Medium vintage wash 100% rigid cotton denim with a relaxed straight-to-wide drape.',
    stylingNotes: 'Break over low-profile sneakers like Sambas or Air Force 1s.',
    remixCount: 68,
    likesCount: 310,
    createdAt: '2026-02-09T18:10:00Z'
  },
  {
    id: 'pc_6',
    ownerId: 'usr_4',
    ownerUsername: 'zane_tailor',
    ownerName: 'Zane Montgomery',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    title: 'Relaxed Pleated Chino Trousers Charcoal',
    category: 'bottoms',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    brandName: 'COS / Tailoring',
    dominantColors: ['#1C1E24', '#3A3D46'],
    description: 'Double front pleats with deep slash pockets and an easy, elegant tapered drape.',
    stylingNotes: 'Dress down with Sambas or dress up with chunky loafers.',
    remixCount: 57,
    likesCount: 280,
    createdAt: '2026-02-03T13:40:00Z'
  },
  {
    id: 'pc_7',
    ownerId: 'usr_me',
    ownerUsername: 'alex_creator',
    ownerName: 'Alex Rivers',
    ownerAvatar: CURRENT_USER.avatarUrl,
    title: 'Round Mini Shoulder Crossbody Bag Obsidian',
    category: 'bags',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    brandName: 'Uniqlo / Minimal',
    dominantColors: ['#0D0E12'],
    description: 'Lightweight water-repellent nylon crescent bag with adjustable shoulder strap.',
    stylingNotes: 'The viral everyday carry bag that complements any street outfit.',
    remixCount: 46,
    likesCount: 230,
    createdAt: '2026-02-04T17:30:00Z'
  },
  {
    id: 'pc_8',
    ownerId: 'usr_1',
    ownerUsername: 'elena_v',
    ownerName: 'Elena Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    title: 'Cropped Electric Lime Mohair Knit Sweater',
    category: 'tops',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    brandName: 'Marni / Knitwear',
    dominantColors: ['#E2FF66', '#0D0E12'],
    description: 'Brushed mohair-blend chunky knit in signature Fitmix Electric Lime pop.',
    stylingNotes: 'High-contrast statement color that cuts through dark trousers and jackets.',
    remixCount: 71,
    likesCount: 380,
    createdAt: '2026-02-02T10:00:00Z'
  },
  {
    id: 'pc_9',
    ownerId: 'usr_2',
    ownerUsername: 'kai_upcycle',
    ownerName: 'Kai Chen',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    title: 'New Balance 550 Retro Sneakers White / Forest Green',
    category: 'footwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    brandName: 'New Balance',
    dominantColors: ['#FFFFFF', '#1B4332', '#94A3B8'],
    description: 'Retro 80s basketball low-top with premium white leather and dark green accents.',
    stylingNotes: 'Great for vintage sporty aesthetics with washed jeans or grey sweatpants.',
    remixCount: 63,
    likesCount: 305,
    createdAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'pc_10',
    ownerId: 'usr_3',
    ownerUsername: 'sophie_thrift',
    ownerName: 'Sophie Laurent',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    title: 'Classic Wool-Blend Double-Breasted Trench Camel',
    category: 'outerwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80',
    brandName: 'Vintage Burberrys',
    dominantColors: ['#8C7A6B', '#E5DCC5'],
    description: 'Timeless camel wool overcoat with horn buttons and storm flap.',
    stylingNotes: 'Elevates casual hoodies and tees with timeless architectural lines.',
    remixCount: 54,
    likesCount: 260,
    createdAt: '2026-01-28T14:00:00Z'
  },
  {
    id: 'pc_11',
    ownerId: 'usr_4',
    ownerUsername: 'zane_tailor',
    ownerName: 'Zane Montgomery',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    title: 'Chunky Lug-Sole Leather Penny Loafers',
    category: 'footwear',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    brandName: 'G.H. Bass / Studio',
    dominantColors: ['#0D0E12'],
    description: 'Polished black box calf leather with exaggerated commando rubber lug sole.',
    stylingNotes: 'Pairs with white socks and wide trousers for smart-casual contrast.',
    remixCount: 49,
    likesCount: 215,
    createdAt: '2026-01-25T11:30:00Z'
  },
  {
    id: 'pc_12',
    ownerId: 'usr_me',
    ownerUsername: 'alex_creator',
    ownerName: 'Alex Rivers',
    ownerAvatar: CURRENT_USER.avatarUrl,
    title: 'Heavy Duty Canvas Everyday Tote Bag',
    category: 'bags',
    cutoutImageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
    brandName: 'Editorial Goods',
    dominantColors: ['#E5E7EB', '#0D0E12'],
    description: 'Unbleached natural cotton canvas with reinforced box stitching and interior key pocket.',
    stylingNotes: 'Casual grab-and-go tote for art books, laptop, and daily essentials.',
    remixCount: 38,
    likesCount: 180,
    createdAt: '2026-01-20T10:00:00Z'
  }
];

export const INITIAL_MIXES: Mix[] = [
  {
    id: 'mix_1',
    creatorId: 'usr_me',
    creatorUsername: 'alex_creator',
    creatorName: 'Alex Rivers',
    creatorAvatar: CURRENT_USER.avatarUrl,
    title: 'The Everyday High-Low Uniform',
    description: 'Layering Sophie’s vintage leather biker over a boxy white tee, wide-leg blue denim, and Converse Chuck 70 high-tops.',
    canvasBackground: 'obsidian',
    techniqueTags: ['Streetwear x Formal', 'High-Low', 'Contrast Textures'],
    whyItWorks: 'The boxy crop of the leather jacket balances the wide drape of the Levi’s jeans, while Converse Chuck 70s ground the look casually.',
    layers: [
      {
        pieceId: 'pc_2',
        x: 50,
        y: 28,
        scale: 0.96,
        rotation: -2,
        zIndex: 1,
        flipX: false,
        pieceData: INITIAL_PIECES[1]
      },
      {
        pieceId: 'pc_4',
        x: 50,
        y: 42,
        scale: 0.82,
        rotation: 1,
        zIndex: 2,
        flipX: false,
        pieceData: INITIAL_PIECES[3]
      },
      {
        pieceId: 'pc_5',
        x: 50,
        y: 68,
        scale: 0.95,
        rotation: 0,
        zIndex: 3,
        flipX: false,
        pieceData: INITIAL_PIECES[4]
      },
      {
        pieceId: 'pc_1',
        x: 72,
        y: 86,
        scale: 0.72,
        rotation: 8,
        zIndex: 4,
        flipX: false,
        pieceData: INITIAL_PIECES[0]
      },
      {
        pieceId: 'pc_7',
        x: 24,
        y: 48,
        scale: 0.65,
        rotation: -12,
        zIndex: 5,
        flipX: false,
        pieceData: INITIAL_PIECES[6]
      }
    ],
    likesCount: 184,
    commentsCount: 28,
    remixCount: 22,
    isLiked: true,
    isSaved: false,
    createdAt: '2026-02-10T19:00:00Z'
  },
  {
    id: 'mix_2',
    creatorId: 'usr_1',
    creatorUsername: 'elena_v',
    creatorName: 'Elena Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    title: 'Minimalist Camel Overcoat x Air Force 1',
    description: 'Clean architectural lines: camel wool trench paired with charcoal pleated trousers and crisp Nike Air Force 1s.',
    canvasBackground: 'paper',
    techniqueTags: ['Color-Blocking', 'Minimalist', 'Monochrome Layering'],
    whyItWorks: 'The structured camel coat creates long vertical lines, while the triple white Air Force 1s provide a modern street anchor.',
    layers: [
      {
        pieceId: 'pc_10',
        x: 50,
        y: 30,
        scale: 0.98,
        rotation: 0,
        zIndex: 1,
        flipX: false,
        pieceData: INITIAL_PIECES[9]
      },
      {
        pieceId: 'pc_6',
        x: 50,
        y: 65,
        scale: 0.95,
        rotation: 0,
        zIndex: 2,
        flipX: false,
        pieceData: INITIAL_PIECES[5]
      },
      {
        pieceId: 'pc_3',
        x: 50,
        y: 86,
        scale: 0.74,
        rotation: 4,
        zIndex: 3,
        flipX: false,
        pieceData: INITIAL_PIECES[2]
      }
    ],
    likesCount: 260,
    commentsCount: 35,
    remixCount: 31,
    isLiked: false,
    isSaved: true,
    createdAt: '2026-02-09T14:30:00Z'
  },
  {
    id: 'mix_3',
    creatorId: 'usr_2',
    creatorUsername: 'kai_upcycle',
    creatorName: 'Kai Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    title: 'Electric Lime Pop x Wide Vintage Denim',
    description: 'Elena’s acid lime mohair knit paired with washed 501 denim, New Balance 550s, and an unbleached canvas tote.',
    canvasBackground: 'velvet',
    techniqueTags: ['Color-Blocking', 'Casual Luxury', 'Streetwear'],
    whyItWorks: 'High-saturation electric lime draws attention up top, while relaxed faded denim keeps the outfit grounded and wearable.',
    layers: [
      {
        pieceId: 'pc_8',
        x: 50,
        y: 26,
        scale: 0.88,
        rotation: 0,
        zIndex: 1,
        flipX: false,
        pieceData: INITIAL_PIECES[7]
      },
      {
        pieceId: 'pc_5',
        x: 50,
        y: 62,
        scale: 0.95,
        rotation: 0,
        zIndex: 2,
        flipX: false,
        pieceData: INITIAL_PIECES[4]
      },
      {
        pieceId: 'pc_9',
        x: 50,
        y: 84,
        scale: 0.72,
        rotation: -4,
        zIndex: 3,
        flipX: false,
        pieceData: INITIAL_PIECES[8]
      }
    ],
    likesCount: 140,
    commentsCount: 19,
    remixCount: 16,
    isLiked: false,
    isSaved: false,
    createdAt: '2026-02-08T16:00:00Z'
  },
  {
    id: 'mix_4',
    creatorId: 'usr_1',
    creatorUsername: 'elena_v',
    creatorName: 'Elena Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    title: 'Tailored Makeover of High-Low Uniform',
    description: 'Elevated @alex_creator’s look by swapping the relaxed canvas tote for an archival structured shoulder bag.',
    canvasBackground: 'obsidian',
    techniqueTags: ['Streetwear x Formal', 'Contrast Textures'],
    whyItWorks: 'Replacing the canvas tote with structured black leather adds formality to the Converse sneakers without disrupting the effortless drape.',
    remixChainParentId: 'mix_1',
    parentMixTitle: 'The Everyday High-Low Uniform',
    parentMixCreatorUsername: 'alex_creator',
    layers: [
      {
        pieceId: 'pc_2',
        x: 50,
        y: 28,
        scale: 0.95,
        rotation: -2,
        zIndex: 1,
        flipX: false,
        pieceData: INITIAL_PIECES[1]
      },
      {
        pieceId: 'pc_4',
        x: 50,
        y: 65,
        scale: 0.95,
        rotation: 0,
        zIndex: 2,
        flipX: false,
        pieceData: INITIAL_PIECES[3]
      },
      {
        pieceId: 'pc_1',
        x: 68,
        y: 86,
        scale: 0.82,
        rotation: 4,
        zIndex: 3,
        flipX: false,
        pieceData: INITIAL_PIECES[0]
      },
      {
        pieceId: 'pc_7',
        x: 24,
        y: 48,
        scale: 0.75,
        rotation: -8,
        zIndex: 4,
        flipX: false,
        pieceData: INITIAL_PIECES[6]
      }
    ],
    likesCount: 312,
    commentsCount: 28,
    remixCount: 9,
    isLiked: false,
    isSaved: true,
    createdAt: '2026-02-11T11:00:00Z'
  },
  {
    id: 'mix_5',
    creatorId: 'usr_3',
    creatorUsername: 'sophie_thrift',
    creatorName: 'Sophie Laurent',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    title: 'Thrifted Leather Jacket • Advice Needed!',
    description: 'Just thrifted this distressed 90s leather jacket. How would you stylists elevate this look? Piece swaps & remix makeovers welcome!',
    canvasBackground: 'paper',
    techniqueTags: ['Help Me Style This', 'Vintage / Thrift'],
    whyItWorks: 'Seeking community styling advice on footwear and trouser silhouettes to balance the heavy leather shoulder drop.',
    layers: [
      {
        pieceId: 'pc_2',
        x: 50,
        y: 35,
        scale: 0.98,
        rotation: 0,
        zIndex: 1,
        flipX: false,
        pieceData: INITIAL_PIECES[1]
      },
      {
        pieceId: 'pc_5',
        x: 50,
        y: 72,
        scale: 0.95,
        rotation: 0,
        zIndex: 2,
        flipX: false,
        pieceData: INITIAL_PIECES[4]
      }
    ],
    likesCount: 184,
    commentsCount: 42,
    remixCount: 38,
    isLiked: true,
    isSaved: false,
    createdAt: '2026-02-11T14:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_me',
    actorId: 'usr_1',
    actorUsername: 'elena_v',
    actorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    type: 'remix',
    targetMixId: 'mix_1',
    targetPieceId: 'pc_1',
    pieceTitle: 'Converse Chuck 70 High Top',
    mixTitle: 'The Everyday High-Low Uniform',
    read: false,
    createdAt: '2026-02-10T18:30:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_me',
    actorId: 'usr_2',
    actorUsername: 'kai_upcycle',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    type: 'like',
    targetMixId: 'mix_1',
    mixTitle: 'The Everyday High-Low Uniform',
    read: false,
    createdAt: '2026-02-10T17:15:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_me',
    actorId: 'usr_3',
    actorUsername: 'sophie_thrift',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    type: 'follow',
    read: true,
    createdAt: '2026-02-09T12:00:00Z'
  }
];

export const FASHION_TECHNIQUES = [
  {
    id: 'tech_fix',
    name: 'Help Me Style This',
    description: 'Community styling requests where the creator is looking for piece swaps, makeovers, and alternative combinations.'
  },
  {
    id: 'tech_1',
    name: 'Color-Blocking',
    description: 'Combining contrasting solid color planes (e.g. Electric Lime with Vintage Camel or Denim) to create bold visual impact.'
  },
  {
    id: 'tech_2',
    name: 'Streetwear x Formal',
    description: 'Juxtaposing relaxed casual staples like Sambas or Air Force 1s with leather biker jackets or tailored wool coats.'
  },
  {
    id: 'tech_3',
    name: 'Contrast Textures',
    description: 'Pairing fuzzy mohair knits with washed denim, slick nylon crossbody bags, or grain leather.'
  },
  {
    id: 'tech_4',
    name: 'Monochrome Layering',
    description: 'Building depth using varying shades and textures of a single color family (e.g. charcoal pleats with matte black leather).'
  },
  {
    id: 'tech_5',
    name: 'Avant-Garde Silhouette',
    description: 'Altering traditional proportions with chunky lug-sole loafers, cropped boxy tees, and wide-leg pooled denim.'
  },
  {
    id: 'tech_6',
    name: 'Upcycled DIY Statement',
    description: 'Centering a look around a 1-of-1 reconstructed handmade garment while keeping secondary pieces minimalist.'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    userId: 'usr_me',
    username: 'alex_creator',
    displayName: 'Alex Rivers',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80',
    title: 'Archival Wool Trench',
    category: 'Outerwear',
    caption: 'Just added this heavy wool archival trench to my closet. Tag me if you remix it!',
    pieceId: 'pc_2',
    likesCount: 19,
    isLiked: false,
    viewsCount: 68,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_2',
    userId: 'usr_1',
    username: 'elena_v',
    displayName: 'Elena Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    title: 'Upcycled Bottle-Cap Denim',
    category: 'Upcycled DIY',
    caption: '1-of-1 handmade piece made with recycled caps. Check how it looks on the flat-lay!',
    pieceId: 'pc_3',
    likesCount: 34,
    isLiked: false,
    viewsCount: 142,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_3',
    userId: 'usr_1',
    username: 'elena_v',
    displayName: 'Elena Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    title: 'Leather Layering In Studio',
    category: 'Outerwear',
    caption: 'Styling high-contrast outerwear with cropped proportions.',
    pieceId: 'pc_2',
    likesCount: 28,
    isLiked: true,
    viewsCount: 110,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_4',
    userId: 'usr_2',
    username: 'kai_upcycle',
    displayName: 'Kai Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    title: 'Adidas Samba Classic Restock',
    category: 'Footwear',
    caption: 'Streetwear staple restocked in the community studio.',
    pieceId: 'pc_1',
    likesCount: 52,
    isLiked: false,
    viewsCount: 230,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_5',
    userId: 'usr_3',
    username: 'sophie_thrift',
    displayName: 'Sophie Laurent',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    title: 'Electric Mohair Lime Knit',
    category: 'Tops',
    caption: 'Electric lime texture pops against any dark minimal bottom.',
    pieceId: 'pc_8',
    likesCount: 41,
    isLiked: false,
    viewsCount: 185,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString()
  }
];
