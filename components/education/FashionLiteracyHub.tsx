'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Shirt, 
  Scissors, 
  Compass, 
  Repeat, 
  ArrowRight, 
  CheckCircle2,
  BookOpen,
  Award,
  Flame,
  ExternalLink
} from 'lucide-react';

interface TechniqueGuide {
  id: string;
  name: string;
  category: string;
  icon: any;
  summary: string;
  ruleOfThumb: string;
  exampleMixId: string;
  keyPieceNames: string[];
  colorChips: string[];
  stylingTips: string[];
}

const TECHNIQUES: TechniqueGuide[] = [
  {
    id: 'color-blocking',
    name: 'Color-Blocking',
    category: 'Color Theory',
    icon: Palette,
    summary: 'Combining vibrant high-saturation color planes against neutral foundations to produce striking visual contrast.',
    ruleOfThumb: 'Pair 1 vibrant saturated statement color (e.g. Electric Lime) with 2 grounded neutrals (Camel, Charcoal).',
    exampleMixId: 'mix_1',
    keyPieceNames: ['Marni Acid Lime Mohair', 'Burberrys Wool Trench'],
    colorChips: ['#E2FF66', '#8C7A6B', '#0D0E12'],
    stylingTips: [
      'Keep secondary accessories neutral so the hero color pop remains the focal point.',
      'Use matte fabric textures (wool, brushed mohair) to soften bold neon colors.'
    ]
  },
  {
    id: 'streetwear-formal',
    name: 'Streetwear x Formal (High-Low)',
    category: 'Silhouette Juxtaposition',
    icon: Shirt,
    summary: 'Pairing relaxed athletic or streetwear staples with sharp heritage tailoring for effortless modern elegance.',
    ruleOfThumb: 'Ground formal outerwear (trench coats, blazers) with casual low-profile sneakers (Adidas Sambas).',
    exampleMixId: 'mix_1',
    keyPieceNames: ['Adidas Samba Classic', 'Wool Trench Coat'],
    colorChips: ['#0D0E12', '#FFFFFF', '#8C7A6B'],
    stylingTips: [
      'Ensure the trousers have a relaxed, fluid drape to bridge the gap between sneaker and coat.',
      'Unbutton heavy coats to create organic motion lines while walking.'
    ]
  },
  {
    id: 'contrast-textures',
    name: 'Contrast Textures',
    category: 'Material Science',
    icon: Layers,
    summary: 'Stacking tactile differences (brushed mohair, slick recycled nylon, permanent micro-pleats, raw denim) to create dimensional depth.',
    ruleOfThumb: 'Never wear 3 pieces of the exact same flat fabric texture in a single flat-lay.',
    exampleMixId: 'mix_1',
    keyPieceNames: ['Mohair Knit', 'Homme Plissé Trousers', 'Re-Nylon Pouch'],
    colorChips: ['#E2FF66', '#1C1E24', '#C0C0C0'],
    stylingTips: [
      'Contrast fuzzy, light-absorbing knits with light-reflecting nylon bags or silver hardware.',
      'Micro-pleats create optical shadows that add rhythm to monochrome outfits.'
    ]
  },
  {
    id: 'monochrome-layering',
    name: 'Monochrome Layering',
    category: 'Tonal Composition',
    icon: Sparkles,
    summary: 'Styling entirely within shades of a single color family (all-black, all-cream, all-charcoal) without looking flat or monotone.',
    ruleOfThumb: 'Vary the lightness values (10% charcoal to 90% obsidian) and mix matte with semi-gloss materials.',
    exampleMixId: 'mix_2',
    keyPieceNames: ['Margiela Tabi Boots', 'Pleated Wide-Leg Trousers'],
    colorChips: ['#0D0E12', '#1C1E24', '#3A3D46'],
    stylingTips: [
      'Use footwear with distinctive architectural silhouettes (Tabi split-toe) to anchor the look.',
      'Incorporate subtle metallic highlights (zippers, bottle caps) to break solid dark planes.'
    ]
  },
  {
    id: 'upcycled-statement',
    name: 'Upcycled DIY Statement',
    category: 'Sustainable Craft',
    icon: Scissors,
    summary: 'Centering the entire outfit around a 1-of-1 handmade reconstructed garment while keeping supporting pieces disciplined.',
    ruleOfThumb: 'Let the upcycled piece do 80% of the talking. Complement with timeless minimalist staples.',
    exampleMixId: 'mix_2',
    keyPieceNames: ['Bottle-Cap Denim Overshirt', 'Cork Bucket Hat'],
    colorChips: ['#2B4C7E', '#C0C0C0', '#D4F038'],
    stylingTips: [
      'Highlight the craftsmanship of visible stitching and recycled materials.',
      'Match subtle accent colors of the upcycled piece to an accessory or sneaker sole.'
    ]
  }
];

