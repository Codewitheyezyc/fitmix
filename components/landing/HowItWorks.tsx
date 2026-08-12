'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, Layers, Repeat, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Post a Piece (Auto Cutout)',
      description: 'Upload a photo of your shoes, jackets, vintage finds, or upcycled creations. In-browser AI instantly strips the background into a transparent cutout.',
      icon: Shirt,
      accent: 'from-[#E2FF66]/20 to-[#E2FF66]/5',
    },
    {
      step: '02',
      title: 'Remix on the Flat-Lay Canvas',
      description: 'Drag, scale, rotate, and arrange multiple clothing pieces on a tactile studio board. Combine your own pieces with public items from stylists worldwide.',
      icon: Layers,
      accent: 'from-[#9D4EDD]/20 to-[#9D4EDD]/5',
    },
    {
      step: '03',
      title: 'Notify Owners & Build the Graph',
      description: 'Publishing notifies every piece owner whose item was used. Every clothing piece builds an ongoing "Remixed by (N)" tree of creative looks.',
      icon: Repeat,
      accent: 'from-[#00F5D4]/20 to-[#00F5D4]/5',
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E2FF66]/20 border border-[#E2FF66]/40 text-[#0D0E12] dark:text-[#E2FF66] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Core Loop</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D0E12] dark:text-white tracking-tight">
          How Fitmix Works
        </h2>
        <p className="text-sm text-[#64748B] dark:text-[#8E95A5] mt-2">
          From isolated physical clothes to a global collaborative styling canvas in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.accent} border border-black/10 dark:border-white/10 flex items-center justify-center text-[#0D0E12] dark:text-[#E2FF66] shadow-sm`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-[#94A3B8] dark:text-[#6B7280]">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0D0E12] dark:text-white mb-2 group-hover:text-[#B5DB10] dark:group-hover:text-[#E2FF66] transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#B0B7C6] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-1 text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66]">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_25px_rgba(226,255,102,0.35)] transition-all hover:scale-105 active:scale-95"
        >
          <span>Create Your Free Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}
