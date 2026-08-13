'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import MixCard from '@/components/feed/MixCard';
import MixOfTheWeek from '@/components/education/MixOfTheWeek';
import UploadPieceModal from '@/components/piece/UploadPieceModal';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import StoryViewerModal from '@/components/story/StoryViewerModal';
import UploadStoryModal from '@/components/story/UploadStoryModal';
import UserAvatar from '@/components/ui/UserAvatar';
import MixCardSkeleton from '@/components/feed/MixCardSkeleton';
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
    getPiecesByOwner,
    getUserStoryGroups
  } = useStore();

  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadPieceOpen, setIsUploadPieceOpen] = useState(false);
  const [isUploadStoryOpen, setIsUploadStoryOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  // Story Viewer State
  const [activeStoryGroupIndex, setActiveStoryGroupIndex] = useState<number | null>(null);

  // Active Story Groups (auto-filtered for 24h expiration)
  const storyGroups = getUserStoryGroups();
  const myStoryGroup = storyGroups.find(
    g => g.userId === currentUser.id || 
         g.username.toLowerCase() === currentUser.username.toLowerCase() ||
         (currentUser.username.toLowerCase() === 'alex_creator' && g.userId === 'usr_me')
  );
  const otherStoryGroups = storyGroups.filter(
    g => g.userId !== currentUser.id && 
         g.username.toLowerCase() !== currentUser.username.toLowerCase() &&
         !(currentUser.username.toLowerCase() === 'alex_creator' && g.userId === 'usr_me')
  );

  // User pieces count
  const myPieces = getPiecesByOwner(currentUser.username);
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  // Filter mixes based on active tab and category
  const filteredMixes = mixes.filter(mix => {
    if (selectedCategory !== 'all') {
      const hasCategory = mix.layers.some(l => l.pieceData?.category === selectedCategory);
      if (!hasCategory) return false;
    }

    if (activeTab === 'following') {
      const followedUsernames = users.filter(u => u.isFollowing).map(u => u.username.toLowerCase());
      return followedUsernames.includes(mix.creatorUsername.toLowerCase()) || mix.creatorId === currentUser.id;
    }

    if (activeTab === 'trending') {
      return (mix.likesCount || 0) + (mix.remixCount || 0) * 2 > 10;
    }

    return true; // for-you default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* 3-Column Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR: User Stylist Profile & Closet Quick Access (3 Cols)      */}
        {/* ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          
          {/* User Digital Closet Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            
            <div className="flex items-center gap-3.5 mb-4">
              <UserAvatar 
                src={currentUser.avatarUrl} 
                name={currentUser.displayName || currentUser.username} 
                size="lg" 
              />
              <div className="min-w-0">
                <h3 className="font-bold text-base text-[#0D0E12] dark:text-white truncate">
                  {currentUser.displayName}
                </h3>
                <span className="text-xs text-[#7B9600] dark:text-[#E2FF66] font-semibold truncate block">
                  @{currentUser.username}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                  {currentUser.location || 'Creative Stylist'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#8E95A5] line-clamp-2 leading-relaxed mb-4">
              {currentUser.bio}
            </p>

            {/* Closet Stats */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 dark:border-white/5 text-center mb-4">
              <div>
                <span className="block font-extrabold text-sm text-[#0D0E12] dark:text-white">{myPieces.length}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] uppercase tracking-wider">Pieces</span>
              </div>
              <div>
                <span className="block font-extrabold text-sm text-[#0D0E12] dark:text-white">{currentUser.followersCount}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] uppercase tracking-wider">Followers</span>
              </div>
              <div>
                <span className="block font-extrabold text-sm text-[#7B9600] dark:text-[#E2FF66]">{currentUser.totalRemixesReceived}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] uppercase tracking-wider">Remixed</span>
              </div>
            </div>

            {/* Closet Quick Action Buttons */}
            <div className="space-y-2">
              <Link
                href={`/closet/${currentUser.username}`}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:border-[#E2FF66] border border-black/5 dark:border-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <Shirt className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>View My Closet</span>
              </Link>
              
              <button
                onClick={() => setIsUploadPieceOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all hover:scale-102 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(226,255,102,0.25)]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post a Piece (AI Cutout)</span>
              </button>
            </div>

          </div>

          {/* Quick Wardrobe Categories Filter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Wardrobe Categories</span>
            </h4>

            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Combinations', icon: '✨' },
                { id: 'outerwear', label: 'Outerwear & Coats', icon: '🧥' },
                { id: 'tops', label: 'Tops & Knits', icon: '👕' },
                { id: 'bottoms', label: 'Trousers & Skirts', icon: '👖' },
                { id: 'footwear', label: 'Footwear & Boots', icon: '👟' },
                { id: 'bags', label: 'Bags & Leather', icon: '👜' },
                { id: 'upcycled', label: 'Upcycled 1-of-1', icon: '♻️' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#E2FF66] text-[#0D0E12]'
                      : 'text-[#64748B] dark:text-[#8E95A5] hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* 2. CENTER COLUMN: Main Stories & Feed Stream (6 Cols on Desktop)          */}
        {/* ========================================================================= */}
        <main className="lg:col-span-6 space-y-6 min-w-0">
          
          {/* Stories Horizontal Strip with Signature Gradient Rings */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              
              {/* User's Own Story Avatar Circle */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                <div 
                  onClick={() => {
                    if (myStoryGroup && myStoryGroup.stories.length > 0) {
                      // Open user's active story
                      const myIndex = storyGroups.findIndex(g => g.userId === currentUser.id);
                      setActiveStoryGroupIndex(myIndex >= 0 ? myIndex : 0);
                    } else {
                      // No active stories, open upload
                      setIsUploadStoryOpen(true);
                    }
                  }}
                  className="relative w-16 h-16 rounded-full transition-transform group-hover:scale-105"
                >
                  {myStoryGroup && myStoryGroup.stories.length > 0 ? (
                    <div className="w-full h-full rounded-full p-[2.5px] bg-gradient-to-tr from-[#E2FF66] via-[#B5DB10] to-[#E2FF66] shadow-[0_0_12px_rgba(226,255,102,0.4)] flex items-center justify-center">
                      <UserAvatar 
                        src={currentUser.avatarUrl} 
                        name={currentUser.displayName || currentUser.username} 
                        border={false}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full border-2 border-dashed border-black/20 dark:border-white/25 p-[2px] flex items-center justify-center">
                      <UserAvatar 
                        src={currentUser.avatarUrl} 
                        name={currentUser.displayName || currentUser.username} 
                        border={false}
                        className="w-full h-full opacity-80"
                      />
                    </div>
                  )}

                  {/* + Icon Button to Add Story */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUploadStoryOpen(true);
                    }}
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#E2FF66] text-[#0D0E12] border-2 border-white dark:border-[#0D0E12] flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 active:scale-95 transition-transform z-10"
                    title="Add to story"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
                
                <span className="text-[11px] font-semibold text-[#0D0E12] dark:text-[#8E95A5] group-hover:text-black dark:group-hover:text-white truncate max-w-[65px]">
                  Your Story
                </span>
              </div>

              {/* Followed Stylists Active Stories */}
              {otherStoryGroups.map((group) => {
                const groupIdx = storyGroups.findIndex(g => g.userId === group.userId);
                return (
                  <div
                    key={`story_group_${group.userId}`}
                    onClick={() => setActiveStoryGroupIndex(groupIdx >= 0 ? groupIdx : 0)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
                    title={`View ${group.displayName}'s story`}
                  >
                    <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#E2FF66] via-[#B5DB10] to-[#E2FF66] group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(226,255,102,0.3)] flex items-center justify-center">
                      <UserAvatar 
                        src={group.avatarUrl} 
                        name={group.displayName || group.username} 
                        border={false}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8E95A5] group-hover:text-[#0D0E12] dark:group-hover:text-white truncate max-w-[65px]">
                      @{group.username}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Feed Navigation Tabs (Clean Segmented Control) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center p-1.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#16181E] border border-black/5 dark:border-white/5 shadow-sm gap-1">
              <button
                onClick={() => setActiveTab('for-you')}
                className={`w-full sm:w-auto px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'for-you'
                    ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>For You</span>
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className={`w-full sm:w-auto px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'following'
                    ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Following</span>
              </button>

              <button
                onClick={() => setActiveTab('trending')}
                className={`w-full sm:w-auto px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'trending'
                    ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm'
                    : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Trending</span>
              </button>
            </div>

            <Link
              href="/remix"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_15px_rgba(226,255,102,0.25)] transition-all hover:scale-102 active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Remix Studio</span>
            </Link>
          </div>

          {/* Mobile Mix of the Week Spotlight (Visible only on mobile / small screens) */}
          <div className="lg:hidden">
            <MixOfTheWeek compact />
          </div>

          {/* Mobile Featured Stylists Carousel */}
          <div className="lg:hidden p-4 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>Featured Stylists</span>
              </h4>
              <Link href="/discover" className="text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline">
                Explore All →
              </Link>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {otherUsers.map(stylist => (
                <div 
                  key={`mobile_stylist_${stylist.id}`}
                  className="flex-shrink-0 w-36 p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex flex-col items-center text-center gap-2"
                >
                  <Link href={`/closet/${stylist.username}`}>
                    <UserAvatar 
                      src={stylist.avatarUrl} 
                      name={stylist.displayName || stylist.username} 
                      size="sm" 
                    />
                  </Link>
                  <div className="min-w-0 w-full">
                    <Link href={`/closet/${stylist.username}`} className="text-xs font-bold text-[#0D0E12] dark:text-white truncate block hover:underline">
                      {stylist.displayName}
                    </Link>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate block">
                      @{stylist.username}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFollowUser(stylist.id)}
                    className={`w-full py-1 rounded-full text-[10px] font-bold transition-all ${
                      stylist.isFollowing
                        ? 'bg-transparent text-[#64748B] dark:text-[#8E95A5] border border-black/10 dark:border-white/10'
                        : 'bg-[#E2FF66] text-[#0D0E12] shadow-xs'
                    }`}
                  >
                    {stylist.isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Feed Mix Stream */}
          <div className="space-y-6">
            {filteredMixes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg">
                <Shirt className="w-12 h-12 stroke-[1.5] text-[#64748B] dark:text-[#8E95A5] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white">No mixes found in this category</h4>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1 max-w-xs mx-auto mb-4">
                  Be the first to style an outfit using your wardrobe pieces!
                </p>
                <Link
                  href="/remix"
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12]"
                >
                  Create First Mix
                </Link>
              </div>
            ) : (
              filteredMixes.map(mix => (
                <MixCard key={mix.id} mix={mix} />
              ))
            )}
          </div>

        </main>

        {/* ========================================================================= */}
        {/* 3. RIGHT SIDEBAR: Mix of the Week & Suggested Stylists (3 Cols)          */}
        {/* ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          
          {/* Editorial Mix of the Week Spotlight */}
          <MixOfTheWeek />

          {/* Suggested Stylists to Follow */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>Featured Stylists</span>
              </h4>
              <Link href="/discover" className="text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3.5">
              {otherUsers.slice(0, 4).map(stylist => (
                <div key={stylist.id} className="flex items-center justify-between gap-3">
                  <Link 
                    href={`/closet/${stylist.username}`}
                    className="flex items-center gap-2.5 min-w-0 group"
                  >
                    <UserAvatar 
                      src={stylist.avatarUrl} 
                      name={stylist.displayName || stylist.username} 
                      size="sm" 
                    />
                    <div className="min-w-0">
                      <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate transition-colors">
                        {stylist.displayName}
                      </h6>
                      <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate block">
                        @{stylist.username}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollowUser(stylist.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex-shrink-0 ${
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
      {isUploadPieceOpen && <UploadPieceModal onClose={() => setIsUploadPieceOpen(false)} />}
      {isUploadStoryOpen && <UploadStoryModal isOpen={isUploadStoryOpen} onClose={() => setIsUploadStoryOpen(false)} />}
      {selectedPiece && <PieceDetailModal piece={selectedPiece} onClose={() => setSelectedPiece(null)} />}
      
      {/* Full-Screen Instagram-Exact Story Viewer Modal */}
      {activeStoryGroupIndex !== null && (
        <StoryViewerModal
          storyGroups={storyGroups}
          initialGroupIndex={activeStoryGroupIndex}
          onClose={() => setActiveStoryGroupIndex(null)}
        />
      )}

    </div>
  );
}
