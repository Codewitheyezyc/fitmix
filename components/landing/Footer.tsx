'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  Compass, 
  Instagram, 
  Twitter, 
  ShieldCheck, 
  Heart,
  Globe,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#090A0D]/90 backdrop-blur-xl transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-black/5 dark:border-white/5">
          
          {/* Brand & Manifesto Column (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="font-black text-2xl md:text-3xl tracking-tight text-[#0D0E12] dark:text-white">
                Fitmix<span className="text-[#B5DB10] dark:text-[#E2FF66]">.</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] border border-[#E2FF66]/40">
                Beta
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8E95A5] leading-relaxed max-w-sm">
              The collaborative wardrobe remix network. Isolate your clothes, combine community pieces into flat-lays, and master personal style naturally.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-[#E2FF66] hover:bg-[#E2FF66]/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-[#E2FF66] hover:bg-[#E2FF66]/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-[#E2FF66] hover:bg-[#E2FF66]/10 transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TK
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B] dark:text-[#8E95A5]">
              <li>
                <Link href="/discover" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Discover Directory
                </Link>
              </li>
              <li>
                <Link href="/remix" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>Remix Studio</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E2FF66] text-[#0D0E12]">New</span>
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Fashion Literacy Guide
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Trending Pieces
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B] dark:text-[#8E95A5]">
              <li>
                <span className="text-[#64748B] dark:text-[#8E95A5]">AI Background Cutout</span>
              </li>
              <li>
                <span className="text-[#64748B] dark:text-[#8E95A5]">Flat-Lay Layer Canvas</span>
              </li>
              <li>
                <span className="text-[#64748B] dark:text-[#8E95A5]">Community Attribution</span>
              </li>
              <li>
                <span className="text-[#64748B] dark:text-[#8E95A5]">Direct Messaging & Inquiries</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B] dark:text-[#8E95A5]">
              <li>
                <Link href="#" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0D0E12] dark:hover:text-white hover:underline transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] dark:text-[#737373]">
          <p>© 2026 Fitmix Inc. All rights reserved.</p>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#64748B] dark:text-[#8E95A5]">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
