'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Plus, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  MessageCircle, 
  Sparkles,
  Layers,
  X,
  Heart,
  Repeat,
  LogOut,
  User,
  Sliders,
  ArrowRight
} from 'lucide-react';
import UploadPieceModal from '@/components/piece/UploadPieceModal';
import DirectMessageDrawer from '@/components/social/DirectMessageDrawer';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    isAuthenticated,
    logout,
    theme, 
    toggleTheme, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationsAsRead 
  } = useStore();
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Hide header completely on auth routes
  if (pathname === '/signup' || pathname === '/login' || pathname === '/signin' || pathname === '/confirm-email') {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b transition-colors duration-200 border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0D0E12]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl md:text-3xl tracking-tight text-[#0D0E12] dark:text-white transition-transform group-hover:scale-[1.02]">
              Fitmix<span className="text-[#B5DB10] dark:text-[#E2FF66]">.</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] border border-[#E2FF66]/40">
              Beta
            </span>
          </Link>

          {/* Center Search Bar (Visible when logged in on Desktop) */}
          {isAuthenticated && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-[#8E95A5]" />
                <input
                  type="text"
                  placeholder="Search pieces, brands, styles (Press Enter)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#F4F5F8] dark:bg-[#16181E] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#6B7280] border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66] transition-all"
                />
              </div>
            </form>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
              title={theme === 'dark' ? 'Switch to Editorial Light Mode' : 'Switch to Obsidian Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E2FF66]" /> : <Moon className="w-4 h-4 text-[#0D0E12]" />}
            </button>

            {isAuthenticated ? (
              /* LOGGED-IN NAVBAR ITEMS */
              <>
                {/* Direct Messages */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Direct Messages"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      if (!isNotifOpen && unreadNotificationsCount > 0) {
                        markNotificationsAsRead();
                      }
                    }}
                    className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E2FF66] animate-pulse" />
                    )}
                  </button>

                  {/* Notification Popover */}
                  {isNotifOpen && (
                    <>
                      {/* Mobile click-away backdrop */}
                      <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                        onClick={() => setIsNotifOpen(false)}
                      />
                      
                      <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96 rounded-2xl p-4 bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl z-50 animate-in fade-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 flex-shrink-0">
                          <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
                            <span>Remix Activity</span>
                          </h4>
                          <button 
                            onClick={() => setIsNotifOpen(false)}
                            className="p-1 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 mt-2 space-y-2 pr-3 scrollbar-thin">
                          {notifications.length === 0 ? (
                            <div className="text-center py-6 text-xs text-[#64748B] dark:text-[#8E95A5]">
                              No activity yet.
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className="pt-2.5 pb-1.5 flex items-start gap-3 text-xs pr-1">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-black/10 dark:border-white/10">
                                  <img src={n.actorAvatar} alt={n.actorUsername} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 pr-1">
                                  <p className="text-[#0D0E12] dark:text-[#F8F9FA] leading-tight">
                                    <span className="font-semibold text-[#7B9600] dark:text-[#E2FF66]">@{n.actorUsername}</span>{' '}
                                    {n.type === 'mention' && (n.message || `mentioned you in a look!`)}
                                    {n.type === 'remix' && `remixed your ${n.pieceTitle || 'piece'} into a new look!`}
                                    {n.type === 'like' && `liked your mix "${n.mixTitle}"`}
                                    {n.type === 'follow' && `started following your closet`}
                                    {n.type === 'comment' && `commented on your mix "${n.mixTitle}"`}
                                  </p>
                                  <span className="text-[10px] text-[#94A3B8] dark:text-[#6B7280] block mt-1">Just now</span>
                                </div>
                                <div className="flex-shrink-0 pl-1">
                                  {n.type === 'mention' ? (
                                    <Sparkles className="w-3.5 h-3.5 text-[#E2FF66]" />
                                  ) : n.type === 'remix' ? (
                                    <Repeat className="w-3.5 h-3.5 text-[#E2FF66]" />
                                  ) : (
                                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* View all footer link */}
                        <div className="pt-3 mt-2 border-t border-black/10 dark:border-white/10 text-center flex-shrink-0">
                          <Link
                            href="/notifications"
                            onClick={() => setIsNotifOpen(false)}
                            className="text-xs font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline inline-flex items-center gap-1"
                          >
                            <span>View All Activity & Alerts</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Remix Studio Button */}
                <Link
                  href="/remix"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 hover:border-[#E2FF66] transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                  Remix Studio
                </Link>

                {/* Post Piece CTA Button */}
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all shadow-[0_0_20px_rgba(226,255,102,0.3)] hover:scale-105"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden xs:inline">Post Piece</span>
                </button>

                {/* User Profile Avatar with Dropdown */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#E2FF66] block hover:ring-2 hover:ring-[#E2FF66] transition-all"
                  >
                    <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 rounded-2xl p-2 bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-black/5 dark:border-white/5">
                        <p className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">{currentUser.displayName}</p>
                        <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">@{currentUser.username}</p>
                      </div>
                      <Link
                        href={`/closet/${currentUser.username}`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#0D0E12] dark:text-[#F8F9FA] hover:bg-black/5 dark:hover:bg-white/5 mt-1"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>My Closet</span>
                      </Link>
                      <Link
                        href="/messages"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#0D0E12] dark:text-[#F8F9FA] hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                        <span>Messages Hub</span>
                      </Link>
                      <Link
                        href="/learn"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#0D0E12] dark:text-[#F8F9FA] hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                        <span>Fashion Literacy Guide</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#0D0E12] dark:text-[#F8F9FA] hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Settings & Privacy</span>
                      </Link>
                      <Link
                        href="/discover"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#0D0E12] dark:text-[#F8F9FA] hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Discover Hub</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 mt-1 border-t border-black/5 dark:border-white/5 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* GUEST NAVBAR ITEMS */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#0D0E12] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.35)] transition-all hover:scale-105 active:scale-95"
                >
                  <span>Sign Up Free</span>
                </Link>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Modals */}
      {isUploadOpen && <UploadPieceModal onClose={() => setIsUploadOpen(false)} />}
      {isChatOpen && <DirectMessageDrawer onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
