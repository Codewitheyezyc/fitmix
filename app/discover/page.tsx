'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CategoryType, Piece } from '@/lib/types';
import { FASHION_TECHNIQUES } from '@/lib/seedData';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Filter, 
  Repeat, 
  ArrowRight,
  Shirt,
  Tag,
  TrendingUp,
  Award,
  BookOpen,
  Layers,
  Palette,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import PieceDetailModal from '@/components/piece/PieceDetailModal';
import MixCard from '@/components/feed/MixCard';

const COLOR_SWATCHES = [
  { name: 'All Colors', hex: 'all' },
  { name: 'Electric Lime', hex: '#E2FF66' },
  { name: 'Obsidian Black', hex: '#0D0E12' },
  { name: 'Vintage Camel', hex: '#8C7A6B' },
  { name: 'Denim Indigo', hex: '#2B4C7E' },
  { name: 'Heather Grey', hex: '#C0C0C0' }
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const { pieces, mixes } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);

    const pieceId = searchParams.get('piece');
    if (pieceId) {
      const found = pieces.find(p => p.id === pieceId);
      if (found) setSelectedPiece(found);
    }
  }, [searchParams, pieces]);

  // Filter pieces
  const filteredPieces = pieces.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedColor !== 'all' && (!p.dominantColors || !p.dominantColors.some(c => c.toLowerCase() === selectedColor.toLowerCase()))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || 
             (p.brandName && p.brandName.toLowerCase().includes(q)) ||
             p.ownerUsername.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter mixes
  const filteredMixes = mixes.filter(m => {
    if (selectedTechnique && !m.techniqueTags.includes(selectedTechnique)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || 
             m.creatorUsername.toLowerCase().includes(q) ||
             (m.description && m.description.toLowerCase().includes(q));
    }
    return true;
  });

  // Trending Leaderboard Pieces (sorted by remixCount)
  const trendingPieces = [...pieces].sort((a, b) => (b.remixCount || 0) - (a.remixCount || 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. Header Banner with Direct Link to Fashion Literacy Guide */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/40 text-[#0D0E12] dark:text-[#E2FF66] text-xs font-bold mb-4 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Phase 2 Community Directory & Trends</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
          Discover & Remix<span className="text-[#B5DB10] dark:text-[#E2FF66]">.</span>
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#B0B7C6] mt-2 max-w-xl mx-auto">
          Explore the community wardrobe index, track weekly trending pieces, and master new styling principles.
        </p>

        {/* Quick Link to Fashion Literacy Guide */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline"
          >
            <BookOpen className="w-4 h-4" />
            <span>Visit the Fashion Literacy & Styling Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Multi-Dimension Search & Filter Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl space-y-5 transition-colors">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8E95A5]" />
          <input
            type="text"
            placeholder="Search by piece title, brand tag, or stylist handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#6B7280] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-all"
          />
        </div>

        {/* Category Pills & Color Swatch Filter Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          
          {/* Category Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {(['all', 'footwear', 'outerwear', 'tops', 'bottoms', 'bags', 'accessories', 'upcycled'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full capitalize text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E2FF66] text-[#0D0E12] font-bold shadow-sm'
                    : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Pieces' : cat}
              </button>
            ))}
          </div>

          {/* Color Palette Swatch Filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Palette className="w-3.5 h-3.5 text-[#64748B] dark:text-[#8E95A5]" />
            <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#8E95A5]">Color:</span>
            <div className="flex items-center gap-1.5">
              {COLOR_SWATCHES.map(swatch => (
                <button
                  key={swatch.name}
                  onClick={() => setSelectedColor(swatch.hex)}
                  className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                    selectedColor === swatch.hex
                      ? 'border-[#E2FF66] scale-110 shadow-sm'
                      : 'border-black/20 dark:border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex === 'all' ? '#8E95A5' : swatch.hex }}
                  title={swatch.name}
                >
                  {swatch.hex === 'all' && <span className="text-[8px] font-bold text-white">ALL</span>}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Trending Pieces Leaderboard (Phase 2 Feature) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
              Weekly Trending Pieces Leaderboard
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5">
              The most remixed wardrobe items across the Fitmix network this week.
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 w-fit">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trendingPieces.slice(0, 4).map((piece, index) => (
            <div
              key={piece.id}
              onClick={() => setSelectedPiece(piece)}
              className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] cursor-pointer transition-all hover:scale-[1.02] relative group flex flex-col justify-between"
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#E2FF66] text-[#0D0E12] font-black text-xs flex items-center justify-center shadow-sm">
                  #{index + 1}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ▲ +{4 - index}
                </span>
              </div>

              {/* Cutout Image */}
              <div className="w-full h-32 rounded-xl bg-white dark:bg-[#0D0E12] flex items-center justify-center p-2.5 overflow-hidden mb-3">
                <img
                  src={piece.cutoutImageUrl}
                  alt={piece.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              <div>
                <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                  {piece.title}
                </h5>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                  <span>@{piece.ownerUsername}</span>
                  <span className="text-[#7B9600] dark:text-[#E2FF66] font-bold">{piece.remixCount} remixes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trending Styling Techniques (Fashion Literacy) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
            Filter by Styling Technique
          </h3>
          <Link href="/learn" className="text-xs font-bold text-[#7B9600] dark:text-[#E2FF66] hover:underline">
            View Style Principles Guide →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FASHION_TECHNIQUES.map(tech => {
            const isSelected = selectedTechnique === tech.name;
            return (
              <div
                key={tech.id}
                onClick={() => setSelectedTechnique(isSelected ? null : tech.name)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F4F5F8] dark:bg-[#1F222A] border-[#E2FF66] shadow-sm'
                    : 'bg-[#F8F9FA] dark:bg-[#0D0E12]/50 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white">{tech.name}</h5>
                  {isSelected && <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] font-bold">Active</span>}
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] mt-1 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Available Pieces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
            Remixable Pieces ({filteredPieces.length})
          </h3>
          <span className="text-xs text-[#64748B] dark:text-[#8E95A5]">Click any piece to inspect or remix</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredPieces.map(piece => (
            <div
              key={piece.id}
              onClick={() => setSelectedPiece(piece)}
              className="p-4 rounded-2xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 hover:border-[#E2FF66] cursor-pointer transition-all hover:scale-[1.02] shadow-sm group flex flex-col justify-between"
            >
              <div className="w-full h-36 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] flex items-center justify-center p-3 overflow-hidden mb-3">
                <img
                  src={piece.cutoutImageUrl}
                  alt={piece.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                  {piece.title}
                </h5>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                  <span className="truncate">@{piece.ownerUsername}</span>
                  <span className="text-[#7B9600] dark:text-[#E2FF66] font-semibold">{piece.remixCount} remixes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Community Mixes Gallery */}
      <div>
        <h3 className="text-base font-bold text-[#0D0E12] dark:text-white mb-6">
          Community Outfits ({filteredMixes.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMixes.map(mix => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      </div>

      {/* Piece Detail Modal */}
      {selectedPiece && (
        <PieceDetailModal
          piece={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}

    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-[#64748B] dark:text-[#8E95A5]">
        Loading Discover Hub...
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
