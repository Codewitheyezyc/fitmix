'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Sparkles, Layers, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

interface HeroSectionProps {
  onOpenUpload?: () => void;
}

export default function HeroSection({ onOpenUpload }: HeroSectionProps) {
  const { isAuthenticated } = useStore();

  const floatingItems = [
    {
      id: 'float_1',
      title: 'Converse Chuck 70 High Top',
      brand: 'Converse Classic',
      image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&auto=format&fit=crop&q=80',
      position: 'top-8 left-4 md:top-10 md:left-10 lg:left-20',
      animation: 'animate-float-slow',
      delay: '0s',
    },
    {
      id: 'float_2',
      title: 'Vintage Leather Biker Jacket',
      brand: 'Thrift Archive',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=80',
      position: 'top-16 right-4 md:top-14 md:right-10 lg:right-20',
      animation: 'animate-float-medium',
      delay: '1.2s',
    },
    {
      id: 'float_3',
      title: 'Nike Air Force 1 07 Low',
      brand: 'Nike Sportswear',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80',
      position: 'bottom-16 left-6 md:bottom-20 md:left-14 lg:left-28',
      animation: 'animate-float-reverse',
      delay: '2s',
    },
    {
      id: 'float_4',
      title: 'Wide-Leg Vintage Wash Denim',
      brand: "Levi's 501",
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80',
      position: 'bottom-12 right-6 md:bottom-16 md:right-14 lg:right-28',
      animation: 'animate-float-slow',
      delay: '0.8s',
    },
    {
      id: 'float_5',
      title: 'Round Mini Shoulder Crossbody',
      brand: 'Uniqlo',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80',
      position: 'hidden xl:block top-1/2 -translate-y-1/2 left-6',
      animation: 'animate-float-medium',
      delay: '1.8s',
    },
    {
      id: 'float_6',
      title: 'Heavyweight Boxy Cotton Tee',
      brand: 'Essentials / Minimal',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
      position: 'hidden xl:block top-1/2 -translate-y-1/2 right-6',
      animation: 'animate-float-reverse',
      delay: '2.5s',
    }
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-16 transition-colors">
      
      {/* Ambient background glow flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#E2FF66]/20 via-[#9D4EDD]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-1/4 w-[400px] h-[250px] bg-[#E2FF66]/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Floating Glassmorphic Cutout Bubbles */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto overflow-hidden">
        {floatingItems.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.position} ${item.animation} z-10 transition-all duration-700 hidden sm:block`}
            style={{ animationDelay: item.delay }}
          >
            <div className="group relative p-2.5 rounded-2xl bg-white/70 dark:bg-[rgba(22,24,30,0.65)] backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 w-48 md:w-56 hover:border-[#E2FF66]/70 transition-colors">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-black/5 dark:bg-black/40 flex-shrink-0 border border-black/5 dark:border-white/10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] block truncate">
                  {item.brand}
                </span>
                <h5 className="text-xs font-semibold text-[#0D0E12] dark:text-white truncate">
                  {item.title}
                </h5>
                <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5DB10] dark:bg-[#E2FF66]"></span>
                  Cutout Ready
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-20 max-w-3xl mx-auto text-center px-4">
        
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/40 text-[#0D0E12] dark:text-[#E2FF66] text-xs md:text-sm font-bold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Collaborative Fashion Remix Network</span>
        </div>

        {/* Extra-Bold Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0D0E12] dark:text-white leading-[1.08] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Your closet<span className="text-[#B5DB10] dark:text-[#E2FF66]">.</span> <br />
          Everyone&apos;s creativity<span className="text-[#B5DB10] dark:text-[#E2FF66]">.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#4B5563] dark:text-[#B0B7C6] max-w-2xl mx-auto font-normal leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          Post individual clothing cutouts. Let stylists and friends around the world remix your pieces into striking flat-lay outfit collages.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {isAuthenticated ? (
            <>
              <Link
                href="/remix"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all shadow-[0_0_30px_rgba(226,255,102,0.35)] hover:scale-105 active:scale-95"
              >
                <Layers className="w-4 h-4 stroke-[2.5]" />
                <span>Open Remix Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-white dark:bg-[#16181E] text-[#0D0E12] dark:text-white hover:bg-gray-100 dark:hover:bg-[#1F222A] border border-black/10 dark:border-white/10 transition-all hover:scale-105"
                >
                  <span>Post a Piece (Auto Cutout)</span>
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all shadow-[0_0_30px_rgba(226,255,102,0.35)] hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Get Started — Free Forever</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-white dark:bg-[#16181E] text-[#0D0E12] dark:text-white hover:bg-gray-100 dark:hover:bg-[#1F222A] border border-black/10 dark:border-white/10 transition-all hover:scale-105"
              >
                <span>How It Works</span>
              </Link>
            </>
          )}

        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B] dark:text-[#8E95A5]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
            <span>100% Free at Launch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5DB10] dark:bg-[#E2FF66]" />
            <span>Instant In-Browser AI Cutouts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5DB10] dark:bg-[#E2FF66]" />
            <span>Creator Attribution Always Preserved</span>
          </div>
        </div>

      </div>
    </section>
  );
}
