'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Eye, EyeOff, HelpCircle } from 'lucide-react';

const STYLE_PRESETS = [
  'Streetwear',
  'Vintage / Thrift',
  'Minimalist',
  'High Luxury',
  'Avant-Garde',
  'Upcycled / DIY',
  'Monochrome',
  'Tailoring'
];

const MONTHS = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SignUpPage() {
  const router = useRouter();
  const { signup, login } = useStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthMonth, setBirthMonth] = useState('Month');
  const [birthDay, setBirthDay] = useState('Day');
  const [birthYear, setBirthYear] = useState('Year');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Streetwear', 'Vintage / Thrift']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (supabase) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
          },
        });
      }
      login('google_user@fitmix.app');
      router.push('/');
    } catch (err: any) {
      login('google_user@fitmix.app');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!emailOrPhone || !password || !fullName || !username) {
      setErrorMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      if (emailOrPhone.includes('@') && supabase) {
        try {
          await supabase.auth.signUp({
            email: emailOrPhone,
            password: password,
            options: {
              data: {
                full_name: fullName,
                username: username.toLowerCase().replace(/\s+/g, '_'),
                birth_date: `${birthYear}-${birthMonth}-${birthDay}`,
              },
            },
          });
        } catch (e) {
          console.log('Supabase sync notice:', e);
        }
      }

      signup({
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        displayName: fullName.trim(),
        styleInterests: selectedStyles,
      });

      // Route to Email Confirmation Screen as per User Journey Blueprint
      router.push(`/confirm-email?email=${encodeURIComponent(emailOrPhone)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const days = ['Day', ...Array.from({ length: 31 }, (_, i) => String(i + 1))];
  const currentYear = new Date().getFullYear();
  const years = ['Year', ...Array.from({ length: 80 }, (_, i) => String(currentYear - 13 - i))];

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center bg-[#FAFAFC] dark:bg-[#121212] transition-colors duration-200">
      
      {/* Centered Form Column */}
      <div className="w-full max-w-[430px] mx-auto transition-all">
        
        {/* Back Navigation Arrow */}
        <div className="mb-4">
          <Link 
            href="/" 
            className="inline-flex p-1 -ml-1 text-[#64748B] dark:text-[#A8A8A8] hover:text-[#0D0E12] dark:hover:text-white transition-colors"
            aria-label="Back to Home"
          >
            <ChevronLeft className="w-7 h-7" />
          </Link>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0D0E12] dark:text-[#F5F5F5] leading-tight mb-2">
          Get started on Fitmix
        </h1>
        
        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#64748B] dark:text-[#A8A8A8] leading-relaxed mb-6">
          Sign up to see outfits and remix clothing pieces from your friends.
        </p>

        {/* Google One-Tap Social Auth */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-white hover:bg-gray-200 dark:hover:bg-[#282828] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 border border-black/10 dark:border-[rgba(255,255,255,0.12)] transition-all shadow-sm active:scale-98"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-black/10 dark:bg-[#262626]" />
          <span className="text-[11px] font-bold text-[#64748B] dark:text-[#737373] uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-black/10 dark:bg-[#262626]" />
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Mobile number or email */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">
              Mobile number or email
            </label>
            <input
              type="text"
              required
              placeholder="Mobile number or email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#737373] text-xs sm:text-sm border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#E2FF66] transition-all"
            />
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-[#737373] -mt-2 leading-relaxed">
            You may receive notifications from us.{' '}
            <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Learn why we ask for your contact information</span>
          </p>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#737373] text-xs sm:text-sm border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#E2FF66] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#737373] hover:text-[#0D0E12] dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Birthday Dropdowns */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA]">
                Birthday
              </label>
              <span title="Providing your birthday helps us maintain a safe community.">
                <HelpCircle className="w-3.5 h-3.5 text-[#64748B] dark:text-[#737373] cursor-pointer" />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="px-3 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] text-xs border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#0095F6]"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m} className="bg-white dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA]">
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="px-3 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] text-xs border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#0095F6]"
              >
                {days.map(d => (
                  <option key={d} value={d} className="bg-white dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA]">
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="px-3 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] text-xs border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#0095F6]"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-white dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA]">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#737373] text-xs sm:text-sm border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#E2FF66] transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#0D0E12] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#737373] text-xs sm:text-sm border border-black/10 dark:border-[#363636] focus:outline-none focus:border-[#E2FF66] transition-all"
            />
          </div>

          {/* Style Aesthetics */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#FAFAFA] mb-2 flex items-center justify-between">
              <span>Style Aesthetics (Pick 2+)</span>
              <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] font-bold">Personalize Feed</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_PRESETS.map(style => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] font-bold shadow-sm'
                        : 'bg-[#F4F5F8] dark:bg-[#1E1E1E] text-[#64748B] dark:text-[#A8A8A8] border-black/5 dark:border-[#363636] hover:text-[#0D0E12] dark:hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="space-y-2 pt-1 text-[11px] text-[#64748B] dark:text-[#737373] leading-relaxed">
            <p>
              People who use our service may have uploaded your contact information to Fitmix.{' '}
              <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Learn more</span>.
            </p>
            <p>
              By tapping Submit, you agree to create an account and to Fitmix&apos;s{' '}
              <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Terms</span>,{' '}
              <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Privacy Policy</span> and{' '}
              <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Cookies Policy</span>.
            </p>
            <p>
              The <span className="text-[#7B9600] dark:text-[#E2FF66] cursor-pointer hover:underline">Privacy Policy</span> describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalize and improve our products.
            </p>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full text-sm font-bold bg-[#E2FF66] hover:bg-[#d5f356] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>

          {/* Secondary "I already have an account" Button */}
          <div>
            <Link
              href="/login"
              className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#0D0E12] dark:text-[#FAFAFA] border border-black/20 dark:border-[#363636] transition-all flex items-center justify-center"
            >
              I already have an account
            </Link>
          </div>

        </form>

        {/* Footer Brand Links */}
        <div className="mt-12 pt-6 border-t border-black/5 dark:border-[#262626] flex items-center justify-center gap-x-4 text-[11px] text-[#94A3B8] dark:text-[#737373]">
          <Link href="#" className="hover:underline">Privacy</Link>
          <span>•</span>
          <Link href="#" className="hover:underline">Terms</Link>
          <span>•</span>
          <Link href="#" className="hover:underline">Help</Link>
        </div>

        <div className="mt-3 text-center text-[11px] text-[#94A3B8] dark:text-[#737373]">
          © 2026 Fitmix. All rights reserved.
        </div>

      </div>

    </div>
  );
}