export default function FashionLiteracyHub() {
  const { mixes } = useStore();
  const [selectedTechnique, setSelectedTechnique] = useState<string>(TECHNIQUES[0].id);

  const activeTech = TECHNIQUES.find(t => t.id === selectedTechnique) || TECHNIQUES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E2FF66]/20 via-white to-[#F4F5F8] dark:from-[#1E2028] dark:via-[#16181E] dark:to-[#0D0E12] border border-[#E2FF66]/40 shadow-xl text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] flex items-center justify-center sm:justify-start gap-1.5">
              <BookOpen className="w-4 h-4" />
              Fashion Literacy & Styling Engine
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
              Master the Art of the Outfit Remix
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed">
              Demystifying wardrobe composition. Learn how top stylists combine color harmony, architectural silhouettes, and texture contrast to build stunning flat-lays.
            </p>
          </div>

          <Link
            href="/remix"
            className="px-6 py-3 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all hover:scale-105 flex items-center gap-2 flex-shrink-0"
          >
            <Repeat className="w-4 h-4 stroke-[2.5]" />
            <span>Practice in Remix Studio</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Technique Deep-Dives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Technique Selector Tabs (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E95A5] mb-3 px-1">
            Styling Techniques
          </h3>

          {TECHNIQUES.map(tech => {
            const isSelected = selectedTechnique === tech.id;
            const Icon = tech.icon;

            return (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnique(tech.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-white dark:bg-[#16181E] border-[#E2FF66] shadow-lg scale-[1.02]'
                    : 'bg-[#F4F5F8] dark:bg-[#12141A]/60 border-black/5 dark:border-white/5 hover:border-black/15 text-[#64748B] dark:text-[#8E95A5]'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#E2FF66] text-[#0D0E12]'
                    : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-[#8E95A5]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] block">
                    {tech.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                    {tech.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] line-clamp-1 mt-0.5">
                    {tech.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Technique Breakdown (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl space-y-6 transition-colors">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
            <div>
              <span className="text-xs font-bold text-[#7B9600] dark:text-[#E2FF66] uppercase tracking-wider">
                {activeTech.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D0E12] dark:text-white mt-0.5">
                {activeTech.name}
              </h2>
            </div>

            <Link
              href={`/remix?remixMixId=${activeTech.exampleMixId}`}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-sm transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Remix This Technique</span>
            </Link>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B0B7C6] leading-relaxed">
            {activeTech.summary}
          </p>

          {/* Rule of Thumb Callout */}
          <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#0D0E12] dark:text-white block">Stylist Rule of Thumb</span>
              <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-0.5 leading-relaxed">
                {activeTech.ruleOfThumb}
              </p>
            </div>
          </div>

          {/* Color Palette Chips */}
          <div>
            <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white mb-2">
              Recommended Color Palette Balance
            </h5>
            <div className="flex items-center gap-3">
              {activeTech.colorChips.map(color => (
                <div key={color} className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full border border-black/15 dark:border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#8E95A5]">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Styling Tips */}
          <div>
            <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white mb-2.5">
              Practical Application Guidelines
            </h5>
            <ul className="space-y-2 text-xs text-[#4B5563] dark:text-[#B0B7C6]">
              {activeTech.stylingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2FF66] mt-1.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 3. Mix of the Week Archive */}
      <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
            Mix of the Week Spotlight Archive
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1">
            Curated weekly looks breaking down real-world applications of fashion styling principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mixes.map(mix => (
            <div
              key={mix.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#E2FF66] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66]">
                    {mix.techniqueTags[0] || 'Curated Look'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] dark:text-[#737373]">Featured Week 6</span>
                </div>

                <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] transition-colors truncate">
                  {mix.title}
                </h4>

                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] line-clamp-2 mt-1 leading-relaxed">
                  {mix.description}
                </p>

                {mix.whyItWorks && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[11px] text-[#4B5563] dark:text-[#B0B7C6] italic">
                    &ldquo;{mix.whyItWorks}&rdquo;
                  </div>
                )}
              </div>

              <Link
                href={`/remix?remixMixId=${mix.id}`}
                className="w-full py-2 rounded-full text-xs font-bold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 group-hover:bg-[#E2FF66] group-hover:text-[#0D0E12] group-hover:border-[#E2FF66] transition-all flex items-center justify-center gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Remix This Mix</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
