'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import LoggedInDashboard from '@/components/dashboard/LoggedInDashboard';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import MixCard from '@/components/feed/MixCard';
import MixOfTheWeek from '@/components/education/MixOfTheWeek';
import UploadPieceModal from '@/components/piece/UploadPieceModal';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import Footer from '@/components/landing/Footer';
import { Piece } from '@/lib/types';
import { Sparkles, TrendingUp, Users, Flame, ArrowRight, UserPlus } from 'lucide-react';

export default function HomePage() {
  const { mixes, pieces, isAuthenticated, isAuthReady } = useStore();
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  // While auth status is hydrating from localStorage, render a clean seamless skeleton
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC] dark:bg-[#0D0E12]">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/40 flex items-center justify-center font-black text-sm text-[#0D0E12] dark:text-[#E2FF66]">
            F.
          </div>
        </div>
      </div>
    );
  }

  // If user is LOGGED IN, render the dedicated Logged-In User Dashboard (Screen 3)
  if (isAuthenticated) {
    return <LoggedInDashboard />;
  }

  // GUEST / PRE-SIGNUP LANDING PAGE (Screen 1 in Document 6)
  const trendingPieces = [...pieces].sort((a, b) => (b.remixCount || 0) - (a.remixCount || 0)).slice(0, 6);

  return (
    <div className="min-h-screen">
      
      {/* 1. Hero Section (Pre-Signup Screen 1) */}
      <HeroSection onOpenUpload={() => setIsUploadOpen(true)} />

      {/* 2. 3-Step Feature Showcase */}
      <HowItWorks />

      {/* 3. Pre-Signup Showcase Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Spotlight Look */}
        <MixOfTheWeek />

        {/* Trending Pieces Showcase Strip */}
        <div className="mb-10 p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#B5DB10] dark:text-[#E2FF66]" />
              <h3 className="font-bold text-sm text-[#0D0E12] dark:text-white">Trending Pieces in the Community</h3>
            </div>
            <Link
              href="/signup"
              className="text-xs text-[#7B9600] dark:text-[#E2FF66] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Sign up to remix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
            {trendingPieces.map(piece => (
              <div
                key={piece.id}
                onClick={() => setSelectedPiece(piece)}
                className="flex-shrink-0 w-40 p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="w-full h-24 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-2 overflow-hidden mb-2">
                  <img
                    src={piece.cutoutImageUrl}
                    alt={piece.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                  {piece.title}
                </h6>
                <div className="flex items-center justify-between mt-1 text-[10px] text-[#64748B] dark:text-[#8E95A5]">
                  <span className="truncate">@{piece.ownerUsername}</span>
                  <span className="text-[#7B9600] dark:text-[#E2FF66] font-semibold">{piece.remixCount} remixes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#E2FF66]/20 via-[#E2FF66]/10 to-transparent border border-[#E2FF66]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white">
              Ready to remix your closet?
            </h4>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] mt-1">
              Join thousands of stylists posting pieces and collaborating on outfit collages.
            </p>
          </div>
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all hover:scale-105 flex-shrink-0"
          >
            Sign Up Free
          </Link>
        </div>

        {/* Community Mixes Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              Latest Community Mixes
            </h3>
            <Link href="/signup" className="text-xs text-[#7B9600] dark:text-[#E2FF66] font-semibold hover:underline">
              Log in to see personalized feed
            </Link>
          </div>

          {mixes.map(mix => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>

      </div>

      {/* 4. Marketing Page Footer */}
      <Footer />

      {/* Modals */}
      {isUploadOpen && <UploadPieceModal onClose={() => setIsUploadOpen(false)} />}
      {selectedPiece && (
        <PieceDetailModal
          piece={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}

    </div>
  );
}
