'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import MixCard from '@/components/feed/MixCard';
import MixOfTheWeek from '@/components/education/MixOfTheWeek';
import UploadPieceModal from '@/components/piece/UploadPieceModal';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import StoryViewerModal, { StoryItem } from '@/components/story/StoryViewerModal';
import { Piece, UserProfile } from '@/lib/types';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Flame, 
  Plus, 
  Layers, 
  ArrowRight, 
  Shirt, 
  Compass, 
  Repeat, 
  UserPlus, 
  Check,
  Search,
  Home,
  Bookmark,
  Bell,
  User,
  MessageCircle,
  SlidersHorizontal,
  Tag
} from 'lucide-react';

export default function LoggedInDashboard() {
  const { 
    currentUser, 
    mixes, 
    pieces, 
    users, 
    toggleFollowUser, 
    getPiecesByOwner 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  // Story Viewer State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // User pieces count
  const myPieces = getPiecesByOwner(currentUser.username);
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  // Stories Seed Data linked to real pieces
  const stories: StoryItem[] = [
    {
      id: 'story_1',
      userId: 'usr_2',
      username: 'alex_creator',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80',
      title: 'Archival Wool Trench',
      category: 'Outerwear',
      caption: 'Just added this heavy wool archival trench to my closet. Tag me if you remix it!',
      pieceId: 'pc_2',
      timeAgo: '2h ago'
    },
    {
      id: 'story_2',
      userId: 'usr_3',
      username: 'elena_v',
      displayName: 'Elena Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
      title: 'Upcycled Bottle-Cap Denim',
      category: 'Upcycled DIY',
      caption: '1-of-1 handmade piece made with recycled caps. Check how it looks on the flat-lay!',
      pieceId: 'pc_3',
      timeAgo: '4h ago'
    },
    {
      id: 'story_3',
      userId: 'usr_4',
      username: 'kai_upcycle',
      displayName: 'Kai Tanaka',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
      title: 'Adidas Samba Classic',
      category: 'Footwear',
      caption: 'Streetwear staple restocked in the community studio.',
      pieceId: 'pc_1',
      timeAgo: '6h ago'
    },
    {
      id: 'story_4',
      userId: 'usr_5',
      username: 'sophie_thrift',
      displayName: 'Sophie Martin',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
      title: 'Mohair Lime Knit',
      category: 'Tops',
      caption: 'Electric lime texture pops against any dark minimal bottom.',
      pieceId: 'pc_5',
      timeAgo: '8h ago'
    },
    {
      id: 'story_5',
      userId: 'usr_6',
      username: 'zane_tailor',
      displayName: 'Zane Al-Mansoor',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
      title: 'Maison Margiela Tabi Boots',
      category: 'Footwear',
      caption: 'Testing an avant-garde silhouette balance.',
      pieceId: 'pc_4',
      timeAgo: '12h ago'
    }
  ];

  // Filter mixes
  const displayedMixes = activeTab === 'following'
    ? mixes.filter(m => m.creatorId !== currentUser.id)
    : activeTab === 'trending'
    ? [...mixes].sort((a, b) => (b.likesCount || 0) + (b.remixCount || 0) - ((a.likesCount || 0) + (a.remixCount || 0)))
    : mixes;

  // Trending Pieces
  const trendingPieces = [...pieces].sort((a, b) => (b.remixCount || 0) - (a.remixCount || 0)).slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      
      {/* 3-COLUMN RESPONSIVE LAYOUT (Left Sidebar + Center Feed + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR: Navigation & User Hub (3 Cols on Desktop)                */}
        {/* ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-20 self-start">
          
          {/* User Mini Profile Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <Link href={`/closet/${currentUser.username}`} className="flex items-center gap-3 group mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E2FF66] shadow-[0_0_15px_rgba(226,255,102,0.3)]">
                <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] transition-colors truncate">
                  {currentUser.displayName}
                </h4>
                <p className="text-xs text-[#7B9600] dark:text-[#E2FF66]">@{currentUser.username}</p>
              </div>
            </Link>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 dark:border-white/5 text-center text-xs">
              <div>
                <span className="font-bold text-[#0D0E12] dark:text-white text-sm">{myPieces.length}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] block">Pieces</span>
              </div>
              <div>
                <span className="font-bold text-[#0D0E12] dark:text-white text-sm">{currentUser.totalRemixesReceived || 24}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] block">Remixes</span>
              </div>
              <div>
                <span className="font-bold text-[#0D0E12] dark:text-white text-sm">{currentUser.followersCount || 120}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] block">Followers</span>
              </div>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 w-full py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_15px_rgba(226,255,102,0.25)] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Piece</span>
            </button>
          </div>

          {/* Navigation Links Hub */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-sm"
            >
              <Home className="w-4 h-4 stroke-[2.5]" />
              <span>Mix Feed</span>
            </Link>

            <Link
              href="/discover"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Discover Directory</span>
            </Link>

            <Link
              href="/remix"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <Layers className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Remix Studio</span>
            </Link>

            <Link
              href="/messages"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Direct Messages</span>
            </Link>

            <Link
              href="/learn"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Fashion Literacy Guide</span>
            </Link>

            <Link
              href={`/closet/${currentUser.username}`}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Closet ({myPieces.length})</span>
            </Link>

            <Link
              href="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Remix Activity</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#64748B] dark:text-[#B0B7C6] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Settings & Privacy</span>
            </Link>
          </div>

          {/* Style Aesthetic Filter Tags */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#0D0E12] dark:text-white">
              <Tag className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Aesthetic Filters</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Streetwear', 'Vintage', 'Minimalist', 'Luxury', 'Upcycled'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    selectedCategory === cat.toLowerCase()
                      ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] font-bold shadow-sm'
                      : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] border-black/5 dark:border-white/5 hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* 2. CENTER COLUMN: Main Stories & Feed Stream (6 Cols on Desktop)          */}
        {/* ========================================================================= */}
        <main className="lg:col-span-6 space-y-6 min-w-0">
          
          {/* Stories Horizontal Strip */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg">
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
              
              {/* User's Add Story Circle */}
              <div 
                onClick={() => setIsUploadOpen(true)}
                className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
              >
                <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-[#B5DB10] dark:border-[#E2FF66] group-hover:scale-105 transition-transform flex items-center justify-center bg-[#F4F5F8] dark:bg-[#0D0E12]">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img src={currentUser.avatarUrl} alt="Post Story" className="w-full h-full object-cover opacity-85" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E2FF66] text-[#0D0E12] flex items-center justify-center font-bold text-xs shadow-md">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#0D0E12] dark:text-white truncate max-w-[65px]">
                  Add Piece
                </span>
              </div>

              {/* Stylists Stories (Tapping opens full-screen story viewer modal) */}
              {stories.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStoryIndex(idx)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
                  title={`View ${story.displayName}'s story`}
                >
                  <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#E2FF66] via-[#9D4EDD] to-[#00F5D4] group-hover:scale-105 transition-transform shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden p-[2px] bg-white dark:bg-[#0D0E12]">
                      <img src={story.avatarUrl} alt={story.displayName} className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8E95A5] group-hover:text-[#0D0E12] dark:group-hover:text-white truncate max-w-[65px]">
                    @{story.username}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* Feed Navigation Tabs */}
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="p-1 rounded-2xl bg-[#F4F5F8] dark:bg-[#16181E] border border-black/5 dark:border-white/5 flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setActiveTab('for-you')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'for-you'
                    ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>For You</span>
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'following'
                    ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Following</span>
              </button>

              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'trending'
                    ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>
            </div>

            <span className="text-xs text-[#64748B] dark:text-[#8E95A5] hidden sm:inline-block">
              {displayedMixes.length} Looks
            </span>
          </div>

          {/* Mix Cards Vertical Stream */}
          <div className="space-y-6">
            {displayedMixes.map(mix => (
              <MixCard key={mix.id} mix={mix} />
            ))}
          </div>

        </main>

        {/* ========================================================================= */}
        {/* 3. RIGHT SIDEBAR: Discovery, Trending & Spotlights (3 Cols on Desktop)   */}
        {/* ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-20 self-start">
          
          {/* Mix of the Week Spotlight Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-white via-[#F8F9FA] to-[#ECEEF3] dark:from-[#1F222A] dark:via-[#16181E] dark:to-[#0D0E12] border border-[#E2FF66]/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Mix of the Week
              </span>
            </div>
            
            <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white line-clamp-1 mb-1">
              {mixes[0]?.title || 'Electric Lime Pop x Archival Trench'}
            </h5>
            
            <p className="text-[11px] text-[#64748B] dark:text-[#A8A8A8] line-clamp-2 leading-relaxed mb-3">
              {mixes[0]?.description || 'A masterful combination demonstrating color harmony and balanced proportions.'}
            </p>

            <Link
              href={`/remix?remixMixId=${mixes[0]?.id}`}
              className="w-full py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_15px_rgba(226,255,102,0.25)] transition-all flex items-center justify-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Remix This Look</span>
            </Link>
          </div>

          {/* Top Trending Pieces to Remix */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
                Top Pieces to Remix
              </h4>
              <Link href="/discover" className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] font-semibold hover:underline">
                See All
              </Link>
            </div>

            <div className="space-y-3">
              {trendingPieces.map(piece => (
                <div
                  key={piece.id}
                  onClick={() => setSelectedPiece(piece)}
                  className="p-2 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-1 flex-shrink-0">
                      <img src={piece.cutoutImageUrl} alt={piece.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <h6 className="text-xs font-semibold text-[#0D0E12] dark:text-white truncate">
                        {piece.title}
                      </h6>
                      <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">
                        by @{piece.ownerUsername}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#7B9600] dark:text-[#E2FF66] flex-shrink-0">
                    {piece.remixCount} remixes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Stylists to Follow */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <h4 className="text-xs font-bold text-[#0D0E12] dark:text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              Suggested Stylists
            </h4>

            <div className="space-y-3">
              {otherUsers.slice(0, 4).map(stylist => (
                <div key={stylist.id} className="flex items-center justify-between gap-3">
                  <Link href={`/closet/${stylist.username}`} className="flex items-center gap-2.5 min-w-0 group">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0">
                      <img src={stylist.avatarUrl} alt={stylist.displayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h6 className="text-xs font-semibold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate">
                        {stylist.displayName}
                      </h6>
                      <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">
                        @{stylist.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollowUser(stylist.id)}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition-all ${
                      stylist.isFollowing
                        ? 'bg-transparent text-[#64748B] dark:text-[#8E95A5] border-black/10 dark:border-white/10'
                        : 'bg-[#E2FF66] text-[#0D0E12] border-transparent font-bold hover:bg-[#d5f356]'
                    }`}
                  >
                    {stylist.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* Modals & Viewer Drawers */}
      {isUploadOpen && <UploadPieceModal onClose={() => setIsUploadOpen(false)} />}
      {selectedPiece && <PieceDetailModal piece={selectedPiece} onClose={() => setSelectedPiece(null)} />}
      
      {/* Interactive Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

    </div>
  );
}
