'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Piece } from '@/lib/types';
import { 
  User, 
  Sparkles, 
  Repeat, 
  Plus, 
  MessageCircle, 
  Grid, 
  Layers, 
  Bookmark,
  Share2,
  MapPin,
  Sun,
  Moon
} from 'lucide-react';
import UploadPieceModal from '@/components/piece/UploadPieceModal';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import DirectMessageDrawer from '@/components/social/DirectMessageDrawer';
import MixCard from '@/components/feed/MixCard';
import Link from 'next/link';

export default function ClosetProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { 
    currentUser, 
    users, 
    pieces, 
    mixes, 
    theme,
    toggleTheme,
    toggleFollowUser, 
    getPiecesByOwner, 
    getMixesByCreator 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'pieces' | 'mixes' | 'saved'>('pieces');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isOwner = currentUser.username.toLowerCase() === username.toLowerCase();
  
  const profileUser = isOwner
    ? currentUser
    : users.find(u => u.username.toLowerCase() === username.toLowerCase()) || {
        id: 'usr_guest',
        username: username,
        displayName: username,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: 'Fashion lover & outfit mixer.',
        styleInterests: ['Streetwear', 'Vintage'],
        totalRemixesReceived: 24,
        followersCount: 120,
        followingCount: 80,
        isFollowing: false,
        createdAt: '2026-01-01T00:00:00Z'
      };

  const userPieces = getPiecesByOwner(username);
  const userMixes = getMixesByCreator(username);
  const savedMixes = mixes.filter(m => m.isSaved);

  const totalRemixes = userPieces.reduce((acc, p) => acc + (p.remixCount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#E2FF66] shadow-[0_0_25px_rgba(226,255,102,0.3)] flex-shrink-0">
            <img src={profileUser.avatarUrl} alt={profileUser.displayName} className="w-full h-full object-cover" />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#0D0E12] dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {profileUser.displayName}
                </h1>
                <span className="text-xs text-[#7B9600] dark:text-[#E2FF66] font-semibold">@{profileUser.username}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                {isOwner ? (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all shadow-[0_0_15px_rgba(226,255,102,0.25)] hover:scale-105"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Post New Piece</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => toggleFollowUser(profileUser.id)}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                        profileUser.isFollowing
                          ? 'bg-black/5 dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] border border-black/10 dark:border-white/10 hover:text-black dark:hover:text-white'
                          : 'bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_15px_rgba(226,255,102,0.3)]'
                      }`}
                    >
                      {profileUser.isFollowing ? 'Following' : '+ Follow'}
                    </button>

                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="p-2 rounded-full bg-black/5 dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:bg-black/10 dark:hover:bg-[#282C37] border border-black/10 dark:border-white/10"
                      title="Send Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed max-w-xl">
                {profileUser.bio}
              </p>
            )}

            {/* Closet Statistics */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-3 text-xs">
              <div>
                <span className="font-bold text-[#0D0E12] dark:text-white text-sm">{userPieces.length}</span>
                <span className="text-[#64748B] dark:text-[#8E95A5] ml-1.5">Pieces in Closet</span>
              </div>
              <div>
                <span className="font-bold text-[#0D0E12] dark:text-white text-sm">{userMixes.length}</span>
                <span className="text-[#64748B] dark:text-[#8E95A5] ml-1.5">Published Mixes</span>
              </div>
              <div className="flex items-center gap-1 text-[#7B9600] dark:text-[#E2FF66]">
                <Repeat className="w-3.5 h-3.5" />
                <span className="font-bold text-sm">{totalRemixes}</span>
                <span className="text-xs ml-1">Community Remixes</span>
              </div>
            </div>

            {/* Style Tags */}
            {profileUser.styleInterests && profileUser.styleInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                {profileUser.styleInterests.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 dark:bg-[#1F222A] text-[#4B5563] dark:text-[#B0B7C6] border border-black/5 dark:border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Sleek Segmented Tabs Navigation */}
      <div className="w-full mb-8">
        <div className="p-1 rounded-2xl bg-[#F4F5F8] dark:bg-[#16181E] border border-black/5 dark:border-white/5 flex items-center justify-between sm:justify-start gap-1 shadow-sm max-w-xl mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab('pieces')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pieces'
                ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Closet ({userPieces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mixes')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'mixes'
                ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mixes ({userMixes.length})</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                  : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedMixes.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Closet Pieces Grid */}
      {activeTab === 'pieces' && (
        <div>
          {userPieces.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#16181E] border border-dashed border-black/10 dark:border-white/10 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#E2FF66]/15 border border-[#E2FF66]/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[#7B9600] dark:text-[#E2FF66]" />
              </div>
              <h4 className="text-base font-bold text-[#0D0E12] dark:text-white">
                {isOwner ? 'Your Closet is a Clean Slate' : 'No Pieces in Closet Yet'}
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8E95A5] mt-1.5 max-w-md mx-auto leading-relaxed">
                {isOwner
                  ? 'Upload your first background-removed piece to start building your personal digital wardrobe, or remix pieces directly from the community.'
                  : `@${profileUser.username} hasn't uploaded any pieces yet. Check back soon!`}
              </p>
              {isOwner && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.35)] hover:scale-105 transition-all"
                  >
                    + Upload First Piece
                  </button>
                  <Link
                    href="/remix"
                    className="px-6 py-3 rounded-full text-xs font-semibold bg-black/5 dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:bg-black/10 dark:hover:bg-[#282C37] border border-black/5 dark:border-white/10 transition-colors"
                  >
                    Remix Community Pieces
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userPieces.map(piece => (
                <div
                  key={piece.id}
                  onClick={() => setSelectedPiece(piece)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 hover:border-[#E2FF66] cursor-pointer transition-all hover:scale-[1.02] shadow-sm group"
                >
                  <div className="w-full h-36 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-3 overflow-hidden mb-3">
                    <img
                      src={piece.cutoutImageUrl}
                      alt={piece.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                    {piece.title}
                  </h5>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                    <span className="capitalize">{piece.category}</span>
                    <span className="text-[#7B9600] dark:text-[#E2FF66] font-semibold">{piece.remixCount} remixes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Mixes Grid */}
      {activeTab === 'mixes' && (
        <div>
          {userMixes.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#16181E] border border-dashed border-black/10 dark:border-white/10 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#E2FF66]/15 border border-[#E2FF66]/30 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-7 h-7 text-[#7B9600] dark:text-[#E2FF66]" />
              </div>
              <h4 className="text-base font-bold text-[#0D0E12] dark:text-white">No Mixes Published Yet</h4>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8E95A5] mt-1.5 max-w-md mx-auto leading-relaxed">
                Combine isolated garments from your closet or friends into striking flat-lay outfit collages.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link
                  href="/remix"
                  className="px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.35)] hover:scale-105 transition-all"
                >
                  Create First Mix in Studio
                </Link>
                <Link
                  href="/discover"
                  className="px-6 py-3 rounded-full text-xs font-semibold bg-black/5 dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:bg-black/10 dark:hover:bg-[#282C37] border border-black/5 dark:border-white/10 transition-colors"
                >
                  Explore Trending Looks
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userMixes.map(mix => (
                <MixCard key={mix.id} mix={mix} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Looks */}
      {activeTab === 'saved' && isOwner && (
        <div>
          {savedMixes.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#16181E] border border-dashed border-black/10 dark:border-white/10 text-center text-xs text-[#64748B] dark:text-[#8E95A5]">
              No saved community looks yet. Tap the bookmark icon on any mix in the feed to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedMixes.map(mix => (
                <MixCard key={mix.id} mix={mix} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals & Drawers */}
      {isUploadOpen && <UploadPieceModal onClose={() => setIsUploadOpen(false)} />}
      {selectedPiece && <PieceDetailModal piece={selectedPiece} onClose={() => setSelectedPiece(null)} />}
      {isChatOpen && <DirectMessageDrawer onClose={() => setIsChatOpen(false)} targetUser={profileUser} />}

    </div>
  );
}
