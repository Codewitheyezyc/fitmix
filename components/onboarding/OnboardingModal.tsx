'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Users,
  Check,
  X,
  Star,
  Layers
} from 'lucide-react';

const STEP_COUNT = 3;

export default function OnboardingModal() {
  const { currentUser, completeOnboarding, users, toggleFollowUser } = useStore();
  const [step, setStep] = useState(1);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  // Suggested stylists — first 3 users that aren't the current user
  const suggestedStylists = users
    .filter(u => u.id !== currentUser.id && u.username !== currentUser.username)
    .slice(0, 4);

  const handleFollowToggle = (userId: string) => {
    if (followedIds.includes(userId)) {
      setFollowedIds(prev => prev.filter(id => id !== userId));
    } else {
      setFollowedIds(prev => [...prev, userId]);
      toggleFollowUser(userId);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#16181E] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden">

        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2FF66] via-[#b8ff00] to-[#E2FF66]" />

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all z-10"
          aria-label="Skip onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-6 h-2 bg-[#E2FF66]'
                  : i + 1 < step
                  ? 'w-2 h-2 bg-[#E2FF66]/60'
                  : 'w-2 h-2 bg-black/10 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="px-6 pb-6 pt-2">

          {/* ─── Step 1: Welcome ─────────────────────────────────── */}
          {step === 1 && (
            <div className="text-center space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-center pt-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E2FF66] to-[#b8ff00] flex items-center justify-center shadow-[0_0_40px_rgba(226,255,102,0.4)]">
                  <Sparkles className="w-9 h-9 text-[#0D0E12]" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
                  Welcome to FitMix
                </h2>
                <p className="text-sm text-[#64748B] dark:text-[#8E95A5] mt-2 leading-relaxed">
                  Hey {currentUser.displayName || 'Stylist'} 👋<br />
                  Your digital wardrobe starts here. Catalogue your clothes, build outfit lookboards, and remix styles from the community.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Upload, label: 'Upload Pieces', desc: 'Catalogue your wardrobe' },
                  { icon: Layers, label: 'Build Mixes', desc: 'Create outfit lookboards' },
                  { icon: Users, label: 'Community', desc: 'Remix & get remixed' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5">
                    <Icon className="w-5 h-5 text-[#E2FF66] mx-auto mb-1.5" />
                    <p className="text-[10px] font-bold text-[#0D0E12] dark:text-white leading-tight">{label}</p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#8E95A5] mt-0.5 leading-tight">{desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-2xl bg-[#E2FF66] text-[#0D0E12] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d5f356] active:scale-95 transition-all shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─── Step 2: Upload First Piece ──────────────────────── */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E2FF66]/20 border border-[#E2FF66]/50 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#E2FF66]" />
                </div>
                <h2 className="text-xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
                  Upload Your First Piece
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1.5 leading-relaxed">
                  A "piece" is any item from your wardrobe — a jacket, sneaker, bag, or accessory. Upload a photo and FitMix will remove the background automatically.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-dashed border-[#E2FF66]/40 p-5 text-center space-y-2">
                <div className="text-3xl">👗</div>
                <p className="text-xs font-semibold text-[#0D0E12] dark:text-white">How it works</p>
                <div className="space-y-1.5 text-left">
                  {[
                    '📸 Take a photo of any clothing item',
                    '✂️ FitMix auto-removes the background',
                    '🗂️ It gets added to your digital closet',
                    '🎨 Use it to build mix lookboards',
                  ].map(tip => (
                    <p key={tip} className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">{tip}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/closet/me"
                  onClick={handleFinish}
                  className="w-full py-3 rounded-2xl bg-[#E2FF66] text-[#0D0E12] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d5f356] active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Go to My Closet & Upload</span>
                </Link>
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-2.5 rounded-2xl text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Follow Stylists ─────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E2FF66]/20 border border-[#E2FF66]/50 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-[#E2FF66]" />
                </div>
                <h2 className="text-xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
                  Discover Stylists
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1.5">
                  Follow stylists to see their pieces and mixes in your feed.
                </p>
              </div>

              <div className="space-y-2.5">
                {suggestedStylists.length > 0 ? (
                  suggestedStylists.map(stylist => {
                    const isFollowed = followedIds.includes(stylist.id);
                    return (
                      <div
                        key={stylist.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E2FF66]/20 border border-[#E2FF66]/30 flex-shrink-0">
                            {stylist.avatarUrl ? (
                              <img src={stylist.avatarUrl} alt={stylist.displayName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#E2FF66] text-sm font-bold">
                                {stylist.displayName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0D0E12] dark:text-white">{stylist.displayName}</p>
                            <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5]">@{stylist.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollowToggle(stylist.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                            isFollowed
                              ? 'bg-[#E2FF66]/20 text-[#7B9600] dark:text-[#E2FF66] border border-[#E2FF66]/30'
                              : 'bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356]'
                          }`}
                        >
                          {isFollowed ? (
                            <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Following</span>
                          ) : 'Follow'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-[#64748B] dark:text-[#8E95A5]">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>More stylists will appear here as the community grows.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleFinish}
                  className="w-full py-3 rounded-2xl bg-[#E2FF66] text-[#0D0E12] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d5f356] active:scale-95 transition-all"
                >
                  <span>Start Exploring FitMix</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
