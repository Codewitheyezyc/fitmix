'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { uploadImageToStorage } from '@/lib/storageUpload';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  Check, 
  ChevronRight, 
  Sparkles,
  Smartphone,
  Eye,
  Sliders,
  CheckCircle2,
  Camera,
  RefreshCw
} from 'lucide-react';

const STYLE_PRESETS = [
  'Streetwear',
  'Vintage / Thrift',
  'Minimalist',
  'Monochrome',
  'Tailoring',
  'Upcycled / DIY',
  'Avant-Garde',
  'Y2K',
  'Gorpcore',
  'High Luxury'
];

type SettingsSection = 'profile' | 'privacy' | 'notifications' | 'appearance' | 'security';

export default function SettingsPage() {
  const { 
    currentUser, 
    theme, 
    toggleTheme, 
    setThemeMode, 
    logout,
    updateCurrentUser
  } = useStore();

  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Form State for Edit Profile
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || 'Lagos / London');
  const [styleInterests, setStyleInterests] = useState<string[]>(currentUser.styleInterests || []);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string>(currentUser.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Privacy State
  const [isPrivateCloset, setIsPrivateCloset] = useState(false);
  const [allowCommunityRemix, setAllowCommunityRemix] = useState(true);
  const [showActiveStatus, setShowActiveStatus] = useState(true);

  // Notifications State
  const [notifRemixes, setNotifRemixes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifDms, setNotifDms] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);

  const toggleStyle = (style: string) => {
    if (styleInterests.includes(style)) {
      setStyleInterests(styleInterests.filter(s => s !== style));
    } else {
      setStyleInterests([...styleInterests, style]);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      // Show local preview instantly
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase CDN
      const publicUrl = await uploadImageToStorage(file, 'avatars', `avatar_${currentUser.id}`);
      setAvatarPreview(publicUrl);
      updateCurrentUser({ avatarUrl: publicUrl });
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateCurrentUser({ displayName, username, bio, location, styleInterests, avatarUrl: avatarPreview });
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
          Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8E95A5] mt-1">
          Manage your account profile, remix permissions, notification alerts, and theme preferences.
        </p>
      </div>

      {/* Main Settings Container */}
      <div className="rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] transition-colors">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Settings Menu (4 Cols)                                       */}
        {/* ========================================================================= */}
        <aside className="md:col-span-4 border-r border-black/5 dark:border-white/5 p-4 space-y-1 bg-[#FAFAFC] dark:bg-[#12141A]/50">
          
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeSection === 'profile'
                ? 'bg-white dark:bg-[#1E2028] text-[#0D0E12] dark:text-white shadow-sm border border-black/5 dark:border-white/10 font-bold'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeSection === 'privacy'
                ? 'bg-white dark:bg-[#1E2028] text-[#0D0E12] dark:text-white shadow-sm border border-black/5 dark:border-white/10 font-bold'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Account Privacy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeSection === 'notifications'
                ? 'bg-white dark:bg-[#1E2028] text-[#0D0E12] dark:text-white shadow-sm border border-black/5 dark:border-white/10 font-bold'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeSection === 'appearance'
                ? 'bg-white dark:bg-[#1E2028] text-[#0D0E12] dark:text-white shadow-sm border border-black/5 dark:border-white/10 font-bold'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#E2FF66]" /> : <Sun className="w-4 h-4 text-[#0D0E12]" />}
              <span>Theme & Appearance</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeSection === 'security'
                ? 'bg-white dark:bg-[#1E2028] text-[#0D0E12] dark:text-white shadow-sm border border-black/5 dark:border-white/10 font-bold'
                : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Security & Passwords</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          {/* Account Logout Action */}
          <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Fitmix</span>
            </button>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Active Section Viewport (8 Cols)                            */}
        {/* ========================================================================= */}
        <main className="md:col-span-8 p-6 sm:p-8 bg-white dark:bg-[#16181E]">
          
          {/* Toast Notification */}
          {isSavedToast && (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Profile changes updated successfully.</span>
            </div>
          )}

          {/* 1. EDIT PROFILE SECTION */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0D0E12] dark:text-white">Edit Profile</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">Keep your stylist bio, aesthetics, and public identity up to date.</p>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5">
                <div className="relative flex-shrink-0">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#E2FF66] shadow-[0_0_16px_rgba(226,255,102,0.25)]">
                    <img src={avatarPreview} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  </div>
                  {isUploadingAvatar ? (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#E2FF66] flex items-center justify-center shadow">
                      <RefreshCw className="w-3 h-3 text-[#0D0E12] animate-spin" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#E2FF66] hover:bg-[#d5f356] flex items-center justify-center shadow transition-all hover:scale-110"
                    >
                      <Camera className="w-3 h-3 text-[#0D0E12]" />
                    </button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Profile Photo</span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">Tap the camera icon to upload a new photo.</span>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="mt-1.5 text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline disabled:opacity-50"
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-xs text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-xs text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lagos / London"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-xs text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about your wardrobe and styling philosophy..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-xs text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                />
              </div>

              {/* Style Aesthetic Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-2">Style Aesthetics</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_PRESETS.map(style => {
                    const isSelected = styleInterests.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] font-bold shadow-sm'
                            : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] border-black/5 dark:border-white/5 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving || isUploadingAvatar}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 2. ACCOUNT PRIVACY SECTION */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0D0E12] dark:text-white">Account Privacy</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">Control who can discover, view, and remix your wardrobe pieces.</p>
              </div>

              <div className="space-y-4">
                
                {/* Private Closet Toggle */}
                <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Private Closet</span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block mt-0.5">
                      When your closet is private, only followers you approve can see and remix your posted items.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivateCloset}
                    onChange={(e) => setIsPrivateCloset(e.target.checked)}
                    className="w-5 h-5 accent-[#E2FF66] rounded cursor-pointer"
                  />
                </div>

                {/* Allow Community Remixing */}
                <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Community Remix Permission</span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block mt-0.5">
                      Allow other stylists to feature your background-removed cutouts in their public lookboards with full attribution.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowCommunityRemix}
                    onChange={(e) => setAllowCommunityRemix(e.target.checked)}
                    className="w-5 h-5 accent-[#E2FF66] rounded cursor-pointer"
                  />
                </div>

                {/* Active Status */}
                <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Show Active Status</span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block mt-0.5">
                      Allow stylists you follow to see when you are currently online in Remix Studio.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showActiveStatus}
                    onChange={(e) => setShowActiveStatus(e.target.checked)}
                    className="w-5 h-5 accent-[#E2FF66] rounded cursor-pointer"
                  />
                </div>

              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0D0E12] dark:text-white">Notification Preferences</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">Choose which activity triggers real-time alerts.</p>
              </div>

              <div className="space-y-3">
                
                <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0D0E12] dark:text-white">Remixes of my pieces</span>
                  <input
                    type="checkbox"
                    checked={notifRemixes}
                    onChange={(e) => setNotifRemixes(e.target.checked)}
                    className="w-4 h-4 accent-[#E2FF66] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0D0E12] dark:text-white">Comments on my lookboards</span>
                  <input
                    type="checkbox"
                    checked={notifComments}
                    onChange={(e) => setNotifComments(e.target.checked)}
                    className="w-4 h-4 accent-[#E2FF66] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0D0E12] dark:text-white">Direct Messages from mutual stylists</span>
                  <input
                    type="checkbox"
                    checked={notifDms}
                    onChange={(e) => setNotifDms(e.target.checked)}
                    className="w-4 h-4 accent-[#E2FF66] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0D0E12] dark:text-white">New Closet Followers</span>
                  <input
                    type="checkbox"
                    checked={notifFollows}
                    onChange={(e) => setNotifFollows(e.target.checked)}
                    className="w-4 h-4 accent-[#E2FF66] cursor-pointer"
                  />
                </div>

              </div>
            </div>
          )}

          {/* 4. APPEARANCE & THEME SECTION */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0D0E12] dark:text-white">Theme & Appearance</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">Customize your visual studio mode.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Obsidian Dark Card */}
                <div
                  onClick={() => setThemeMode('dark')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'bg-[#0D0E12] border-[#E2FF66] shadow-[0_0_20px_rgba(226,255,102,0.2)] text-white'
                      : 'bg-[#16181E] border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Moon className="w-5 h-5 text-[#E2FF66]" />
                    {theme === 'dark' && <span className="text-[10px] font-bold text-[#E2FF66]">Active</span>}
                  </div>
                  <h4 className="text-sm font-bold">Obsidian Dark Mode</h4>
                  <p className="text-xs text-white/60 mt-1">High-contrast runway aesthetic with neon lime accents.</p>
                </div>

                {/* Editorial Light Card */}
                <div
                  onClick={() => setThemeMode('light')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'bg-[#FAFAFC] border-[#0D0E12] shadow-lg text-[#0D0E12]'
                      : 'bg-[#F4F5F8] border-black/10 text-[#64748B] hover:text-[#0D0E12]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Sun className="w-5 h-5 text-[#7B9600]" />
                    {theme === 'light' && <span className="text-[10px] font-bold text-[#0D0E12]">Active</span>}
                  </div>
                  <h4 className="text-sm font-bold">Editorial Light Mode</h4>
                  <p className="text-xs text-[#64748B] mt-1">Crisp print magazine look with clean off-white canvas.</p>
                </div>

              </div>
            </div>
          )}

          {/* 5. SECURITY & PASSWORDS SECTION */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0D0E12] dark:text-white">Security & Passwords</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">Manage your credentials and login safety.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 space-y-1">
                  <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Email Address</span>
                  <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">alex_creator@fitmix.app</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">Adds an extra layer of security to your closet</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66]">Enabled</span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
